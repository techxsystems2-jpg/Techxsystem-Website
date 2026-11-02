"use client";

import { useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { buttonClass } from "@techx/ui/Button";
import { ArrowIcon } from "@techx/ui/Icons";
import { Err, Field, inputClass } from "@/features/site-shell/FormField";
import { site } from "@/lib/site";
import { TRIAL, validateContact, type ContactDetails } from "@/lib/trial";
import { isApiError, postJson } from "@/lib/uploader";

/* "Send a message" (Figma 34:155): name, email, message. Posts to /api/contact, which saves the message to the
   studio's Dropbox / Google Drive (same place as the trials). Errors (owner, 2026-11-02): the shared rules in
   lib/trial.ts inline under each field, re-checked as you type after the first send, first problem focused; rate
   limits and network problems in a banner. Only if the inbox is offline (not set up) does it fall back to the
   visitor's mail app, with the message already written. */
type Errors = Partial<Record<keyof ContactDetails, string>>;
const spring = { type: "spring", bounce: 0, duration: 0.45 } as const;
const empty: ContactDetails = { name: "", email: "", message: "" };

export function MessageForm() {
  const [d, setD] = useState<ContactDetails>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [tried, setTried] = useState(false);
  const [banner, setBanner] = useState("");
  const [state, setState] = useState<"form" | "sending" | "sent" | "mailto">("form");
  const formRef = useRef<HTMLFormElement>(null);

  const set = (k: keyof ContactDetails, v: string) => {
    const next = { ...d, [k]: v };
    setD(next);
    if (tried) setErrors(validateContact(next));
  };
  const focusFirst = (e: Errors) => {
    const k = (["name", "email", "message"] as const).find((f) => e[f]);
    if (k) formRef.current?.querySelector<HTMLElement>(`[name="${k}"]`)?.focus();
  };
  const mailto = () => {
    const body = `${d.message.trim()}\n\n${d.name} · ${d.email}`;
    window.location.href = `mailto:${site.contact.email}?subject=${encodeURIComponent(`Message from ${d.name}`)}&body=${encodeURIComponent(body)}`;
    setState("mailto");
  };

  const send = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTried(true);
    setBanner("");
    const errs = validateContact(d);
    setErrors(errs);
    if (Object.keys(errs).length) return focusFirst(errs);
    setState("sending");
    const website = String(new FormData(e.currentTarget).get("website") ?? "");
    const res = await postJson<{ ok: true }>("/api/contact", { ...d, website });
    if (!isApiError(res)) return setState("sent");
    setState("form");
    if (res.code === "not_ready") return mailto();
    if (res.fields) { setErrors(res.fields as Errors); focusFirst(res.fields as Errors); }
    setBanner(res.code === "invalid" ? "Please fix the highlighted fields." : res.error);
  };

  const done = state === "sent" || state === "mailto";
  return (
    <div id="message" className="relative h-full scroll-mt-28 rounded-card bg-surface px-4 pb-5 pt-6 shadow-hair md:px-7 md:pt-7">
      <AnimatePresence mode="wait" initial={false}>
        {done ? (
          <motion.div key="sent" role="status" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={spring} className="grid min-h-[380px] content-center justify-items-start">
            <span className="grid size-10 place-items-center rounded-inner bg-[#E7F6EE] text-green">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
            </span>
            {state === "sent" ? (
              <>
                <h2 className="mt-5 text-h4 tracking-[-0.015em]">Thanks{d.name ? `, ${d.name.split(" ")[0]}` : ""}. Your message is with the studio.</h2>
                <p className="mt-3 max-w-[400px] text-ink-2">An editor will reply to <b className="font-medium text-ink">{d.email}</b>. Need an answer sooner? Message us on WhatsApp.</p>
              </>
            ) : (
              <>
                <h2 className="mt-5 text-h4 tracking-[-0.015em]">Your message is ready to send.</h2>
                <p className="mt-3 max-w-[400px] text-ink-2">
                  Our inbox is offline for a moment, so your mail app has opened with it written out. Press send there. If nothing opened, write to{" "}
                  <a href={`mailto:${site.contact.email}`} className="font-medium text-ink underline underline-offset-4 hover:text-blue">{site.contact.email}</a>.
                </p>
              </>
            )}
            <button type="button" onClick={() => { setD(empty); setTried(false); setErrors({}); setState("form"); }} className={buttonClass("ghost", "-ml-3 mt-6", "sm")}>Write another message</button>
          </motion.div>
        ) : (
          <motion.form ref={formRef} key="form" onSubmit={send} noValidate className="flex h-full flex-col" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={spring}>
            <p className="mb-2.5 flex gap-2.5 font-mono text-label uppercase">
              <b className="font-medium text-maroon">04</b><span className="text-ink-2">Send a message</span>
            </p>
            <h2 className="text-h4 tracking-[-0.015em]">Write it here. An editor replies.</h2>
            <fieldset disabled={state === "sending"} className="contents">
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field id="c-name" label="Name" error={errors.name}>
                  <input id="c-name" name="name" value={d.name} onChange={(e) => set("name", e.target.value)} maxLength={TRIAL.limits.name} autoComplete="name" placeholder="Your name" aria-invalid={!!errors.name} aria-describedby={errors.name ? "c-name-error" : undefined} className={inputClass} />
                </Field>
                <Field id="c-email" label="Email" error={errors.email}>
                  <input id="c-email" name="email" type="email" value={d.email} onChange={(e) => set("email", e.target.value.trim())} maxLength={TRIAL.limits.email} autoComplete="email" inputMode="email" placeholder="you@studio.com" aria-invalid={!!errors.email} aria-describedby={errors.email ? "c-email-error" : undefined} className={inputClass} />
                </Field>
              </div>
              <label htmlFor="c-message" className="mt-4 text-small font-medium">Message</label>
              <textarea id="c-message" name="message" value={d.message} onChange={(e) => set("message", e.target.value)} maxLength={TRIAL.limits.notes} placeholder="How can we help?" aria-invalid={!!errors.message} aria-describedby={errors.message ? "c-message-error" : undefined} className={`${inputClass} min-h-[140px] flex-1 resize-none`} />
              <Err id="c-message-error" msg={errors.message} />
              {/* honeypot: hidden from people, filled in by bots */}
              <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />
            </fieldset>
            <AnimatePresence>
              {banner && <motion.p role="alert" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-4 rounded-inner bg-[#FDECEC] px-3.5 py-2.5 text-small text-[#8A1C1C]">{banner}</motion.p>}
            </AnimatePresence>
            <button type="submit" disabled={state === "sending"} className={buttonClass("primary", "mt-6 self-start")}>
              {state === "sending" ? "Sending…" : <>Send message <ArrowIcon className="transition-transform duration-200 group-hover:translate-x-0.5" /></>}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
