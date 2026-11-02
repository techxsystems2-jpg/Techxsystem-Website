import type { NextRequest } from "next/server";
import { rateLimit, tooMany } from "@/lib/server/rate-limit";
import { clientIp, fail, handle, readJson, sameOrigin, str } from "@/lib/server/request";
import { completeSubmission, TrialError } from "@/lib/server/trial-submissions";

/** Called when every file has finished (or failed), and again after retries: writes the upload report. */
export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return fail("Forbidden", 403, "forbidden");
  const l = await rateLimit("trial-complete", clientIp(req), 60, 3600);
  if (!l.ok) return tooMany(l, "updates");
  try {
    const body = await readJson(req, 64 * 1024);
    const list = (v: unknown) => (Array.isArray(v) ? v.map((x) => str(x, 240)).filter(Boolean).slice(0, 500) : []);
    return Response.json(await completeSubmission(str(body.ticket, 6000), list(body.done), list(body.failed)));
  } catch (e) {
    if (e instanceof TrialError) return fail(e.message, 410, "expired");
    return handle(e, "trial/complete");
  }
}
