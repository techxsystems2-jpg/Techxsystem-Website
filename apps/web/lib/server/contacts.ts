import { db, hasDatabase } from "./db";

/* The contact list (owner, 2026-11-04): one row per contact message or free-trial request, shown read-only at
   /admin/contacts. Recording never fails a visitor's request: without a database or before `npm run db:setup` has
   created the table, the row is skipped and logged (the submission is still saved in Dropbox / Drive). */

export type Contact = {
  id: string; kind: "contact" | "trial"; name: string; email: string; studio: string; volume: string;
  message: string; link: string; files: number; folder: string; at: string;
};
type New = Omit<Contact, "id" | "at" | "studio" | "volume" | "link" | "files" | "folder"> & Partial<Pick<Contact, "studio" | "volume" | "link" | "files" | "folder">>;

/** True when the row was saved. */
export async function addContact(c: New): Promise<boolean> {
  if (!hasDatabase()) return false;
  try {
    await db()`insert into contacts (kind, name, email, studio, volume, message, link, files, folder)
      values (${c.kind}, ${c.name}, ${c.email}, ${c.studio ?? ""}, ${c.volume ?? ""}, ${c.message}, ${c.link ?? ""}, ${c.files ?? 0}, ${c.folder ?? ""})`;
    return true;
  } catch (e) {
    console.error("[contacts] not recorded", (e as { code?: string }).code === "42P01" ? "(run npm run db:setup)" : e);
    return false;
  }
}

/** Newest first. `null` when the list can't be read: no database, or the table isn't created yet. */
export async function listContacts(): Promise<Contact[] | null> {
  if (!hasDatabase()) return null;
  try {
    // shortcut: newest 1,000 only, fine for years of form traffic; add paging when the list gets near that
    return await db()<Contact[]>`select id::text, kind, name, email, studio, volume, message, link, files, folder,
      to_char(created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as at from contacts order by created_at desc limit 1000`;
  } catch (e) {
    if ((e as { code?: string }).code === "42P01") return null;
    throw e;
  }
}
