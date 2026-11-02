"use client";

import { useState } from "react";
import { useReducedMotion } from "motion/react";
import { Reveal } from "@/features/motion/Reveal";
import { SectionHead } from "./SectionHead";

/* Real client quotes from TechX's current site, techxsystems.com (owner approved, 2026-11-02; docs/old-site-content.md).
   Lightly trimmed and spelling fixed, never reworded. Names and countries as the old site gives them.
   Confirm the clients are still happy to be quoted before launch.

   Moving review strip (owner, 2026-11-02): small cards drifting left in one continuous, smooth loop (the logo-strip
   `marquee`: CSS transform only, linear, two identical halves so translateX(-50%) wraps without a seam). Edges fade
   (`marquee-mask`). Pauses on hover (globals.css) and with the pause button (moving content needs a control).
   Reduced motion: no movement; the row scrolls sideways instead. Replaces the one-at-a-time slider and its dots. */
const quotes = [
  { q: "I began using TechX over a year ago to assist me with my workflow. Since then I've been able to shoot more, and stress less knowing they will handle the processing.", name: "Fayth Rebiero", from: "USA" },
  { q: "They are photography editing and post-production experts that have a great eye for post-production. They have also taken a large load off of our workflow. Highly recommended.", name: "Jerry Suhrstedt", from: "USA" },
  { q: "A professional and competent agency that provides a personalised service, and the quality of their images edited is excellent. I highly recommend TechX Systems.", name: "Stan", from: "Australia" },
  { q: "Their samples were good before I joined them, and my redone images and videos were even better. Reasonably priced, although their quality is high class.", name: "Patrick Maven", from: "USA" },
  { q: "Very happy and pleased with the work. I have given them a few references to service.", name: "Shane Bailey", from: "Australia" },
];
const initials = (n: string) => n.split(" ").map((w) => w[0]).join("").slice(0, 2);

export function Testimonials() {
  const reduce = useReducedMotion();
  const [paused, setPaused] = useState(false);
  return (
    <section id="reviews" className="scroll-mt-20 pt-28 md:pt-40">
      <div className="wrap">
        <SectionHead label="Clients" lead="Photographers stay for years." rest="Here's why, in their words." />
      </div>
      <Reveal>
        <div role="region" aria-label="Client quotes" className={`marquee-mask mx-auto max-w-[1440px] ${reduce ? "overflow-x-auto" : "overflow-hidden"}`}>
          <div className={`flex w-max py-2 ${reduce ? "" : "marquee"}`} style={reduce ? undefined : { animationDuration: "55s", ...(paused ? { animationPlayState: "paused" } : {}) }}>
            {[0, 1].map((half) => (
              // two identical halves, each ending in the same gap, so -50% lands exactly on the start of the second
              <ul key={half} aria-hidden={half === 1 ? true : undefined} className="flex gap-3 pr-3">
                {quotes.map((t) => (
                  <li key={t.name} className="flex w-[300px] shrink-0 flex-col rounded-[14px] bg-surface p-5 shadow-hair md:w-[330px]">
                    <p className="text-[15px] leading-relaxed text-ink">&ldquo;{t.q}&rdquo;</p>
                    <p className="mt-auto flex items-center gap-2.5 pt-4">
                      <span aria-hidden="true" className="grid size-8 place-items-center rounded-full bg-sunk font-mono text-[10px] font-medium text-ink-2">{initials(t.name)}</span>
                      <span className="text-[13px] leading-tight"><span className="block font-medium">{t.name}</span><span className="text-ink-2">Client · {t.from}</span></span>
                    </p>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
        {!reduce && (
          <div className="mt-2 flex justify-center">
            <button type="button" onClick={() => setPaused((p) => !p)} aria-label={paused ? "Play quotes" : "Pause quotes"}
              className="grid size-11 place-items-center rounded-full text-ink-2 transition-colors duration-150 hover:text-ink active:scale-95">
              <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" fill="currentColor">
                {paused ? <path d="M4.5 2.8v10.4a.6.6 0 0 0 .9.5l8.3-5.2a.6.6 0 0 0 0-1L5.4 2.3a.6.6 0 0 0-.9.5Z" /> : <path d="M4 2.5h2.5v11H4zM9.5 2.5H12v11H9.5z" />}
              </svg>
            </button>
          </div>
        )}
      </Reveal>
    </section>
  );
}
