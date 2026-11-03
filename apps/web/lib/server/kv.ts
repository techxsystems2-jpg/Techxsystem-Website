import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { db, hasDatabase } from "./db";
import { redis } from "./rate-limit";

/* Key-value store for admin-managed data (site content, free-trial upload settings). Values are JSON.
   Where it lives, first match wins:
   1. PostgreSQL when DATABASE_URL is set (owner, 2026-11-03): table `site_content` (key, value jsonb, updated_at),
      created by db/migrations/0001_site_content.sql.
   2. Upstash Redis (REST) when UPSTASH_REDIS_REST_URL / _TOKEN are set.
   3. One JSON file per key in apps/web/.data/ (local development only; Vercel's disk is read-only). */

export type StoreKind = "postgres" | "redis" | "file";
export const storeKind = (): StoreKind => (hasDatabase() ? "postgres" : redis() ? "redis" : "file");

async function command(cmd: (string | number)[]) {
  const r = redis()!;
  const res = await fetch(r.url, { method: "POST", headers: { Authorization: `Bearer ${r.token}`, "Content-Type": "application/json" }, body: JSON.stringify(cmd), cache: "no-store" });
  if (!res.ok) throw new Error(`Store error ${res.status}`);
  return ((await res.json()) as { result: unknown }).result;
}

const fileOf = (key: string) => path.join(process.cwd(), ".data", `${key.replace(/[^a-z0-9:_-]/gi, "_").replace(/:/g, "__")}.json`);

export async function kvGet<T>(key: string): Promise<T | null> {
  let raw: string | null;
  switch (storeKind()) {
    case "postgres": {
      const rows = await db()<{ v: string }[]>`select value::text as v from site_content where key = ${key}`;
      raw = rows[0]?.v ?? null;
      break;
    }
    case "redis": raw = (await command(["GET", key])) as string | null; break;
    default: raw = await readFile(fileOf(key), "utf8").catch(() => null);
  }
  return raw ? (JSON.parse(raw) as T) : null;
}

// postgres.js v4 sends a parameter as the type the server asks for: cast straight to jsonb, a JSON string would be
// encoded as JSON again and stored as one big string. `::text::jsonb` sends the text as-is and the server parses it.
export async function kvSet(key: string, value: unknown) {
  const raw = JSON.stringify(value);
  switch (storeKind()) {
    case "postgres":
      await db()`insert into site_content (key, value, updated_at) values (${key}, ${raw}::text::jsonb, now())
        on conflict (key) do update set value = excluded.value, updated_at = now()`;
      break;
    case "redis": await command(["SET", key, raw]); break;
    default: {
      const f = fileOf(key);
      await mkdir(path.dirname(f), { recursive: true });
      await writeFile(f, raw);
    }
  }
}

/** Back to the built-in default: the saved value is cleared (a JSON null), so reads fall back to the default. In
    PostgreSQL the row stays, with its updated_at, so there's a record that the section was reset. */
export async function kvDel(key: string) {
  switch (storeKind()) {
    case "postgres":
      await db()`insert into site_content (key, value, updated_at) values (${key}, 'null'::jsonb, now())
        on conflict (key) do update set value = 'null'::jsonb, updated_at = now()`;
      break;
    case "redis": await command(["DEL", key]); break;
    default: await writeFile(fileOf(key), "null").catch(() => {});
  }
}
