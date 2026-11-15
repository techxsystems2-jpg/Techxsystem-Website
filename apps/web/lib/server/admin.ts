import { cookies } from "next/headers";
import { connection } from "next/server";
import { safeEqual, seal, unseal } from "./crypto";

/* Admin sign-in for /admin with an email and a password (owner, 2026-11-03: "simple email and password"):
   ADMIN_EMAIL and ADMIN_PASSWORD in the environment. A signed, HTTP-only cookie for 12 hours carries the email, so
   changing ADMIN_EMAIL signs everyone out. Tries are rate-limited in the sign-in action (app/admin/actions.ts). */
export const ADMIN_COOKIE = "techx_admin";
const TTL = 12 * 3600;

const adminEmailSetting = () => (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();

export const adminConfigured = () => !!adminEmailSetting() && !!process.env.ADMIN_PASSWORD && !!process.env.APP_SECRET;

/** The signed-in admin's email, or null. */
export async function adminEmail(): Promise<string | null> {
  if (!adminConfigured()) return null;
  // request time only: the session check reads the clock (expiry), which a prefetch prerender must not do
  await connection();
  return sessionEmail((await cookies()).get(ADMIN_COOKIE)?.value);
}

/** The admin email a session cookie value carries, if it is valid, unexpired and still the configured admin. */
export function sessionEmail(cookie: string | undefined): string | null {
  if (!adminConfigured()) return null;
  const s = unseal<{ e?: string }>(cookie, "admin-session");
  return s?.e && s.e === adminEmailSetting() ? s.e : null;
}

export async function isAdmin() {
  return (await adminEmail()) !== null;
}

export async function signIn(email: string, password: string) {
  const expectedEmail = adminEmailSetting(), expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedEmail || !expectedPassword) return false;
  // both are always checked (constant time), so the answer doesn't reveal which one was wrong
  const emailOk = safeEqual(email.trim().toLowerCase(), expectedEmail);
  const passwordOk = safeEqual(password, expectedPassword);
  if (!emailOk || !passwordOk) return false;
  (await cookies()).set(ADMIN_COOKIE, seal({ e: expectedEmail }, TTL, "admin-session"), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: TTL });
  return true;
}

export async function signOut() {
  (await cookies()).delete(ADMIN_COOKIE);
}
