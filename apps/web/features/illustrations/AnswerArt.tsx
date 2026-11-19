"use client";

import { type ReactNode, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import NumberFlow from "@number-flow/react";
import { Mark } from "@techx/ui/Icons";
import Image from "next/image";
import { useLoop } from "@/features/motion/useLoop";
import { Canvas, SHADOW_HERO, SHADOW_SATELLITE, Shot, Story } from "./Canvas";

/* The five must-keep answers, each acted out as a small working flow (features/illustrations/CONTEXT.md).
   Every flow runs only while on screen; off screen or under reduced motion it rests on its finished frame.
   stageshow review (2026-11-03): each composition is drawn at a real type size and shown whole by Shot (never below
   its design size on a wide card, scaled only when the card is narrower); the caption says each beat once, so the
   extra labels that repeated it (the "checked twice" bar, the "billed after delivery" stamp, the dashed "free trial"
   box) are gone; sans labels, monospace only for prices and times; no grey placeholder states. */

const spring = { type: "spring", bounce: 0, duration: 0.5 } as const;
const pop = { type: "spring", bounce: 0.35, duration: 0.5 } as const;

/** Steps through 0..length-1 while `play`, waiting `ms[k]` after step k, then loops. Starts on the finished frame. */
export function useSequence(length: number, ms: readonly number[], play: boolean) {
  const [step, setStep] = useState(length - 1);
  useEffect(() => {
    if (!play) return;
    let k = 0, passes = 0;
    let t: ReturnType<typeof setTimeout>;
    const tick = () => {
      setStep(k);
      if (k === length - 1 && ++passes >= 2) return; // two passes, then rest on the finished frame: looping art must stop (Web Interface Guidelines, 2026-11-04)
      t = setTimeout(tick, ms[k] ?? 900);
      k = (k + 1) % length;
    };
    t = setTimeout(tick, 200);
    return () => clearTimeout(t);
  }, [play, length, ms]);
  return step;
}

const Tick = ({ size = 18 }: { size?: number }) => (
  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={pop} className="grid shrink-0 place-items-center rounded-full bg-[#E7F6EE] text-green" style={{ width: size, height: size }}>
    <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
  </motion.span>
);
/* 01 · How we do it moved to EditorScreen.tsx (EditingArt, owner 2026-11-02); the stations version is in git history. */
// TechX's own finished edits, from the portfolio on the old site (techxsystems.com, docs/PHOTO_CREDITS.md)
const thumbs = ["tx-ext.jpg", "tx-int.jpg", "tx-twi.jpg", "tx-aer.jpg"] as const;
const RAW = "brightness(.68) contrast(.78) saturate(.5) sepia(.08)";
const Thumb = ({ name, raw = false, sizes = "140px" }: { name: string; raw?: boolean; sizes?: string }) => (
  <Image src={name.includes(".") ? `/photos/${name}` : `/photos/${name}.webp`} alt="" fill sizes={sizes} className="object-cover transition-[filter] duration-500" style={raw ? { filter: RAW } : undefined} />
);

/* 02 · Our process, two places on one screen (owner, 2026-10-31): the photographer in New York, the studio in India.
   The shoot leaves New York in the evening and lands in the studio inbox while India sleeps; at 9 AM IST the team reads
   the notes and edits; every image is checked twice (the editor, then the QC assigned to the account); the finished set
   flies back and New York wakes up to it. Both clocks run the whole way, so the time difference explains itself.
   New York times are the Figma ones (EDT); IST = ET + 9:30. Figma's "5:42 AM IST" read as New York time (OPEN_ITEMS).
   owner, 2026-11-19: the same night plays twice, New York then Sydney. Sydney's times are AEDT (IST + 5:30), so its
   shoot lands while the studio is open and is edited that evening, India time. */
const PROCESS_MS = [2400, 3000, 1600, 1600, 3200] as const;
const PLACES = [
  { city: "New York", zone: "ET", inbox: "Arrives overnight. Opened at 9 AM.", indiaNight: [0],
    story: ["7:02 PM: you upload before bed", "9:10 AM IST: we read your notes", "Check 1: your editor reviews it", "Check 2: your QC signs it off", "7:58 AM: your photos are ready"],
    clocks: [["7:02 PM", "4:32 AM"], ["11:40 PM", "9:10 AM"], ["3:50 AM", "1:20 PM"], ["5:42 AM", "3:12 PM"], ["7:58 AM", "5:28 PM"]] },
  { city: "Sydney", zone: "AET", inbox: "Arrives in studio hours. Opened at once.", indiaNight: [4],
    story: ["7:02 PM: you upload before bed", "2:10 PM IST: we read your notes", "Check 1: your editor reviews it", "Check 2: your QC signs it off", "6:58 AM: your photos are ready"],
    clocks: [["7:02 PM", "1:32 PM"], ["7:40 PM", "2:10 PM"], ["11:50 PM", "6:20 PM"], ["1:30 AM", "8:00 PM"], ["6:58 AM", "1:28 AM"]] },
] as const;
const PROCESS_ALL_MS = [...PROCESS_MS, ...PROCESS_MS];
const NIGHT = "bg-[linear-gradient(160deg,#1B2356,#2C2F66_60%,#3E3478)]";
const swap = { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -6 }, transition: { type: "spring", bounce: 0, duration: 0.35 } } as const;
const Moon = () => <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden="true"><path d="M10.5 1.5a6.5 6.5 0 104 11.2A5.8 5.8 0 0110.5 1.5z" fill="#C9D4FF" /></svg>;
const Sun = () => <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="3.4" fill="#F5B83D" /><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.4 1.4M11.6 11.6L13 13M3 13l1.4-1.4M11.6 4.4L13 3" stroke="#F5B83D" strokeWidth="1.4" strokeLinecap="round" /></svg>;

