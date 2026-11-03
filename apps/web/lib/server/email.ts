import { createHash } from "node:crypto";
import { site } from "@/lib/site";
import { rateLimit } from "./rate-limit";

/* Studio alerts by email through Resend (owner, 2026-11-03), called with fetch: no SDK.
   Credits are limited, so every send passes these gates, cheapest first:
   1. the route's own guards already ran (same-origin, honeypot, validation, per-visitor rate limits);
   2. the same alert is sent once: Resend's Idempotency-Key drops a repeat within 24 h, and a failed send can be retried
      (a local "sent" mark set before the send used to block that retry; audit, 2026-11-04);
   3. a site-wide cap per day and per month (MAIL_DAILY_CAP / MAIL_MONTHLY_CAP, defaults under Resend's free
      100 a day / 3,000 a month), counted in Redis so it holds across every server instance.
   Mail only ever goes to the studio (MAIL_TO). The visitor's address is the Reply-To, never a recipient, so the forms
   can't be used to send mail to anyone else, and each submission costs one credit at most.
   A skipped or failed email never fails the visitor's request: the submission is saved in Dropbox / Drive as well. */

export type Alert = { kind: "contact" | "trial"; subject: string; lines: [label: string, value: string][]; body?: string; replyTo?: string };
export type MailResult = { sent: boolean; reason?: "off" | "daily-cap" | "monthly-cap" | "error" };

const num = (v: string | undefined, d: number) => (Number.isFinite(Number(v)) && Number(v) > 0 ? Math.floor(Number(v)) : d);
export const mailConfigured = () => !!process.env.RESEND_API_KEY && !!process.env.MAIL_FROM;

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").slice(0, 150);

function render(a: Alert) {
  const text = [...a.lines.map(([k, v]) => `${k}: ${v || "-"}`), ...(a.body ? ["", a.body] : [])].join("\n");
  const rows = a.lines.map(([k, v]) => `<tr><td style="padding:4px 16px 4px 0;color:#6b7280;vertical-align:top">${esc(k)}</td><td style="padding:4px 0">${esc(v || "-")}</td></tr>`).join("");
  const html = `<div style="font:15px/1.5 -apple-system,Segoe UI,sans-serif;color:#111827"><table style="border-collapse:collapse">${rows}</table>${
    a.body ? `<p style="white-space:pre-wrap;margin-top:16px;padding:12px 16px;background:#f4f8fe;border-radius:8px">${esc(a.body)}</p>` : ""}</div>`;
  return { text, html };
}

export async function sendAlert(a: Alert): Promise<MailResult> {
  if (!mailConfigured()) return { sent: false, reason: "off" };
  const { text, html } = render(a);
  const fingerprint = createHash("sha256").update(`${a.kind}\n${a.replyTo ?? ""}\n${text}`).digest("base64url").slice(0, 32);

  // the month is checked first so a full month doesn't also use up the day's count
  if (!(await rateLimit("mail-month", "all", num(process.env.MAIL_MONTHLY_CAP, 2900), 30 * 86400)).ok) return skipped("monthly-cap");
  if (!(await rateLimit("mail-day", "all", num(process.env.MAIL_DAILY_CAP, 90), 86400)).ok) return skipped("daily-cap");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST", cache: "no-store", signal: AbortSignal.timeout(8000),
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json", "Idempotency-Key": `${a.kind}-${fingerprint}` },
      body: JSON.stringify({
        from: process.env.MAIL_FROM, to: (process.env.MAIL_TO || site.contact.email).split(",").map((s) => s.trim()).filter(Boolean),
        subject: oneLine(a.subject), text, html, ...(a.replyTo ? { reply_to: a.replyTo } : {}),
      }),
    });
    if (!res.ok) throw new Error(`Resend ${res.status}: ${(await res.text()).slice(0, 300)}`);
    return { sent: true };
  } catch (e) {
    console.error(`[email] ${a.kind} alert not sent`, e);
    return { sent: false, reason: "error" };
  }
}

function skipped(reason: "daily-cap" | "monthly-cap"): MailResult {
  console.warn(`[email] ${reason} reached: alert skipped`);
  return { sent: false, reason };
}
