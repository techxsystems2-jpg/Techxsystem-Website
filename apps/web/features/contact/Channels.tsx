"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowIcon } from "@techx/ui/Icons";
import { RevealGroup, RevealItem } from "@/features/motion/Reveal";
import { Spotlight } from "@/features/motion/Spotlight";
import { useSite } from "@/features/content/ContentProvider";
import { CallScene, EmailScene, WhatsAppScene } from "./ContactScenes";

/* Three ways in (Figma 34:155), built like the Home answer cards (owner, 2026-11-02: follow the Home design):
   Spotlight card, the channel acted out on a real device (ContactScenes.tsx, owner 2026-11-03), a maroon number + mono label, one line, the number or
   address, and a blue link pinned to the foot so the links line up. WhatsApp first (fastest), then Email, then Call.
   Email's address has a copy button (people often write from another device); "Book a call" opens WhatsApp with the
   request typed, because US hours fall outside the studio day. */

export function Channels() {
  const { contact } = useSite();
  const BOOK = `${contact.whatsappUrl}?text=${encodeURIComponent("Hi TechX, I'd like to book a call.")}`;
  return (
    <RevealGroup className="wrap mt-14 grid gap-3 md:grid-cols-2 lg:grid-cols-3 [&>*]:min-w-0">
      <Channel n="01" label="WhatsApp" art={<WhatsAppScene />} value={contact.whatsapp} href={contact.whatsappUrl} more="Open WhatsApp">
        The fastest way to reach the studio. An editor replies.
      </Channel>
      <Channel n="02" label="Email" art={<EmailScene />} value={contact.email} copy href={`mailto:${contact.email}`} more="Write an email">
        For quotes, invoices and anything with attachments.
      </Channel>
      <Channel n="03" label="Call" art={<CallScene />} value={contact.phone} valueHref={contact.phoneUrl} href={BOOK} more="Book a call" className="md:col-span-2 lg:col-span-1">
        {contact.hours}. Book a call for US hours.
      </Channel>
    </RevealGroup>
  );
}

function Channel({ n, label, art, value, valueHref, copy = false, href, more, className = "", children }: { n: string; label: string; art: ReactNode; value: string; valueHref?: string; copy?: boolean; href: string; more: string; className?: string; children: ReactNode }) {
  return (
    <RevealItem className={className}>
      <Spotlight className="flex h-full flex-col">
        {art}
        <div className="flex flex-1 flex-col px-4 pb-4 pt-6 md:px-5">
          <p className="mb-2.5 flex gap-2.5 font-mono text-label uppercase">
            <b className="font-medium text-maroon">{n}</b><span className="text-ink-2">{label}</span>
          </p>
          <h2 className="text-h4 tracking-[-0.015em]">{children}</h2>
          {/* the value sits above the card-wide link (z-30) so it can be tapped or copied on its own */}
          <p className="relative z-30 mt-3 flex items-center gap-2 font-mono text-[13px] text-ink">
            {valueHref ? <a href={valueHref} className="tap underline-offset-4 hover:text-blue-2 hover:underline">{value}</a> : <span className="select-all">{value}</span>}
            {copy && <CopyButton text={value} />}
          </p>
          <div className="mt-auto">
            <a href={href} rel="noopener" className="mt-4 inline-flex items-center gap-1.5 text-small font-medium text-blue-2 after:absolute after:inset-0 after:z-20 after:rounded-card">
              {more} <ArrowIcon size={14} className="transition-transform duration-200 group-hover/card:translate-x-[3px]" />
            </a>
          </div>
        </div>
      </Spotlight>
    </RevealItem>
  );
}

function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setDone(false), 1800);
    } catch {
      window.location.href = `mailto:${text}`; // no clipboard access: open the mail app instead
    }
  };
  return (
    <button type="button" onClick={copy} aria-label={done ? "Address copied" : "Copy address"}
      className="relative grid size-7 place-items-center rounded-input text-ink-2 transition-colors duration-150 hover:bg-sunk hover:text-ink active:scale-95">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.svg key={done ? "done" : "copy"} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
          className={done ? "text-green" : ""} initial={{ opacity: 0, scale: 0.6, filter: "blur(2px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} exit={{ opacity: 0, scale: 0.6 }} transition={{ type: "spring", bounce: 0, duration: 0.3 }}>
          {done ? <path d="M5 12.5l4.5 4.5L19 7.5" /> : <><rect x="8" y="8" width="12" height="12" rx="2.5" /><path d="M16 8V6.5A2.5 2.5 0 0 0 13.5 4h-7A2.5 2.5 0 0 0 4 6.5v7A2.5 2.5 0 0 0 6.5 16H8" /></>}
        </motion.svg>
      </AnimatePresence>
      <span role="status" className="sr-only">{done ? "Copied" : ""}</span>
    </button>
  );
}
