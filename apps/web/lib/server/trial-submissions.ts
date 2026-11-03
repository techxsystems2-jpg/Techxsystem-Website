import { validateDetails, validateFiles, type FieldErrors, type TrialDetails, type TrialFile } from "@/lib/trial";
import { after } from "next/server";
import { sendAlert } from "./email";
import { randomId, seal, unseal } from "./crypto";
import { openStore } from "./destinations";
import { cleanName, type Destination } from "./upload-settings";

/* A free-trial submission, start to finish:
   1. start(): validates the form with the same rules as the browser (lib/trial.ts), makes one folder per submission
      ("2026-11-02 Jake Morrison (Northlight Media) a1b2") under the admin's top folder, writes "Trial details.txt", and
      returns one direct upload target per file plus a signed ticket (valid 12 h).
   2. The browser sends each file straight to Dropbox / Google Drive (or, in development, /api/trial/local-upload).
      If a file fails, retarget() hands out a fresh link for that file only (links can be single-use or expire).
   3. complete(): writes "Upload report.txt" (received / failed), so the team sees whether a set arrived whole.
      Safe to call again after retries; the newest report is the one that counts. */

type Ticket = { dest: Destination; ref: string; files: TrialFile[]; email: string };

export class TrialError extends Error {
  constructor(message: string, public fields?: FieldErrors) { super(message); }
}

function detailsText(d: TrialDetails, files: TrialFile[]) {
  return [
    "TechX free trial", `Received: ${new Date().toISOString()}`, "",
    `Name: ${d.name}`, `Studio: ${d.studio || "-"}`, `Email: ${d.email}`, `Photos per month: ${d.volume || "-"}`,
    `Link: ${d.link || "-"}`, "", "Notes:", d.notes || "-", "", `Files sent from the form (${files.length}):`,
    ...files.map((f) => `- ${f.name} (${Math.round(f.size / 1024)} KB${f.photos && f.photos > 1 ? `, ZIP with ${f.photos} photos` : ""})`), "",
  ].join("\n");
}

/** De-duplicates names inside one submission (two "IMG_0001.jpg" from different cards). */
function uniqueNames(files: TrialFile[]) {
  const seen = new Map<string, number>();
  return files.map((f) => {
    const name = cleanName(f.name, 120);
    const n = seen.get(name.toLowerCase()) ?? 0;
    seen.set(name.toLowerCase(), n + 1);
    return { ...f, name: n ? name.replace(/(\.[^.]*)?$/, ` (${n + 1})$1`) : name };
  });
}

/** The shared rules (lib/trial.ts); throws TrialError with per-field messages. Cheap, so it runs before rate limits. */
export function checkTrial(d: TrialDetails, files: TrialFile[]) {
  const fields = validateDetails(d);
  const fileProblem = validateFiles(files, d.link);
  if (fileProblem) fields.files = fileProblem;
  if (Object.keys(fields).length) throw new TrialError(Object.values(fields)[0]!, fields);
}

export async function startSubmission(d: TrialDetails, rawFiles: TrialFile[], origin: string) {
  checkTrial(d, rawFiles);

  const files = uniqueNames(rawFiles);
  const store = await openStore();
  const label = `${new Date().toISOString().slice(0, 10)} ${d.name}${d.studio ? ` (${d.studio})` : ""} ${randomId(2)}`;
  const ref = await store.folder(label);
  await store.writeText(ref, "Trial details.txt", detailsText(d, files));
  // studio alert by email, sent after the response so the visitor never waits on it (lib/server/email.ts)
  after(() => sendAlert({
    kind: "trial", subject: `Free trial: ${d.name}${d.studio ? ` (${d.studio})` : ""}, ${files.length} file${files.length === 1 ? "" : "s"}`,
    replyTo: d.email, body: d.notes || undefined,
    lines: [["Name", d.name], ["Studio", d.studio], ["Email", d.email], ["Photos a month", d.volume], ["Link", d.link],
      ["Files", `${files.length} uploading`], ["Folder", `${store.dest === "gdrive" ? "Google Drive" : store.dest === "dropbox" ? "Dropbox" : "Upload folder"}: ${label}`]],
  }));
  const targets = await Promise.all(files.map((f) => store.target(ref, f, origin)));
  const ticket = seal({ dest: store.dest, ref, files, email: d.email } satisfies Ticket, 12 * 3600, "trial-ticket");
  return { ticket, targets };
}

function readTicket(token: string) {
  const t = unseal<Ticket>(token, "trial-ticket");
  if (!t) throw new TrialError("This upload has expired. Please send the form again.");
  return t;
}

/** A fresh upload link for one file of an existing submission (after a failed or timed-out attempt). */
export async function retarget(token: string, name: string, origin: string) {
  const t = readTicket(token);
  const file = t.files.find((f) => f.name === name);
  if (!file) throw new TrialError("That file isn't part of this upload.");
  const store = await openStore(t.dest);
  return store.target(t.ref, file, origin);
}

export async function completeSubmission(token: string, done: string[], failed: string[]) {
  const t = readTicket(token);
  const known = new Set(t.files.map((f) => f.name));
  const ok = [...new Set(done.filter((n) => known.has(n)))];
  const bad = [...new Set(failed.filter((n) => known.has(n) && !ok.includes(n)))];
  const report = [
    `Upload report: ${new Date().toISOString()}`, `${ok.length} of ${t.files.length} files received.`, "",
    ...(bad.length ? [`Failed (ask ${t.email} to resend these):`, ...bad.map((n) => `- ${n}`), ""] : []),
    "Received:", ...ok.map((n) => `- ${n}`), "",
  ].join("\n");
  const store = await openStore(t.dest);
  await store.writeText(t.ref, "Upload report.txt", report);
  return { received: ok.length, total: t.files.length };
}
