"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Canvas, SHADOW_HERO, SHADOW_SATELLITE, Shot } from "@/features/illustrations/Canvas";
import { EditorScreen, useEditSteps } from "@/features/illustrations/EditorScreen";
import { useSite } from "@/features/content/ContentProvider";

/* How it works page · the four steps, each shown on a Mac as it really happens (owner, 2026-11-03: "the whole website
   and the upload on the Mac screen, a cursor dragging the images in; the mail where the user tells us; the editor on a
   Mac; Dropbox or a mail share with the download link"). Same copy as before; Home keeps its step cards (StepArt).
   01 Finder → drag five brackets onto the TechX upload page · 02 Mail to the studio, notes typed, sent, saved as the
   style guide · 03 the Photoshop-like editor on the laptop (EditorScreen, no Adobe name or logo) · 04 the "ready" mail
   with a Dropbox share: Download, then a change request that comes back revised, free.
   Purpose: explanation, seen once per visit. Each plays once when its row comes into view and replays when a mouse
   enters the row; `run` 0 = never played = the finished frame (server render, reduced motion, no JS).
   Transform / opacity / clip-path only, full transform strings; the cursor travels on the strong ease-in-out, things
   arriving use the strong ease-out. Real TechX photos (docs/PHOTO_CREDITS.md).
   Framing (stageshow review, 2026-11-03): the Mac screen alone, no bezel or base, drawn at a readable size and cropped
   by the panel (Shot): inset top-left, running off the right and bottom; on a phone it crops harder around each
   scene's focus instead of shrinking the type. Every beat has the scene on screen: nothing starts from a blank desk. */

const OUT = [0.23, 1, 0.32, 1] as const;
const IN_OUT = [0.77, 0, 0.175, 1] as const;
const enter = { duration: 0.45, ease: OUT };
const W = 500; // design size of the Mac screen (menu bar 22 + desktop 300)
const H = 322;
// where each scene's story happens, in design pixels: kept in view when a phone crops the screen
const FOCUS: [number, number][] = [[300, 140], [240, 150], [330, 150], [240, 160]];

/** Steps through a scene: after `run` changes, k goes 0 → gaps.length, one gap (ms) per step; at rest k is the end. */
function useSteps(run: number, gaps: readonly number[]) {
  const [k, setK] = useState(gaps.length);
  useEffect(() => {
    if (!run) return;
    let at = 0;
    const timers = [setTimeout(() => setK(0), 0), ...gaps.map((g, i) => setTimeout(() => setK(i + 1), (at += g)))];
    return () => timers.forEach(clearTimeout);
  }, [run, gaps]);
  return k;
}

export function StepScene({ n, run }: { n: number; run: number }) {
  return (
    <Canvas className="h-[300px] sm:h-[360px]">
      <Shot w={W} h={H} focus={FOCUS[n]} fill={n === 2 ? [0.92, 0.83] : [0.84, 0.83]} gutter={28}>
        {n === 0 ? <UploadScene run={run} /> : n === 1 ? <MailScene run={run} /> : n === 2 ? <EditScene run={run} /> : <DeliverScene run={run} />}
      </Shot>
    </Canvas>
  );
}

/** The Mac screen: menu bar (app name, menus) over a soft desktop. 500×322, content area 500×300. No bezel or
    base: the screen itself is the shot, and the panel crops it. */
export function Mac({ app, menus, children }: { app: string; menus: string[]; children: ReactNode }) {
  return (
    <div className={`relative h-[322px] w-[500px] overflow-hidden rounded-[12px] bg-[linear-gradient(160deg,#EAF3FF_0%,#F6F6F8_55%,#EEF0F6_100%)] ${SHADOW_HERO}`}>
      {/* no clock on the right: the shot crops that edge, and a cut word reads as a mistake (the times are told in the
          mails and the timeline below) */}
      <div className="flex h-[22px] items-center bg-white/70 px-3 text-[10px] backdrop-blur">
        <span className="flex gap-3 text-ink-2"><b className="font-semibold text-ink">{app}</b>{menus.map((m) => <span key={m}>{m}</span>)}</span>
      </div>
      <div className="relative h-[300px]">{children}</div>
    </div>
  );
}

