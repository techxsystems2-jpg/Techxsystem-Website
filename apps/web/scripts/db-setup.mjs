// One-time database setup for the TechX website (owner runs it: `npm run db:setup` in apps/web).
// 1. Creates the content table (db/migrations/*.sql, in order; each is safe to run again).
// 2. Copies content saved on this computer (apps/web/.data/*.json) into the database, only for sections the database
//    doesn't have yet, so nothing already in the database is overwritten.
// Reads DATABASE_URL from the environment, .env.local or .env.
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import postgres from "postgres";

const root = path.resolve(import.meta.dirname, "..");
for (const f of [".env.local", ".env"]) {
  try { process.loadEnvFile(path.join(root, f)); } catch {}
}
const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL isn't set. Paste your PostgreSQL link into apps/web/.env.local (or .env) as DATABASE_URL=… and run this again.");
  process.exit(1);
}

const sql = postgres(url, { max: 1, prepare: false, onnotice: () => {}, ssl: /sslmode=|localhost|127\.0\.0\.1/.test(url) ? undefined : "require" });
try {
  const dir = path.join(root, "db", "migrations");
  for (const f of (await readdir(dir)).filter((f) => f.endsWith(".sql")).sort()) {
    await sql.unsafe(await readFile(path.join(dir, f), "utf8"));
    console.log(`✓ applied ${f}`);
  }

  // local saves: .data/techx__content__facts.json → key techx:content:facts ; .data/upload-settings.json → techx:upload-settings
  const data = path.join(root, ".data");
  const files = await readdir(data).catch(() => []);
  let copied = 0, kept = 0;
  for (const f of files.filter((f) => f.endsWith(".json"))) {
    const key = f === "upload-settings.json" ? "techx:upload-settings" : f.replace(/\.json$/, "").replace(/__/g, ":");
    if (!key.startsWith("techx:")) continue;
    const raw = (await readFile(path.join(data, f), "utf8")).trim();
    if (!raw || raw === "null") continue;
    JSON.parse(raw); // only valid JSON goes in
    const r = await sql`insert into site_content (key, value) values (${key}, ${raw}::text::jsonb) on conflict (key) do nothing returning key`;
    if (r.length) copied++;
    else kept++;
  }
  if (files.length) console.log(`✓ local content: ${copied} section(s) copied${kept ? `, ${kept} already in the database (left as they are)` : ""}`);
  const [{ n }] = await sql`select count(*)::int as n from site_content`;
  console.log(`✓ ready: ${n} saved section(s) in the database. Start the site and open /admin.`);
} catch (e) {
  console.error("✗ setup failed:", e.message ?? e);
  process.exitCode = 1;
} finally {
  await sql.end();
}
