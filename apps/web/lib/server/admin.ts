import { cookies } from "next/headers";
import { safeEqual, seal, unseal } from "./crypto";

/* Admin sign-in for /admin (one shared password, ADMIN_PASSWORD). A signed, HTTP-only cookie for 12 hours. */
export const ADMIN_COOKIE = "techx_admin";
const TTL = 12 * 3600;

export const adminConfigured = () => !!process.env.ADMIN_PASSWORD && !!process.env.APP_SECRET;

export async function isAdmin() {
  if (!adminConfigured()) return false;
  return !!unseal<{ a: 1 }>((await cookies()).get(ADMIN_COOKIE)?.value);
}

export async function signIn(password: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || !safeEqual(password, expected)) return false;
  (await cookies()).set(ADMIN_COOKIE, seal({ a: 1 }, TTL), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: TTL });
  return true;
}

export async function signOut() {
  (await cookies()).delete(ADMIN_COOKIE);
}
