import type { ApiError, UploadTarget } from "./trial";

/* Browser upload engine for the free trial (owner, 2026-11-02: handle every error).
   - Each file goes straight to its target with XMLHttpRequest (real progress events).
   - A stall timer aborts an attempt that sends nothing for 45 s (a dead connection never "fails" on its own).
   - Up to 4 attempts per file with backoff (1 s, 3 s, 8 s). Attempts after the first ask the server for a fresh link,
     because Dropbox links can be single-use and Google sessions expire.
   - While the browser is offline it waits for the connection to come back instead of burning attempts.
   - Everything stops at once on cancel (AbortSignal). 4xx answers other than 408 / 429 aren't retried. */

export class UploadError extends Error {
  constructor(message: string, public retryable: boolean) { super(message); }
}

const STALL_MS = 45_000;
const BACKOFF = [1000, 3000, 8000];

function attempt(t: UploadTarget, file: File, signal: AbortSignal, onProgress: (p: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const x = new XMLHttpRequest();
    let stall: ReturnType<typeof setTimeout>;
    const arm = () => { clearTimeout(stall); stall = setTimeout(() => x.abort(), STALL_MS); };
    const done = (fn: () => void) => { clearTimeout(stall); signal.removeEventListener("abort", stop); fn(); };
    const stop = () => x.abort();
    signal.addEventListener("abort", stop);
    x.open(t.method, t.url);
    for (const [k, v] of Object.entries(t.headers)) x.setRequestHeader(k, v);
    x.upload.onprogress = (e) => { arm(); if (e.lengthComputable) onProgress(e.loaded / e.total); };
    x.onload = () => done(() => {
      if (x.status >= 200 && x.status < 300) return resolve();
      const retryable = x.status === 408 || x.status === 429 || x.status >= 500;
      reject(new UploadError(x.status === 413 ? "File too large for the upload link" : `Upload refused (${x.status})`, retryable));
    });
    x.onerror = () => done(() => reject(new UploadError("Network error", true)));
    x.onabort = () => done(() => reject(new UploadError(signal.aborted ? "Cancelled" : "Connection stalled", !signal.aborted)));
    arm();
    x.send(file);
  });
}

const wait = (ms: number, signal: AbortSignal) => new Promise<void>((res, rej) => {
  const t = setTimeout(res, ms);
  signal.addEventListener("abort", () => { clearTimeout(t); rej(new UploadError("Cancelled", false)); }, { once: true });
});

const online = (signal: AbortSignal) => navigator.onLine ? Promise.resolve() : new Promise<void>((res, rej) => {
  const on = () => { window.removeEventListener("online", on); res(); };
  window.addEventListener("online", on);
  signal.addEventListener("abort", () => { window.removeEventListener("online", on); rej(new UploadError("Cancelled", false)); }, { once: true });
});

export async function uploadWithRetry(opts: {
  target: UploadTarget; file: File; signal: AbortSignal;
  onProgress: (p: number) => void; onRetry: (attempt: number, reason: string) => void;
  fresh: () => Promise<UploadTarget>;
}) {
  let target = opts.target;
  for (let n = 0; ; n++) {
    await online(opts.signal);
    try {
      return await attempt(target, opts.file, opts.signal, opts.onProgress);
    } catch (e) {
      const err = e instanceof UploadError ? e : new UploadError("Upload failed", true);
      if (!err.retryable || n >= BACKOFF.length || opts.signal.aborted) throw err;
      opts.onRetry(n + 1, err.message);
      opts.onProgress(0);
      await wait(BACKOFF[n]!, opts.signal);
      await online(opts.signal);
      target = await opts.fresh();
    }
  }
}

/** POST JSON to one of our endpoints; always resolves to the body or a typed error (network, timeout, 429, 5xx). */
export async function postJson<T>(url: string, body: unknown, timeoutMs = 30_000): Promise<T | ApiError> {
  if (typeof navigator !== "undefined" && !navigator.onLine) return { error: "You're offline. Check your connection, then try again.", code: "offline" };
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), signal: ctl.signal });
    const data = (await res.json().catch(() => null)) as (T & Partial<ApiError>) | null;
    if (!res.ok || !data) return { error: data?.error ?? "Something went wrong on our side. Please try again in a minute.", code: data?.code ?? `http_${res.status}`, fields: data?.fields, retryAfter: data?.retryAfter };
    return data;
  } catch {
    return ctl.signal.aborted
      ? { error: "That took too long. Check your connection and try again.", code: "timeout" }
      : { error: "Couldn't reach us. Check your connection and try again.", code: "network" };
  } finally {
    clearTimeout(t);
  }
}

export const isApiError = (v: unknown): v is ApiError => !!v && typeof v === "object" && "error" in v && "code" in v;
