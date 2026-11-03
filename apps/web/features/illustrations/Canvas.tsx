"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";

/** The dotted canvas every illustration sits on (Aceternity approach): dots fade out towards the edges. One ground for
    every scene on the site (stageshow review, 2026-11-03: one figure language). With `story`, a narrated caption sits
    at the foot over the art. */
export function Canvas({ children, className = "h-[340px]", story }: { children: ReactNode; className?: string; story?: ReactNode }) {
  return (
    <div className={`dots relative flex flex-col overflow-hidden rounded-inner ${className}`}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_45%,transparent,var(--color-sunk))]" />
      <div className="relative z-[1] grid w-full min-h-0 flex-1 place-items-center">{children}</div>
      {story && <div className="relative z-[2] flex justify-center px-4 pb-4">{story}</div>}
    </div>
  );
}

/** The one shadow every hero window and device on the site uses (stageshow --ss-shadow-hero), and the tighter one for a
    card sitting on it. */
export const SHADOW_HERO = "shadow-[0_0_0_1px_rgb(10_10_11/0.07),0_30px_60px_-12px_rgb(50_50_93/0.22),0_18px_36px_-18px_rgb(0_0_0/0.28)]";
export const SHADOW_SATELLITE = "shadow-[0_0_0_1px_rgb(10_10_11/0.05),0_14px_32px_-8px_rgb(50_50_93/0.24),0_4px_10px_-4px_rgb(0_0_0/0.1)]";

/** A product shot, framed the stageshow way (2026-11-03): the design is drawn at a readable size and cropped by the
    panel, not shrunk to fit it. Inset by `gutter` at the top and left, it runs off the right and bottom (corner bleed).
    `fill` is how much of the design's width and height should show on a wide panel; the scale is then held between
    `min` and `max`, so on a phone the type stays readable and the panel crops harder, keeping `focus` (a point in
    design pixels) in view. `mode="fit"` instead shows the whole design, centered, never above 1 (for compositions
    that are whole by nature; `max` lets a wide card show it a little larger). */
export function Shot({ w, h, children, focus = [w / 2, h / 2], fill = [0.88, 0.92], min = 0.92, max, gutter = 24, mode = "bleed", className = "" }: {
  w: number; h: number; children: ReactNode; focus?: [number, number]; fill?: [number, number]; min?: number; max?: number; gutter?: number; mode?: "bleed" | "fit"; className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<[number, number] | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setBox([e.contentRect.width, e.contentRect.height]));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  // before it's measured (server render, no JS) the shot shows at 1:1 from the gutter: a real crop, never blank
  let style: React.CSSProperties = { width: w, height: h, transform: `translate(${gutter}px, ${gutter}px)` };
  if (box) {
    const [cw, ch] = box;
    if (mode === "fit") {
      const s = Math.min(max ?? 1, cw / w, ch / h);
      style = { width: w, height: h, transform: `translate(${(cw - w * s) / 2}px, ${(ch - h * s) / 2}px) scale(${s})` };
    } else {
      const s = Math.max(min, Math.min(max ?? 1.35, (cw - gutter) / (w * fill[0]), (ch - gutter) / (h * fill[1])));
      // the top stays a gutter down (the menu bar is what makes it a Mac); across, keep the gutter on the left when the
      // design is wide enough, and on a narrow panel slide it so `focus` is in view
      const x = Math.min(gutter, Math.max(cw * 0.75 - focus[0] * s, cw - w * s)); // focus kept in the left three quarters
      const y = gutter;
      style = { width: w, height: h, transform: `translate(${x}px, ${y}px) scale(${s})` };
    }
  }
  return (
    <div ref={ref} aria-hidden="true" className={`relative size-full overflow-hidden ${className}`}>
      <div className="absolute left-0 top-0 origin-top-left" style={style}>{children}</div>
    </div>
  );
}

/** The story under an illustration: one caption per beat, step dots showing where the flow is.
    The caption changes with the animation, so watching the card tells the whole process. Captions cross-fade in one
    grid cell, so the pill is never empty between beats (stageshow review: no blank frames). */
export function Story({ steps, at }: { steps: string[]; at: number }) {
  return (
    <div className="flex max-w-full items-center gap-2.5 rounded-full bg-surface/90 py-1.5 pl-2.5 pr-3.5 shadow-hair backdrop-blur">
      <span className="flex shrink-0 gap-1" aria-hidden="true">
        {steps.map((_, i) => (
          <span key={i} className={`h-1.5 rounded-full transition-[width,background-color] duration-300 ${i === at ? "w-4 bg-blue" : i < at ? "w-1.5 bg-blue/40" : "w-1.5 bg-line-2"}`} />
        ))}
      </span>
      <span className="grid min-w-0 overflow-hidden text-[12.5px] font-medium text-ink" aria-live="polite">
        <AnimatePresence initial={false}>
          <motion.span key={at} className="col-start-1 row-start-1 block truncate" initial={{ opacity: 0, y: 6, filter: "blur(3px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -6, filter: "blur(3px)" }} transition={{ type: "spring", bounce: 0, duration: 0.35 }}>
            {steps[at]}
          </motion.span>
        </AnimatePresence>
      </span>
    </div>
  );
}
