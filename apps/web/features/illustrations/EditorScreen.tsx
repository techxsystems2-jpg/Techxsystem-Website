"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { useLoop } from "@/features/motion/useLoop";
import { Canvas, SHADOW_HERO, SHADOW_SATELLITE, Story } from "./Canvas";

/* The edit, then the check, shown as a photo editor on screen (owner, 2026-11-02, after a laptop reference).
   A Photoshop-like workspace in a light theme, with no Adobe name or logo: tools on the left, the canvas with a
   before/after divider, a Layers panel on the right. The fixes land as layers one by one (HDR merge, Window pull, Sky
   replace, Verticals) and each one pushes the divider further into "after". Then the check pill underneath ticks:
   1 · your editor, 2 · your QC. Photo: a TechX edit from the old site (docs/PHOTO_CREDITS.md).
   EditorScreen is the Mac screen (menu bar, the window, the checks floating over it; How it works step 03), drawn at
   design size and framed by Shot, which crops instead of shrinking (stageshow review, 2026-11-03). Answer card 01 and
   Home step card 03 use the close-up (EditCloseUp): the photo as the hero and the Layers panel straddling its edge.
   `loop` repeats while `play`; without it the sequence runs once per mount (remount with a new key to replay).
   Not playing (off screen, reduced motion, server render): the finished frame, every layer on, both checks done.
   Transform, opacity and clip-path only. */

const S = 6; // 0 raw · 1–4 one layer each · 5 check 1 · 6 check 2
const STEP_MS = 850;
const HOLD_MS = 2600;
const spring = { type: "spring", bounce: 0, duration: 0.7 } as const;
const RAW = { filter: "brightness(.62) contrast(.78) saturate(.5) sepia(.1)" };
const PHOTO = "/photos/tx-ext.jpg";
const LAYERS = ["HDR merge", "Window pull", "Sky replace", "Verticals"] as const;
export const EDITOR_STORY = ["Your RAW opens in our editor", "Merge, windows, sky, verticals", "Check 1 · your editor", "Check 2 · your QC signs off"];

/** Where the sequence is: 0..S while playing, S at rest. */
export function useEditSteps(play: boolean, loop: boolean) {
  const [k, setK] = useState(S);
  useEffect(() => {
    if (!play) return;
    let i = 0;
    let t: ReturnType<typeof setTimeout>;
    const tick = () => {
      setK(i);
      if (i === S) {
        if (loop) t = setTimeout(() => { i = 0; tick(); }, HOLD_MS);
        return;
      }
      i += 1;
      t = setTimeout(tick, STEP_MS);
    };
    t = setTimeout(tick, 250);
    return () => clearTimeout(t);
  }, [play, loop]);
  return play ? k : S;
}

/** Caption index for a Story under the laptop. */
export const editorBeat = (k: number) => (k === 0 ? 0 : k <= 4 ? 1 : k === 5 ? 2 : 3);

/** The Mac screen with the editor (500×322), drawn at design size; How it works frames it with Shot. */
export function EditorScreen({ k }: { k: number }) {
  return <Desk k={k} />;
}

/** Answer card 01 · How we do it, as a close-up: the photo is the hero (before / after, the divider moving as each fix
    lands) and the Layers panel straddles its right edge, each fix ticking on. The caption tells the checks. Real type
    sizes, so it reads on a phone. */
export function EditingArt() {
  const { ref, play } = useLoop<HTMLDivElement>();
  const k = useEditSteps(play, true);
  return (
    <div ref={ref}>
      <Canvas className="h-[292px]" story={<Story steps={EDITOR_STORY} at={editorBeat(k)} />}>
        <EditCloseUp k={k} />
      </Canvas>
    </div>
  );
}

/** The close-up itself: the photo (before / after) as the hero, the Layers panel straddling its right edge. The panel's
    header counts the fixes, then says "Checked" once both checks are done. `small` fits a 168px step card. */
