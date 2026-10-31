"use client";

import type { ReactNode } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";

/** Card surface with Apple-grade hover: lifts 3px to the raised shadow, and a soft brand light follows the pointer.
    Touch devices get the press state only. */
export function Spotlight({ children, className = "" }: { children: ReactNode; className?: string }) {
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const sx = useSpring(x, { bounce: 0, duration: 0.35 });
  const sy = useSpring(y, { bounce: 0, duration: 0.35 });
  const glow = useMotionTemplate`radial-gradient(420px circle at ${sx}px ${sy}px, rgb(48 116 254 / 0.10), rgb(142 31 63 / 0.04) 40%, transparent 70%)`;
  return (
    <motion.div
      className={`group/card relative rounded-card bg-surface p-2 shadow-hair transition-[box-shadow] duration-[320ms] hover:shadow-raised ${className}`}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.995 }}
      transition={{ type: "spring", bounce: 0, duration: 0.4 }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - r.left);
        y.set(e.clientY - r.top);
      }}
      onPointerLeave={() => { x.set(-400); y.set(-400); }}
    >
      <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/card:opacity-100" style={{ background: glow }} />
      {children}
    </motion.div>
  );
}
