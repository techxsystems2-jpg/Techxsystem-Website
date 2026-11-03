"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { StepScene } from "./StepScenes";
import { Reveal } from "@/features/motion/Reveal";

/* How it works · the four steps as full-width rows (Figma 30:155): big number (grey, maroon on hover), title, text and the
   who/when tag on the left; on the right the step's scene (StepScenes.tsx: real photos, new for this page on 2026-11-03; Home keeps StepArt). Each row's
   art plays once when the row comes into view and replays when a mouse enters anywhere on the row; reduced motion shows finished frames. */
const steps = [
  { t: "Upload the shoot", d: "Upload RAW or JPEG brackets on our site, or paste a Dropbox or Google Drive link. No plugins, no desktop app.", who: "You · 2 minutes" },
  { t: "Tell us once", d: "Leave notes by email or WhatsApp the first time. We turn them into your style guide, and every editor follows it on every job after.", who: "You · once" },
  { t: "Edit, then check", d: "One editor works on your set. A team lead checks every image against your style guide before anything leaves the studio.", who: "TechX · overnight" },
  { t: "Download and revise", d: "Your photos are ready by morning. Download the set, or ask for a change on any image. Revisions are free and usually back the same day.", who: "You · 10–16 h after upload" },
];

export function StepRows() {
  return (
    <ol className="space-y-3">
      {steps.map((s, i) => <Row key={s.t} i={i} {...s} />)}
    </ol>
  );
}

function Row({ i, t, d, who }: { i: number; t: string; d: string; who: string }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [run, setRun] = useState(0);
  useEffect(() => {
    if (!inView || reduce) return;
    const t = setTimeout(() => setRun((r) => r + 1), 200);
    return () => clearTimeout(t);
  }, [inView, reduce]);
  return (
    <li ref={ref} onPointerEnter={(e) => { if (e.pointerType === "mouse" && !reduce) setRun((r) => r + 1); }}>
      <Reveal className="group grid items-center gap-2 rounded-card bg-surface p-2 shadow-hair md:grid-cols-[1fr_1.15fr]">
        <div className="px-5 py-6 md:px-8 md:py-8">
          <span className="block text-[56px] font-light leading-none tracking-[-0.04em] text-[#8B8B93] transition-colors duration-300 group-hover:text-maroon md:text-[64px]">{String(i + 1).padStart(2, "0")}</span>
          <h2 className="mt-6 text-h3">{t}</h2>
          <p className="mt-3 max-w-[440px] text-ink-2">{d}</p>
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.04em] text-blue-2">{who}</p>
        </div>
        <StepScene n={i} run={run} />
      </Reveal>
    </li>
  );
}
