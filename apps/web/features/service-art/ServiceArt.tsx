"use client";

import { useEffect, useRef, useState, type PointerEvent, type ReactElement, type ReactNode } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useLoop } from "@/features/motion/useLoop";

/* One card per service, the whole edit on one screen (owner, 2026-10-31): after on the left, before on the right, and
   the fixes ticking off along the bottom. Each tick pushes the divider right, so the after grows as the work is done.
   Photos are TechX's own finished edits from the old site's portfolio (docs/PHOTO_CREDITS.md); the "before" is a
   filter over the same frame until real pairs arrive. Staging keeps the stock pair (no TechX staging samples yet).
   Loops only while on screen; off screen or under reduced motion it rests on a 50/50 split with every fix ticked.
   Transform, opacity and clip-path only.
   Interactive (owner, 2026-11-02): with a mouse the divider follows the pointer while hovering the photo and the loop
   resumes when it leaves; on touch a sideways drag moves it (vertical scrolling still works) and a tap opens the
   service. Tags and the fixes bar ignore the pointer so the whole photo is the handle. */

type Slug = "photo-editing" | "virtual-twilight" | "virtual-staging" | "drone-editing" | "floor-plans" | "video-editing";

export function ServiceArt({ slug }: { slug: Slug }) {
  const { ref, play } = useLoop<HTMLDivElement>();
  const Art = arts[slug];
  return (
    <div ref={ref} className="relative aspect-[3/2] overflow-hidden rounded-inner bg-sunk">
      <Art play={play} />
    </div>
  );
}

const spring = { type: "spring", bounce: 0, duration: 0.7 } as const;
const pop = { type: "spring", bounce: 0.35, duration: 0.5 } as const;

/** Counts 0..n while `play` (one fix every `ms`, then holds on all done), then starts over. Rests on n. */
function useSteps(n: number, play: boolean, ms = 1100, hold = 2400) {
  const [k, setK] = useState(n);
  useEffect(() => {
    if (!play) return;
    let i = 0;
    let t: ReturnType<typeof setTimeout>;
    const tick = () => {
      setK(i);
      t = setTimeout(tick, i === n ? hold : ms);
      i = i === n ? 0 : i + 1;
    };
    t = setTimeout(tick, 300);
    return () => clearTimeout(t);
  }, [n, play, ms, hold]);
  return play ? k : n;
}

function Photo({ src, style, className = "" }: { src: string; style?: React.CSSProperties; className?: string }) {
  return <Image src={src} alt="" fill sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" className={`object-cover ${className}`} style={style} />;
}

/** Corner labels: the edited side (left) light, the raw side (right) dark. */
const Tag = ({ children, side }: { children: ReactNode; side: "l" | "r" }) => (
  <span className={`pointer-events-none absolute top-3 z-10 rounded-md px-2 py-[3px] font-mono text-[10.5px] uppercase tracking-[0.04em] backdrop-blur ${side === "l" ? "left-3 bg-surface/90 text-ink" : "right-3 bg-ink/55 text-white"}`}>{children}</span>
);

const Tick = () => (
  <motion.span initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={pop} className="grid size-3.5 shrink-0 place-items-center rounded-full bg-[#E7F6EE] text-green">
    <svg width="8" height="8" viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
  </motion.span>
);

/** The fixes along the bottom, ticked as they land; the one in progress spins. */
function Steps({ items, done }: { items: readonly string[]; done: number }) {
  return (
    <div className="glass pointer-events-none absolute inset-x-3 bottom-3 z-10 flex items-center justify-center gap-3 rounded-full px-3 py-1.5">
      {items.map((s, i) => (
        <span key={s} className={`flex items-center gap-1 whitespace-nowrap text-[11px] font-medium transition-colors duration-300 ${i < done ? "text-ink" : "text-ink-2/70"}`}>
          {i < done ? <Tick /> : i === done ? <span className="size-3.5 animate-spin rounded-full border-[1.5px] border-dashed border-blue [animation-duration:3s]" /> : <span className="size-3.5 rounded-full border-[1.5px] border-line-2" />}
          {s}
        </span>
      ))}
    </div>
  );
}

/** After | before with a divider. `done` of `n` fixes sets where the divider sits: it walks right from 22% to 78% while
    playing, so the after grows left to right; at rest it sits in the middle so both halves read equally. */
