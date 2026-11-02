"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Canvas } from "./Canvas";
import { EditorScreen, useEditSteps } from "./EditorScreen";

/* How it works · one small illustration per step card (owner, 2026-11-02), on the same dotted canvas as the answer
   illustrations. Each acts out its step once when `run` changes (the row's left-to-right sequence, or a mouse hover),
   then rests on its finished frame. `run` 0 = never played: the finished frame, which is also what reduced motion,
   no-JS and the server render show. Transform, opacity and clip-path only.
   01 files drop into the zone and the bar fills · 02 the visitor types their style guide, then saves it ·
   03 the photo editor: layers land one by one, then check 1 (editor) and check 2 (QC) (EditorScreen.tsx) ·
   04 the "photos are ready" email lands, Download all is clicked and downloads, then "Revision · free". Photos are TechX's own edits from the old site (docs/PHOTO_CREDITS.md). */

const OUT = [0.23, 1, 0.32, 1] as const;

/** Start state only when the step is actually playing; otherwise render the finished frame directly. */
const from = (run: number, v: Record<string, string | number>) => (run > 0 ? v : false);

// Pikaicons (free pack): upload-up, download-down, envelope
const ICON = {
  upload: "M3 15a5 5 0 0 0 5 5h8a5 5 0 0 0 5-5M9 6.812a15 15 0 0 1 2.556-2.655A.7.7 0 0 1 12 4m3 2.812a15 15 0 0 0-2.556-2.655A.7.7 0 0 0 12 4m0 0v11",
  mail: "m21.803 7.762-5.508 3.505c-1.557.99-2.335 1.486-3.171 1.678a5 5 0 0 1-2.248 0c-.836-.192-1.614-.688-3.171-1.678L2.197 7.762m19.606 0C22 8.722 22 10.006 22 12c0 2.8 0 4.2-.545 5.27a5 5 0 0 1-2.185 2.185C18.2 20 16.8 20 14 20h-4c-2.8 0-4.2 0-5.27-.545a5 5 0 0 1-2.185-2.185C2 16.2 2 14.8 2 12c0-1.994 0-3.278.197-4.238m19.606 0a4 4 0 0 0-.348-1.032 5 5 0 0 0-2.185-2.185C18.2 4 16.8 4 14 4h-4c-2.8 0-4.2 0-5.27.545A5 5 0 0 0 2.545 6.73a4 4 0 0 0-.348 1.032",
  download: "M3 15a5 5 0 0 0 5 5h8a5 5 0 0 0 5-5M9 12.188a15 15 0 0 0 2.556 2.655A.7.7 0 0 0 12 15m3-2.812a15 15 0 0 1-2.556 2.655A.7.7 0 0 1 12 15m0 0V4",
} as const;
const Icon = ({ d, size = 16 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);

/** `big`: the How it works page's step rows, where the canvas is wider and taller, so the art is drawn a little larger (not 03: the editor window fits itself). */
export function StepArt({ n, run, big = false }: { n: number; run: number; big?: boolean }) {
  const Art = [UploadArt, GuideArt, EditCheckArt, DownloadArt][n];
  return (
    <Canvas className={big ? "h-[240px] sm:h-[300px]" : "h-[168px]"}>
      <div aria-hidden="true" className={`relative grid size-full place-items-center ${big && n !== 2 ? "lg:scale-[1.15]" : ""}`}>
        <Art run={run} />
      </div>
    </Canvas>
  );
}

function UploadArt({ run }: { run: number }) {
  return (
    <div className="relative w-[80%]">
      <div className="grid justify-items-center gap-1.5 rounded-xl border-[1.5px] border-dashed border-blue/40 bg-surface/90 px-3 py-3.5">
        <span className="grid size-8 place-items-center rounded-lg bg-blue-tint text-blue"><Icon d={ICON.upload} /></span>
        <span className="text-[11.5px] font-medium">Drop brackets here</span>
        <span className="h-1 w-[70%] overflow-hidden rounded-full bg-line">
          <motion.span key={run} className="block h-full origin-left rounded-full bg-blue"
            initial={from(run, { transform: "scaleX(0)" })} animate={{ transform: "scaleX(1)" }} transition={{ duration: 0.7, delay: 0.6, ease: OUT }} />
        </span>
      </div>
      {run > 0 && ["DSC_0412.ARW", "DSC_0417.ARW"].map((f, i) => (
        <motion.span key={`${run}-${f}`} className="absolute left-1/2 top-[38%] flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-md bg-surface px-1.5 py-1 font-mono text-[9px] text-ink-2 shadow-hair"
          initial={{ opacity: 0, transform: `translate(${i ? 34 : -34}px, -46px) rotate(${i ? 8 : -8}deg)` }}
          animate={{ opacity: [0, 1, 1, 0], transform: "translate(0px, 0px) rotate(0deg) scale(0.9)" }}
          transition={{ duration: 0.75, delay: i * 0.2, ease: OUT, opacity: { duration: 0.75, delay: i * 0.2, times: [0, 0.2, 0.8, 1] } }}>
          <i className="h-2.5 w-2 rounded-[2px] bg-[linear-gradient(135deg,#C9D6FF,#7FA2FF)]" />{f}
        </motion.span>
      ))}
      <motion.p key={`done-${run}`} className="mt-2 text-center font-mono text-[10px] uppercase tracking-[0.04em] text-green"
        initial={from(run, { opacity: 0, transform: "translateY(4px)" })} animate={{ opacity: 1, transform: "translateY(0px)" }} transition={{ duration: 0.3, delay: 1.2 }}>
        ✓ Brackets uploaded
      </motion.p>
    </div>
  );
}

/* 02 · Tell us once: the visitor fills in their style guide. Each field types in turn (focus ring + caret), then
   "Save style guide" is pressed and turns into "Saved for every editor". */
const GUIDE = [["Sky", "Blue, soft clouds"], ["Verticals", "Always straight"], ["Windows", "Full pull"]] as const;
const GUIDE_LEN = GUIDE.reduce((n, [, v]) => n + v.length, 0);
const GUIDE_START = GUIDE.map((_, i) => GUIDE.slice(0, i).reduce((n, [, v]) => n + v.length, 0)); // where each field begins
const TYPE_MS = 38;
const GUIDE_AT = [200 + GUIDE_LEN * TYPE_MS + 250, 200 + GUIDE_LEN * TYPE_MS + 650] as const; // press, saved

function GuideArt({ run }: { run: number }) {
  const typed = useTyped(run, GUIDE_LEN, 200, TYPE_MS);
  const stage = useStage(run, GUIDE_AT); // 0 typing · 1 pressing · 2 saved
  return (
    <div className="w-[88%] rounded-xl bg-surface p-2.5 shadow-hair">
      <p className="flex items-center justify-between text-[11px] font-medium">Your style guide<span className="font-mono text-[8.5px] font-normal uppercase tracking-[0.04em] text-ink-3">{stage >= 2 ? "Saved" : "Draft"}</span></p>
      {GUIDE.map(([k, v], i) => {
        const start = GUIDE_START[i];
        const n = Math.max(0, Math.min(v.length, typed - start));
        const active = typed < GUIDE_LEN && typed >= start && typed < start + v.length;
        return (
          <div key={k} className="mt-1.5 flex items-center gap-2 text-[10px]">
            <span className="w-[52px] shrink-0 text-ink-2">{k}</span>
            <span className={`flex h-[22px] min-w-0 flex-1 items-center rounded-md px-2 transition-[box-shadow,background-color] duration-200 ${active ? "bg-surface shadow-[0_0_0_1px_var(--color-blue),0_0_0_3px_rgb(48_116_254/0.14)]" : "bg-[#FAFAFB] shadow-[0_0_0_1px_var(--color-line-2)]"}`}>
              <span className="truncate text-ink">{v.slice(0, n)}</span>
              {active && <span className="ml-px h-3 w-px shrink-0 animate-pulse bg-blue" />}
            </span>
          </div>
        );
      })}
      <motion.span className={`mt-2 flex h-6 items-center justify-center rounded-full text-[10px] font-medium transition-colors duration-300 ${stage >= 2 ? "bg-[#E7F6EE] text-green" : "bg-blue text-white"}`}
        animate={stage === 1 ? { transform: ["scale(1)", "scale(0.93)", "scale(1)"] } : { transform: "scale(1)" }} transition={{ duration: 0.35 }}>
        {stage >= 2 ? "✓ Saved for every editor" : "Save style guide"}
      </motion.span>
    </div>
  );
}

/** 03 · Edit, then check: the photo editor window, layers landing one by one, then both checks (EditorScreen). */
function EditCheckArt({ run }: { run: number }) {
  return <EditOnce key={run} run={run} />;
}
function EditOnce({ run }: { run: number }) {
  const k = useEditSteps(run > 0, false);
  return <div className="h-[156px] w-full px-2.5"><EditorScreen k={k} variant="window" /></div>;
}

/* 04 · Download and revise: the "your photos are ready" email lands, the cursor clicks Download all, it downloads,
   then "Revision · free" appears underneath. 7:58 AM matches the overnight timeline's download. */
const THUMBS = ["tx-ext.jpg", "tx-twi.jpg", "tx-aer.jpg"] as const;
const MAIL_AT = [350, 1000, 1300, 2200, 2600] as const; // mail in · cursor arrives · click · downloaded · revision
function DownloadArt({ run }: { run: number }) {
  const s = useStage(run, MAIL_AT);
  const mailIn = s >= 1, cursor = s >= 2 && s < 4, clicked = s >= 3, downloaded = s >= 4, revise = s >= 5;
  return (
    <div className="flex w-[90%] flex-col items-center gap-1.5">
      <motion.div className="w-full rounded-xl bg-surface p-2.5 shadow-hair" initial={false}
        animate={{ opacity: mailIn ? 1 : 0, transform: mailIn ? "translateY(0px)" : "translateY(-10px)" }} transition={{ duration: 0.35, ease: OUT }}>
        <div className="flex items-center gap-2">
          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-blue-tint text-blue"><Icon d={ICON.mail} size={12} /></span>
          <div className="min-w-0 flex-1">
            <p className="flex items-center justify-between text-[10px]"><b className="font-semibold">TechX Studio</b><span className="font-mono text-[8.5px] text-ink-3">7:58 AM</span></p>
            <p className="truncate text-[10px] text-ink-2">Your photos are ready · 42 edited</p>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-1">
          {THUMBS.map((t) => (
            <span key={t} className="relative h-7 w-9 shrink-0 overflow-hidden rounded-[4px]"><Image src={`/photos/${t}`} alt="" fill sizes="40px" className="object-cover" /></span>
          ))}
          <span className="relative ml-auto">
            <motion.span className={`flex h-6 items-center gap-1 whitespace-nowrap rounded-full px-2.5 text-[9.5px] font-medium transition-colors duration-300 ${downloaded ? "bg-[#E7F6EE] text-green" : "bg-blue text-white"}`}
              animate={s === 3 ? { transform: ["scale(1)", "scale(0.9)", "scale(1)"] } : { transform: "scale(1)" }} transition={{ duration: 0.3 }}>
              {downloaded ? "✓ Downloaded" : clicked ? "Downloading…" : <><Icon d={ICON.download} size={10} />Download all</>}
            </motion.span>
            {clicked && !downloaded && (
              <span className="absolute inset-x-2 -bottom-1.5 h-0.5 overflow-hidden rounded-full bg-line">
                <motion.span className="block h-full origin-left rounded-full bg-blue" initial={{ transform: "scaleX(0)" }} animate={{ transform: "scaleX(1)" }} transition={{ duration: 0.85, ease: "linear" }} />
              </span>
            )}
            {run > 0 && (
              <motion.svg width="13" height="13" viewBox="0 0 14 14" className="pointer-events-none absolute left-1/2 top-1/2" initial={{ opacity: 0, transform: "translate(34px, 26px)" }}
                animate={{ opacity: cursor ? 1 : 0, transform: s >= 2 ? "translate(2px, 2px)" : "translate(34px, 26px)" }} transition={{ duration: 0.5, ease: OUT }}>
                <path d="M1 1l4.5 11 1.6-4.4L11.5 6z" fill="#0A0A0B" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" />
              </motion.svg>
            )}
          </span>
        </div>
      </motion.div>
      <motion.span className="flex items-center gap-1.5 rounded-full bg-surface py-1 pl-1.5 pr-2.5 text-[10px] text-ink-2 shadow-hair" initial={false}
        animate={{ opacity: revise ? 1 : 0, transform: revise ? "translateY(0px)" : "translateY(4px)" }} transition={{ duration: 0.3 }}>
        <i className="size-2 rounded-full bg-blue" />Need a change? Revision · free
      </motion.span>
    </div>
  );
}

/** Steps through `at` (ms) once per run: 0 at the start, then 1, 2, … as each time passes. Rests on the last (run 0). */
function useStage(run: number, at: readonly number[]) {
  const [s, setS] = useState(at.length);
  useEffect(() => {
    if (!run) return;
    const ts = [setTimeout(() => setS(0), 0), ...at.map((ms, i) => setTimeout(() => setS(i + 1), ms))];
    return () => ts.forEach(clearTimeout);
  }, [run, at]);
  return run ? s : at.length;
}

/** Characters typed so far: 0 → total, one every `every` ms after `delay`, once per run. Rests on total (run 0). */
function useTyped(run: number, total: number, delay: number, every: number) {
  const [n, setN] = useState(total);
  useEffect(() => {
    if (!run) return;
    let i = 0;
    let iv: ReturnType<typeof setInterval> | undefined;
    const t0 = setTimeout(() => setN(0), 0);
    const t1 = setTimeout(() => { iv = setInterval(() => { i += 1; setN(i); if (i >= total) clearInterval(iv); }, every); }, delay);
    return () => { clearTimeout(t0); clearTimeout(t1); if (iv) clearInterval(iv); };
  }, [run, total, delay, every]);
  return run ? n : total;
}
