/* Form rules shared by the browser (instant, inline errors) and the server (the real check). One source, so the two
   can never disagree. Messages are written for the visitor: what's wrong and what to do. */

/** Figma: "Drop up to 10 photos or brackets". Brackets are 3, 5 or 7 exposures a photo, so files are capped at 70. */
export const TRIAL = {
  maxFiles: 70,
  // Dropbox's direct upload links take up to 150 MB a file; a RAW frame is 20–80 MB.
  maxFileBytes: 150 * 1024 * 1024,
  maxTotalBytes: 3 * 1024 * 1024 * 1024,
  // ZIPs: what's inside counts towards maxFiles; refuse anything that unpacks to more than this (zip bombs)
  maxZipUnpackedBytes: 5 * 1024 * 1024 * 1024,
  photoExtensions: ["jpg", "jpeg", "png", "tif", "tiff", "heic", "heif", "dng", "cr2", "cr3", "nef", "arw", "raf", "orf", "rw2"],
  volumes: ["Under 200", "200–1,000", "1,000+"],
  limits: { name: 100, studio: 120, email: 200, notes: 4000, link: 1000 },
} as const;

export const ALL_EXTENSIONS = [...TRIAL.photoExtensions, "zip"] as const;
export const accept = ALL_EXTENSIONS.map((e) => `.${e}`).join(",");
export const extOf = (name: string) => (name.includes(".") ? name.split(".").pop()!.toLowerCase() : "");
export const isPhotoName = (name: string) => (TRIAL.photoExtensions as readonly string[]).includes(extOf(name));
export const allowedFile = (name: string) => isPhotoName(name) || extOf(name) === "zip";

export type TrialFile = { name: string; size: number; type: string; photos?: number };
export type TrialDetails = { name: string; studio: string; email: string; volume: string; notes: string; link: string };
export type FieldErrors = Partial<Record<keyof TrialDetails | "files", string>>;

/** One upload instruction per file: the browser sends the file body straight to `url`. */
export type UploadTarget = { name: string; url: string; method: "POST" | "PUT"; headers: Record<string, string> };
export type ApiError = { error: string; code: string; fields?: FieldErrors; retryAfter?: number };
export type StartResponse = { ticket: string; targets: UploadTarget[] } | ApiError;

const EMAIL = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;
// Links we can open without an account: Dropbox, Google Drive / Photos, WeTransfer, OneDrive, Box, iCloud
const LINK_HOSTS = /(^|\.)(dropbox\.com|db\.tt|drive\.google\.com|docs\.google\.com|photos\.app\.goo\.gl|photos\.google\.com|wetransfer\.com|we\.tl|onedrive\.live\.com|1drv\.ms|sharepoint\.com|box\.com|icloud\.com|smugmug\.com|pixieset\.com)$/i;

export function linkProblem(link: string) {
  if (!link) return "";
  let u: URL;
  try {
    u = new URL(link);
  } catch {
    return "That doesn't look like a link. Copy the share link from Dropbox or Drive and paste it here.";
  }
  if (u.protocol !== "https:" && u.protocol !== "http:") return "Paste a web link (starting with https://).";
  if (!LINK_HOSTS.test(u.hostname)) return "Use a Dropbox, Google Drive, WeTransfer, OneDrive or iCloud share link.";
  return "";
}

export function validateDetails(d: TrialDetails): FieldErrors {
  const e: FieldErrors = {};
  if (!d.name.trim()) e.name = "Add your name.";
  else if (d.name.length > TRIAL.limits.name) e.name = "That name is too long.";
  if (d.studio.length > TRIAL.limits.studio) e.studio = "That studio name is too long.";
  if (!d.email.trim()) e.email = "Add your email, so we can send the edits back.";
  else if (!EMAIL.test(d.email) || d.email.length > TRIAL.limits.email) e.email = "Check your email address: it should look like you@studio.com.";
  if (d.volume && !(TRIAL.volumes as readonly string[]).includes(d.volume)) e.volume = "Pick how many photos you shoot a month.";
  if (d.notes.length > TRIAL.limits.notes) e.notes = `Keep notes under ${TRIAL.limits.notes.toLocaleString("en-US")} characters.`;
  const lp = linkProblem(d.link);
  if (lp) e.link = lp;
  return e;
}

/** Checks the list as a whole (each file is also inspected in the browser, lib/file-check.ts). */
export function validateFiles(files: TrialFile[], link: string): string {
  if (!files.length && !link) return "Add your photos, or paste a Dropbox or Drive link.";
  const photos = files.reduce((n, f) => n + (f.photos ?? 1), 0);
  if (photos > TRIAL.maxFiles) return `That's ${photos} files. The trial takes up to ${TRIAL.maxFiles} (10 photos with up to 7 brackets each). Send the rest as a link.`;
  let total = 0;
  for (const f of files) {
    if (!allowedFile(f.name)) return `${f.name}: we take JPEG, RAW (CR2, CR3, NEF, ARW, RAF, ORF, RW2), DNG, TIFF, HEIC or a ZIP of those.`;
    if (!(f.size > 0)) return `${f.name} is empty. Please choose the file again.`;
    if (f.size > TRIAL.maxFileBytes) return `${f.name} is over 150 MB. Paste a Dropbox or Drive link for big files.`;
    total += f.size;
  }
  if (total > TRIAL.maxTotalBytes) return "That's over 3 GB in total. Paste a Dropbox or Drive link instead.";
  return "";
}

export type ContactDetails = { name: string; email: string; message: string };
export function validateContact(d: ContactDetails) {
  const e: Partial<Record<keyof ContactDetails, string>> = {};
  if (!d.name.trim()) e.name = "Add your name.";
  else if (d.name.length > TRIAL.limits.name) e.name = "That name is too long.";
  if (!d.email.trim()) e.email = "Add your email, so we can reply.";
  else if (!EMAIL.test(d.email) || d.email.length > TRIAL.limits.email) e.email = "Check your email address: it should look like you@studio.com.";
  if (d.message.trim().length < 2) e.message = "Write a short message.";
  else if (d.message.length > TRIAL.limits.notes) e.message = `Keep it under ${TRIAL.limits.notes.toLocaleString("en-US")} characters.`;
  return e;
}

export const formatBytes = (n: number) => (n >= 1024 ** 3 ? `${(n / 1024 ** 3).toFixed(1)} GB` : n >= 1024 ** 2 ? `${(n / 1024 ** 2).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);
