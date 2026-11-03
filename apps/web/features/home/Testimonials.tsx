"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { Reveal } from "@/features/motion/Reveal";
import { SectionHead } from "./SectionHead";
import type { Quote } from "@/lib/content/types";

/* Real client quotes from TechX's current site, techxsystems.com (owner approved, 2026-11-02; docs/old-site-content.md).
   Lightly trimmed and spelling fixed, never reworded. Names and countries as the old site gives them.
   Confirm the clients are still happy to be quoted before launch. The quotes are admin-managed (lib/content, key
   "testimonials"); pages pass them in.

   One big quote (owner approved, 2026-11-03, after the impeccable critique: the page's end should peak on a person's
   words, not a strip of small cards). The five clients sit underneath as tabs; the quote advances every 7s while on
   screen and holds while hovered or focused, and switches with a short blur crossfade. Reduced motion: no
   auto-advance, instant swap. Replaces the moving review strip. */
const initials = (n: string) => n.split(" ").map((w) => w[0]).join("").slice(0, 2);
// each client keeps one colour (stageshow: named people get their own colour; grey discs are for placeholders)
const TINTS = ["bg-blue-tint text-blue-2", "bg-maroon-tint text-maroon", "bg-[#E7F6EE] text-[#1E7A45]", "bg-[#FFF1DC] text-[#8A5300]"];
const tint = (n: string) => TINTS[[...n].reduce((h, c) => h + c.charCodeAt(0), 0) % TINTS.length];
const EVERY = 7000;

export function Testimonials({ quotes }: { quotes: Quote[] }) {
  const reduce = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const inView = useInView(box, { amount: 0.4 });
  const [i, setI] = useState(0);
  const [held, setHeld] = useState(false);
  const t = quotes[Math.min(i, quotes.length - 1)];

  useEffect(() => {
    if (reduce || held || !inView || quotes.length < 2) return;
    const id = setTimeout(() => setI((n) => (n + 1) % quotes.length), EVERY);
    return () => clearTimeout(id);
  }, [i, reduce, held, inView, quotes.length]);

  if (!t) return null; // no quotes saved: the section stays out
  return (
    <section id="reviews" className="scroll-mt-20 pt-28 md:pt-40">
      <div className="wrap">
        <SectionHead label="Clients" lead="Photographers stay for years." rest="Here's why, in their words." />
        <Reveal>
          <div ref={box} onPointerEnter={() => setHeld(true)} onPointerLeave={() => setHeld(false)} onFocus={() => setHeld(true)} onBlur={() => setHeld(false)}
            className="relative overflow-hidden rounded-panel bg-surface px-6 py-12 shadow-hair md:px-16 md:py-16">
            <svg aria-hidden="true" width="44" height="34" viewBox="0 0 44 34" className="text-maroon/80">
              <path fill="currentColor" d="M0 34V20.4C0 8.9 6 2.2 17.9 0l1.9 4.4C13.5 6.3 10.4 10 10 15.6h8.5V34H0Zm24.3 0V20.4C24.3 8.9 30.3 2.2 42.1 0L44 4.4c-6.3 1.9-9.4 5.6-9.8 11.2h8.5V34H24.3Z" />
            </svg>
            <div className="relative mt-7 min-h-[11.5rem] sm:min-h-[9rem] md:min-h-[8.5rem]" aria-live={held ? "polite" : "off"}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.figure key={t.name}
                  initial={reduce ? false : { opacity: 0, y: 8, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -6, filter: "blur(6px)" }}
                  transition={{ type: "spring", bounce: 0, duration: 0.45 }}>
                  <blockquote className="max-w-[900px] text-[22px] font-medium leading-[1.4] tracking-[-0.015em] text-ink md:text-[30px]">&ldquo;{t.q}&rdquo;</blockquote>
                  <figcaption className="mt-7 flex items-center gap-3">
                    <span aria-hidden="true" className={`grid size-10 place-items-center rounded-full text-[12px] font-semibold ${tint(t.name)}`}>{initials(t.name)}</span>
                    <span className="text-[15px] leading-tight"><span className="block font-medium">{t.name}</span><span className="text-ink-2">Client · {t.from}</span></span>
                  </figcaption>
                </motion.figure>
              </AnimatePresence>
            </div>
            <div role="group" aria-label="Choose a client" className="mt-10 flex flex-wrap gap-1.5 border-t border-line pt-5">
              {quotes.map((c, k) => (
                <button key={c.name} type="button" aria-pressed={k === i} onClick={() => setI(k)}
                  className={`relative h-11 overflow-hidden rounded-[10px] px-3.5 text-[14px] transition-[background-color,color,scale] duration-200 active:scale-[0.96] ${k === i ? "bg-sunk text-ink" : "text-ink-2 hover:text-ink"}`}>
                  {c.name}
                  {/* time left on the current quote, so the change never comes as a surprise */}
                  {k === i && !reduce && !held && inView && (
                    <motion.span key={`bar-${i}`} aria-hidden="true" className="absolute inset-x-3 bottom-1.5 h-0.5 origin-left rounded-full bg-maroon/50"
                      initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: EVERY / 1000, ease: "linear" }} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
