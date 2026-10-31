"use client";

import type { ReactNode } from "react";
import { motion, type Variants } from "motion/react";

// Apple-style default: critically damped spring, no overshoot. Content materialises: rises, sharpens, fades in.
const spring = { type: "spring", bounce: 0, duration: 0.9 } as const;
const item: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(10px)" },
  shown: { opacity: 1, y: 0, filter: "blur(0px)", transition: spring },
};

/** One block that materialises when it scrolls into view (once). */
export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div className={className} variants={item} initial="hidden" whileInView="shown" viewport={{ once: true, margin: "0px 0px -12% 0px" }} transition={{ ...spring, delay }}>
      {children}
    </motion.div>
  );
}

/** A group whose RevealItem children arrive one after another (80ms apart). */
export function RevealGroup({ children, className, as = "div" }: { children: ReactNode; className?: string; as?: "div" | "ul" }) {
  const M = as === "ul" ? motion.ul : motion.div;
  return (
    <M className={className} initial="hidden" whileInView="shown" viewport={{ once: true, margin: "0px 0px -10% 0px" }} transition={{ staggerChildren: 0.08 }}>
      {children}
    </M>
  );
}

export function RevealItem({ children, className, as = "div" }: { children: ReactNode; className?: string; as?: "div" | "li" }) {
  const M = as === "li" ? motion.li : motion.div;
  return <M className={className} variants={item}>{children}</M>;
}
