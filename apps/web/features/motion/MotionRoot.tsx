"use client";

import { useEffect, type ReactNode } from "react";
import { MotionConfig } from "motion/react";

/** Site-wide motion settings: respects the OS reduced-motion setting, and adds Lenis smooth scrolling.
    Speed pass (2026-11-03): Lenis used to start during the first render, measuring the whole page and running a frame
    loop before anything was drawn (over a second of style and layout in Lighthouse's phone test). Now it loads only on
    devices with a mouse or trackpad (touch keeps native scrolling, as it always did), only after the page has loaded
    and the browser is idle, and its code is fetched then, not with the page. Skipped under reduced motion. */
export function MotionRoot({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let lenis: { raf: (t: number) => void; destroy: () => void } | undefined;
    let id = 0;
    let cancelled = false;
    const start = () => {
      import("lenis").then(({ default: Lenis }) => {
        if (cancelled) return;
        lenis = new Lenis({ lerp: 0.1, anchors: { offset: -96 } });
        id = requestAnimationFrame(function raf(t) {
          lenis!.raf(t);
          id = requestAnimationFrame(raf);
        });
      });
    };
    const idle = (cb: () => void) => ("requestIdleCallback" in window ? requestIdleCallback(cb, { timeout: 2500 }) : setTimeout(cb, 1200));
    const onLoad = () => idle(start);
    if (document.readyState === "complete") onLoad();
    else addEventListener("load", onLoad, { once: true });
    return () => {
      cancelled = true;
      removeEventListener("load", onLoad);
      cancelAnimationFrame(id);
      lenis?.destroy();
    };
  }, []);
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
