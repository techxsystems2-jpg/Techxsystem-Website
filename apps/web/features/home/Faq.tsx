"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Eyebrow } from "@techx/ui/Eyebrow";
import { buttonClass } from "@techx/ui/Button";
import { WhatsAppIcon } from "@techx/ui/Icons";
import { Reveal } from "@/features/motion/Reveal";
import { site } from "@/lib/site";

// First answer from Figma; the other four from the Direction B page until Figma has them (confirm with TechX).
const homeFaqs: readonly (readonly [string, string])[] = [
  ["How fast will I get my photos back?", "Within 12–24 hours. Send them by evening in the US or Australia and they're usually ready by morning."],
  ["Do I need to pay before you start?", "No. Your first 10 photos are free. After that you're billed monthly, only for photos we deliver."],
  ["What if I don't like an edit?", "Tell us what to change and we'll redo it free, usually the same day."],
  ["Are your edits MLS-compliant?", "Yes. We never change the property itself, and staged rooms are clearly labelled."],
  ["Which files do you accept?", "RAW (CR2, CR3, NEF, ARW, RAF), DNG, JPEG and TIFF. Brackets of 3, 5 or 7 are all fine."],
] as const;

const spring = { type: "spring", bounce: 0, duration: 0.45 } as const;

/** Questions block. Home uses the defaults; other pages pass their own heading, lede and questions (contact: Figma 34:155). */
export function Faq({ title = "Before you send your first shoot.", lede = "Still unsure? Message the studio on WhatsApp. An editor answers, not a bot.", faqs = homeFaqs }: { title?: string; lede?: string; faqs?: readonly (readonly [string, string])[] }) {
  const [open, setOpen] = useState(0);
  return (
    <section className="wrap grid gap-10 pt-28 md:grid-cols-[1fr_1.6fr] md:pt-40">
      <Reveal>
        <Eyebrow className="mb-4.5 block">Questions</Eyebrow>
        <h2 className="text-h2">{title}</h2>
        <p className="mt-4 max-w-[340px] text-ink-2">{lede}</p>
        <a href={site.contact.whatsappUrl} rel="noopener" className={buttonClass("whatsapp", "mt-6")}><WhatsAppIcon />Chat on WhatsApp</a>
      </Reveal>
      <Reveal delay={0.1}>
        {faqs.map(([q, a], i) => {
          const on = open === i;
          return (
            <div key={q} className="border-b border-line">
              <h3>
                <button type="button" aria-expanded={on} aria-controls={`faq-${i}`} onClick={() => setOpen(on ? -1 : i)} className="group flex w-full items-center justify-between gap-6 py-6 text-left text-[19px] font-medium tracking-[-0.01em]">
                  {q}
                  <span className="grid size-8 shrink-0 place-items-center rounded-full transition-[background-color,scale] duration-200 group-hover:bg-sunk group-active:scale-90 group-active:bg-sunk group-active:duration-100">
                    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                      <path d="M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      <motion.path d="M8 3v10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" animate={{ scaleY: on ? 0 : 1 }} transition={spring} style={{ originX: "50%", originY: "50%" }} />
                    </svg>
                  </span>
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {on && (
                  <motion.div id={`faq-${i}`} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={spring} className="overflow-hidden">
                    <motion.p initial={{ y: -6, filter: "blur(4px)" }} animate={{ y: 0, filter: "blur(0px)" }} transition={spring} className="max-w-[620px] pb-6 text-ink-2">{a}</motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </Reveal>
    </section>
  );
}
