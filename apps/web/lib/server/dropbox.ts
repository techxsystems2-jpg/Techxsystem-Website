/* Dropbox connector (owner, 2026-11-02). Uses a Dropbox app with "App folder" access and the scopes
   files.content.write + account_info.read, so files land in Apps/<app name>/<folder>/… in the admin's Dropbox.
   Client files never pass through our server: for each file we ask Dropbox for a temporary upload link (valid 4 h,
   up to 150 MB a file) and the browser POSTs the file straight to it. Setup: docs/uploads.md. */

const API = "https://api.dropboxapi.com";
const CONTENT = "https://content.dropboxapi.com";

function app() {
  const key = process.env.DROPBOX_APP_KEY, secret = process.env.DROPBOX_APP_SECRET;
  if (!key || !secret) throw new Error("DROPBOX_APP_KEY / DROPBOX_APP_SECRET are not set.");
  return { key, secret, basic: `Basic ${Buffer.from(`${key}:${secret}`).toString("base64")}` };
}

export const dropboxConfigured = () => !!(process.env.DROPBOX_APP_KEY && process.env.DROPBOX_APP_SECRET);

export function dropboxAuthUrl(redirectUri: string, state: string) {
  const q = new URLSearchParams({ client_id: app().key, response_type: "code", token_access_type: "offline", redirect_uri: redirectUri, state });
  return `https://www.dropbox.com/oauth2/authorize?${q}`;
}

async function token(body: Record<string, string>) {
  const res = await fetch(`${API}/oauth2/token`, { method: "POST", headers: { Authorization: app().basic, "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(body), cache: "no-store" });
  if (!res.ok) throw new Error(`Dropbox sign-in failed (${res.status}): ${await res.text()}`);
  return (await res.json()) as { access_token: string; refresh_token?: string };
}

/** OAuth callback: code → refresh token + the account's email (shown on the admin page). */
export async function dropboxConnect(code: string, redirectUri: string) {
  const t = await token({ grant_type: "authorization_code", code, redirect_uri: redirectUri });
  if (!t.refresh_token) throw new Error("Dropbox did not return a refresh token.");
  const me = await rpc<{ email: string }>(t.access_token, "users/get_current_account", null);
  return { refreshToken: t.refresh_token, account: me.email };
}

export const dropboxAccess = async (refreshToken: string) => (await token({ grant_type: "refresh_token", refresh_token: refreshToken })).access_token;

async function rpc<T>(access: string, endpoint: string, args: unknown): Promise<T> {
  const res = await fetch(`${API}/2/${endpoint}`, { method: "POST", headers: { Authorization: `Bearer ${access}`, "Content-Type": "application/json" }, body: JSON.stringify(args), cache: "no-store" });
  if (!res.ok) throw Object.assign(new Error(`Dropbox ${endpoint} failed (${res.status}): ${await res.text()}`), { status: res.status });
  return (await res.json()) as T;
}

export async function dropboxCreateFolder(access: string, path: string) {
  try {
    await rpc(access, "files/create_folder_v2", { path, autorename: false });
  } catch (e) {
    if ((e as { status?: number }).status !== 409) throw e; // already exists
  }
}

/** A one-off link the browser POSTs a single file to (Content-Type: application/octet-stream). */
export async function dropboxUploadLink(access: string, path: string) {
  const r = await rpc<{ link: string }>(access, "files/get_temporary_upload_link", { commit_info: { path, mode: "add", autorename: true, mute: false }, duration: 14400 });
  return r.link;
}

// Dropbox-API-Arg is an HTTP header, so anything outside ASCII must be \u-escaped
const headerJson = (v: unknown) => JSON.stringify(v).replace(/[\u007f-￿]/g, (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`);

export async function dropboxWriteText(access: string, path: string, text: string) {
  const res = await fetch(`${CONTENT}/2/files/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${access}`, "Content-Type": "application/octet-stream", "Dropbox-API-Arg": headerJson({ path, mode: "overwrite", mute: true }) },
    body: text,
  });
  if (!res.ok) throw new Error(`Dropbox upload failed (${res.status}): ${await res.text()}`);
}
