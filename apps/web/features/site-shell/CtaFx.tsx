"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";

/* Moving sky inside the final CTA panel (owner, 2026-11-02), shown on the White background only (`.cta-fx` in
   globals.css). Two soft blue patches drift slowly (CSS transform loops, 14s / 18s; still under reduced motion), and a
   blue glow follows the mouse while it is over the panel (springed, fades out on leave). Sits behind the content and
   never takes pointer events; it listens on its parent panel. Transform and opacity only, plus the glow's gradient. */
export function CtaFx() {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(-600);
  const y = useMotionValue(-600);
  const sx = useSpring(x, { bounce: 0, duration: 0.5 });
  const sy = useSpring(y, { bounce: 0, duration: 0.5 });
  const o = useSpring(0, { bounce: 0, duration: 0.4 });
  const glow = useMotionTemplate`radial-gradient(420px circle at ${sx}px ${sy}px, rgb(48 116 254 / 0.20), rgb(120 180 255 / 0.10) 45%, transparent 70%)`;

  useEffect(() => {
    const panel = ref.current?.parentElement;
    if (!panel) return;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = panel.getBoundingClientRect();
      x.set(e.clientX - r.left);
      y.set(e.clientY - r.top);
      o.set(1);
    };
    const leave = () => o.set(0);
    panel.addEventListener("pointermove", move);
    panel.addEventListener("pointerleave", leave);
    return () => { panel.removeEventListener("pointermove", move); panel.removeEventListener("pointerleave", leave); };
  }, [x, y, o]);

  return (
    <div ref={ref} aria-hidden="true" className="cta-fx pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
      <span className="cta-blob absolute -left-[12%] -top-[35%] h-[80%] w-[55%] rounded-full bg-[radial-gradient(closest-side,#9CC9FF,transparent)] opacity-70 blur-2xl [animation:cta-drift-a_14s_ease-in-out_infinite]" />
      <span className="cta-blob absolute -right-[10%] -top-[25%] h-[75%] w-[50%] rounded-full bg-[radial-gradient(closest-side,#B4D7FF,transparent)] opacity-70 blur-2xl [animation:cta-drift-b_18s_ease-in-out_infinite]" />
      <motion.span className="absolute inset-0" style={{ background: glow, opacity: o }} />
    </div>
  );
}
