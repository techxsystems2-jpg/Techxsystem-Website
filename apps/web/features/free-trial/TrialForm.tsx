"use client";

import { useEffect, useRef, useState, type DragEvent, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { buttonClass } from "@techx/ui/Button";
import { ArrowIcon, CheckIcon } from "@techx/ui/Icons";
import { inspectFile } from "@/lib/file-check";
import { Err, Field, inputClass as input } from "@/features/site-shell/FormField";
import { POINT_ICONS, PointIcon } from "@/features/site-shell/SkyHero";
import { site } from "@/lib/site";
import { TRIAL, accept, formatBytes, validateDetails, validateFiles, type FieldErrors, type StartResponse, type TrialDetails, type UploadTarget } from "@/lib/trial";
import { isApiError, postJson, uploadWithRetry } from "@/lib/uploader";

/* The free-trial form (Figma 32:155, copy in features/free-trial/CONTEXT.md). Files go straight from the browser to the
   studio's Dropbox or Google Drive, whichever the admin chose at /admin (docs/uploads.md).
   Error handling (owner, 2026-11-02):
   - Fields: the shared rules in lib/trial.ts, shown inline under each field (aria-invalid + aria-describedby); after the
     first send they re-check as you type; the first problem gets focus. Server answers map back to the same fields.
   - Files: each file is opened and checked as it's added (lib/file-check.ts: real type from its first bytes, size,
     duplicates; ZIPs inspected for photos, passwords, zip bombs). Rejected files are listed with the reason.
   - Upload: 3 at a time, stall timeout, retries with fresh links, waits out offline spells, Cancel, a warning before
     leaving mid-upload, and "Retry failed files" afterwards. Rate limits come back with how long to wait. */

type Status = "checking" | "ready" | "uploading" | "retrying" | "done" | "failed";
type Item = { id: string; file: File; status: Status; progress: number; photos: number; note?: string; error?: string; sentAs?: string };
type Phase = "form" | "starting" | "uploading" | "sent";

const spring = { type: "spring", bounce: 0, duration: 0.45 } as const;
const empty: TrialDetails = { name: "", studio: "", email: "", volume: TRIAL.volumes[1], notes: "", link: "" };

export function TrialForm() {
  const [d, setD] = useState<TrialDetails>(empty);
  const [items, setItems] = useState<Item[]>([]);
  const [rejected, setRejected] = useState<string[]>([]);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [tried, setTried] = useState(false);
  const [banner, setBanner] = useState("");
  const [phase, setPhase] = useState<Phase>("form");
  const [drag, setDrag] = useState(false);
  const [offline, setOffline] = useState(false);
  const [result, setResult] = useState({ received: 0, total: 0 });
  const ticket = useRef("");
  const abort = useRef<AbortController | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const busy = phase === "starting" || phase === "uploading";
  const photos = items.filter((i) => i.status !== "checking").reduce((n, i) => n + i.photos, 0);
  const totalBytes = items.reduce((n, i) => n + i.file.size, 0);
  const sentBytes = items.reduce((n, i) => n + i.file.size * i.progress, 0);
  const failed = items.filter((i) => i.status === "failed");

  // warn before leaving mid-upload; track the connection
  useEffect(() => {
    const leave = (e: BeforeUnloadEvent) => { if (busy) e.preventDefault(); };
    const net = () => setOffline(!navigator.onLine);
    window.addEventListener("beforeunload", leave);
    window.addEventListener("online", net);
    window.addEventListener("offline", net);
    return () => { window.removeEventListener("beforeunload", leave); window.removeEventListener("online", net); window.removeEventListener("offline", net); };
  }, [busy]);
  useEffect(() => () => abort.current?.abort(), []);

  const check = (next: TrialDetails, list: Item[]) => {
    const e = validateDetails(next);
    const f = validateFiles(list.filter((i) => i.status !== "checking").map((i) => ({ name: i.file.name, size: i.file.size, type: i.file.type, photos: i.photos })), next.link);
    if (f) e.files = f;
    return e;
  };
  const set = (k: keyof TrialDetails, v: string) => {
    const next = { ...d, [k]: v };
    setD(next);
    if (tried) setErrors(check(next, items));
  };
  const patch = (id: string, p: Partial<Item>) => setItems((cur) => cur.map((i) => (i.id === id ? { ...i, ...p } : i)));
  const updateItems = (fn: (cur: Item[]) => Item[]) => setItems((cur) => {
    const next = fn(cur);
    if (tried) setErrors((e) => ({ ...e, files: check(d, next).files }));
    return next;
  });

  const add = async (list: File[] | null) => {
    if (!list?.length) return;
    const have = new Set(items.map((i) => `${i.file.name}:${i.file.size}`));
    const reasons: string[] = [];
    const fresh: Item[] = [];
    for (const file of list) {
      const key = `${file.name}:${file.size}`;
      if (have.has(key)) { reasons.push(`${file.name} is already added.`); continue; }
      have.add(key);
      fresh.push({ id: `${key}:${Math.random().toString(36).slice(2)}`, file, status: "checking", progress: 0, photos: 1 });
    }
    setItems((cur) => [...cur, ...fresh]);
    await Promise.all(fresh.map(async (it) => {
      const r = await inspectFile(it.file);
      if (r.ok) updateItems((cur) => cur.map((x) => (x.id === it.id ? { ...x, status: "ready", photos: r.photos, note: r.note } : x)));
      else { reasons.push(r.reason); updateItems((cur) => cur.filter((x) => x.id !== it.id)); }
    }));
    setRejected(reasons);
  };

  const focusFirst = (e: FieldErrors) => {
    const k = (["name", "studio", "email", "volume", "files", "link", "notes"] as const).find((f) => e[f]);
    if (!k) return;
    const el = formRef.current?.querySelector<HTMLElement>(k === "files" ? "#trial-files-label" : `[name="${k}"]`);
    el?.focus();
    el?.scrollIntoView({ block: "center", behavior: "smooth" });
  };

  const runUploads = async (list: Item[], targets: UploadTarget[]) => {
    const ctl = new AbortController();
    abort.current = ctl;
    const queue = list.map((item, k) => ({ item, t: targets[k]! }));
    const done: string[] = [], bad: string[] = [];
    const worker = async () => {
      for (let job = queue.shift(); job && !ctl.signal.aborted; job = queue.shift()) {
        const { item, t } = job;
        patch(item.id, { status: "uploading", progress: 0, error: undefined, sentAs: t.name });
        try {
          await uploadWithRetry({
            target: t, file: item.file, signal: ctl.signal,
            onProgress: (p) => patch(item.id, { progress: p }),
            onRetry: (n) => patch(item.id, { status: "retrying", error: `Connection dropped. Retrying (${n} of 3)…` }),
            fresh: async () => {
              const r = await postJson<UploadTarget>("/api/trial/target", { ticket: ticket.current, name: t.name });
              if (isApiError(r)) throw new Error(r.error);
              return r;
            },
          });
          patch(item.id, { status: "done", progress: 1, error: undefined });
          done.push(t.name);
        } catch (e) {
          patch(item.id, { status: "failed", error: ctl.signal.aborted ? "Cancelled" : (e as Error).message === "Network error" ? "Couldn't upload. Check your connection." : "Couldn't upload this file." });
          bad.push(t.name);
        }
      }
    };
    await Promise.all([worker(), worker(), worker()]);
    for (const { t } of queue) bad.push(t.name); // anything never started (cancelled)
    return { done, bad, cancelled: ctl.signal.aborted };
  };

  const report = (done: string[], bad: string[]) =>
    postJson<{ received: number; total: number }>("/api/trial/complete", { ticket: ticket.current, done, failed: bad });

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTried(true);
    setBanner("");
    if (items.some((i) => i.status === "checking")) return setBanner("Still checking your files. One moment, then send again.");
    const errs = check(d, items);
    setErrors(errs);
    if (Object.keys(errs).length) return focusFirst(errs);

    setPhase("starting");
    const website = String(new FormData(e.currentTarget).get("website") ?? "");
    const files = items.map((i) => ({ name: i.file.name, size: i.file.size, type: i.file.type, photos: i.photos }));
    const res = await postJson<Exclude<StartResponse, { error: string }>>("/api/trial/start", { ...d, website, files });
    if (isApiError(res)) {
      setPhase("form");
      if (res.fields) { setErrors(res.fields); focusFirst(res.fields); }
      return setBanner(res.code === "invalid" ? "Please fix the highlighted fields." : res.error);
    }
    ticket.current = res.ticket;
    if (!res.targets.length) { setResult({ received: 0, total: 0 }); return setPhase("sent"); } // link only

    setPhase("uploading");
    const { done, bad, cancelled } = await runUploads(items, res.targets);
    if (cancelled) {
      await report(done, bad);
      setPhase("form");
      setItems((cur) => cur.map((i) => (i.status === "done" ? i : { ...i, status: "ready", progress: 0, error: undefined })));
      return setBanner(done.length ? `Upload cancelled. ${done.length} file${done.length === 1 ? " was" : "s were"} already sent; send the form again to add the rest.` : "Upload cancelled. Nothing was sent.");
    }
    const r = await report(done, bad);
    setResult(isApiError(r) ? { received: done.length, total: res.targets.length } : r);
    setPhase("sent");
  };

  const retryFailed = async () => {
    const list = items.filter((i) => i.status === "failed");
    if (!list.length) return;
    setBanner("");
    setPhase("uploading");
    const targets: UploadTarget[] = [];
    for (const i of list) {
      const t = await postJson<UploadTarget>("/api/trial/target", { ticket: ticket.current, name: i.sentAs ?? i.file.name });
      if (isApiError(t)) { setPhase("sent"); return setBanner(t.error); }
      targets.push(t);
    }
    const prev = items.filter((i) => i.status === "done").map((i) => i.sentAs ?? i.file.name);
    const { done, bad } = await runUploads(list, targets);
    const r = await report([...prev, ...done], bad);
    setResult(isApiError(r) ? { received: prev.length + done.length, total: items.length } : r);
    setPhase("sent");
  };

  const onDrop = (e: DragEvent) => { e.preventDefault(); setDrag(false); if (!busy) void add([...e.dataTransfer.files]); };

  return (
    <div className="relative h-full rounded-card bg-surface px-4 pb-5 pt-6 text-left shadow-hair md:px-7 md:pt-7">
      <AnimatePresence mode="wait" initial={false}>
        {phase === "sent" ? (
          <motion.div key="sent" role="status" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={spring} className="grid h-full min-h-[520px] content-center justify-items-start">
            <span className="grid size-11 place-items-center rounded-inner bg-[#E7F6EE] text-green"><CheckIcon size={20} /></span>
            <p className="mt-6 font-mono text-label uppercase text-ink-2">Free trial · received</p>
            <h2 className="mt-2 text-h3">Thanks{d.name ? `, ${d.name.split(" ")[0]}` : ""}. Your photos are with the studio.</h2>
            <p className="mt-3 max-w-[440px] text-ink-2">
              An editor starts on them tonight. Your edits come back within 24 hours, with a link sent to <b className="font-medium text-ink">{d.email}</b>.
            </p>
            {result.total > 0 && result.received < result.total && (
              <div className="mt-5 w-full rounded-inner bg-[#FFF6E5] p-4 text-small text-[#7A4B00]">
                <p><b className="font-medium">{result.total - result.received} of {result.total} files didn&rsquo;t upload.</b> The rest arrived safely.</p>
                <ul className="mt-2 grid gap-0.5">{failed.slice(0, 5).map((i) => <li key={i.id} className="truncate">· {i.file.name}</li>)}</ul>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" onClick={retryFailed} className={buttonClass("secondary", "", "sm")}>Retry failed files</button>
                  <a href={site.contact.whatsappUrl} rel="noopener" className={buttonClass("ghost", "", "sm")}>Send them on WhatsApp</a>
                </div>
              </div>
            )}
            {banner && <p role="alert" className="mt-3 text-small text-error">{banner}</p>}
            <a href={site.contact.whatsappUrl} rel="noopener" className={buttonClass("secondary", "mt-7")}>Questions? Message the studio</a>
          </motion.div>
        ) : (
          <motion.form ref={formRef} key="form" onSubmit={submit} noValidate initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={spring}>
            <fieldset disabled={busy} className="contents">
              <p className="mb-2.5 font-mono text-label uppercase text-ink-2">Your details</p>
              <h2 className="text-h4 tracking-[-0.015em]">Tell us where to send your edits.</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field id="name" label="Name" error={errors.name}>
                  <input id="name" name="name" value={d.name} onChange={(e) => set("name", e.target.value)} maxLength={TRIAL.limits.name} autoComplete="name" placeholder="Jake Morrison" aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} className={input} />
                </Field>
                <Field id="studio" label="Studio" hint="Optional" error={errors.studio}>
                  <input id="studio" name="studio" value={d.studio} onChange={(e) => set("studio", e.target.value)} maxLength={TRIAL.limits.studio} autoComplete="organization" placeholder="Northlight Media" aria-invalid={!!errors.studio} className={input} />
                </Field>
              </div>
              <div className="mt-4">
                <Field id="email" label="Email" error={errors.email} help="We'll send your edited photos here.">
                  <input id="email" name="email" type="email" value={d.email} onChange={(e) => set("email", e.target.value.trim())} maxLength={TRIAL.limits.email} autoComplete="email" inputMode="email" placeholder="jake@northlight.media" aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : "email-help"} className={input} />
                </Field>
              </div>
              {/* honeypot: hidden from people, filled in by bots */}
              <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />

              <fieldset className="mt-5">
                <legend className="text-small font-medium">Photos per month</legend>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {TRIAL.volumes.map((v) => (
                    <label key={v} className={`cursor-pointer rounded-[8px] px-3.5 py-2 text-[14px] font-medium transition-colors duration-150 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-blue ${d.volume === v ? "bg-ink text-white" : "bg-sunk text-ink-2 hover:text-ink"}`}>
                      <input type="radio" name="volume" value={v} checked={d.volume === v} onChange={() => set("volume", v)} className="sr-only" />{v}
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* drop zone: drag files in, or click to choose */}
              <div onDragOver={(e) => { e.preventDefault(); if (!busy) setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={onDrop}
                className={`relative mt-5 rounded-inner border border-dashed px-4 py-6 text-center transition-colors duration-150 ${drag ? "border-blue bg-blue-tint" : errors.files ? "border-error" : "border-line-2 hover:border-ink-3"}`}>
                <input type="file" multiple accept={accept} onChange={(e) => { void add(e.target.files ? [...e.target.files] : null); e.target.value = ""; }} className="peer sr-only" id="trial-files" aria-describedby="files-help" />
                <label id="trial-files-label" tabIndex={-1} htmlFor="trial-files" className="block cursor-pointer rounded-inner outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-blue">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mx-auto text-ink"><path d="M12 15V4m0 0L7.5 8.5M12 4l4.5 4.5M4 15v2a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-2" /></svg>
                  <span className="mt-2 block font-medium">Drop up to 10 photos or brackets</span>
                  <span id="files-help" className="mt-0.5 block text-small text-ink-2">or <span className="text-blue underline underline-offset-4">choose files</span> · JPEG, RAW, DNG, TIFF or a ZIP · 150 MB a file</span>
                </label>
                <div className="mx-auto mt-4 max-w-[380px] text-left">
                  <label htmlFor="link" className="sr-only">Or paste a Dropbox / Drive link</label>
                  <input id="link" name="link" type="url" value={d.link} onChange={(e) => set("link", e.target.value.trim())} maxLength={TRIAL.limits.link} placeholder="or paste a Dropbox / Drive link" aria-invalid={!!errors.link} aria-describedby={errors.link ? "link-error" : undefined} className={`${input} mt-0 text-center`} />
                  <Err id="link-error" msg={errors.link} />
                </div>
              </div>
              <Err id="files-error" msg={errors.files} />
              <AnimatePresence>
                {rejected.length > 0 && (
                  <motion.div role="alert" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <div className="mt-3 rounded-inner bg-[#FDECEC] p-3 text-small text-[#8A1C1C]">
                      <p className="flex items-start justify-between gap-3 font-medium">
                        {rejected.length === 1 ? "This file wasn't added:" : `${rejected.length} files weren't added:`}
                        <button type="button" onClick={() => setRejected([])} className="-m-1 rounded p-1 font-normal underline-offset-4 hover:underline">Dismiss</button>
                      </p>
                      <ul className="mt-1 grid gap-0.5">{rejected.slice(0, 5).map((r) => <li key={r}>· {r}</li>)}</ul>
                      {rejected.length > 5 && <p className="mt-1">…and {rejected.length - 5} more.</p>}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {items.length > 0 && (
                <div className="mt-3">
                  <p className="flex justify-between font-mono text-label uppercase text-ink-2">
                    <span>{photos} photo{photos === 1 ? "" : "s"} in {items.length} file{items.length === 1 ? "" : "s"} · {formatBytes(totalBytes)}</span>
                    {busy && <span className="tabular-nums">{Math.round((sentBytes / Math.max(totalBytes, 1)) * 100)}%</span>}
                  </p>
                  <ul className="mt-2 grid max-h-[220px] gap-1 overflow-y-auto pr-1" aria-live="polite">
                    <AnimatePresence initial={false}>
                      {items.map((i) => (
                        <motion.li key={i.id} layout initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} transition={spring}
                          className="relative overflow-hidden rounded-[8px] bg-sunk px-3 py-2 text-[13px]">
                          <span aria-hidden="true" className={`absolute inset-y-0 left-0 transition-[width] duration-200 ${i.status === "failed" ? "bg-[#FDECEC]" : "bg-blue-tint"}`} style={{ width: `${i.status === "failed" ? 100 : i.progress * 100}%` }} />
                          <span className="relative flex items-center gap-3">
                            <span className="min-w-0 flex-1 truncate font-medium">{i.file.name}</span>
                            <span className={`font-mono text-[11.5px] ${i.status === "failed" ? "text-error" : "text-ink-2"}`}>{label(i)}</span>
                            {i.status === "done" ? <CheckIcon size={14} className="text-green" /> : !busy && (
                              <button type="button" onClick={() => updateItems((c) => c.filter((x) => x.id !== i.id))} aria-label={`Remove ${i.file.name}`} className="-mr-1 grid size-6 place-items-center rounded text-ink-2 hover:bg-line hover:text-ink">
                                <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                              </button>
                            )}
                          </span>
                          {(i.note || i.error) && <span className={`relative mt-0.5 block text-[12px] ${i.status === "failed" ? "text-error" : "text-ink-2"}`}>{i.error ?? i.note}</span>}
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                </div>
              )}

              <div className="mt-5">
                <Field id="notes" label="Anything we should know?" hint="Optional" error={errors.notes}>
                  <textarea id="notes" name="notes" value={d.notes} onChange={(e) => set("notes", e.target.value)} rows={3} maxLength={TRIAL.limits.notes} placeholder="Bright and airy, blue skies, keep wall colours…" aria-invalid={!!errors.notes} className={`${input} resize-none`} />
                </Field>
              </div>
            </fieldset>

            <AnimatePresence>
              {(banner || offline) && (
                <motion.p role="alert" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-4 rounded-inner bg-[#FDECEC] px-3.5 py-2.5 text-small text-[#8A1C1C]">
                  {offline ? (busy ? "You're offline. Uploads will carry on when you reconnect." : "You're offline. Reconnect to send your trial.") : banner}
                </motion.p>
              )}
            </AnimatePresence>

            <button type="submit" disabled={busy} className={buttonClass("primary", "mt-6 w-full", "lg")}>
              {phase === "starting" ? "Getting ready…" : phase === "uploading" ? `Uploading ${items.filter((i) => i.status === "done").length} of ${items.length}…` : <>Send my free trial <ArrowIcon className="transition-transform duration-200 group-hover:translate-x-0.5" /></>}
            </button>
            {phase === "uploading" && (
              <button type="button" onClick={() => abort.current?.abort()} className={buttonClass("ghost", "mt-2 w-full", "sm")}>Cancel upload</button>
            )}
            <ul className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-1.5 text-small text-ink-2">
              {([["No card", POINT_ICONS.card], ["Back in 24 h", POINT_ICONS.clock], ["Your files stay private", POINT_ICONS.lock]] as const).map(([t, icon]) => (
                <li key={t} className="flex items-center gap-1.5"><PointIcon icon={icon} size={15} />{t}</li>
              ))}
            </ul>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function label(i: Item) {
  if (i.status === "checking") return "Checking…";
  if (i.status === "done") return "Uploaded";
  if (i.status === "failed") return "Failed";
  if (i.status === "uploading" || i.status === "retrying") return `${Math.round(i.progress * 100)}%`;
  return formatBytes(i.file.size);
}
