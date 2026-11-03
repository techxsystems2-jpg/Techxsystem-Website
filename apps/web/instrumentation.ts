/* Runs once when a production server starts (production readiness, 2026-11-03): lists the settings that are missing or
   weak, so a half-configured deploy shows up in the Vercel logs straight away. Warnings only: the public site works
   without most of these, and taking it down over a missing email key would be worse. Values are never printed. */
export function register() {
  if (process.env.NODE_ENV !== "production" || process.env.NEXT_RUNTIME !== "nodejs") return;
  const e = process.env;
  const problems = [
    !e.APP_SECRET || e.APP_SECRET.length < 32 ? "APP_SECRET missing or under 32 characters: admin sign-in and uploads are off" : "",
    !e.ADMIN_EMAIL || !e.ADMIN_PASSWORD ? "ADMIN_EMAIL / ADMIN_PASSWORD missing: admin sign-in is off" : "",
    e.ADMIN_PASSWORD && e.ADMIN_PASSWORD.length < 16 ? "ADMIN_PASSWORD is under 16 characters" : "",
    !e.DATABASE_URL ? "DATABASE_URL missing: admin edits can't be saved" : "",
    e.VERCEL && !e.BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN ? "BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN missing: admin photo uploads are off" : "",
    !e.UPSTASH_REDIS_REST_URL || !e.UPSTASH_REDIS_REST_TOKEN ? "UPSTASH_REDIS_REST_URL / _TOKEN missing: rate limits and email caps only count per server instance" : "",
    !e.RESEND_API_KEY || !e.MAIL_FROM ? "RESEND_API_KEY / MAIL_FROM missing: no email alerts for contact messages and trials" : "",
    e.VERCEL_ENV === "production" && !e.NEXT_PUBLIC_SITE_URL ? "NEXT_PUBLIC_SITE_URL missing: canonical links use https://www.techxsystems.com" : "",
  ].filter(Boolean);
  if (problems.length) console.warn(`[setup] ${problems.length} setting(s) need attention:\n- ${problems.join("\n- ")}`);
}
