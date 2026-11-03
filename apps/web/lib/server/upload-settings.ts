import { readFile } from "node:fs/promises";
import path from "node:path";
import { kvGet, kvSet, storeKind } from "./kv";

/* Where client uploads land, chosen by the admin at /admin (owner, 2026-11-02).
   Kept in the site's store (lib/server/kv.ts): PostgreSQL when DATABASE_URL is set, else Upstash Redis, else a local
   file in apps/web/.data/ (development only). Provider refresh tokens are stored encrypted (lib/server/crypto.ts). */

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
// where local settings were kept before they moved into the shared store (read once, as a fallback)
const OLD_FILE = path.join(process.cwd(), ".data", "upload-settings.json");

export const settingsStoreKind = storeKind;

export async function getSettings(): Promise<UploadSettings> {
  let saved = await kvGet<Partial<UploadSettings>>(KEY).catch(() => null);
  if (!saved && storeKind() === "file") saved = await readFile(OLD_FILE, "utf8").then((r) => JSON.parse(r) as Partial<UploadSettings>).catch(() => null);
  return saved ? { ...DEFAULTS, ...saved } : DEFAULTS;
}

export async function saveSettings(next: UploadSettings) {
  await kvSet(KEY, next);
}

/** Folder and file names safe on Dropbox, Google Drive and disk. */
export const cleanName = (s: string, max = 80) =>
  s.normalize("NFKC").replace(/[\\/:*?"<>|\u0000-\u001f]/g, " ").replace(/\s+/g, " ").trim().slice(0, max) || "untitled";
