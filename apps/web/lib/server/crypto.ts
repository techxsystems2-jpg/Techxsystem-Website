import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

/* Small crypto helpers for the upload system. Everything keys off APP_SECRET (32+ random characters, server only):
   - seal / unseal: signed, expiring tokens (upload tickets, OAuth state, the admin session cookie);
   - encrypt / decrypt: AES-256-GCM for the Dropbox / Google refresh tokens kept in the settings store. */

function secret() {
  const s = process.env.APP_SECRET;
  if (!s || s.length < 32) throw new Error("APP_SECRET is missing or shorter than 32 characters (see .env.example).");
  return s;
}

const mac = (v: string) => createHmac("sha256", secret()).update(v).digest("base64url");

export function safeEqual(a: string, b: string) {
  const x = createHash("sha256").update(a).digest();
  const y = createHash("sha256").update(b).digest();
  return timingSafeEqual(x, y);
}

/** A signed token carrying `data` until `ttlSeconds` from now. */
export function seal(data: object, ttlSeconds: number) {
  const body = Buffer.from(JSON.stringify({ d: data, e: Date.now() + ttlSeconds * 1000 })).toString("base64url");
  return `${body}.${mac(body)}`;
}

export function unseal<T>(token: string | undefined | null): T | null {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig || !safeEqual(sig, mac(body))) return null;
  try {
    const { d, e } = JSON.parse(Buffer.from(body, "base64url").toString()) as { d: T; e: number };
    return Date.now() < e ? d : null;
  } catch {
    return null;
  }
}

const key = () => createHash("sha256").update(`enc:${secret()}`).digest();

export function encrypt(text: string) {
  const iv = randomBytes(12);
  const c = createCipheriv("aes-256-gcm", key(), iv);
  const out = Buffer.concat([c.update(text, "utf8"), c.final()]);
  return [iv, c.getAuthTag(), out].map((b) => b.toString("base64url")).join(".");
}

export function decrypt(sealed: string) {
  const [iv, tag, out] = sealed.split(".").map((p) => Buffer.from(p, "base64url"));
  const d = createDecipheriv("aes-256-gcm", key(), iv!);
  d.setAuthTag(tag!);
  return Buffer.concat([d.update(out!), d.final()]).toString("utf8");
}

export const randomId = (bytes = 4) => randomBytes(bytes).toString("hex");