/** A window with traffic lights and a title. */
export function Win({ title, className = "", children }: { title: ReactNode; className?: string; children: ReactNode }) {
  return (
    <div className={`absolute flex flex-col overflow-hidden rounded-[9px] bg-surface ${SHADOW_SATELLITE} ${className}`}>
      <div className="flex h-6 shrink-0 items-center gap-2 border-b border-line px-2.5">
        <span className="flex gap-1"><i className="size-2 rounded-full bg-[#FF5F57]" /><i className="size-2 rounded-full bg-[#FEBC2E]" /><i className="size-2 rounded-full bg-[#28C840]" /></span>
        <span className="min-w-0 flex-1 truncate text-center text-[10px] font-medium text-ink-2">{title}</span>
        <span className="w-8" />
      </div>
      <div className="relative min-h-0 flex-1">{children}</div>
    </div>
  );
}

/** The pointer, moved with transforms; presses in on a click. */
export function Cursor({ x, y, down = false, children }: { x: number; y: number; down?: boolean; children?: ReactNode }) {
  return (
    <motion.div initial={false} className="pointer-events-none absolute left-0 top-0 z-30" animate={{ transform: `translate(${x}px, ${y}px)` }} transition={{ duration: 0.9, ease: IN_OUT }}>
      {children}
      <motion.svg initial={false} animate={{ transform: down ? "scale(0.86)" : "scale(1)" }} transition={{ duration: 0.12 }} width="16" height="22" viewBox="0 0 16 22" className="relative origin-top-left drop-shadow-[0_2px_3px_rgb(10_10_11/0.35)]">
        <path d="M1 1v17.5l4.6-4.3 3 6.6 2.8-1.2-3-6.5H15z" fill="#0A0A0B" stroke="#fff" strokeWidth="1.3" strokeLinejoin="round" />
      </motion.svg>
    </motion.div>
  );
}

export const Tick = ({ size = 14 }: { size?: number }) => (
  <span className="grid shrink-0 place-items-center rounded-full bg-[#E7F6EE] text-green" style={{ width: size, height: size }}>
    <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
  </span>
);

const fade = (on: boolean, y = 6) => ({ opacity: on ? 1 : 0, transform: `translateY(${on ? 0 : y}px)` });

