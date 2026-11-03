import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { put } from "@vercel/blob";

/* Images uploaded from the admin panel (owner, 2026-11-03).
   Vercel Blob when BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN is set (production); otherwise apps/web/public/uploads/ (local development
   only, git-ignored). The browser shrinks photos to WebP ≤ 2400 px before sending (features/admin/ImageField.tsx),
   so uploads stay well under the 4 MB action limit. Files are checked by their bytes, not their name. */

export const MAX_BYTES = 4 * 1024 * 1024;

const kinds = [
  { ext: "webp", type: "image/webp", test: (b: Uint8Array) => b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50 },
  { ext: "jpg", type: "image/jpeg", test: (b: Uint8Array) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { ext: "png", type: "image/png", test: (b: Uint8Array) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 },
] as const;

/** The Blob store's token. The owner saved it as BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN (2026-11-04); the library only
    looks for BLOB_READ_WRITE_TOKEN by itself, so it is handed over explicitly on every call. */
export const blobToken = () => process.env.BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN || undefined;

export const mediaStoreKind = () => (blobToken() ? "blob" : "local") as "blob" | "local";

/** Saves an image and returns the URL the site uses for it. Throws a short, user-facing message on bad input. */
export async function storeImage(file: File, folder: string): Promise<string> {
  if (!file || file.size === 0) throw new Error("Choose a photo first.");
  if (file.size > MAX_BYTES) throw new Error("That photo is over 4 MB, even after shrinking. Try a smaller one.");
  const bytes = new Uint8Array(await file.arrayBuffer());
  const kind = kinds.find((k) => k.test(bytes));
  if (!kind) throw new Error("Use a JPEG, PNG or WebP photo.");
  const name = `${folder.replace(/[^a-z0-9-]/gi, "") || "misc"}/${randomUUID()}.${kind.ext}`;
  if (mediaStoreKind() === "blob") {
    const blob = await put(`site/${name}`, Buffer.from(bytes), { access: "public", contentType: kind.type, addRandomSuffix: false, token: blobToken() });
    return blob.url;
  }
  const out = path.join(process.cwd(), "public", "uploads", name);
  await mkdir(path.dirname(out), { recursive: true });
  await writeFile(out, bytes);
  return `/uploads/${name}`;
}
