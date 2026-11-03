"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { animate, motion, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform } from "motion/react";
import { RevealGroup, RevealItem, Reveal } from "@/features/motion/Reveal";
import { SectionHead } from "./SectionHead";
import { ScrollFill } from "@/features/motion/ScrollFill";
import { FlagIN, FlagUS } from "./Flags";
import { StepArt } from "@/features/illustrations/StepArt";

// Pikaicons free pack (pikaicons.com), fetched with `npx pikaicons show`: upload-up, pencil-edit-swoosh, shield-check, download-down
const icon = (d: string, size = 22): ReactNode => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);
// more Pikaicons (free pack) for the overnight timeline: moon, sun, envelope-default, pencil-edit, check-tick-circle,
// send-plane-horizontal. No sunrise/sunset in the free pack, so the morning ends use the sun in a warm tint.
const P = {
  upload: "M3 15a5 5 0 0 0 5 5h8a5 5 0 0 0 5-5M9 6.812a15 15 0 0 1 2.556-2.655A.7.7 0 0 1 12 4m3 2.812a15 15 0 0 0-2.556-2.655A.7.7 0 0 0 12 4m0 0v11",
  download: "M3 15a5 5 0 0 0 5 5h8a5 5 0 0 0 5-5M9 12.188a15 15 0 0 0 2.556 2.655A.7.7 0 0 0 12 15m3-2.812a15 15 0 0 1-2.556 2.655A.7.7 0 0 1 12 15m0 0V4",
  shield: "m9.133 12.02 2.007 2.004a13.06 13.06 0 0 1 3.993-4.29m-4.25-7.366L5.497 4.314a3 3 0 0 0-1.98 2.706l-.127 3.309a11 11 0 0 0 5.543 9.978l1.521.867a3 3 0 0 0 2.915.032l1.489-.806a11 11 0 0 0 5.728-10.516l-.227-2.95a3 3 0 0 0-1.972-2.592l-5.465-1.974a3 3 0 0 0-2.038 0Z",
  moon: "M21 11.966A6.5 6.5 0 1 1 12.035 3H12a9 9 0 1 0 9 9z",
  sun: "M12 23v-1m-7.778-2.222.707-.707M1 12h1m2.222-7.778.707.707M12 2V1m7.071 3.929.707-.707M22 12h1m-3.929 7.071.707.707M18 12a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z",
  inbox: "m21.803 7.762-5.508 3.505c-1.557.99-2.335 1.486-3.171 1.678a5 5 0 0 1-2.248 0c-.836-.192-1.614-.688-3.171-1.678L2.197 7.762m19.606 0C22 8.722 22 10.006 22 12c0 2.8 0 4.2-.545 5.27a5 5 0 0 1-2.185 2.185C18.2 20 16.8 20 14 20h-4c-2.8 0-4.2 0-5.27-.545a5 5 0 0 1-2.185-2.185C2 16.2 2 14.8 2 12c0-1.994 0-3.278.197-4.238m19.606 0a4 4 0 0 0-.348-1.032 5 5 0 0 0-2.185-2.185C18.2 4 16.8 4 14 4h-4c-2.8 0-4.2 0-5.27.545A5 5 0 0 0 2.545 6.73a4 4 0 0 0-.348 1.032",
  edit: "M3.066 18.315c.01-.377.014-.565.06-.742q.06-.237.19-.445c.096-.155.228-.288.494-.555l13.053-13.11a1.57 1.57 0 0 1 1.964-.212 6.3 6.3 0 0 1 1.932 1.965c.404.65.273 1.473-.258 2.006L7.528 20.252c-.275.277-.413.415-.574.514a1.6 1.6 0 0 1-.46.19c-.183.045-.378.044-.767.044L3 20.995z",
  check: "m8.5 12.513 2.341 2.338A15 15 0 0 1 15.4 9.915l.101-.069M21.15 12a9.15 9.15 0 1 1-18.3 0 9.15 9.15 0 0 1 18.3 0Z",
  send: "M4.934 12 3.09 5.732c-.481-1.635 1.05-3.147 2.665-2.628a54 54 0 0 1 12.64 5.963C19.525 9.793 21 10.442 21 12s-1.474 2.207-2.605 2.933a54 54 0 0 1-12.64 5.963c-1.614.519-3.146-.993-2.665-2.628zm0 0h4.9",
} as const;