export function ProcessArt() {
  const { ref, play } = useLoop<HTMLDivElement>();
  const step = useSequence(PROCESS_ALL_MS.length, PROCESS_ALL_MS, play);
  const place = PLACES[step < PROCESS_MS.length ? 0 : 1];
  const s = step % PROCESS_MS.length;
  const nyNight = s < 4;
  const inNight = (place.indiaNight as readonly number[]).includes(s);
  const arc = "M78 40 Q174 -14 270 40";
  return (
    <div ref={ref}>
      <Canvas className="h-[292px]" story={<Story steps={[...place.story]} at={s} />}>
        <Shot w={348} h={206} mode="fit">
        <div className="relative h-[206px] w-[348px]">
          {/* the route between the two places, and the shoot travelling it: out at 0, back at 4 */}
          <svg viewBox="0 0 348 50" className="absolute inset-x-0 top-0 h-[50px] w-full overflow-visible" aria-hidden="true">
            <path d={arc} fill="none" stroke="#D5D9E0" strokeWidth="1.5" strokeDasharray="3 5" />
          </svg>
          {(s === 0 || s === 4) && (
            <motion.div key={s} className="absolute left-0 top-0 z-20 -ml-4 -mt-3 h-6 w-8 overflow-hidden rounded-md shadow-raised ring-2 ring-white" style={{ offsetPath: `path("${arc}")`, offsetRotate: "0deg" }}
              initial={{ offsetDistance: s === 0 ? "0%" : "100%", opacity: 0 }} animate={{ offsetDistance: s === 0 ? "100%" : "0%", opacity: [0, 1, 1, 0] }}
              transition={{ duration: 1.3, delay: s === 0 ? 0.9 : 0.2, ease: [0.77, 0, 0.175, 1] }}>
              <Thumb name="tx-ext.jpg" raw={s === 0} sizes="40px" />
            </motion.div>
          )}

          {/* the photographer: New York, then Sydney */}
          <Place className="left-0" city={place.city} zone={place.zone} time={place.clocks[s]![0]} night={nyNight}>
            <AnimatePresence mode="wait" initial={false}>
              {s === 0 && (
                <motion.div key="up" {...swap}>
                  <p className="text-[11px] font-medium">Uploading RAWs + notes</p>
                  <span className="mt-2 block h-1 overflow-hidden rounded-full bg-white/15">
                    <motion.span className="block h-full origin-left rounded-full bg-blue" initial={{ scaleX: 0.05 }} animate={{ scaleX: 1 }} transition={{ duration: 1, ease: [0.77, 0, 0.175, 1] }} />
                  </span>
                  <p className="mt-2 text-[10px] text-white/60">Notes: swap sky, pull windows</p>
                </motion.div>
              )}
              {s >= 1 && s <= 3 && (
                <motion.div key="sleep" {...swap} className="grid justify-items-center pt-1 text-center">
                  <span className="font-mono text-[15px] tracking-[0.2em] text-white/70">z<span className="text-[12px]">z</span><span className="text-[10px]">z</span></span>
                  <p className="mt-1 text-[11px] font-medium">You sleep.</p>
                  <p className="text-[9.5px] text-white/60">We edit.</p>
                </motion.div>
              )}
              {s === 4 && (
                <motion.div key="ready" {...swap}>
                  <div className="flex items-center gap-1.5"><Tick size={14} /><p className="text-[11px] font-semibold text-ink">Photos ready</p></div>
                  <div className="mt-2 grid grid-cols-4 gap-0.5">
                    {thumbs.map((t, i) => (
                      <motion.div key={t} className="relative h-[24px] overflow-hidden rounded" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 1.2 + i * 0.07 }}><Thumb name={t} sizes="40px" /></motion.div>
                    ))}
                  </div>
                  <p className="mt-1.5 text-[10px] text-ink-2">Edited, checked twice</p>
                </motion.div>
              )}
            </AnimatePresence>
          </Place>

          {/* India: the studio */}
          <Place className="right-0" city="India" zone="IST" time={place.clocks[s]![1]} night={inNight}>
            <AnimatePresence mode="wait" initial={false}>
              {s === 0 && (
                <motion.div key="inbox" {...swap}>
                  <motion.div className="flex items-center gap-1.5" initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} transition={{ delay: 2.1, duration: 0.3 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="M3.5 7l8.5 6 8.5-6" /></svg>
                    <p className="text-[11px] font-medium">Studio inbox</p>
                    <motion.span className="ml-auto rounded-full bg-blue px-1.5 text-[10px] font-medium text-white" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...pop, delay: 2.1 }}>1 new</motion.span>
                  </motion.div>
                  <p className={`mt-2 text-[9.5px] ${inNight ? "text-white/60" : "text-ink-2"}`}>{place.inbox}</p>
                </motion.div>
              )}
              {s >= 1 && (
                <motion.div key="studio" {...swap}>
                  <div className="relative h-[44px] overflow-hidden rounded-lg">
                    <Thumb name="tx-ext.jpg" raw sizes="150px" />
                    <motion.div className="absolute inset-0" initial={{ clipPath: s === 1 ? "inset(0 100% 0 0)" : "inset(0 0% 0 0)" }} animate={{ clipPath: "inset(0 0% 0 0)" }} transition={{ duration: 1.8, delay: 0.9, ease: [0.77, 0, 0.175, 1] }}>
                      <Thumb name="tx-ext.jpg" sizes="150px" />
                    </motion.div>
                    {s === 1 && (
                      <motion.span className="absolute left-1 top-1 rounded-full bg-white/90 px-1.5 py-px text-[8.5px] font-medium text-ink" initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 1, 0] }} transition={{ duration: 1.2, times: [0, 0.15, 0.8, 1] }}>Reading your notes</motion.span>
                    )}
                  </div>
                  <p className="mt-1.5 text-[10.5px] font-medium text-ink">{s === 1 ? "Editing your shoot" : s === 4 ? "Sent to you" : "Checking every image"}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </Place>

        </div>
        </Shot>
      </Canvas>
    </div>
  );
}