/* ── 01 · Upload the shoot: Finder → TechX upload page ───────────────────────────────────────────────────────── */
const EXPOSURE = [0.42, 0.66, 0.95, 1.3, 1.65];
const UPLOAD_GAPS = [500, 700, 1100, 350, 1300, 400] as const; // 1 select · 2 drag · 3 drop · 4 uploading · 5 done · 6 rest
function UploadScene({ run }: { run: number }) {
  const site = useSite();
  const k = useSteps(run, UPLOAD_GAPS);
  const selected = k >= 1;
  const dragging = k === 2;
  const dropped = k >= 3;
  const done = k >= 5;
  // cursor: starts low on the desktop, goes to the Finder thumbnails, drags across to the drop zone
  const pos = k === 0 ? [96, 232] : k === 1 ? [64, 180] : [318, 140];
  return (
    <Mac app="Safari" menus={["File", "Edit", "View", "History"]}>
      {/* the TechX site, free-trial upload */}
      <Win title={<span className="rounded bg-sunk px-2 py-0.5 font-mono text-[9px]">{new URL(site.url).host}/free-trial</span>} className="left-[132px] top-[10px] h-[236px] w-[338px]">
        <div className="px-4 pt-3">
          <p className="text-[9px] font-medium text-ink-2"><span className="text-ink">TechX</span> Systems</p>
          <p className="mt-2 text-[15px] font-medium leading-tight tracking-[-0.01em]">Send ten photos. <span className="text-ink-2">Judge the result.</span></p>
          <motion.div initial={false} animate={{ backgroundColor: dragging ? "rgb(235 241 255)" : "rgb(250 250 251)" }} transition={{ duration: 0.2 }}
            className={`mt-3 grid h-[112px] place-items-center rounded-[8px] border border-dashed ${dragging ? "border-blue" : "border-line-2"}`}>
            {!dropped ? (
              <p className="text-center text-[10.5px] leading-snug"><b className="block font-medium">Drop your brackets here</b><span className="text-ink-2">or paste a Dropbox / Google Drive link</span></p>
            ) : (
              <div className="w-[85%]">
                <div className="flex gap-1.5">
                  {EXPOSURE.map((b, i) => (
                    <motion.span key={i} initial={false} animate={fade(dropped, 4)} transition={{ ...enter, delay: k === 3 ? i * 0.05 : 0 }} className="relative h-9 flex-1 overflow-hidden rounded-[4px]">
                      <Image src="/photos/tx-int.jpg" alt="" fill sizes="60px" className="object-cover" style={{ filter: `brightness(${b})` }} />
                    </motion.span>
                  ))}
                </div>
                <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-sunk">
                  <motion.div initial={false} animate={{ transform: `scaleX(${k >= 4 ? 1 : 0.06})` }} transition={{ duration: k >= 4 ? 1.1 : 0, ease: "linear" }} className="h-full origin-left rounded-full bg-ink" />
                </div>
                <p className="mt-1.5 flex items-center gap-1.5 text-[10px] font-medium">{done ? <><Tick size={12} />5 brackets uploaded</> : <span className="text-ink-2">Uploading 5 files…</span>}</p>
              </div>
            )}
          </motion.div>
          <p className="mt-2.5 text-right"><span className="inline-block rounded-[6px] bg-blue-2 px-3 py-1.5 text-[10.5px] font-medium text-white">Send my photos</span></p>
        </div>
      </Win>
      {/* Finder with the shoot */}
      <Win title="Shoot · 123 Ocean View" className="left-[12px] top-[86px] z-10 h-[150px] w-[150px]">
        <div className="grid grid-cols-3 gap-1.5 p-2">
          {EXPOSURE.map((b, i) => (
            <span key={i} className="text-center">
              <span className={`relative block h-[30px] overflow-hidden rounded-[3px] ${selected && !dropped ? "ring-2 ring-blue" : ""}`} style={{ opacity: dragging ? 0.45 : 1 }}>
                <Image src="/photos/tx-int.jpg" alt="" fill sizes="40px" className="object-cover" style={{ filter: `brightness(${b})` }} />
              </span>
              <span className="mt-0.5 block truncate font-mono text-[6.5px] text-ink-2">DSC_041{2 + i}</span>
            </span>
          ))}
        </div>
      </Win>
      <Cursor x={pos[0]!} y={pos[1]!} down={k === 1 || dragging}>
        {/* the dragged stack rides under the pointer while dragging */}
        <motion.span initial={false} animate={{ opacity: dragging ? 1 : 0 }} transition={{ duration: 0.15 }} className="absolute left-2 top-3 block h-[34px] w-[48px]">
          {[2, 1, 0].map((o) => (
            <span key={o} className="absolute inset-0 overflow-hidden rounded-[4px] ring-1 ring-white shadow-[0_6px_14px_-6px_rgb(10_10_11/0.5)]" style={{ transform: `translate(${o * 3}px, ${o * 3}px)` }}>
              <Image src="/photos/tx-int.jpg" alt="" fill sizes="50px" className="object-cover" />
            </span>
          ))}
          <span className="absolute -right-2 -top-2 grid size-4 place-items-center rounded-full bg-[#FF3B30] text-[8px] font-semibold text-white">5</span>
        </motion.span>
      </Cursor>
    </Mac>
  );
}

