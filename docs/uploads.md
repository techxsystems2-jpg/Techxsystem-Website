# Free-trial uploads: Dropbox / Google Drive

Clients upload on `/free-trial`. Files go **straight from their browser to TechX's Dropbox or Google Drive**. They never
pass through the website's server, so there's no size limit from the host and nothing to store.
The admin chooses the destination at **`/admin`**. Built 2026-11-02.

## What lands where

```
<top folder, e.g. "TechX free trials">/
  2026-11-02 Jake Morrison (Northlight Media) a1b2/
    Trial details.txt     name, studio, email, photos per month, link, notes, file list
    IMG_0001.CR3 …        the client's files
    Upload report.txt     "12 of 12 files received", or which ones failed
```

- **Dropbox:** `Apps/<your Dropbox app name>/<top folder>/…` (the app only sees its own folder).
- **Google Drive:** `My Drive/<top folder>/…` (the site only sees folders it created: scope `drive.file`).
- **This computer:** development only, `apps/web/.uploads/…`. Lets you try the form with no keys.

Limits (in `lib/trial.ts`): up to 70 files (10 photos × up to 7 brackets), 150 MB a file (Dropbox's limit for direct
links), 3 GB in total; JPEG, PNG, TIFF, HEIC, DNG, CR2, CR3, NEF, ARW, RAF, ORF, RW2, ZIP. Bigger sets: paste a link.

## One-time setup (owner)

AIs don't create these accounts or handle the keys. Put the values in Vercel → Project → Settings → Environment
Variables (and in `apps/web/.env.local` to try locally). Names are in `apps/web/.env.example`.

1. **`APP_SECRET`**: 32+ random characters. Generate:
   `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"`
2. **`ADMIN_PASSWORD`**: the password for `/admin`.
3. **Settings store (production):** create a free Upstash Redis database (Vercel Marketplace → Upstash) and set
   `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`. Without it the choice can't be saved on Vercel.
4. **Dropbox** (if used): dropbox.com/developers/apps → Create app → *Scoped access* → *App folder* → name it
   (e.g. "TechX Uploads").
   - Permissions tab: tick `files.content.write`, `files.content.read`, `account_info.read`, then Submit.
   - Settings tab: add the redirect URI `https://www.techxsystems.com/api/admin/oauth/dropbox/callback`
     (and `http://localhost:3000/api/admin/oauth/dropbox/callback` for local testing).
   - Copy App key / App secret into `DROPBOX_APP_KEY` / `DROPBOX_APP_SECRET`.
5. **Google Drive** (if used): console.cloud.google.com → new project → *APIs & Services*:
   - Enable **Google Drive API**.
   - OAuth consent screen: External, app name "TechX Systems", scope `.../auth/drive.file`; then **Publish app**
     (otherwise the connection expires after 7 days). `drive.file` needs no Google review.
   - Credentials → Create OAuth client ID → *Web application*; authorised redirect URI
     `https://www.techxsystems.com/api/admin/oauth/gdrive/callback` (plus the localhost one).
   - Copy Client ID / secret into `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`.
6. Redeploy, open `/admin`, sign in, press **Connect** next to Dropbox and/or Google Drive, pick one, name the top
   folder, **Save**. Switch any time; new uploads follow the new choice.

## How it works (for developers)

| Step | File |
|---|---|
| Form, drag and drop, per-file progress, 3 uploads at a time | `features/free-trial/TrialForm.tsx` |
| Rules shared by browser and server | `lib/trial.ts` |
| Start: validate, make the folder, write details, return one direct upload link per file | `app/api/trial/start/route.ts` → `lib/server/trial-submissions.ts` |
| Dropbox: temporary upload link per file (browser POSTs to it) | `lib/server/dropbox.ts` |
| Google Drive: resumable session per file, opened with the site's Origin (browser PUTs to it) | `lib/server/gdrive.ts` |
| Finish: write the upload report | `app/api/trial/complete/route.ts` |
| Admin page, sign-in, connect / disconnect, choose destination | `app/admin/*`, `app/api/admin/oauth/*`, `lib/server/admin.ts` |
| Settings store (Upstash or local file), tokens encrypted with `APP_SECRET` | `lib/server/upload-settings.ts`, `lib/server/crypto.ts` |

Safety: refresh tokens are AES-GCM encrypted at rest; upload tickets and the admin cookie are signed and expire;
`/admin` and `/api/` are disallowed in robots.txt and the page is `noindex`; the form has a honeypot and rate limits
(below). **Add Cloudflare Turnstile** to `/api/trial/start` if spam still gets through.

## Errors, limits and files (2026-11-02)

**Forms (free trial and contact).** One set of rules in `lib/trial.ts`, used by the browser (instant) and the server
(the real check). Errors show under each field, re-check as the visitor types after the first send, and the first
problem gets focus. Every endpoint answers errors as `{ error, code, fields? }`.

**Server guards, in order:** same-origin only (403 otherwise) → JSON body only, capped (64 KB trial, 16 KB contact) →
hidden honeypot field (bots get a fake success) → validation (422 with per-field messages; doesn't count against the
limits) → rate limits (429 + `Retry-After`) → storage (503 `not_ready` if no destination is set).

| Endpoint | Limits (Upstash Redis across all servers; in-memory fallback) |
|---|---|
| `POST /api/trial/start` | 4 a minute and 12 an hour per address; 5 a day per email |
| `POST /api/trial/target` (fresh upload link) | 300 an hour per address |
| `POST /api/trial/complete` | 60 an hour per address |
| `POST /api/contact` | 3 every 10 minutes and 20 a day per address; 6 a day per email |

**Files, checked in the browser before upload** (`lib/file-check.ts`): accepted types only; the first bytes must match
the type (renamed or damaged files are caught); empty files, files over 150 MB and duplicates are refused; the list is
capped at 70 photos and 3 GB. Each refusal is listed with its reason.

**ZIPs** are opened without unpacking (central directory only, ZIP64 supported): refused if password-protected, empty,
holding no photos, only holding other ZIPs, damaged, over 70 photos, or unpacking to over 5 GB / 200× (zip bombs).
Photos inside count towards the 70. Non-photo files inside are ignored, and the visitor is told.

**Uploads** (`lib/uploader.ts`): 3 at a time; an attempt that sends nothing for 45 s is aborted; up to 3 retries per file
(1 s, 3 s, 8 s) each with a fresh link; waits while offline; Cancel stops everything and reports what arrived; a
warning before leaving mid-upload; "Retry failed files" afterwards. The upload report lists what's missing.

**Contact form** saves each message to `<top folder>/Contact messages/<date> <name>/message.txt`. If no destination is
set, it falls back to the visitor's mail app with the message written out.

Tested 2026-11-02 on the dev server: every guard above by direct request; in the browser, real, renamed, empty,
duplicate, non-photo, good ZIP, password ZIP, text-only ZIP, ZIP-in-ZIP and corrupt ZIP files; inline errors and
focus; a forced upload failure retried with a fresh link and all files arrived byte-for-byte.

## Not done yet
- Tested end to end with the development destination only. Dropbox and Google Drive need the owner's keys; test both
  once they're set (connect, send a 2-file trial, check the folder and the report).
- No email to the studio when a trial arrives. Next step: send one from `completeSubmission` (Resend or similar).
