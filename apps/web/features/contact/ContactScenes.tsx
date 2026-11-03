"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Mark } from "@techx/ui/Icons";
import { Canvas, SHADOW_SATELLITE, Shot, Story } from "@/features/illustrations/Canvas";
import { useSequence } from "@/features/illustrations/AnswerArt";
import { Cursor, Mac, Tick, Win } from "@/features/how-it-works/StepScenes";
import { Phone } from "@/features/stage-kit/phone";
import "@/features/stage-kit/tokens.css";
import { useLoop } from "@/features/motion/useLoop";
import { useSite } from "@/features/content/ContentProvider";

/* Contact channel cards on real devices (owner, 2026-11-03): WhatsApp and the call on a phone, email on the Mac. Same
   captions and lines as before (Figma 34:155). Each loops while its card is on screen (useLoop + useSequence); off
   screen, reduced motion and the server render show the finished frame.
   Framing (stageshow review, 2026-11-03): the phones are stageshow's iPhone (features/stage-kit, real iOS geometry, the
   screen laid out in points and scaled as a whole), large and pinned from the top, fading out at the foot over the
   caption instead of floating small in the tile. Every beat has content: nothing starts from an empty chat. The email
   card is the How it works Mac, framed by Shot. Transform / opacity / clip-path only. */

const OUT = [0.23, 1, 0.32, 1] as const;
const enter = { duration: 0.45, ease: OUT };
const show = (on: boolean, y = 8) => ({ opacity: on ? 1 : 0, transform: `translateY(${on ? 0 : y}px)` });
const ART = "h-[340px]";
const PHONE_W = 268;

/** A phone pinned a gutter from the top of the tile, running off the bottom, faded out at its foot over the caption. */
function PhoneShot({ story, dark = false, wallpaper, children }: { story: ReactNode; dark?: boolean; wallpaper?: string; children: ReactNode }) {
  return (
    <Canvas className={ART} story={story}>
      <div aria-hidden="true" className="ss-tokens absolute inset-x-0 top-0 h-full [mask-image:linear-gradient(to_bottom,#000_74%,transparent_94%)]">
        <div className="absolute left-1/2 top-6 -translate-x-1/2 drop-shadow-[0_24px_30px_rgb(50_50_93/0.22)]">
          <Phone width={PHONE_W} dark={dark} wallpaper={wallpaper}>{children}</Phone>
        </div>
      </div>
    </Canvas>
  );
}

const Avatar = ({ size = 36 }: { size?: number }) => (
  <span className="grid shrink-0 place-items-center rounded-full bg-ink" style={{ width: size, height: size }}><Mark className="scale-[0.7] brightness-0 invert" /></span>
);

