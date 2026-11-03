import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { UploadTarget } from "@/lib/trial";
import { decrypt, seal } from "./crypto";
import { dropboxAccess, dropboxCreateFolder, dropboxUploadLink, dropboxWriteText } from "./dropbox";
import { gdriveAccess, gdriveCreateFolder, gdriveFolderAlive, gdriveUploadSession, gdriveWriteText } from "./gdrive";
import { cleanName, getSettings, saveSettings, type Destination } from "./upload-settings";

/* One interface over the three places files can land (Dropbox, Google Drive, this computer in development), so the
   free trial and the contact form don't care which one the admin picked at /admin.
   A folder `ref` is a Dropbox path, a Drive folder id, or a path under apps/web/.uploads. */

export const LOCAL_ROOT = path.join(process.cwd(), ".uploads");

export class NotReady extends Error {}

export type Store = {
  dest: Destination;
  /** Makes `<top folder>/<sub>/<name>` (sub optional) and returns its ref. */
  folder(name: string, sub?: string): Promise<string>;
  writeText(ref: string, name: string, text: string): Promise<void>;
  target(ref: string, file: { name: string; size: number; type: string }, origin: string): Promise<UploadTarget>;
};

/** The store for a destination; by default the one the admin chose. Throws NotReady when uploads aren't set up. */
export async function openStore(force?: Destination): Promise<Store> {
  const s = await getSettings();
  const dest = force ?? s.destination;
  const top = cleanName(s.folder || "TechX free trials");

  if (dest === "dropbox") {
    if (!s.dropbox) throw new NotReady("Dropbox is selected but not connected.");
    const access = await dropboxAccess(decrypt(s.dropbox.token));
    return {
      dest,
      async folder(name, sub) {
        const ref = `/${top}${sub ? `/${cleanName(sub)}` : ""}/${cleanName(name, 120)}`;
        await dropboxCreateFolder(access, ref);
        return ref;
      },
      writeText: (ref, name, text) => dropboxWriteText(access, `${ref}/${name}`, text),
      async target(ref, f) {
        return { name: f.name, method: "POST", headers: { "Content-Type": "application/octet-stream" }, url: await dropboxUploadLink(access, `${ref}/${f.name}`) };
      },
    };
  }

  if (dest === "gdrive") {
    if (!s.gdrive) throw new NotReady("Google Drive is selected but not connected.");
    const access = await gdriveAccess(decrypt(s.gdrive.token));
    let root = s.gdrive.rootName === top ? s.gdrive.rootId : undefined;
    const subs = new Map<string, string>();
    const ensureRoot = async () => {
      if (root && (await gdriveFolderAlive(access, root))) return root;
      root = await gdriveCreateFolder(access, top);
      await saveSettings({ ...s, gdrive: { ...s.gdrive!, rootId: root, rootName: top } });
      return root;
    };
    return {
      dest,
      async folder(name, sub) {
        let parent = await ensureRoot();
        if (sub) parent = subs.get(sub) ?? (await gdriveCreateFolder(access, cleanName(sub), parent));
        return gdriveCreateFolder(access, cleanName(name, 120), parent);
      },
      writeText: (ref, name, text) => gdriveWriteText(access, name, text, ref),
      async target(ref, f, origin) {
        return { name: f.name, method: "PUT", headers: {}, url: await gdriveUploadSession(access, f, ref, origin) };
      },
    };
  }

  if (dest === "local") {
    if (process.env.NODE_ENV === "production") throw new NotReady("Local uploads are for development only.");
    return {
      dest,
      async folder(name, sub) {
        const ref = path.join(top, ...(sub ? [cleanName(sub)] : []), cleanName(name, 120));
        await mkdir(path.join(LOCAL_ROOT, ref), { recursive: true });
        return ref;
      },
      writeText: (ref, name, text) => writeFile(path.join(LOCAL_ROOT, ref, name), text),
      async target(ref, f) {
        return { name: f.name, method: "PUT", headers: { "Content-Type": "application/octet-stream" }, url: `/api/trial/local-upload?t=${encodeURIComponent(seal({ dir: ref, name: f.name, size: f.size }, 6 * 3600, "local-upload"))}` };
      },
    };
  }

  throw new NotReady("Uploads aren't set up yet: choose Dropbox or Google Drive at /admin.");
}