export function EditCloseUp({ k, small = false }: { k: number; small?: boolean }) {
  const applied = Math.min(k, 4);
  const at = k <= 4 ? 12 + applied * 19 : 50;
  const row = small ? "h-6 px-2.5 text-[11px]" : "h-7 px-3 text-[12px]";
  return (
    <div aria-hidden="true" className="relative size-full">
      <div className={`absolute left-[6%] aspect-[3/2] overflow-hidden rounded-[10px] ${small ? "top-4 w-[62%]" : "top-5 w-[64%]"} ${SHADOW_HERO}`}>
        <Image src={PHOTO} alt="" fill sizes="(min-width: 1024px) 260px, 60vw" className="object-cover" style={RAW} />
        <motion.div className="absolute inset-0" initial={false} animate={{ clipPath: `inset(0 ${100 - at}% 0 0)` }} transition={spring}>
          <Image src={PHOTO} alt="" fill sizes="(min-width: 1024px) 260px, 60vw" className="object-cover" />
        </motion.div>
        <Divider at={at} />
        <span className="absolute left-2 top-2 rounded-[5px] bg-surface/90 px-1.5 py-0.5 text-[11px] font-medium text-ink">After</span>
        {!small && <span className="absolute right-2 top-2 rounded-[5px] bg-ink/60 px-1.5 py-0.5 text-[11px] font-medium text-white">Before</span>}
      </div>
      <div className={`absolute right-[5%] overflow-hidden rounded-[10px] bg-surface ${small ? "top-7 w-[132px]" : "top-[52px] w-[152px]"} ${SHADOW_SATELLITE}`}>
        <p className={`flex items-center justify-between border-b border-line ${small ? "h-7 px-2.5 text-[11px]" : "h-8 px-3 text-[12px]"}`}>
          <b className="font-semibold text-ink">Layers</b>
          <span className={k >= S ? "flex items-center gap-1 font-medium text-green" : "text-ink-2"}>{k >= S ? <>Checked<Check /></> : `${applied} of 4`}</span>
        </p>
        <ul>
          {[...LAYERS].reverse().map((name) => {
            const idx = LAYERS.indexOf(name);
            const on = idx < applied;
            const now = on && idx === applied - 1 && k >= 1 && k <= 4;
            return (
              <motion.li key={name} initial={false} animate={{ opacity: on ? 1 : 0.4 }} transition={{ duration: 0.3 }}
                className={`flex items-center gap-2 transition-colors duration-300 ${row} ${now ? "bg-blue-tint" : ""}`}>
                <span className={`truncate ${now ? "font-medium text-blue-2" : "text-ink"}`}>{name}</span>
                {on && <span className="ml-auto text-green"><Check /></span>}
              </motion.li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

const Check = () => <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>;

const Divider = ({ at }: { at: number }) => (
  <motion.div className="absolute inset-0" initial={false} animate={{ transform: `translateX(${at}%)` }} transition={spring}>
    <span className="absolute inset-y-0 left-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_8px_rgb(0_0_0/0.3)]" />
    <span className="absolute left-0 top-1/2 grid size-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-ink shadow-raised">
      <svg width="10" height="10" viewBox="0 0 16 16"><path d="M6 4L2 8l4 4M10 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </span>
  </motion.div>
);

function Desk({ k }: { k: number }) {
  return (
    <div className={`relative h-[322px] w-[500px] overflow-hidden rounded-[12px] bg-[linear-gradient(160deg,#EAF3FF_0%,#F6F6F8_55%,#EEF0F6_100%)] ${SHADOW_HERO}`}>
      <div className="flex h-[22px] items-center bg-white/70 px-3 text-[10px] backdrop-blur">
        <span className="flex gap-3 text-ink-2"><b className="font-semibold text-ink">Editor</b><span>File</span><span>Edit</span><span>Image</span><span>Layer</span><span>Filter</span><span>View</span></span>
      </div>
      {/* the window stops short of the screen's right edge, so the shot can crop the desktop and keep the Layers whole */}
      <div className="w-[440px] pl-2.5 pt-2"><Window k={k} /></div>
      <Checks k={k} className="absolute left-[96px] top-[214px]" compact />
    </div>
  );
}

function Window({ k }: { k: number }) {
  const applied = Math.min(k, 4); // layers on
  const at = k <= 4 ? 12 + applied * 19 : 50; // % of the photo already "after"
  return (
    <div className="flex h-[288px] flex-col overflow-hidden rounded-[10px] bg-surface shadow-[0_0_0_1px_rgb(10_10_11/0.08),0_10px_24px_-14px_rgb(10_10_11/0.35)]">
      {/* title bar */}
      <div className="flex h-7 shrink-0 items-center gap-2 border-b border-line px-3">
        <span className="flex gap-1.5"><i className="size-2.5 rounded-full bg-[#FF5F57]" /><i className="size-2.5 rounded-full bg-[#FEBC2E]" /><i className="size-2.5 rounded-full bg-[#28C840]" /></span>
        <span className="ml-2 truncate text-[10.5px] font-medium text-ink">DSC_0412.ARW @ 50% (Edited)</span>
        <span className="ml-2 shrink-0 rounded-[4px] bg-blue-tint px-1.5 py-px text-[9.5px] font-medium text-blue-2">Your style guide</span>
      </div>
      {/* options bar */}
      <div className="flex h-[22px] shrink-0 items-center gap-3 border-b border-line bg-[#FAFAFB] px-3 text-[9px] text-ink-2">
        <span>Brush 24px</span><span>Opacity 100%</span><span>Flow 100%</span><span className="ml-auto">16-bit · RGB</span>
      </div>
      <div className="flex min-h-0 flex-1">
        {/* tools */}
        <div className="flex w-7 shrink-0 flex-col items-center gap-1.5 border-r border-line bg-[#FAFAFB] py-2">
          {TOOLS.map((d, i) => (
            <span key={i} className={`grid size-5 place-items-center rounded ${i === 3 ? "bg-blue-tint text-blue-2" : "text-ink-2"}`}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
            </span>
          ))}
        </div>
        {/* canvas with before / after */}
        <div className="relative grid min-h-0 min-w-0 flex-1 place-items-center bg-[#EDEDF0] p-3">
          {/* fits by height or width, whichever runs out first, so the check pill never covers it */}
          <div className="relative aspect-[3/2] max-h-full w-full max-w-full overflow-hidden rounded-[3px] shadow-[0_2px_8px_rgb(10_10_11/0.18)]">
            <Image src={PHOTO} alt="" fill sizes="320px" className="object-cover" style={RAW} />
            <motion.div className="absolute inset-0" initial={false} animate={{ clipPath: `inset(0 ${100 - at}% 0 0)` }} transition={spring}>
              <Image src={PHOTO} alt="" fill sizes="320px" className="object-cover" />
            </motion.div>
            <Divider at={at} />
            <span className="absolute left-1.5 top-1.5 rounded bg-surface/90 px-1 py-px text-[9px] font-medium text-ink">After</span>
            <span className="absolute right-1.5 top-1.5 rounded bg-ink/55 px-1 py-px text-[9px] font-medium text-white">Before</span>
          </div>
        </div>
        {/* layers */}
        <div className="flex w-[138px] shrink-0 flex-col border-l border-line bg-[#FAFAFB]">
          <div className="flex h-6 items-center gap-3 border-b border-line px-2.5 text-[9.5px]"><b className="font-semibold text-ink">Layers</b><span className="text-ink-2">Adjust</span></div>
          <ul className="flex flex-col">
            {[...LAYERS].reverse().map((name) => {
              const idx = LAYERS.indexOf(name);
              const on = idx < applied;
              const now = on && idx === applied - 1 && k >= 1 && k <= 4;
              return (
                <motion.li key={name} initial={false} animate={{ opacity: on ? 1 : 0.35 }} transition={{ duration: 0.3 }}
                  className={`flex h-[26px] items-center gap-1.5 border-b border-line px-2 text-[9.5px] transition-colors duration-300 ${now ? "bg-blue-tint" : ""}`}>
                  <Eye on={on} />
                  <span className="relative h-3.5 w-5 shrink-0 overflow-hidden rounded-[2px] ring-1 ring-line-2"><Image src={PHOTO} alt="" fill sizes="20px" className="object-cover" /></span>
                  <span className={`truncate ${now ? "font-medium text-blue-2" : "text-ink"}`}>{name}</span>
                  {on && <span className="ml-auto text-green"><svg width="9" height="9" viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg></span>}
                </motion.li>
              );
            })}
            <li className="flex h-[26px] items-center gap-1.5 px-2 text-[9.5px]">
              <Eye on />
              <span className="relative h-3.5 w-5 shrink-0 overflow-hidden rounded-[2px] ring-1 ring-line-2"><Image src={PHOTO} alt="" fill sizes="20px" className="object-cover" style={RAW} /></span>
              <span className="truncate italic text-ink-2">Background (RAW)</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

/** The two checks, as a pill under the screen (after the reference's control bar). */
function Checks({ k, className = "", compact = false }: { k: number; className?: string; compact?: boolean }) {
  const items = [{ label: "1 · Your editor", on: k >= 5, now: k === 5 }, { label: "2 · Your QC", on: k >= 6, now: k === 6 }];
  return (
    <div className={`flex items-center gap-1.5 rounded-full bg-ink p-1 shadow-[0_10px_24px_-12px_rgb(10_10_11/0.55)] ${className}`}>
      <span className={`flex items-center gap-1.5 rounded-full bg-white/10 text-white/80 ${compact ? "px-2 py-0.5 text-[10px]" : "px-3 py-1.5 text-[11px]"}`}>
        <motion.i className={`size-1.5 rounded-full ${k < S ? "bg-[#FF4D4D]" : "bg-[#3DDC84]"}`} animate={k < S ? { opacity: [1, 0.25, 1] } : { opacity: 1 }} transition={k < S ? { duration: 1.2, repeat: Infinity } : { duration: 0 }} />
        {k <= 4 ? "Editing" : k < S ? "Checking" : "Done"}
      </span>
      {items.map((c) => (
        <span key={c.label} className={`flex items-center gap-1.5 rounded-full font-medium transition-colors duration-300 ${compact ? "px-2 py-0.5 text-[10px]" : "px-3 py-1.5 text-[11px]"} ${c.on ? "bg-white text-ink" : "bg-white/10 text-white/60"}`}>
          <span className={`grid size-3.5 place-items-center rounded-full transition-colors duration-300 ${c.on ? "bg-[#E7F6EE] text-green" : "border border-white/30"}`}>
            {c.on && (
              <motion.svg key={c.now ? "now" : "rest"} width="8" height="8" viewBox="0 0 16 16" initial={c.now ? { scale: 0.4, opacity: 0 } : false} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", bounce: 0.4, duration: 0.45 }}>
                <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              </motion.svg>
            )}
          </span>
          {c.label}
        </span>
      ))}
    </div>
  );
}

const Eye = ({ on }: { on: boolean }) => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={on ? "shrink-0 text-ink-2" : "shrink-0 text-ink-3"}>
    {on ? <><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></> : <path d="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4M6.6 6.6A17 17 0 0 0 2 12s3.6 7 10 7a9.7 9.7 0 0 0 5.4-1.6" />}
  </svg>
);

// generic tool glyphs: move, marquee, lasso, brush, clone stamp, crop, eyedropper
const TOOLS = [
  "M12 2v20M2 12h20M12 2l-3 3m3-3 3 3M12 22l-3-3m3 3 3-3M2 12l3-3m-3 3 3 3M22 12l-3-3m3 3-3 3",
  "M4 4h4M12 4h4M20 4v4M20 12v4M20 20h-4M12 20H8M4 20v-4M4 12V8",
  "M12 4c5 0 8 2.5 8 5.5S17 15 12 15c-1.5 0-3-.2-4-.6M12 4C7 4 4 6.5 4 9.5c0 1.6 1 3 2.5 4M6.5 13.5 5 20",
  "M18 3l3 3-9.5 9.5-3-3zM8.5 12.5 5 16c-1 1-1.5 3-2 5 2-.5 4-1 5-2l3.5-3.5",
  "M9 9h6v4H9zM12 13v3M6 20h12v-4H6zM12 9V5a2 2 0 1 1 0 0",
  "M6 2v16h16M2 6h16v16",
  "M15 3l6 6-3 3-6-6zM12 6 4 14v6h6l8-8",
];
