import type { NextRequest } from "next/server";
import { NotReady } from "@/lib/server/destinations";
import { rateLimitAll, tooMany } from "@/lib/server/rate-limit";
import { clientIp, fail, handle, readJson, sameOrigin, str } from "@/lib/server/request";
import { checkTrial, startSubmission, TrialError } from "@/lib/server/trial-submissions";
import { TRIAL, type TrialDetails, type TrialFile } from "@/lib/trial";

/* Starts a free-trial submission (lib/server/trial-submissions.ts). Guards, in order: same-origin only, a JSON body
   under 64 KB, a hidden honeypot field, the shared validation, then rate limits (per address and per email).
   Errors come back as { error, code, fields? } so the form can mark the exact field. */
export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return fail("Forbidden", 403, "forbidden");
  const ip = clientIp(req);
  try {
    const body = await readJson(req);
    if (str(body.website, 200)) return Response.json({ ticket: "", targets: [] }); // honeypot: pretend it worked

    const details: TrialDetails = {
      name: str(body.name, 200), studio: str(body.studio, 200), email: str(body.email, 300).toLowerCase(),
      volume: str(body.volume, 40), notes: str(body.notes, 5000), link: str(body.link, 1200),
    };
    const files: TrialFile[] = Array.isArray(body.files)
      ? body.files.slice(0, 500).map((f: Record<string, unknown>) => ({
          name: str(f?.name, 240), size: Number(f?.size) || 0, type: str(f?.type, 100),
          photos: Math.max(1, Math.min(TRIAL.maxFiles + 1, Math.floor(Number(f?.photos) || 1))),
        }))
      : [];

    checkTrial(details, files); // invalid forms don't use up the visitor's tries
    const limited = await rateLimitAll([
      ["trial-burst", ip, 4, 60],              // 4 a minute from one address
      ["trial-hour", ip, 12, 3600],            // 12 an hour from one address (studios share an office IP)
      ["trial-email", details.email || ip, 5, 86400], // 5 a day per email
    ]);
    if (limited) return tooMany(limited, "free-trial requests");

    return Response.json(await startSubmission(details, files, req.nextUrl.origin));
  } catch (e) {
    if (e instanceof TrialError) return fail(e.message, 422, "invalid", e.fields);
    if (e instanceof NotReady) {
      console.error("[trial/start] not ready:", e.message);
      return fail("Uploads are paused for a moment. Paste a Dropbox or Drive link instead, or send your photos on WhatsApp.", 503, "not_ready");
    }
    return handle(e, "trial/start");
  }
}