/* ── 01 · WhatsApp on a phone ─────────────────────────────────────────────────────────────────────────────────── */
const CHAT_MS = [1100, 1300, 1400, 2800] as const;
// 0 the ask · 1 typing · 2 the reply · 3 the upload lands, hold
export function WhatsAppScene() {
  const { ref, play } = useLoop<HTMLDivElement>();
  const s = useSequence(CHAT_MS.length, CHAT_MS, play);
  // sizes in iOS points: the Phone scales the whole screen, so 16pt reads like a real chat
  const bubble = (me: boolean) => `max-w-[290px] rounded-[16px] px-3.5 py-2 text-[16px] leading-[1.3] text-[#111B21] shadow-[0_1px_0_rgb(10_10_11/0.08)] ${me ? "ml-auto rounded-tr-[5px] bg-[#D9FDD3]" : "rounded-tl-[5px] bg-white"}`;
  return (
    <div ref={ref}>
      <PhoneShot wallpaper="#EFEAE2" story={<Story steps={["Message the studio on WhatsApp", "An editor replies, not a bot", "Booked in. Upload when ready"]} at={s === 0 ? 0 : s <= 2 ? 1 : 2} />}>
        <div className="flex items-center gap-3 border-b border-black/5 bg-[#F6F5F3] px-4 pb-3 pt-1">
          <svg width="12" height="20" viewBox="0 0 8 12" className="text-[#128C7E]"><path d="M6.5 1 1.5 6l5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <Avatar />
          <span className="grid leading-tight">
            <span className="text-[17px] font-semibold text-[#111B21]">TechX studio</span>
            <span className="text-[13px] text-[#54656F]">{s === 1 ? "typing…" : "online"}</span>
          </span>
        </div>
        <div className="space-y-2 px-3.5 pt-4">
          <p className={bubble(true)}>Can you do twilights for three listings tonight?</p>
          {/* the typing dots sit in the reply's own slot, so the reply replaces them */}
          <div className="relative">
            <motion.div initial={false} animate={{ opacity: s === 1 ? 1 : 0 }} transition={{ duration: 0.15 }} className="absolute left-0 top-0 flex gap-1.5 rounded-[16px] rounded-tl-[5px] bg-white px-4 py-3.5">
              {[0, 1, 2].map((d) => <i key={d} className="size-2 rounded-full bg-[#8696A0]" />)}
            </motion.div>
            <motion.p initial={false} animate={show(s >= 2)} transition={enter} className={bubble(false)}>Yes. Upload by 9 PM and they&rsquo;re ready by 8 AM EST.</motion.p>
          </div>
          <motion.div initial={false} animate={show(s >= 3)} transition={enter} className="ml-auto w-[220px] rounded-[16px] rounded-tr-[5px] bg-[#D9FDD3] p-1.5 shadow-[0_1px_0_rgb(10_10_11/0.08)]">
            <span className="relative block h-[118px] overflow-hidden rounded-[12px]"><Image src="/photos/tx-twi.jpg" alt="" fill sizes="140px" className="object-cover" /></span>
            <span className="mt-1 flex items-center justify-end gap-1.5 px-1.5 text-[13px] text-[#54656F]">3 listings · 42 files<svg width="18" height="11" viewBox="0 0 16 10" aria-hidden="true" className="text-[#53BDEB]"><path d="M1 5.5l2.6 2.6L9 2.5M6.5 8.1L12.5 2.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
          </motion.div>
        </div>
      </PhoneShot>
    </div>
  );
}