/** One side of the world: city, live clock, and the sky behind it (night fades to day by opacity). */
function Place({ city, zone, time, night, className, children }: { city: string; zone: string; time: string; night: boolean; className: string; children: ReactNode }) {
  return (
    <div className={`absolute top-[34px] h-[164px] w-[156px] overflow-hidden rounded-xl bg-[linear-gradient(170deg,#EAF5FF,#FFFFFF_70%)] ${SHADOW_SATELLITE} ${className}`}>
      <motion.div aria-hidden="true" className={`absolute inset-0 ${NIGHT}`} initial={false} animate={{ opacity: night ? 1 : 0 }} transition={{ duration: 0.8 }} />
      <div className={`relative p-2.5 transition-colors duration-700 ${night ? "text-white" : "text-ink"}`}>
        <div className="flex items-center gap-1.5">
          {night ? <Moon /> : <Sun />}
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={city} {...swap} className="text-[11px] font-semibold">{city}</motion.span>
          </AnimatePresence>
        </div>
        <p className="mt-1 font-mono text-[17px] font-medium tabular-nums tracking-[-0.02em]">
          {time} <span className={`text-[9px] ${night ? "text-white/60" : "text-ink-2"}`}>{zone}</span>
        </p>
        <div className="mt-2.5">{children}</div>
      </div>
    </div>
  );
}

