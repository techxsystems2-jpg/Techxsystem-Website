"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Eyebrow } from "@techx/ui/Eyebrow";
import { buttonClass } from "@techx/ui/Button";
import { WhatsAppIcon } from "@techx/ui/Icons";
import { Reveal } from "@/features/motion/Reveal";
import { useSite } from "@/features/content/ContentProvider";
import type { QA } from "@/lib/content/types";


const spring = { type: "spring", bounce: 0, duration: 0.45 } as const;

/** Questions block. Each page passes its own questions from the content store (lib/content, key "faqs"). */
export function Faq({ title = "Before you send your first shoot.", lede = "Still unsure? Message the studio on WhatsApp. An editor answers, not a bot.", faqs }: { title?: string; lede?: string; faqs: readonly QA[] }) {
  const site = useSite();
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
        {faqs.map(({ q, a }, i) => {
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