function Split({ before, after, done, n, play, overlay }: { before: ReactNode; after: ReactNode; done: number; n: number; play: boolean; overlay?: ReactNode }) {
  const [manual, setManual] = useState<number | null>(null); // set while the visitor is moving the divider
  const drag = useRef<{ x: number; moved: boolean } | null>(null);
  const dragged = useRef(false);
  const at = manual ?? (play ? 22 + (done / n) * 56 : 50); // % from the left where "after" ends
  const move = manual === null ? spring : { duration: 0 };
  const follow = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setManual(Math.min(97, Math.max(3, ((e.clientX - r.left) / r.width) * 100)));
  };
  return (
    <>
      <div aria-hidden="true" className="absolute inset-0 z-[5] cursor-ew-resize touch-pan-y"
        onPointerDown={(e) => { if (e.pointerType === "mouse") return; drag.current = { x: e.clientX, moved: false }; e.currentTarget.setPointerCapture(e.pointerId); }}
        onPointerMove={(e) => {
          if (e.pointerType === "mouse") return follow(e);
          if (!drag.current) return;
          if (Math.abs(e.clientX - drag.current.x) > 6) drag.current.moved = true;
          if (drag.current.moved) follow(e);
        }}
        onPointerUp={() => { dragged.current = !!drag.current?.moved; drag.current = null; }}
        onPointerCancel={() => { drag.current = null; }}
        onPointerLeave={(e) => { if (e.pointerType === "mouse") setManual(null); }}
        onClick={(e) => { if (dragged.current) { e.preventDefault(); dragged.current = false; } }} />
      <div className="absolute inset-0">{before}</div>
      <motion.div className="absolute inset-0" initial={false} animate={{ clipPath: `inset(0 ${100 - at}% 0 0)` }} transition={move}>
        {after}
        {overlay}
      </motion.div>
      <motion.div className="pointer-events-none absolute inset-0" initial={false} animate={{ transform: `translateX(${at}%)` }} transition={move}>
        <span className="absolute inset-y-0 left-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_10px_rgb(0_0_0/0.25)]" />
        <span className="absolute left-0 top-1/2 grid size-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-ink shadow-raised">
          <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 4L2 8l4 4M10 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
      </motion.div>
    </>
  );
}

const RAW = { filter: "brightness(.62) contrast(.78) saturate(.5) sepia(.1)" };

function HdrArt({ play }: { play: boolean }) {
  const steps = ["Merge", "Windows", "Sky", "Verticals"] as const;
  const done = useSteps(steps.length, play);
  return (
    <>
      <Split n={steps.length} done={done} play={play} before={<Photo src="/photos/tx-ext.jpg" style={RAW} />} after={<Photo src="/photos/tx-ext.jpg" />} />
      <Tag side="l">HDR edit</Tag><Tag side="r">3 brackets</Tag>
      <Steps items={steps} done={done} />
    </>
  );
}

function TwilightArt({ play }: { play: boolean }) {
  const steps = ["Dusk sky", "Lights on", "Pool glow"] as const;
  const done = useSteps(steps.length, play);
  return (
    <>
      <Split n={steps.length} done={done} play={play}
        before={<Photo src="/photos/tx-twi.jpg" style={{ filter: "brightness(1.55) saturate(.25) contrast(.75) hue-rotate(-10deg)" }} />}
        after={<Photo src="/photos/tx-twi.jpg" />} />
      <Tag side="l">Dusk</Tag><Tag side="r">Day</Tag>
      <Steps items={steps} done={done} />
    </>
  );
}

function StagingArt({ play }: { play: boolean }) {
  const steps = ["Rug", "Sofa", "Decor"] as const;
  const done = useSteps(steps.length, play);
  return (
    <>
      <Split n={steps.length} done={done} play={play} before={<Photo src="/photos/empty.webp" />} after={<Photo src="/photos/int.webp" />} />
      <Tag side="l">Staged</Tag><Tag side="r">Empty room</Tag>
      <Steps items={steps} done={done} />
    </>
  );
}

function DroneArt({ play }: { play: boolean }) {
  const steps = ["Colour match", "Sky", "Lot lines"] as const;
  const done = useSteps(steps.length, play);
  // the lot outline, drawn once "Lot lines" is done
  const lines = (
    <motion.span className="absolute left-[52%] top-[30%] h-[34%] w-[26%] rotate-[8deg] rounded-sm border-2 border-dashed border-white bg-white/10 shadow-[0_0_0_1px_rgb(0_0_0/0.15)]"
      initial={false} animate={{ opacity: done >= 3 ? 1 : 0, transform: done >= 3 ? "scale(1) rotate(8deg)" : "scale(0.94) rotate(8deg)" }} transition={pop} />
  );
  return (
    <>
      <Split n={steps.length} done={done} play={play} before={<Photo src="/photos/tx-aer.jpg" style={RAW} />} after={<Photo src="/photos/tx-aer.jpg" />} overlay={lines} />
      <Tag side="l">Edited</Tag><Tag side="r">Raw aerial</Tag>
      <Steps items={steps} done={done} />
    </>
  );
}