const steps = [
  { n: "01", t: "Upload the shoot", d: "Drag RAW or JPEG brackets into the portal, or paste a Dropbox or Drive link.", who: "You · 2 minutes" },
  { n: "02", t: "Tell us once", d: "Tell us how you like your photos once. It becomes a style guide every editor on your account follows.", who: "You · once" },
  { n: "03", t: "Edit, then check", d: "One editor works your set start to finish. A team lead checks every image before delivery.", who: "TechX · overnight" },
  { n: "04", t: "Download and revise", d: "Ready by morning. Ask for changes on any image, free.", who: "You · 10–16 h later" },
];


/** Four steps, then the overnight timeline (Overnight): one night, two clocks. */
export function HowItWorks() {
  return (
    <section id="process" className="wrap pt-28 md:pt-40">
      <SectionHead label="How it works" lead="Upload tonight." rest="Listing-ready by morning. You only do step one." />
      <StepCards />

      <Overnight />
    </section>
  );
}

/* Overnight (owner, 2026-10-31): the whole night as one flow, on two clocks. New York on top (night to sunrise), India
   underneath (night to working day), one axis from 7 PM to 8 AM New York time. City names sit in their own column so
   the lanes and their end dots never collide. Seven moments: the upload, the hand-off to India, editing, check 1 by
   your editor, check 2 by your QC, the hand-back and the download; dashed lines between the lanes show the shoot
   crossing over. A scrubber with both clocks sweeps the night while the card is in view; the shoot rides it (raw,
   editing, checked) and each moment lights as it passes. Phones get the moments as a list under the lanes.
   Times match the "Our process" illustration. IST = ET + 9:30 (EDT). Rest frame: the morning, everything done. */