/* ── 02 · Email on the Mac ────────────────────────────────────────────────────────────────────────────────────── */
const MAIL_MS = [600, 1000, 1100, 1000, 700, 600, 1500, 2600] as const;
// 0 the draft · 1 subject typed · 2 cursor drags files · 3 files attached · 4 to Send · 5 press · 6 sent, reply lands · 7 hold
const FILES = ["brackets_sample.zip", "style_notes.pdf"];
export function EmailScene() {
  const site = useSite();
  const { ref, play } = useLoop<HTMLDivElement>();
  const s = useSequence(MAIL_MS.length, MAIL_MS, play);
  const sent = s >= 6;
  const pos = s <= 1 ? [70, 250] : s === 2 ? [170, 176] : s === 3 ? [230, 182] : [346, 44];
  return (
    <div ref={ref}>
      <Canvas className={ART} story={<Story steps={["Write to the studio", "Attach anything you need", "Quotes and invoices come back"]} at={s <= 1 ? 0 : s <= 4 ? 1 : 2} />}>
        <Shot w={500} h={322} focus={[205, 150]} fill={[0.84, 0.86]} min={0.72} gutter={20}>
          <Mac app="Mail" menus={["File", "Edit", "View", "Message"]}>
            {/* the files on the desktop, before they're attached */}
            <motion.div initial={false} animate={{ opacity: s >= 3 ? 0 : 1 }} transition={{ duration: 0.2 }} className="absolute left-4 top-[214px] flex gap-3">
              {FILES.map((f) => (
                <span key={f} className="grid w-16 justify-items-center gap-1 text-center">
                  <span className="grid h-10 w-8 place-items-center rounded-[4px] bg-white text-[8px] font-medium text-ink-2 shadow-hair">{f.split(".")[1]!.toUpperCase()}</span>
                  <span className="w-full truncate text-[8.5px] text-ink-2">{f}</span>
                </span>
              ))}
            </motion.div>
            <motion.div initial={false} animate={sent ? { opacity: 0, transform: "translateY(-20px) scale(0.95)" } : { opacity: 1, transform: "translateY(0px) scale(1)" }} transition={{ duration: 0.45, ease: OUT }} className="absolute inset-0">
              <Win title="New message" className="left-[16px] top-[10px] h-[196px] w-[380px]">
                <div className="flex items-center justify-end border-b border-line px-3 py-1.5">
                  <motion.span initial={false} animate={{ transform: s === 5 ? "scale(0.94)" : "scale(1)" }} className="rounded-[6px] bg-ink px-3 py-1 text-[12px] font-medium text-white">Send</motion.span>
                </div>
                <div className="px-3 text-[12.5px]">
                  <p className="flex gap-2 border-b border-line py-1.5"><span className="w-12 text-ink-2">To:</span>{site.contact.email}</p>
                  <p className="flex gap-2 border-b border-line py-1.5"><span className="w-12 text-ink-2">Subject:</span>
                    <motion.span initial={false} className="font-medium" animate={{ clipPath: s >= 1 ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)" }} transition={{ duration: s >= 1 ? 0.8 : 0, ease: "linear" }}>Quote for 3 listings this week</motion.span>
                  </p>
                  <p className="pt-2 leading-snug text-ink-2">Hi team, three listings this week, about 40 photos each. Samples attached.</p>
                </div>
                <div className="absolute inset-x-3 bottom-3 flex gap-2">
                  {FILES.map((f, i) => (
                    <motion.span key={f} initial={false} animate={show(s >= 3, 4)} transition={{ ...enter, delay: s === 3 ? i * 0.08 : 0 }} className="rounded-[6px] bg-sunk px-2 py-1 font-mono text-[10.5px] text-ink-2">{f}</motion.span>
                  ))}
                </div>
              </Win>
            </motion.div>
            {/* the reply */}
            <motion.div initial={false} animate={show(sent, 10)} transition={enter} className={`absolute left-[30px] top-[64px] w-[330px] rounded-[12px] bg-surface p-4 ${SHADOW_SATELLITE}`}>
              <p className="flex items-center gap-2.5">
                <Avatar size={28} />
                <span className="text-[13px] leading-tight"><b className="block font-medium">Re: Quote for 3 listings</b><span className="text-ink-2">TechX studio · quote attached</span></span>
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 rounded-[6px] bg-sunk px-2 py-1 font-mono text-[11px] text-ink-2"><Tick size={14} />quote_3_listings.pdf</span>
            </motion.div>
            <Cursor x={pos[0]!} y={pos[1]!} down={s === 2 || s === 5}>
              <motion.span initial={false} animate={{ opacity: s === 2 ? 1 : 0 }} transition={{ duration: 0.15 }} className="absolute left-3 top-3 grid h-9 w-7 place-items-center rounded-[4px] bg-white text-[7px] font-medium text-ink-2 shadow-raised">ZIP</motion.span>
            </Cursor>
          </Mac>
        </Shot>
      </Canvas>
    </div>
  );
}

// the in-call buttons, drawn like the phone's own (24-unit grid, 1.75 stroke)
const CALL_BUTTONS: [string, ReactNode][] = [
  ["mute", <><path d="M9 9V5a3 3 0 0 1 5.6-1.5M15 9.5V11a3 3 0 0 1-4.3 2.7" /><path d="M19 11a7 7 0 0 1-1.2 3.9M5 11a7 7 0 0 0 10.8 5.9M12 18v3" /><path d="m4 4 16 16" /></>],
  ["keypad", <>{[6, 12, 18].flatMap((y) => [6, 12, 18].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r={1.4} fill="currentColor" stroke="none" />))}</>],
  ["speaker", <><path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4Z" /><path d="M15.5 9a4.5 4.5 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11" /></>],
];

/* ── 03 · Call on a phone, then book one for US hours ─────────────────────────────────────────────────────────── */
const CALL_MS = [900, 1300, 1300, 1300, 1400, 2600] as const;
// 0 calling · 1 ringing · 2 connected 00:04 · 3 00:12 · 4 booking sheet · 5 hold
export function CallScene() {
  const site = useSite();
  const { ref, play } = useLoop<HTMLDivElement>();
  const s = useSequence(CALL_MS.length, CALL_MS, play);
  const live = s >= 2;
  const sheet = s >= 4;
  return (
    <div ref={ref}>
      <PhoneShot dark wallpaper="linear-gradient(180deg,#2A2D34 0%,#15161A 60%)" story={<Story steps={["Call the studio directly", "Weekdays, 9 AM – 7 PM IST", "Or book a call for US hours"]} at={s <= 1 ? 0 : s <= 3 ? 1 : 2} />}>
        <div className="flex flex-col items-center pt-6 text-center text-white">
          <span className="relative grid place-items-center">
            {/* rings while it rings */}
            {[0, 1].map((r) => (
              <motion.span key={r} initial={false} className="absolute size-[88px] rounded-full border border-white/40"
                animate={s === 1 ? { opacity: [0.6, 0], transform: ["scale(1)", `scale(${1.5 + r * 0.35})`] } : { opacity: 0, transform: "scale(1)" }}
                transition={s === 1 ? { duration: 1.2, repeat: Infinity, delay: r * 0.4, ease: OUT } : { duration: 0.2 }} />
            ))}
            <span className="grid size-[88px] place-items-center rounded-full bg-white"><Mark className="scale-[1.7]" /></span>
          </span>
          <p className="mt-4 text-[28px] font-medium leading-[1.2] tracking-[-0.01em]">TechX studio</p>
          <p className="mt-1 text-[17px] leading-[1.35] tabular-nums text-white/70">{site.contact.phone}</p>
          <p className={`mt-1.5 text-[16px] leading-[1.35] tabular-nums ${live ? "text-[#30D158]" : "text-white/60"}`}>{s === 0 ? "calling…" : s === 1 ? "ringing…" : s === 2 ? "00:04" : "00:12"}</p>
        </div>
        <div className="absolute inset-x-0 top-[300px] grid grid-cols-3 justify-items-center px-10 text-white/80">
          {CALL_BUTTONS.map(([b, icon]) => (
            <span key={b} className="grid justify-items-center gap-1.5 text-[13px]">
              <span className="grid size-[72px] place-items-center rounded-full bg-white/15 text-white">
                <svg viewBox="0 0 24 24" className="size-8" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden>{icon}</svg>
              </span>{b}
            </span>
          ))}
        </div>
        {/* outside studio hours: book a call (rises into the visible part of the screen) */}
        <motion.div initial={false} animate={sheet ? { transform: "translateY(0%)" } : { transform: "translateY(110%)" }} transition={{ duration: 0.5, ease: OUT }}
          className="absolute inset-x-0 top-[246px] h-[640px] rounded-t-[28px] bg-white px-5 pt-3 text-ink">
          <span className="mx-auto mb-4 block h-[5px] w-10 rounded-full bg-line-2" />
          <p className="text-[20px] font-semibold">Book a call</p>
          <p className="mt-0.5 text-[15px] text-ink-2">For US hours. An editor calls you.</p>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[14px]">
            {["Tue 9:30 AM", "Tue 10:30 AM", "Wed 9:00 AM"].map((t, i) => (
              <span key={t} className={`rounded-[12px] py-2.5 ${i === 1 ? "bg-ink text-white" : "bg-sunk text-ink-2"}`}>{t}</span>
            ))}
          </div>
          <p className="mt-4 flex items-center gap-2 text-[15px] font-medium"><Tick size={18} />Booked · 10:30 AM ET</p>
        </motion.div>
      </PhoneShot>
    </div>
  );
}
