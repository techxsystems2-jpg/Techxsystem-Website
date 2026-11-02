import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* Where client uploads land, chosen by the admin at /admin (owner, 2026-11-02).
   Stored in Upstash Redis when UPSTASH_REDIS_REST_URL / _TOKEN are set (needed on Vercel, whose disk is read-only),
   otherwise in apps/web/.data/upload-settings.json (local development only). Provider refresh tokens are stored
   encrypted (lib/server/crypto.ts). */

export type Destination = "dropbox" | "gdrive" | "local";

export type UploadSettings = {
  destination: Destination | null;
  /** Top folder every submission goes under, e.g. "TechX free trials". One folder name, no slashes. */
  folder: string;
  dropbox?: { token: string; account: string };
  gdrive?: { token: string; account: string; rootId?: string; rootName?: string };
};

const DEFAULTS: UploadSettings = { destination: process.env.NODE_ENV === "production" ? null : "local", folder: "TechX free trials" };
const KEY = "techx:upload-settings";
const FILE = path.join(process.cwd(), ".data", "upload-settings.json");

const redis = () => {
  const url = process.env.UPSTASH_REDIS_REST_URL, token = process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url, token } : null;
};

export const settingsStoreKind = () => (redis() ? "redis" : "file") as "redis" | "file";

async function command(cmd: (string | number)[]) {
  const r = redis()!;
  const res = await fetch(r.url, { method: "POST", headers: { Authorization: `Bearer ${r.token}`, "Content-Type": "application/json" }, body: JSON.stringify(cmd), cache: "no-store" });
  if (!res.ok) throw new Error(`Settings store error ${res.status}`);
  return ((await res.json()) as { result: unknown }).result;
}

export async function getSettings(): Promise<UploadSettings> {
  let raw: string | null = null;
  if (redis()) raw = (await command(["GET", KEY])) as string | null;
  else raw = await readFile(FILE, "utf8").catch(() => null);
  return raw ? { ...DEFAULTS, ...(JSON.parse(raw) as Partial<UploadSettings>) } : DEFAULTS;
}

export async function saveSettings(next: UploadSettings) {
  const raw = JSON.stringify(next);
  if (redis()) await command(["SET", KEY, raw]);
  else {
    await mkdir(path.dirname(FILE), { recursive: true });
    await writeFile(FILE, raw);
  }
}

/** Folder and file names safe on Dropbox, Google Drive and disk. */
export const cleanName = (s: string, max = 80) =>
  s.normalize("NFKC").replace(/[\\/:*?"<>|\u0000-\u001f]/g, " ").replace(/\s+/g, " ").trim().slice(0, max) || "untitled";
