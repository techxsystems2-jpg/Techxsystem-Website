/* Google Drive connector (owner, 2026-11-02). OAuth with the `drive.file` scope only: the site can see and write
   just the folders and files it creates, nothing else in the admin's Drive (and the scope needs no Google review).
   Client files never pass through our server: for each file we open a resumable upload session (sent with the
   site's Origin so the browser may use it) and the browser PUTs the file straight to Google. Setup: docs/uploads.md. */

const SCOPES = "https://www.googleapis.com/auth/drive.file openid email";
const FOLDER = "application/vnd.google-apps.folder";

function app() {
  const id = process.env.GOOGLE_CLIENT_ID, secret = process.env.GOOGLE_CLIENT_SECRET;
  if (!id || !secret) throw new Error("GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET are not set.");
  return { id, secret };
}

export const gdriveConfigured = () => !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

export function gdriveAuthUrl(redirectUri: string, state: string) {
  const q = new URLSearchParams({ client_id: app().id, redirect_uri: redirectUri, response_type: "code", scope: SCOPES, access_type: "offline", prompt: "consent", include_granted_scopes: "true", state });
  return `https://accounts.google.com/o/oauth2/v2/auth?${q}`;
}

async function token(body: Record<string, string>) {
  const { id, secret } = app();
  const res = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ client_id: id, client_secret: secret, ...body }), cache: "no-store" });
  if (!res.ok) throw new Error(`Google sign-in failed (${res.status}): ${await res.text()}`);
  return (await res.json()) as { access_token: string; refresh_token?: string };
}

export async function gdriveConnect(code: string, redirectUri: string) {
  const t = await token({ grant_type: "authorization_code", code, redirect_uri: redirectUri });
  if (!t.refresh_token) throw new Error("Google did not return a refresh token. Remove the app's access in your Google account and connect again.");
  const me = await fetch("https://openidconnect.googleapis.com/v1/userinfo", { headers: { Authorization: `Bearer ${t.access_token}` } }).then((r) => r.json() as Promise<{ email?: string }>);
  return { refreshToken: t.refresh_token, account: me.email ?? "Google account" };
}

export const gdriveAccess = async (refreshToken: string) => (await token({ grant_type: "refresh_token", refresh_token: refreshToken })).access_token;

async function api<T>(access: string, url: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(url, { ...init, headers: { Authorization: `Bearer ${access}`, ...init.headers }, cache: "no-store" });
  if (!res.ok) throw Object.assign(new Error(`Google Drive request failed (${res.status}): ${await res.text()}`), { status: res.status });
  return (await res.json()) as T;
}

export async function gdriveCreateFolder(access: string, name: string, parent?: string) {
  const f = await api<{ id: string }>(access, "https://www.googleapis.com/drive/v3/files?fields=id", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, mimeType: FOLDER, parents: parent ? [parent] : undefined }),
  });
  return f.id;
}

/** True while the folder still exists and isn't in the bin (the admin may have deleted it). */
export async function gdriveFolderAlive(access: string, id: string) {
  try {
    const f = await api<{ trashed: boolean }>(access, `https://www.googleapis.com/drive/v3/files/${id}?fields=trashed`);
    return !f.trashed;
  } catch {
    return false;
  }
}

/** Resumable session URL the browser PUTs one file to. */
export async function gdriveUploadSession(access: string, file: { name: string; type: string; size: number }, parent: string, origin: string) {
  const res = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&fields=id", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access}`, "Content-Type": "application/json; charset=UTF-8",
      "X-Upload-Content-Type": file.type || "application/octet-stream", "X-Upload-Content-Length": String(file.size), Origin: origin,
    },
    body: JSON.stringify({ name: file.name, parents: [parent] }),
    cache: "no-store",
  });
  const url = res.headers.get("location");
  if (!res.ok || !url) throw new Error(`Google Drive upload session failed (${res.status}): ${await res.text()}`);
  return url;
}

export async function gdriveWriteText(access: string, name: string, text: string, parent: string) {
  const boundary = `techx${Date.now()}`;
  const body = `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify({ name, parents: [parent], mimeType: "text/plain" })}\r\n--${boundary}\r\nContent-Type: text/plain; charset=UTF-8\r\n\r\n${text}\r\n--${boundary}--`;
  await api(access, "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id", { method: "POST", headers: { "Content-Type": `multipart/related; boundary=${boundary}` }, body });
}
