"use client";

import { AnimatePresence, motion } from "motion/react";
import { useStudioClock } from "./useStudioClock";

/** Where Home has the trust badge: the studio's live status and India time, in the same white pill. Before the
    clock is known (server, hydration) it shows the plain "Contact" label so nothing jumps. */
export function StudioBadge() {
  const clock = useStudioClock();
  return (
    <p className="relative inline-flex max-w-full items-center gap-2.5 rounded-full bg-white py-1.5 pl-3 pr-4 text-[13px] font-medium text-ink shadow-[0_0_0_1px_rgb(10_10_11/0.12),0_6px_18px_-8px_rgb(10_10_11/0.25)] sm:text-[14px]">
      <span className="relative size-2 shrink-0 rounded-full bg-current" style={{ color: clock?.open ? "var(--color-green)" : clock ? "var(--color-ink-3)" : "var(--color-blue)" }}>
        {clock?.open && <span className="absolute inset-0 animate-ping rounded-full bg-current opacity-60 motion-reduce:hidden" />}
      </span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={clock ? (clock.open ? "open" : "closed") : "label"} initial={{ opacity: 0, filter: "blur(3px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
          {!clock ? "Contact the studio" : (
            <>
              {clock.open ? "Studio open now" : "Studio closed · support still 24/7"}
              <span className="font-normal text-ink-2 max-sm:hidden"> · <span className="tabular-nums">{clock.indiaTime}</span> in India</span>
            </>
          )}
        </motion.span>
      </AnimatePresence>
    </p>
  );
}
