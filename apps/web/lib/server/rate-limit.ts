import { createHash } from "node:crypto";

/* Fixed-window rate limiting (owner, 2026-11-02). Uses Upstash Redis when UPSTASH_REDIS_REST_URL / _TOKEN are set, so
   limits hold across every serverless instance; otherwise an in-memory window per instance (development, or a host
   without Redis). Keys are hashed, so no raw IP or email is ever stored. */

export type Limit = { ok: boolean; remaining: number; retryAfter: number };

const memory = new Map<string, { count: number; reset: number }>();

/** Upstash Redis REST settings, or null when not configured (also used by the content store, kv.ts). */
export const redis = () => {
  const url = process.env.UPSTASH_REDIS_REST_URL, token = process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url, token } : null;
};

const hash = (s: string) => createHash("sha256").update(s).digest("base64url").slice(0, 22);

/** Allow `max` hits per `windowSec` for this bucket + identity. Fails open if Redis is down (logs it). */
export async function rateLimit(bucket: string, identity: string, max: number, windowSec: number): Promise<Limit> {
  const key = `techx:rl:${bucket}:${hash(identity)}`;
  const r = redis();
  if (r) {
    try {
      const res = await fetch(`${r.url}/pipeline`, {
        method: "POST", headers: { Authorization: `Bearer ${r.token}`, "Content-Type": "application/json" }, cache: "no-store",
        body: JSON.stringify([["INCR", key], ["EXPIRE", key, windowSec, "NX"], ["TTL", key]]),
      });
      if (!res.ok) throw new Error(`Upstash ${res.status}`);
      const [count, , ttl] = ((await res.json()) as { result: number }[]).map((x) => x.result);
      return { ok: count! <= max, remaining: Math.max(0, max - count!), retryAfter: Math.max(1, ttl ?? windowSec) };
    } catch (e) {
      console.error("[rate-limit] Redis unavailable, using memory", e);
    }
  }
  const now = Date.now();
  if (memory.size > 5000) for (const [k, v] of memory) if (v.reset < now) memory.delete(k);
  const w = memory.get(key);
  const cur = w && w.reset > now ? w : { count: 0, reset: now + windowSec * 1000 };
  cur.count++;
  memory.set(key, cur);
  return { ok: cur.count <= max, remaining: Math.max(0, max - cur.count), retryAfter: Math.max(1, Math.ceil((cur.reset - now) / 1000)) };
}

/** Apply several limits; the first one that is exceeded wins. */
export async function rateLimitAll(checks: [bucket: string, identity: string, max: number, windowSec: number][]) {
  for (const c of checks) {
    const l = await rateLimit(...c);
    if (!l.ok) return l;
  }
  return null;
}

export function tooMany(l: Limit, what = "tries") {
  const mins = Math.ceil(l.retryAfter / 60);
  return Response.json(
    { error: `Too many ${what}. Please try again in ${mins <= 1 ? "a minute" : `${mins} minutes`}, or message us on WhatsApp.`, code: "rate_limited", retryAfter: l.retryAfter },
    { status: 429, headers: { "Retry-After": String(l.retryAfter) } },
  );
}
