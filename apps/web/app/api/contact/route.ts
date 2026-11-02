import type { NextRequest } from "next/server";
import { randomId } from "@/lib/server/crypto";
import { NotReady, openStore } from "@/lib/server/destinations";
import { rateLimitAll, tooMany } from "@/lib/server/rate-limit";
import { clientIp, fail, handle, readJson, sameOrigin, str } from "@/lib/server/request";
import { validateContact } from "@/lib/trial";

/* "Send a message" on /contact. Saves the message as a text file in the admin's chosen Dropbox / Google Drive,
   under "<top folder>/Contact messages/<date> <name>/message.txt", so it sits next to the trials.
   Same guards as the trial: same-origin, small JSON body, honeypot, rate limits, shared validation.
   If storage isn't set up, it answers 503 with code "not_ready" and the form falls back to the visitor's mail app. */
export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return fail("Forbidden", 403, "forbidden");
  const ip = clientIp(req);
  try {
    const body = await readJson(req, 16 * 1024);
    if (str(body.website, 200)) return Response.json({ ok: true }); // honeypot
    const d = { name: str(body.name, 200), email: str(body.email, 300).toLowerCase(), message: str(body.message, 5000) };

    const fields = validateContact(d); // invalid forms don't use up the visitor's tries
    if (Object.keys(fields).length) return fail(Object.values(fields)[0]!, 422, "invalid", fields);
    const limited = await rateLimitAll([
      ["contact-burst", ip, 3, 600],          // 3 every 10 minutes from one address
      ["contact-day", ip, 20, 86400],
      ["contact-email", d.email || ip, 6, 86400],
    ]);
    if (limited) return tooMany(limited, "messages");

    const store = await openStore();
    const ref = await store.folder(`${new Date().toISOString().slice(0, 10)} ${d.name} ${randomId(2)}`, "Contact messages");
    await store.writeText(ref, "message.txt", [`From: ${d.name} <${d.email}>`, `Received: ${new Date().toISOString()}`, "", d.message, ""].join("\n"));
    return Response.json({ ok: true });
  } catch (e) {
    if (e instanceof NotReady) return fail("Our message inbox is offline for a moment.", 503, "not_ready");
    return handle(e, "contact");
  }
}
