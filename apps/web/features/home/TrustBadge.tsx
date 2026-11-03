"use client";

import { motion, useReducedMotion } from "motion/react";
import { useSite } from "@/features/content/ContentProvider";
import { FlagAU, FlagUK, FlagUS } from "./Flags";

/** Hero trust badge: flags, client count and rating, with a light that sweeps the pill now and then.
    stageshow review (2026-11-03): proof shows its real values from the first frame. It used to count up from zero and
    pop the flags and stars in, so a screenshot, a slow load or the server render read "0+ clients · 0.0". */
export function TrustBadge() {
  const site = useSite();
  const reduce = useReducedMotion();
  const { clients, rating } = site.trust;

  return (
    <p className="relative inline-flex max-w-full items-center gap-2.5 overflow-hidden rounded-full bg-white py-1 pl-1 pr-3.5 text-[13px] sm:gap-3 sm:pr-4 sm:text-[14px] font-medium text-ink shadow-[0_0_0_1px_rgb(10_10_11/0.12),0_6px_18px_-8px_rgb(10_10_11/0.25)]">
      {!reduce && (
        <motion.span aria-hidden="true" className="pointer-events-none absolute inset-y-0 w-16 -skew-x-12 bg-[linear-gradient(90deg,transparent,rgb(48_116_254/0.12),transparent)]"
          initial={{ left: "-20%" }} animate={{ left: "120%" }} transition={{ duration: 1.6, delay: 1.6, repeat: Infinity, repeatDelay: 4.5, ease: "easeInOut" }} />
      )}
      <span className="flex -space-x-1.5">
        {[FlagUS, FlagAU, FlagUK].map((F, i) => <span key={i} className="block"><F /></span>)}
      </span>
      <span>
        <span className="max-[400px]:hidden">Serving </span><span className="tabular-nums">{clients.toLocaleString("en-US")}+</span> clients
      </span>
      <span aria-hidden="true" className="h-4 w-px bg-line-2" />
      <span className="flex items-center gap-1.5">
        <span className="flex" aria-hidden="true">
          {Array.from({ length: 5 }, (_, i) => {
            const fill = Math.max(0, Math.min(1, rating - i)); // 4.9 → the last star 90% filled
            return (
              <svg key={i} width="14" height="14" viewBox="0 0 20 20" className="text-line-2">
                <defs><clipPath id={`star-${i}`}><rect x="0" y="0" width={20 * fill} height="20" /></clipPath></defs>
                <path d="M10 1.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.6 7.7l5.8-.8z" fill="currentColor" />
                <path d="M10 1.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.6 7.7l5.8-.8z" fill="#F59E0B" clipPath={`url(#star-${i})`} />
              </svg>
            );
          })}
        </span>
        <span className="font-semibold tabular-nums">{rating.toFixed(1)}</span>
        <span className="font-normal text-ink-2 max-sm:hidden">rating</span>
      </span>
    </p>
  );
}
