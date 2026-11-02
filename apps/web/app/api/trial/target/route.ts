import type { NextRequest } from "next/server";
import { rateLimit, tooMany } from "@/lib/server/rate-limit";
import { clientIp, fail, handle, readJson, sameOrigin, str } from "@/lib/server/request";
import { retarget, TrialError } from "@/lib/server/trial-submissions";

/** A fresh upload link for one file of a submission, used when an upload attempt fails or times out. */
export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return fail("Forbidden", 403, "forbidden");
  const l = await rateLimit("trial-target", clientIp(req), 300, 3600);
  if (!l.ok) return tooMany(l, "retries");
  try {
    const body = await readJson(req, 8 * 1024);
    return Response.json(await retarget(str(body.ticket, 6000), str(body.name, 240), req.nextUrl.origin));
  } catch (e) {
    if (e instanceof TrialError) return fail(e.message, 410, "expired");
    return handle(e, "trial/target");
  }
}