/* ── 02 · Tell us once: a mail to the studio ───────────────────────────────────────────────────────────────────── */
const LINES = ["Hi team,", "Sky: blue, with soft clouds.", "Windows: pull them so the view shows.", "Lawn: green, not neon.", "Please use this on every shoot."];
const MAIL_GAPS = [400, 700, 900, 1000, 800, 900, 600, 500, 700] as const; // 1–5 lines · 6 attach · 7 to Send · 8 sent, saved as the style guide
function MailScene({ run }: { run: number }) {
  const site = useSite();
  const k = useSteps(run, MAIL_GAPS);
  const sent = k >= 8;
  const pos = k < 7 ? [400, 226] : [430, 44];
  return (
    <Mac app="Mail" menus={["File", "Edit", "View", "Message"]}>
      <motion.div initial={false} animate={sent ? { opacity: 0, transform: "translateY(-24px) scale(0.94)" } : { opacity: 1, transform: "translateY(0px) scale(1)" }} transition={{ duration: 0.5, ease: OUT }} className="absolute inset-0">
        <Win title="New message" className="left-[34px] top-[10px] h-[240px] w-[412px]">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-end border-b border-line px-3 py-1.5">
              <motion.span initial={false} animate={{ transform: k === 7 ? "scale(0.94)" : "scale(1)" }} className="inline-flex items-center gap-1 rounded-[6px] bg-ink px-2.5 py-1 text-[10px] font-medium text-white">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.9 12 3.1 5.7c-.5-1.6 1-3.1 2.7-2.6a54 54 0 0 1 12.6 6C19.5 9.8 21 10.4 21 12s-1.5 2.2-2.6 2.9a54 54 0 0 1-12.6 6c-1.7.5-3.2-1-2.7-2.6zm0 0h4.9" /></svg>Send
              </motion.span>
            </div>
            <div className="space-y-0 px-3 text-[10.5px]">
              <p className="flex gap-2 border-b border-line py-1.5"><span className="w-12 text-ink-2">To:</span>{site.contact.email}</p>
              <p className="flex gap-2 border-b border-line py-1.5"><span className="w-12 text-ink-2">Subject:</span><span className="font-medium">My style for every shoot</span></p>
            </div>
            <div className="flex-1 space-y-0.5 px-3 pt-2 text-[11px] leading-snug">
              {LINES.map((l, i) => (
                // each line "types": revealed left to right at a steady pace
                <motion.p key={l} initial={false} className="w-fit" animate={{ clipPath: k > i ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)" }} transition={{ duration: k > i ? Math.min(0.85, l.length * 0.025) : 0, ease: "linear" }}>{l}</motion.p>
              ))}
            </div>
            <motion.div initial={false} animate={fade(k >= 6)} transition={enter} className="flex items-center gap-2 border-t border-line px-3 py-2">
              {["/photos/tx-ext.jpg", "/photos/tx-twi.jpg"].map((src) => (
                <span key={src} className="flex items-center gap-1.5 rounded-[6px] bg-sunk p-1 pr-2 text-[9px] text-ink-2">
                  <span className="relative h-5 w-7 overflow-hidden rounded-[3px]"><Image src={src} alt="" fill sizes="30px" className="object-cover" /></span>reference.jpg
                </span>
              ))}
            </motion.div>
          </div>
        </Win>
      </motion.div>
      {/* after sending: the studio turns the mail into the style guide */}
      <motion.div initial={false} animate={fade(k >= 8, 10)} transition={{ ...enter, delay: k === 8 ? 0.25 : 0 }} className="absolute left-1/2 top-[96px] w-[300px] -translate-x-1/2">
        <div className={`rounded-[12px] bg-surface p-3.5 ${SHADOW_SATELLITE}`}>
          <p className="flex items-center gap-2 text-[12px] font-medium"><Tick size={16} />Saved as your style guide</p>
          <ul className="mt-2.5 space-y-1 border-t border-line pt-2.5 text-[10.5px] text-ink-2">
            {LINES.slice(1, 4).map((l) => <li key={l}>{l}</li>)}
          </ul>
          <p className="mt-2.5 text-[10px] text-ink-2">Every editor, every job</p>
        </div>
      </motion.div>
      <Cursor x={pos[0]!} y={pos[1]!} down={k === 7} />
    </Mac>
  );
}

/* ── 03 · Edit, then check: the editor on the laptop (EditorScreen), played once per run ──────────────────────── */
function EditScene({ run }: { run: number }) {
  return <EditPlay key={run} play={run > 0} />; // a new key replays the editor's own sequence
}
function EditPlay({ play }: { play: boolean }) {
  const k = useEditSteps(play, false);
  return <EditorScreen k={k} />;
}

/* ── 04 · Download and revise: the "ready" mail with a Dropbox share ──────────────────────────────────────────── */
const SET = ["/photos/work/int-4.webp", "/photos/work/ext-3.webp", "/photos/work/twi-2.webp", "/photos/work/aer-5.webp"];
const DELIVER_GAPS = [400, 900, 250, 1000, 900, 900, 1300] as const; // 0–1 the mail, open · 2 to Download · 3 press · 4 done · 5 to photo · 6 note · 7 revised
function DeliverScene({ run }: { run: number }) {
  const k = useSteps(run, DELIVER_GAPS);
  const pos = k < 2 ? [440, 236] : k < 5 ? [380, 222] : [200, 170];
  return (
    <Mac app="Mail" menus={["File", "Edit", "View", "Message"]}>
      <div className="absolute inset-0">
        <Win title="Inbox · TechX Studio" className="left-[34px] top-[6px] h-[246px] w-[412px]">
          <div className="px-4 pt-2">
            <div className="flex items-center gap-2.5">
              <span className="grid size-7 place-items-center rounded-full bg-sunk text-[10px] font-medium">TX</span>
              <span className="text-[10.5px] leading-tight"><b className="block font-medium">TechX Studio</b><span className="text-ink-2">to you · 7:58 AM</span></span>
            </div>
            <p className="mt-2 text-[12.5px] font-medium">Your photos are ready</p>
            <p className="mt-0.5 text-[10.5px] text-ink-2">42 edited and checked. Need a change? Reply on any photo.</p>
            {/* the share */}
            <div className="mt-2.5 rounded-[9px] border border-line p-2.5">
              <div className="flex items-center justify-between text-[10px]">
                <span className="flex items-center gap-1.5 font-medium">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ink-2"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>
                  Dropbox · 123 Ocean View Dr
                </span>
                <span className="text-[10px] tabular-nums text-ink-2">42 photos · 610 MB</span>
              </div>
              <div className="mt-2 grid grid-cols-4 gap-1.5">
                {SET.map((src, i) => (
                  <span key={src} className="relative block aspect-[3/2] overflow-visible">
                    <span className="relative block size-full overflow-hidden rounded-[5px]"><Image src={src} alt="" fill sizes="90px" className="object-cover" /></span>
                    {i === 1 && (
                      <>
                        <motion.span initial={false} animate={k === 6 ? { opacity: 1, transform: "translate(-50%, 0px)" } : { opacity: 0, transform: "translate(-50%, 6px)" }} transition={enter}
                          className="absolute -top-7 left-1/2 whitespace-nowrap rounded-[6px] bg-ink px-2 py-1 text-[9.5px] text-white shadow-raised">A touch brighter, please?</motion.span>
                        <motion.span initial={false} animate={{ opacity: k >= 7 ? 1 : 0 }} transition={{ duration: 0.3 }}
                          className="absolute inset-x-1 bottom-1 rounded bg-white/95 py-0.5 text-center text-[8.5px] font-medium text-green">Revised · free</motion.span>
                      </>
                    )}
                  </span>
                ))}
              </div>
              <div className="relative mt-2 h-7 overflow-hidden rounded-[6px] bg-sunk">
                <motion.div initial={false} animate={{ transform: `scaleX(${k >= 3 ? 1 : 0})` }} transition={{ duration: k >= 3 ? 0.9 : 0, ease: "linear" }} className="absolute inset-0 origin-left bg-ink" />
                <span className="relative grid h-full place-items-center text-[10.5px] font-medium text-white mix-blend-difference">
                  {k >= 4 ? "Downloaded · 42 photos" : k >= 3 ? "Downloading…" : "Download all"}
                </span>
              </div>
            </div>
          </div>
        </Win>
      </div>
      <Cursor x={pos[0]!} y={pos[1]!} down={k === 3 || k === 6} />
    </Mac>
  );
}
