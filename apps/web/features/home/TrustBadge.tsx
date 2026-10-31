"use client";

import { motion, useReducedMotion } from "motion/react";
import NumberFlow from "@number-flow/react";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { FlagAU, FlagUK, FlagUS } from "./Flags";

const spring = { type: "spring", bounce: 0.35, duration: 0.55 } as const;

/** Hero trust badge: flags pop in, client count and rating count up, stars fill one by one, a light sweeps the pill. */
export function TrustBadge() {
  const reduce = useReducedMotion();
  const [on, setOn] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setOn(true), reduce ? 0 : 450);
    return () => clearTimeout(t);
  }, [reduce]);
  const { clients, rating } = site.trust;

  return (
    <p className="relative inline-flex max-w-full items-center gap-2.5 overflow-hidden rounded-full bg-white py-1 pl-1 pr-3.5 text-[13px] sm:gap-3 sm:pr-4 sm:text-[14px] font-medium text-ink shadow-[0_0_0_1px_rgb(10_10_11/0.12),0_6px_18px_-8px_rgb(10_10_11/0.25)]">
      {!reduce && (
        <motion.span aria-hidden="true" className="pointer-events-none absolute inset-y-0 w-16 -skew-x-12 bg-[linear-gradient(90deg,transparent,rgb(48_116_254/0.12),transparent)]"
          initial={{ left: "-20%" }} animate={{ left: "120%" }} transition={{ duration: 1.6, delay: 1.6, repeat: Infinity, repeatDelay: 4.5, ease: "easeInOut" }} />
      )}
      <span className="flex -space-x-1.5">
        {[FlagUS, FlagAU, FlagUK].map((F, i) => (
          <motion.span key={i} className="block" initial={reduce ? false : { scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ ...spring, delay: 0.25 + i * 0.09 }}><F /></motion.span>
        ))}
      </span>
      <span>
        <span className="max-[400px]:hidden">Serving </span><span className="tabular-nums"><NumberFlow value={on ? clients : 0} />+</span> clients
      </span>
      <span aria-hidden="true" className="h-4 w-px bg-line-2" />
      <span className="flex items-center gap-1.5">
        <span className="flex" aria-hidden="true">
          {Array.from({ length: 5 }, (_, i) => (
            <svg key={i} width="14" height="14" viewBox="0 0 20 20" className="text-line-2">
              <path d="M10 1.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.6 7.7l5.8-.8z" fill="currentColor" />
              <motion.path d="M10 1.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.6 7.7l5.8-.8z" fill="#F59E0B" style={{ transformOrigin: "50% 50%" }}
                initial={reduce ? false : { scale: 0, opacity: 0 }} animate={on ? { scale: 1, opacity: 1 } : {}} transition={{ ...spring, delay: 0.1 + i * 0.08 }} />
            </svg>
          ))}
        </span>
        <span className="font-semibold tabular-nums"><NumberFlow value={on ? rating : 0} format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }} /></span>
        <span className="font-normal text-ink-2 max-sm:hidden">rating</span>
      </span>
    </p>
  );
}