const SPAN = 13 * 60; // minutes from 7:00 PM to 8:00 AM ET
const moments = [
  { at: 2, lane: "ny", label: "You upload", time: "7:02 PM", icon: P.upload },
  { at: 2, lane: "in", label: "In our inbox", time: "4:32 AM IST", icon: P.inbox },
  { at: 280, lane: "in", label: "Editing starts", time: "9:10 AM IST", icon: P.edit },
  { at: 530, lane: "in", label: "Check 1 · your editor", time: "1:20 PM IST", icon: P.check },
  { at: 642, lane: "in", label: "Check 2 · your QC", time: "3:12 PM IST", icon: P.shield },
  { at: 776, lane: "in", label: "Sent to you", time: "5:28 PM IST", icon: P.send },
  { at: 778, lane: "ny", label: "You download", time: "7:58 AM", icon: P.download },
] as const;
const pos = (at: number) => 5 + (at / SPAN) * 90; // % along the lane, inset so end dots sit inside the rounded ends (wider inset since the flags narrowed the lanes on phones)
const clock = (m: number) => {
  const h = Math.floor(m / 60) % 24, mm = Math.floor(m % 60);
  return `${h % 12 || 12}:${String(mm).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
};

export function Overnight() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const reduce = useReducedMotion();
  const play = inView && !reduce;
  const p = useMotionValue(1);
  const [m, setM] = useState(SPAN); // minutes since 7 PM ET, in 10-minute steps
  useMotionValueEvent(p, "change", (v) => setM(Math.round((v * SPAN) / 10) * 10));
  useEffect(() => {
    if (!play) { p.set(1); return; }
    const c = animate(p, [0, 1], { duration: 10, ease: "linear", repeat: Infinity, repeatDelay: 2.4 });
    return () => c.stop();
  }, [play, p]);
  // the scrubber has no width of its own (so it never widens the page) and moves in container units across the inset
  // lane; its pill slides from left-anchored to right-anchored so the clocks stay inside the card at both ends
  const x = useTransform(p, (v) => `translateX(${(5 + v * 90)}cqw)`);
  const pill = useTransform(p, (v) => `translate(${-v * 100}%, -50%)`);
  const et = 19 * 60 + m, ist = et + 9 * 60 + 30;
  const state = m < moments[2].at ? "raw" : m < moments[4].at ? "editing" : "checked";
  return (
    <Reveal className="mt-4 rounded-card bg-surface px-5 pb-7 pt-7 shadow-hair md:px-10">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="text-h4">We edit while you sleep. <ScrollFill text="Our studio in India works through your night." /></h3>
        <span className="font-mono text-label uppercase text-ink-2">7 PM to 8 AM, New York</span>
      </div>
      <div ref={ref} className="mx-auto mt-10 grid max-w-[1040px] grid-cols-[84px_1fr] gap-x-3 md:mt-16 md:grid-cols-[128px_1fr] md:gap-x-5">
        {/* city column */}
        <div className="grid grid-rows-[36px_44px_36px] items-center md:pt-0">
          <City name="New York" zone="ET" flag={<FlagUS />} />
          <span />
          <City name="India" zone="IST" flag={<FlagIN />} />
        </div>
        {/* lanes, hand-offs, moments, scrubber */}
        <div className="@container relative">
          <div className="grid grid-rows-[36px_44px_36px]">
            <div className="relative overflow-hidden rounded-full bg-[linear-gradient(90deg,#1B2356_0%,#2C2F66_55%,#5A4A86_78%,#F0A070_95%,#FFD9A8)]">
              <span className="absolute inset-0 flex items-center justify-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.06em] text-white/70 md:text-[11px]"><span className="text-[#C9D4FF]">{icon(P.moon, 14)}</span>You sleep</span>
              <span className="absolute left-[88%] top-1/2 hidden -translate-y-1/2 text-[#FFE2B8] md:block">{icon(P.sun, 16)}</span>
            </div>
            <div className="relative">
              {[moments[0], moments[6]].map((mo) => (
                <span key={mo.label} className={`absolute inset-y-0 border-l border-dashed transition-colors duration-300 ${m >= mo.at ? "border-blue" : "border-line-2"}`} style={{ left: `${pos(mo.at)}%` }} />
              ))}
            </div>
            <div className="relative overflow-hidden rounded-full bg-[linear-gradient(90deg,#1B2356_0%,#3E4A86_9%,#BFD8F5_20%,#EAF5FF_38%,#F3F9FF_85%,#FFE9CC)]">
              <span className="absolute left-[11%] top-1/2 hidden -translate-y-1/2 text-[#C9D4FF] md:block">{icon(P.moon, 14)}</span>
              <span className="absolute inset-0 hidden items-center justify-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.06em] text-ink-2 md:flex"><span className="text-[#F5B83D]">{icon(P.sun, 15)}</span>Studio at work</span>
            </div>
          </div>
          {moments.map((mo, i) => {
            const on = m >= mo.at;
            const left = pos(mo.at);
            const anchor = left < 10 ? "left-[-8px]" : left > 90 ? "right-[-8px]" : "left-1/2 -translate-x-1/2";
            return (
              <div key={mo.label} className="absolute" style={{ left: `${left}%`, top: mo.lane === "ny" ? 18 : 98 }}>
                <span className={`absolute left-0 top-0 grid size-5 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full shadow-hair ring-2 ring-white max-md:[&_svg]:size-2.5 md:size-7 transition-[background-color,color,scale] duration-300 ${on ? (mo.lane === "in" ? "scale-105 bg-maroon text-white" : "scale-105 bg-blue text-white") : "bg-surface text-ink-3"}`}>{icon(mo.icon, 14)}</span>
                {/* labels on md+: New York above its lane, India below, the close pair staggered */}
                <span className={`absolute hidden whitespace-nowrap md:block ${mo.lane === "ny" ? "-top-[62px]" : i % 2 ? "top-7" : "top-[64px]"} ${anchor} transition-opacity duration-300 ${on ? "opacity-100" : "opacity-40"}`}>
                  <span className="block font-mono text-[10.5px] uppercase tracking-[0.04em] text-ink-2">{mo.label}</span>
                  <span className="block text-[14px] font-medium text-ink">{mo.time}</span>
                </span>
              </div>
            );
          })}
          <motion.div aria-hidden="true" className="pointer-events-none absolute left-0 top-0 h-[116px] w-0" style={{ transform: x }}>
            <span className="absolute left-0 top-0 h-full w-px bg-ink/60" />
            <motion.span className="absolute left-0 top-[58px] flex items-center gap-1.5 rounded-full bg-surface py-0.5 pl-0.5 pr-2 shadow-raised" style={{ transform: pill }}>
              <span className="relative size-6 overflow-hidden rounded-full">
                <Image src="/photos/tx-ext.jpg" alt="" fill sizes="24px" className="object-cover transition-[filter] duration-500" style={state === "raw" ? { filter: "brightness(.62) contrast(.78) saturate(.5) sepia(.1)" } : undefined} />
              </span>
              <span className="whitespace-nowrap font-mono text-[10px] text-ink">{clock(et)} ET <span className="text-ink-3">·</span> <span className="text-ink-2">{clock(ist)} IST</span></span>
              <span className={`grid size-[18px] place-items-center rounded-full transition-colors duration-300 ${state === "checked" ? "bg-[#E7F6EE] text-green" : state === "editing" ? "bg-blue-tint text-blue-2" : "bg-sunk text-ink-3"}`}>{state === "checked" ? icon(P.check, 11) : state === "editing" ? icon(P.edit, 10) : null}</span>
            </motion.span>
          </motion.div>
          <div className="hidden h-[100px] md:block" />
        </div>
      </div>
      {/* phones: the whole flow as a list, lighting as the night passes */}
      <ol className="mt-6 grid gap-2 md:hidden">
        {moments.map((mo) => {
          const on = m >= mo.at;
          return (
            <li key={mo.label} className={`flex items-center gap-2.5 text-[13px] transition-opacity duration-300 ${on ? "opacity-100" : "opacity-45"}`}>
              <span className={`grid size-6 shrink-0 place-items-center rounded-full ${on ? (mo.lane === "in" ? "bg-maroon text-white" : "bg-blue text-white") : "bg-sunk text-ink-3"}`}>{icon(mo.icon, 12)}</span>
              <span className="font-medium text-ink">{mo.label}</span>
              <span className="ml-auto font-mono text-[11px] text-ink-2">{mo.time}</span>
            </li>
          );
        })}
      </ol>
    </Reveal>
  );
}

/* Each city carries its country's flag (owner, 2026-11-02), so the two places read at a glance. */
function City({ name, zone, flag }: { name: string; zone: string; flag: ReactNode }) {
  return (
    <span className="flex items-center gap-2 leading-tight">
      <span className="shrink-0 max-md:[&_svg]:size-4">{flag}</span>
      <span>
        <span className="block text-[12px] font-semibold text-ink md:text-[13px]">{name}</span>
        <span className="block font-mono text-[10px] text-ink-2">{zone}</span>
      </span>
    </span>
  );
}

/* Step cards (owner, 2026-10-31; illustrations 2026-11-02). Purpose: explanation, seen once per visit, so it plays once
   instead of looping. When the row comes into view the steps play left to right, one every STEP_MS: each card's
   illustration (features/illustrations/StepArt.tsx) acts out its step, then rests on its finished frame; nothing keeps
   moving while people read. Hovering a card with a mouse replays its illustration. No connector line between the cards
   (owner). Reduced motion: no sequence, finished frames only. */
const STEP_MS = 1400;

function StepCards() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const [runs, setRuns] = useState<number[]>(() => steps.map(() => 0)); // plays per card; 0 = finished frame
  const replay = (i: number) => setRuns((r) => r.map((v, j) => (j === i ? v + 1 : v)));
  useEffect(() => {
    if (!inView || reduce) return;
    // card i plays at 150ms + i × STEP_MS (timers, not a synchronous setState in the effect)
    const timers = steps.map((_, i) => setTimeout(() => replay(i), 150 + i * STEP_MS));
    return () => timers.forEach(clearTimeout);
  }, [inView, reduce]);
  return (
    <div ref={ref}>
      <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <RevealItem key={s.n} className="group relative flex flex-col rounded-card bg-surface p-2 shadow-hair transition-[box-shadow,translate] duration-[320ms] ease-[var(--ease-brand)] hover:-translate-y-1 hover:shadow-raised">
            <div className="flex flex-1 flex-col" onPointerEnter={(e) => { if (e.pointerType === "mouse" && !reduce) replay(i); }}>
              <span className="px-4 pb-3 pt-3 font-mono text-label text-ink-2 transition-colors duration-200 group-hover:text-maroon">{s.n}</span>
              <StepArt n={i} run={runs[i]} />
              <div className="flex flex-1 flex-col px-4 pb-4">
                <h3 className="mt-5 text-h4">{s.t}</h3>
                <p className="mt-2 text-small text-ink-2">{s.d}</p>
                {/* pinned to the card foot so every tag sits on one line across the row */}
                <p className="mt-auto pt-5 font-mono text-[11px] uppercase tracking-[0.04em] text-blue-2">{s.who}</p>
              </div>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}
