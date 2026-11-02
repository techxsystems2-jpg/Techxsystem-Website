"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";

/** The dotted canvas every answer illustration sits on (Aceternity approach): dots fade out towards the edges.
    With `story`, a narrated caption sits at the foot and the art centres in the space above it. */
export function Canvas({ children, className = "h-[340px]", story }: { children: ReactNode; className?: string; story?: ReactNode }) {
  return (
    <div className={`dots relative flex flex-col overflow-hidden rounded-inner ${className}`}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_45%,transparent,var(--color-sunk))]" />
      <div className="relative z-[1] grid w-full flex-1 place-items-center">{children}</div>
      {story && <div className="relative z-[1] flex justify-center px-4 pb-4">{story}</div>}
    </div>
  );
}

/** The story under an illustration: one caption per beat, step dots showing where the flow is.
    The caption changes with the animation, so watching the card tells the whole process. */
export function Story({ steps, at }: { steps: string[]; at: number }) {
  return (
    <div className="flex max-w-full items-center gap-2.5 rounded-full bg-surface/90 py-1.5 pl-2.5 pr-3.5 shadow-hair backdrop-blur">
      <span className="flex shrink-0 gap-1" aria-hidden="true">
        {steps.map((_, i) => (
          <span key={i} className={`h-1.5 rounded-full transition-[width,background-color] duration-300 ${i === at ? "w-4 bg-blue" : i < at ? "w-1.5 bg-blue/40" : "w-1.5 bg-line-2"}`} />
        ))}
      </span>
      <span className="relative min-w-0 overflow-hidden text-[12.5px] font-medium text-ink" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={at} className="block truncate" initial={{ opacity: 0, y: 6, filter: "blur(3px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -6, filter: "blur(3px)" }} transition={{ type: "spring", bounce: 0, duration: 0.35 }}>
            {steps[at]}
          </motion.span>
        </AnimatePresence>
      </span>
    </div>
  );
}