function FloorArt({ play }: { play: boolean }) {
  const steps = ["Walls", "Rooms", "Sizes"] as const;
  const done = useSteps(steps.length, play);
  const plan = (style?: React.CSSProperties) => (
    <div className="absolute inset-0 bg-white"><Photo src="/photos/tx-plan.jpg" className="!object-contain p-[4%] pb-[14%]" style={style} /></div>
  );
  return (
    <>
      <Split n={steps.length} done={done} play={play} before={plan({ filter: "blur(1.6px) contrast(.5) sepia(.6) opacity(.75)" })} after={plan()} />
      <Tag side="l">2D plan</Tag><Tag side="r">Your sketch</Tag>
      <Steps items={steps} done={done} />
    </>
  );
}

/** Video: the whole cut on one screen. Four clips on a timeline, the preview plays whichever clip the playhead is on,
    and the finishing touches tick off underneath. */
const CLIPS = ["tx-ext.jpg", "tx-int.jpg", "tx-twi.jpg", "tx-aer.jpg"] as const;
function VideoArt({ play }: { play: boolean }) {
  const steps = ["Cut", "Music", "Titles"] as const;
  const [clip, setClip] = useState(2);
  useEffect(() => {
    if (!play) return;
    const t = setInterval(() => setClip((c) => (c + 1) % CLIPS.length), 1600);
    return () => clearInterval(t);
  }, [play]);
  const done = useSteps(steps.length, play, 1600, 3200);
  const c = play ? clip : 2;
  return (
    <>
      <AnimatePresence initial={false}>
        <motion.div key={c} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
          <motion.div className="absolute inset-0" initial={{ transform: "scale(1.02)" }} animate={{ transform: play ? "scale(1.12)" : "scale(1.04)" }} transition={{ duration: 2.2, ease: "linear" }}>
            <Photo src={`/photos/${CLIPS[c]}`} />
          </motion.div>
        </motion.div>
      </AnimatePresence>
      <span className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-md bg-ink/55 px-2 py-[3px] font-mono text-[10.5px] uppercase tracking-[0.04em] text-white backdrop-blur">
        <motion.i className="size-1.5 rounded-full bg-[#FF4D4D]" animate={play ? { opacity: [1, 0.2, 1] } : { opacity: 1 }} transition={play ? { duration: 1.2, repeat: Infinity } : { duration: 0 }} />
        4K · 2:30
      </span>
      <AnimatePresence>
        {done >= 3 && (
          <motion.span key="title" className="absolute inset-x-0 top-[34%] z-10 text-center font-display text-[20px] font-semibold tracking-[-0.02em] text-white [text-shadow:0_2px_12px_rgb(0_0_0/0.45)]"
            initial={{ opacity: 0, transform: "translateY(6px)" }} animate={{ opacity: 1, transform: "translateY(0px)" }} exit={{ opacity: 0 }} transition={spring}>
            Just listed
          </motion.span>
        )}
      </AnimatePresence>
      {/* timeline: four clips, the playhead on the one in the preview, a music bar under them once added */}
      <div className="glass absolute inset-x-3 bottom-12 z-10 rounded-lg p-1">
        <div className="relative grid grid-cols-4 gap-0.5">
          {CLIPS.map((s, i) => (
            <span key={s} className={`relative h-6 overflow-hidden rounded-[4px] ring-2 transition-[box-shadow] duration-300 ${i === c ? "ring-maroon" : "ring-transparent"}`}><Photo src={`/photos/${s}`} /></span>
          ))}
        </div>
        <motion.span className="mt-0.5 block h-1.5 origin-left rounded-full bg-[linear-gradient(90deg,#8DB3D9,#9AA6D8)]" initial={false} animate={{ transform: `scaleX(${done >= 2 ? 1 : 0})`, opacity: done >= 2 ? 1 : 0 }} transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }} />
      </div>
      <Steps items={steps} done={done} />
    </>
  );
}

const arts: Record<Slug, (p: { play: boolean }) => ReactElement> = {
  "photo-editing": HdrArt,
  "virtual-twilight": TwilightArt,
  "virtual-staging": StagingArt,
  "drone-editing": DroneArt,
  "floor-plans": FloorArt,
  "video-editing": VideoArt,
};