/* 03 · Our prices, as a live invoice (owner, 2026-10-31): one listing, four photos, a level picked for each. The total
   counts up as each level lands, then the invoice is stamped "billed after delivery". Mixing levels, the running total
   and pay-for-what-we-deliver all read on one screen. Rates from Figma / the old site's price list. */
// owner, 2026-11-19: the front exterior lands at $1.00, then drops to its own rate, from $0.25 (step 1)
const PRICE_MS = [1100, 1500, 1300, 1300, 1300, 2800] as const;
const PRICE_STORY = ["Pick a level for each photo", "Front exteriors from $0.25", "Mix levels in one order", "Twilight from $1.00 an image", "Luxury for hand-masked blends", "Billed only after delivery"];
const lines = [
  { photo: "tx-ext.jpg", name: "Front exterior", level: "Exterior", price: 0.25 },
  { photo: "tx-int.jpg", name: "Main bathroom", level: "Essential", price: 0.5 },
  { photo: "tx-twi.jpg", name: "Pool deck", level: "Twilight", price: 1 },
  { photo: "tx-aer.jpg", name: "Aerial", level: "Luxury", price: 1.5 },
] as const;
const usd = { style: "currency", currency: "USD", minimumFractionDigits: 2 } as const;

export function PricesArt() {
  const { ref, play } = useLoop<HTMLDivElement>();
  const s = useSequence(PRICE_MS.length, PRICE_MS, play);
  const row = Math.max(s - 1, 0); // the row being priced; steps 0 and 1 are both the front exterior
  const done = s === PRICE_MS.length - 1;
  const priced = Math.min(row + 1, 4);
  const price = (i: number) => (i === 0 && s === 0 ? 1 : lines[i]!.price); // $1.00 before the exterior rate lands
  const total = lines.slice(0, priced).reduce((t, _, i) => t + price(i), 0);
  return (
    <div ref={ref}>
      <Canvas className="h-[292px]" story={<Story steps={PRICE_STORY} at={s} />}>
        <Shot w={300} h={226} mode="fit">
        <div className={`relative w-[300px] rounded-xl bg-surface p-3 ${SHADOW_HERO}`}>
          <div className="mb-2 flex items-center justify-between px-0.5">
            <span className="text-[11.5px] font-medium text-ink-2">Your listing</span>
            <span className="text-[11px] text-ink-2">4 photos · {done ? "billed after delivery" : "draft"}</span>
          </div>
          <div className="space-y-1">
            {lines.map((l, i) => {
              const on = i < priced;
              return (
                <div key={l.name} className={`relative flex items-center gap-2 rounded-lg px-1 py-1 transition-colors duration-300 ${i === row && !done ? "bg-blue-tint/60" : ""}`}>
                  <span className="relative h-7 w-10 shrink-0 overflow-hidden rounded-md"><Thumb name={l.photo} raw={!on} sizes="48px" /></span>
                  <span className="min-w-0 flex-1 truncate text-[11.5px] font-medium text-ink">{l.name}</span>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.span key="lvl" className={`rounded-full px-1.5 py-px text-[10.5px] font-medium ${l.level === "Twilight" ? "bg-maroon-tint text-maroon" : "bg-blue-tint text-blue-2"}`}
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={pop}>{l.level}</motion.span>
                    )}
                  </AnimatePresence>
                  <span className={`w-11 text-right font-mono text-[11px] tabular-nums ${on ? "text-ink" : "text-ink-3"}`}>{on ? <NumberFlow value={price(i)} format={usd} locales="en-US" /> : "—"}</span>
                  {i === row && !done && (
                    <motion.span className="pointer-events-none absolute right-12 top-3 z-10" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={spring}>
                      <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden="true"><path d="M1 1l4.5 11 1.6-4.4L11.5 6z" fill="#3074FE" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" /></svg>
                    </motion.span>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-line px-1 pt-2">
            <span className="text-[12px] font-semibold text-ink">Listing total</span>
            <span className="font-mono text-[14px] font-medium tabular-nums text-ink"><NumberFlow value={total} format={usd} locales="en-US" /></span>
          </div>

        </div>
        </Shot>
      </Canvas>
    </div>
  );
}

/* 04 · How to start, as a round trip (owner, 2026-10-31): ten photos fly from your stack into the free-trial drop zone
   (no card, no contract), then the edited ten come back underneath, so the whole trial reads on one screen.
   2026-11-03: the photos fly straight into the "Editing your ten" card; its thumbnails are the raw shots until they
   come back edited (never grey placeholders). */

/* 04 · How to start (owner, 2026-11-02: restored into the bento, same animation, sized to the card). */
const OPT_MS = [...Array.from({ length: 10 }, () => 300), 1200, 2800] as const;
const OPT_STORY = ["Send 10 photos, free", "No card, no contract", "Edited and back by morning", "Judge us on your own shoot"];

export function OptInArt() {
  const { ref, play } = useLoop<HTMLDivElement>();
  const s = useSequence(OPT_MS.length, OPT_MS, play);
  const sent = Math.min(s + 1, 10);
  const sending = play && s < 10;
  const back = s === 11;
  const beat = s < 5 ? 0 : s < 10 ? 1 : s === 10 ? 2 : 3;
  return (
    <div ref={ref}>
      <Canvas className="h-[292px]" story={<Story steps={OPT_STORY} at={beat} />}>
        <Shot w={320} h={214} mode="fit" max={1.06}>
        <div className="relative grid w-[320px] justify-items-center gap-5 pt-4">
          <div className="flex items-center">
            <div className="relative h-[92px] w-[120px]">
              {[0, 1, 2].map((i) => (
                <div key={i} className="absolute inset-0 overflow-hidden rounded-xl border-4 border-white shadow-raised transition-transform duration-[320ms] ease-[var(--ease-brand)] group-hover/card:[transform:rotate(var(--r))_translateX(var(--x))]"
                  style={{ transform: `rotate(${(i - 1) * 6}deg)`, ["--r" as string]: `${(i - 1) * 12}deg`, ["--x" as string]: `${(i - 1) * 14}px`, zIndex: i === 1 ? 3 : 1 }}>
                  <Thumb name={(["tx-int.jpg", "tx-ext.jpg", "tx-twi.jpg"] as const)[i]!} raw sizes="140px" />
                </div>
              ))}
              <span className="absolute -right-3 -top-3 z-10 rounded-full bg-ink px-2 py-1 text-[11px] font-medium tabular-nums text-white shadow-raised"><NumberFlow value={sent} locales="en-US" /> / 10 free</span>
              <AnimatePresence>
                {sending && (
                  <motion.div key={s} className="absolute inset-0 z-20 overflow-hidden rounded-xl border-4 border-white shadow-raised"
                    initial={{ x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }} animate={{ x: 0, y: 92, rotate: 4, scale: 0.4, opacity: 0 }} transition={{ duration: 0.45, ease: [0.77, 0, 0.175, 1] }}>
                    <Thumb name={thumbs[s % 4]!} raw sizes="140px" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          {/* the edited ten, back by morning */}
          <motion.div className={`w-full rounded-xl bg-surface p-2.5 ${SHADOW_HERO}`} initial={false} animate={{ scale: sending && s % 2 ? 1.02 : 1 }} transition={{ duration: 0.2 }}>
            <div className="mb-2 flex items-center gap-1.5">
              {back ? <Tick size={14} /> : <span className="block size-3.5 animate-spin rounded-full border-[1.5px] border-dashed border-blue [animation-duration:3s]" />}
              <span className="text-[11.5px] font-semibold text-ink">{back ? "10 / 10 edited, free" : "Editing your ten"}</span>
              <span className="ml-auto text-[11px] text-ink-2">{back ? "No card, no contract" : "Back by morning"}</span>
            </div>
            <div className="grid grid-cols-5 gap-1">
              {[...thumbs, "tx-ext.jpg"].map((t, i) => (
                <motion.div key={i} className="relative h-[34px] overflow-hidden rounded-md" initial={false} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: back ? i * 0.06 : 0 }}>
                  <Thumb name={t} raw={!back} sizes="64px" />
                  {i === 4 && <span className="absolute inset-0 grid place-items-center bg-ink/55 text-[11px] font-medium text-white">+6</span>}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        </Shot>
      </Canvas>
    </div>
  );
}

/* 05 · How to contact: a real exchange on WhatsApp, with the editor typing before the reply (copy from Figma). Framed as a
   chat window (studio, editor online, read ticks) with WhatsApp · Email · Call underneath, so every channel is in view. */
const CHAT_MS = [1100, 1300, 1400, 1300, 2600] as const;
const chat = [
  { me: false, text: "Can you do twilights for three listings tonight?" },
  { me: true, text: "Yes. Upload by 9 PM and they're ready by 8 AM EST." },
  { me: false, text: "Perfect. Uploading now." },
];
const Read = () => <svg width="14" height="10" viewBox="0 0 16 10" aria-hidden="true" className="ml-1 inline text-white/80"><path d="M1 5.5l2.6 2.6L9 2.5M6.5 8.1L12.5 2.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;

export function ContactArt() {
  const { ref, play } = useLoop<HTMLDivElement>();
  const s = useSequence(CHAT_MS.length, CHAT_MS, play);
  // 0 JM asks · 1 typing · 2 reply · 3 JM · 4 hold (the chat always has its first message: no empty beat)
  const shown = [1, 1, 2, 3, 3][s]!;
  return (
    <div ref={ref}>
      <Canvas className="h-[292px]" story={<Story steps={["Message the studio on WhatsApp", "An editor replies, not a bot", "Booked in. Upload when ready"]} at={s === 0 ? 0 : s <= 2 ? 1 : 2} />}>
        <Shot w={320} h={226} mode="fit" max={0.96}>
        <div className={`w-[320px] overflow-hidden rounded-xl bg-surface/80 backdrop-blur ${SHADOW_HERO}`}>
          <div className="flex items-center gap-2 border-b border-line bg-surface px-3 py-2">
            <span className="grid size-7 place-items-center rounded-full bg-ink"><Mark height={12} className="brightness-0 invert" /></span>
            <span className="grid leading-tight">
              <span className="text-[12px] font-semibold text-ink">TechX studio</span>
              <span className="flex items-center gap-1 text-[10.5px] text-ink-2"><span className="size-1.5 rounded-full bg-green" />{s === 1 ? "Editor typing…" : "Editor online"}</span>
            </span>
          </div>
          <div className="grid h-[132px] content-end gap-2 overflow-hidden p-2.5">
            <AnimatePresence initial={false}>
              {chat.slice(0, shown).map((m, i) => (
                <motion.div key={m.text} layout className={`flex items-end gap-2 ${m.me ? "justify-end" : ""}`} initial={{ opacity: 0, y: 10, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={pop}>
                  {!m.me && <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#E8D9C5] text-[10px] font-medium text-[#6B4A1F]">JM</span>}
                  <p className={`max-w-[230px] px-3 py-2 text-[12px] leading-snug ${m.me ? "rounded-[16px_16px_4px_16px] bg-blue-2 text-white shadow-[0_6px_16px_-6px_rgb(48_116_254/0.55)]" : "rounded-[16px_16px_16px_4px] bg-surface shadow-hair"}`}>
                    {m.text}{m.me && shown > i + 1 && <Read />}
                  </p>
                </motion.div>
              ))}
              {s === 1 && (
                <motion.div key="typing" layout className="flex justify-end" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={pop}>
                  <span className="flex gap-1 rounded-full bg-blue/10 px-3 py-2.5">
                    {[0, 1, 2].map((d) => <motion.i key={d} className="size-1.5 rounded-full bg-blue" animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }} transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.15 }} />)}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex gap-1.5 border-t border-line bg-surface px-3 py-2">
            {["WhatsApp", "Email", "Call"].map((c, i) => (
              <span key={c} className={`rounded-full px-2.5 py-1 text-[10.5px] font-medium ${i === 0 ? "bg-ink text-white" : "bg-sunk text-ink-2"}`}>{c}</span>
            ))}
            <span className="ml-auto self-center text-[10.5px] text-ink-2">An editor answers</span>
          </div>
        </div>
        </Shot>
      </Canvas>
    </div>
  );
}
