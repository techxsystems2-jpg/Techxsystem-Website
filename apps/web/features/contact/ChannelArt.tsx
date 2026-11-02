"use client";

import { AnimatePresence, motion } from "motion/react";
import { Mark } from "@techx/ui/Icons";
import { Canvas, Story } from "@/features/illustrations/Canvas";
import { useSequence } from "@/features/illustrations/AnswerArt";
import { useLoop } from "@/features/motion/useLoop";
import { site } from "@/lib/site";

/* Illustrations for the Email and Call channel cards, drawn like the Home answer cards: a small app window on the dotted
   canvas, acting out the channel in a few beats with a story caption underneath. Same window size and scale as
   ContactArt (the WhatsApp card), so the three cards line up. Loops only on screen; reduced motion rests on the
   finished frame. Copy stays inside Figma's lines: email is "for quotes, invoices and anything with attachments";
   calls are "weekdays 9 AM – 7 PM IST, book a call for US hours". */
const pop = { type: "spring", bounce: 0.35, duration: 0.5 } as const;
const enter = { initial: { opacity: 0, y: 10, scale: 0.96 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0 }, transition: pop } as const;

function Window({ title, status, tag, children }: { title: string; status: string; tag: string; children: React.ReactNode }) {
  return (
    <div className="grid h-[214px] w-full place-items-center">
      <div className="mx-auto w-[calc(100%-24px)] max-w-[380px] origin-center scale-[0.78] overflow-hidden rounded-xl bg-surface/70 shadow-raised backdrop-blur">
        <div className="flex items-center gap-2 border-b border-line bg-surface px-3 py-2">
          <span className="grid size-7 place-items-center rounded-full bg-ink"><Mark className="scale-[0.55] brightness-0 invert" /></span>
          <span className="grid leading-tight">
            <span className="text-[12px] font-semibold text-ink">{title}</span>
            <span className="text-[10px] text-ink-2">{status}</span>
          </span>
          <span className="ml-auto font-mono text-[9.5px] uppercase tracking-[0.04em] text-ink-2">{tag}</span>
        </div>
        <div className="grid min-h-[208px] content-start gap-2.5 p-3">{children}</div>
      </div>
    </div>
  );
}

/* Email: write to the studio, attach the files, a quote comes back. */
const MAIL_MS = [700, 1100, 900, 900, 1300, 2800] as const;
const files = ["brackets_sample.zip", "style_notes.pdf"];
export function EmailArt() {
  const { ref, play } = useLoop<HTMLDivElement>();
  const s = useSequence(MAIL_MS.length, MAIL_MS, play);
  // 0 to · 1 subject · 2 file 1 · 3 file 2 · 4 sent + reply · 5 hold
  return (
    <div ref={ref}>
      <Canvas className="h-[292px]" story={<Story steps={["Write to the studio", "Attach anything you need", "Quotes and invoices come back"]} at={s <= 1 ? 0 : s <= 3 ? 1 : 2} />}>
        <Window title="New message" status={s >= 4 ? "Sent" : "Draft"} tag="Email">
          <div className="grid gap-1.5 text-[12px]">
            <p className="flex gap-2 border-b border-line pb-1.5"><span className="w-12 text-ink-2">To</span><span className="font-medium text-ink">{site.contact.email}</span></p>
            <p className="flex gap-2 border-b border-line pb-1.5"><span className="w-12 text-ink-2">Subject</span>
              <AnimatePresence initial={false}>{s >= 1 && <motion.span key="sub" className="font-medium text-ink" {...enter}>Quote for 3 listings this week</motion.span>}</AnimatePresence>
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <AnimatePresence initial={false}>
              {files.slice(0, s >= 3 ? 2 : s >= 2 ? 1 : 0).map((f) => (
                <motion.span key={f} layout className="inline-flex items-center gap-1.5 rounded-md bg-sunk px-2 py-1 font-mono text-[10px] text-ink-2" {...enter}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="m20 11-8.2 8.2a5 5 0 0 1-7-7L13 4a3.5 3.5 0 0 1 5 5l-8.2 8.2a2 2 0 0 1-2.8-2.8L14.5 7" /></svg>
                  {f}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
          <AnimatePresence initial={false}>
            {s >= 4 && (
              <motion.div key="reply" className="flex items-center gap-2.5 rounded-lg bg-blue-tint p-2.5" {...enter}>
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-blue text-white">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 14 4 9l5-5" /><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" /></svg>
                </span>
                <span className="grid leading-snug">
                  <span className="text-[11.5px] font-semibold text-ink">Re: Quote for 3 listings</span>
                  <span className="text-[10.5px] text-ink-2">TechX studio · quote attached</span>
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </Window>
      </Canvas>
    </div>
  );
}

/* Call: dial the studio, it rings, an editor picks up. The status line under the number tells the beat. */
const CALL_MS = [900, 1500, 1300, 1300, 2800] as const;
export function CallArt() {
  const { ref, play } = useLoop<HTMLDivElement>();
  const s = useSequence(CALL_MS.length, CALL_MS, play);
  // 0 dial · 1 ringing · 2 connected · 3 talking · 4 hold
  const live = s >= 2;
  return (
    <div ref={ref}>
      <Canvas className="h-[292px]" story={<Story steps={["Call the studio directly", "Weekdays, 9 AM – 7 PM IST", "Or book a call for US hours"]} at={s <= 1 ? 0 : s <= 3 ? 1 : 2} />}>
        <Window title="TechX studio" status={live ? "Editor on the line" : s === 1 ? "Ringing…" : "Calling"} tag="Call">
          <div className="grid justify-items-center gap-3 pt-1">
            <span className="relative grid size-14 place-items-center rounded-full bg-ink">
              {s === 1 && [0, 1].map((d) => (
                <motion.span key={d} aria-hidden="true" className="absolute inset-0 rounded-full border-2 border-blue" initial={{ scale: 1, opacity: 0.6 }} animate={{ scale: 1.7, opacity: 0 }} transition={{ duration: 1.2, repeat: Infinity, delay: d * 0.6, ease: "easeOut" }} />
              ))}
              <Mark className="brightness-0 invert" />
            </span>
            <span className="font-mono text-[13px] font-medium tabular-nums text-ink">{site.contact.phone}</span>
            <div className="flex h-6 items-center gap-[3px]" aria-hidden="true">
              {Array.from({ length: 14 }, (_, i) => (
                <motion.span key={i} className={`w-[3px] rounded-full ${live ? "bg-blue" : "bg-line-2"}`}
                  initial={false} animate={{ height: live && s !== 4 ? [6, 10 + ((i * 7) % 13), 6] : 6 }}
                  transition={live && s !== 4 ? { duration: 0.7, repeat: Infinity, delay: (i % 5) * 0.08 } : { duration: 0.3 }} />
              ))}
            </div>
            <span className={`rounded-full px-2.5 py-1 text-[10.5px] font-medium transition-colors duration-300 ${live ? "bg-[#E7F6EE] text-green" : "bg-sunk text-ink-2"}`}>
              {live ? "Connected" : "Connecting"}
            </span>
          </div>
        </Window>
      </Canvas>
    </div>
  );
}
