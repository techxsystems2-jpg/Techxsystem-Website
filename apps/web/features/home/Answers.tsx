import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowIcon } from "@techx/ui/Icons";
import { RevealGroup, RevealItem } from "@/features/motion/Reveal";
import { Spotlight } from "@/features/motion/Spotlight";
import { ContactArt, OptInArt, PricesArt, ProcessArt } from "@/features/illustrations/AnswerArt";
import { EditingArt } from "@/features/illustrations/EditorScreen";
import { getSite } from "@/lib/content";
import { MorphCycle } from "@/features/motion/MorphCycle";
import { SectionHead } from "./SectionHead";

// one per card, in the information map order: 01 how we do it · 02 process · 03 prices · 04 start · 05 contact
const questions = ["Who edits my photos?", "When do I get them back?", "What does it cost?", "How do I get started?", "Who do I talk to?"];

/** "Five answers, up front": the five things the site must never lose, each with a working illustration. */
export async function Answers() {
  const site = await getSite();
  return (
    <section id="answers" className="wrap pt-20 md:pt-28">
      {/* The muted line morphs through the five questions photographers ask, one per card below, in their words (torph) */}
      <SectionHead center label="Before you decide" lead="Five answers, up front." rest={<span className="block min-h-[1.08em]"><MorphCycle items={questions} /></span>} />
      {/* Compact bento (owner, 2026-11-02, after a reference): three cards over two, every card with its own animation.
          Order is the information map's and never changes (owner): 01 how we do it · 02 our process · 03 our prices ·
          04 how to start · 05 how to contact. Row 1: 01 editor · 02 New York / India · 03 invoice. Row 2: 04 ten photos ·
          05 WhatsApp chat. Tablet: two across, 03 full width; phone: one column, same order. */}
      <RevealGroup className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 [&>*]:min-w-0">
        <Answer n="01" label="How we do it" href="/how-it-works" more="See how it works" art={<EditingArt />}>
          A trained editor works on your brackets. A second person checks every image before it reaches you.
        </Answer>
        <Answer n="02" label="Our process" href="/how-it-works" more="Follow an order" art={<ProcessArt />}>
          Upload after the shoot. We edit while you sleep, and the set is ready by morning.
        </Answer>
        <Answer n="03" label="Our prices" href="/pricing" more="See all prices" art={<PricesArt />} className="md:col-span-2 lg:col-span-1">
          From $0.50 an image. Three levels, mixed per shoot, billed only for photos we deliver.
        </Answer>
        <div className="grid gap-3 md:col-span-2 md:grid-cols-2 lg:col-span-3 [&>*]:min-w-0">
          <Answer n="04" label="How to start" href="/free-trial" more="Try 10 photos free" art={<OptInArt />}>
            Send ten photos free. No card, no contract. Judge us on your own shoot.
          </Answer>
          <Answer n="05" label="How to contact" href="/contact" more="All the ways to reach us" art={<ContactArt />}
            detail={<>WhatsApp {site.contact.whatsapp} · {site.contact.email}</>}>
            Talk to an editor, not a ticket. WhatsApp, email or a call.
          </Answer>
        </div>
      </RevealGroup>
    </section>
  );
}

function Answer({ n, label, href, more, art, className = "", detail, children }: { n: string; label: string; href: string; more: string; art: ReactNode; className?: string; detail?: ReactNode; children: ReactNode }) {
  return (
    <RevealItem className={className}>
      <Spotlight className="flex h-full flex-col">
        {art}
        <div className="flex flex-1 flex-col px-4 pb-4 pt-6 md:px-5">
          <Num n={n} label={label} />
          <h3 className="text-h4 tracking-[-0.015em]">{children}</h3>
          {detail && <p className="mt-2 text-small text-ink-2">{detail}</p>}
          {/* pinned to the card foot so the links line up across a row */}
          <div className="mt-auto"><More href={href}>{more}</More></div>
        </div>
      </Spotlight>
    </RevealItem>
  );
}

function Num({ n, label }: { n: string; label: string }) {
  return (
    <p className="mb-2.5 flex gap-2.5 font-mono text-label uppercase">
      <b className="font-medium text-maroon">{n}</b><span className="text-ink-2">{label}</span>
    </p>
  );
}

/** The whole card is hoverable; the link itself stretches over it so the card is one target. */
function More({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="mt-4 inline-flex items-center gap-1.5 text-small font-medium text-blue-2 after:absolute after:inset-0 after:z-20 after:rounded-card">
      {children} <ArrowIcon size={14} className="transition-transform duration-200 group-hover/card:translate-x-[3px]" />
    </Link>
  );
}
