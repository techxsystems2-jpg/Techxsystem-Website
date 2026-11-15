"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, animate, motion, useInView, useMotionTemplate, useMotionValue, useReducedMotion, type AnimationPlaybackControls } from "motion/react";
import Image from "next/image";
import { Scene, type SceneName } from "./Scenes";

/** Before/after compare (apple-design: 1:1 tracking, interruptible, spring hand-off).
    - Drag anywhere (pointer or keyboard through a native range input); the divider follows 1:1.
    - On release it springs to the nearest third (20 / 50 / 80%) with a little bounce, since a drag carried momentum.
    - Each time the scene changes and the slider is on screen, it sweeps once to show it can be dragged.
      Grabbing it stops the sweep at once, from wherever it is. */
/** `photo`: a real image (public/photos). The before side is the same photo with the raw-bracket look until TechX
    supplies true raw/edited pairs; then pass `before` too. Without `photo` it draws the illustrated stand-in scene. */
export function BeforeAfter({ scene, className = "", labels = true, photo, before, alt = "" }: { scene: SceneName; className?: string; labels?: boolean; photo?: string; before?: string; alt?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const inView = useInView(box, { amount: 0.5 });
  const reduce = useReducedMotion();
  const pos = useMotionValue(35); // more of the edit on show at rest
  const run = useRef<AnimationPlaybackControls | null>(null);
  const touched = useRef(false);
  const clip = useMotionTemplate`inset(0 calc(100% - ${pos}%) 0 0)`;
  const left = useMotionTemplate`${pos}%`;

  useEffect(() => {
    if (!inView || reduce || touched.current) return;
    run.current = animate(pos, [pos.get(), 18, 72, 35], { duration: 2.6, ease: [0.45, 0, 0.2, 1], times: [0, 0.35, 0.75, 1], delay: 0.5 });
    return () => run.current?.stop();
  }, [scene, inView, reduce, pos]);

  function grab() {
    touched.current = true;
    run.current?.stop();
  }

  function release() {
    const v = pos.get();
    const to = v < 35 ? 20 : v > 65 ? 80 : 50;
    if (input.current) input.current.value = String(to);
    if (reduce) pos.set(to);
    else run.current = animate(pos, to, { type: "spring", bounce: 0.2, duration: 0.45 });
  }

  return (
    <div ref={box} className={`group relative select-none overflow-hidden bg-[#dfe5ec] ${className}`}>
      <AnimatePresence initial={false}>
        <motion.div key={scene} className="absolute inset-0" initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
          {photo ? <Image src={photo} alt={alt} fill loading="eager" fetchPriority="high" sizes="(min-width: 1200px) 1180px, 100vw" className="object-cover" /> : <Scene name={scene} uid={`ba-a-${scene}`} />}
          <motion.div className="absolute inset-0" style={{ clipPath: clip }}>
            {/* eager too: it covers half the hero photo, so the browser can report it as the LCP; with no `before` it is
                the same file and size, so this costs no second download */}
            {photo ? <Image src={before ?? photo} alt="" fill loading="eager" sizes="(min-width: 1200px) 1180px, 100vw" className={`object-cover ${before ? "" : "[filter:brightness(.68)_contrast(.78)_saturate(.5)_sepia(.08)]"}`} /> : <Scene name={scene} uid={`ba-r-${scene}`} className="raw" />}
          </motion.div>
        </motion.div>
      </AnimatePresence>
      <motion.div aria-hidden="true" className="absolute inset-y-0 w-0.5 -translate-x-px bg-white shadow-[0_0_12px_rgb(255_255_255/0.6)]" style={{ left }} />
      <motion.div aria-hidden="true" className="absolute top-1/2 bg-white/85 shadow-raised backdrop-blur-md -ml-[22px] -mt-[22px] grid size-11 place-items-center rounded-full transition-transform duration-150 group-hover:scale-[1.08] group-active:scale-95" style={{ left }}>
        <svg width="20" height="20" viewBox="0 0 20 20"><path d="M7 5L2 10l5 5M13 5l5 5-5 5" stroke="#111318" strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </motion.div>
      {labels && (<>
      {[["Before", " · raw bracket"], ["After", " · TechX edit"]].map(([x, y], k) => (
        <span key={x} className={`absolute bottom-3 rounded-lg bg-ink/55 px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.04em] text-white backdrop-blur-md sm:bottom-4 ${k ? "right-3 sm:right-4" : "left-3 sm:left-4"}`}>
          {x}<span className="max-sm:hidden">{y}</span>
        </span>
      ))}
      </>)}
      <input
        ref={input}
        type="range"
        min={0}
        max={100}
        defaultValue={35}
        aria-label="Drag to compare before and after"
        className="absolute inset-0 size-full cursor-ew-resize opacity-0"
        onPointerDown={grab}
        onKeyDown={grab}
        onInput={(e) => pos.set(Number(e.currentTarget.value))}
        onPointerUp={release}
        onKeyUp={release}
      />
    </div>
  );
}
