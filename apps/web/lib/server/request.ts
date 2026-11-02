import type { NextRequest } from "next/server";

/* Guards shared by the public form endpoints. */

export const clientIp = (req: NextRequest) =>
  req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

/** Blocks other websites from posting to our forms (the browser always sends Origin on a cross-site POST). */
export function sameOrigin(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (!origin) return true; // same-origin fetches from older browsers, curl in development
  try {
    return new URL(origin).host === req.nextUrl.host;
  } catch {
    return false;
  }
}

export class BadRequest extends Error {
  constructor(message: string, public status = 400, public code = "bad_request") { super(message); }
}

/** Reads a JSON body of at most `maxBytes`, as an object. */
export async function readJson(req: NextRequest, maxBytes = 64 * 1024): Promise<Record<string, unknown>> {
  if (!req.headers.get("content-type")?.includes("application/json")) throw new BadRequest("Send the form as JSON.", 415, "content_type");
  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared > maxBytes) throw new BadRequest("That's too much text. Please shorten your notes.", 413, "too_large");
  const text = await req.text();
  if (text.length > maxBytes) throw new BadRequest("That's too much text. Please shorten your notes.", 413, "too_large");
  try {
    const v = JSON.parse(text) as unknown;
    if (!v || typeof v !== "object" || Array.isArray(v)) throw new Error();
    return v as Record<string, unknown>;
  } catch {
    throw new BadRequest("Something went wrong sending the form. Please try again.", 400, "bad_json");
  }
}

export const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** One consistent error shape for every form endpoint: { error, code, fields? }. */
export function fail(error: string, status = 400, code = "bad_request", fields?: Record<string, string>) {
  return Response.json({ error, code, ...(fields ? { fields } : {}) }, { status });
}

export function handle(e: unknown, where: string) {
  if (e instanceof BadRequest) return fail(e.message, e.status, e.code);
  console.error(`[${where}]`, e);
  return fail("Something went wrong on our side. Please try again in a minute, or message us on WhatsApp.", 503, "server_error");
}
