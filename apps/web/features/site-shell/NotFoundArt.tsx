"use client";

import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

/* 404 stage (owner, 2026-11-02, v3 after a dot-matrix reference, made TechX and real estate). Owner follow-ups: not
   dark, match the theme; no border at all; the gradient runs the full width and the full height of the section, and
   the section stays as compact as its content (80px from the links to the footer line). So: a full-bleed section on the page
   itself, with the homepage hero's sky behind it (`hero-sky`, hidden on the White background by globals.css) and a slow
   diagonal sweep of light. The giant 404 is a TechX twilight listing photo printed in halftone dots (background-clip text
   + a dot mask), darkened a little so it reads on a light page. A flashlight follows the mouse and brightens the photo
   inside the digits (a second copy, dot mask intersected with a radial mask at the pointer). No frames, no panel.
   Reduced motion: the sweep rests; the flashlight still follows the pointer (user-driven).
   Photo: TechX's own twilight edit from the old site (docs/PHOTO_CREDITS.md). */
const PHOTO = "url(/photos/tx-twi.jpg)";
const DOTS = "radial-gradient(circle at center, #000 1.15px, transparent 1.65px)";

function Digits({ bright = false }: { bright?: boolean }) {
  const mask: CSSProperties = bright
    ? {
        maskImage: `${DOTS}, radial-gradient(300px circle at var(--x) var(--y), #000 0%, transparent 70%)`,
        WebkitMaskImage: `${DOTS}, radial-gradient(300px circle at var(--x) var(--y), #000 0%, transparent 70%)`,
        maskSize: "6px 6px, 100% 100%", WebkitMaskSize: "6px 6px, 100% 100%",
        maskComposite: "intersect", WebkitMaskComposite: "source-in",
      }
    : { maskImage: DOTS, WebkitMaskImage: DOTS, maskSize: "6px 6px", WebkitMaskSize: "6px 6px" };
  return (
    // the dot (and flashlight) mask sits on this full-area layer, so --x / --y are area coordinates
    <span aria-hidden="true" className={`absolute inset-0 grid place-items-center ${bright ? "" : "opacity-75"}`} style={mask}>
      <span className="select-none font-display text-[clamp(112px,24vw,420px)] font-bold leading-none tracking-[-0.04em] text-transparent"
        style={{ backgroundImage: PHOTO, backgroundSize: "cover", backgroundPosition: "center", WebkitBackgroundClip: "text", backgroundClip: "text",
          filter: bright ? "saturate(1.4) contrast(1.15)" : "brightness(.5) contrast(1.2) saturate(.9)" }}>
        404
      </span>
    </span>
  );
}

export function NotFoundStage({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const area = useRef<HTMLDivElement>(null);
  const move = (e: PointerEvent<HTMLElement>) => {
    const a = area.current;
    if (!a) return;
    const r = a.getBoundingClientRect();
    a.style.setProperty("--x", `${e.clientX - r.left}px`);
    a.style.setProperty("--y", `${e.clientY - r.top}px`);
  };
  return (
    <section onPointerMove={move} className="relative -mb-10 overflow-hidden pt-16 text-center md:pt-20">
      {/* the homepage hero's sky, full width (hidden on the White background); masked to fade out over the bottom
          third so it melts into the page with no edge line (owner) */}
      <div aria-hidden="true" className="hero-sky pointer-events-none absolute inset-0 overflow-hidden [mask-image:linear-gradient(to_bottom,#000_55%,transparent)]">
        <div className="absolute inset-0 bg-[radial-gradient(55%_45%_at_18%_8%,#D2ECFF,transparent_70%),radial-gradient(50%_45%_at_82%_12%,#D8EFFF,transparent_70%),radial-gradient(60%_40%_at_25%_80%,#DCEFFF,transparent_70%),radial-gradient(55%_40%_at_80%_70%,#E3F3FF,transparent_70%),linear-gradient(to_bottom,#EAF5FF,#F3F9FF_55%,transparent)]" />
        <div className="cloud absolute left-[4%] top-[6%] h-[240px] w-[520px] rounded-full bg-white/70 blur-[60px]" />
        <div className="cloud absolute right-[3%] top-[18%] h-[200px] w-[460px] rounded-full bg-white/60 blur-[60px] [animation-delay:-12s]" />
        <div className="cloud absolute bottom-[12%] left-[30%] h-[220px] w-[560px] rounded-full bg-white/60 blur-[60px] [animation-delay:-6s]" />
      </div>
      {/* a soft diagonal sweep of light across the whole width */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden [mask-image:linear-gradient(to_bottom,#000_55%,transparent)]">
      <motion.span className="pointer-events-none absolute -top-1/2 left-0 h-[200%] w-[30%] rotate-[32deg] bg-[linear-gradient(90deg,transparent,rgb(48_116_254/0.06),rgb(255_255_255/0.6),transparent)] blur-xl"
        initial={{ x: "-40%" }} animate={reduce ? { x: "120%" } : { x: ["-60%", "380%"] }}
        transition={reduce ? { duration: 0 } : { duration: 16, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }} />
      </span>
      <div className="wrap relative">
        {/* the halftone 404: no frame, sits on the page */}
        <div ref={area} className="relative mx-auto h-[calc(clamp(112px,24vw,420px)*1.06)] w-full max-w-[1000px] [--x:50%] [--y:45%]">
          <Digits />
          <Digits bright />
        </div>
        {children}
      </div>
    </section>
  );
}
