import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowIcon } from "@techx/ui/Icons";
import { RevealGroup, RevealItem } from "@/features/motion/Reveal";
import { Spotlight } from "@/features/motion/Spotlight";
import { ContactArt, HowWeDoItArt, OptInArt, PricesArt, ProcessArt } from "@/features/illustrations/AnswerArt";
import { site } from "@/lib/site";
import { MorphCycle } from "@/features/motion/MorphCycle";
import { SectionHead } from "./SectionHead";
import { ScrollFill } from "@/features/motion/ScrollFill";

const questions = ["Who edits my photos?", "When do I get them back?", "What does it cost?", "How do I get started?", "Who do I talk to?"];

/** "Five answers, up front": the five things the site must never lose, each with a working illustration. */
export function Answers() {
  return (
    <section id="answers" className="wrap pt-28 md:pt-40">
      {/* The muted line morphs through the five questions photographers ask, one per card below, in their words (torph) */}
      <SectionHead center label="Before you decide" lead="Five answers, up front." rest={<span className="block min-h-[1.08em]"><MorphCycle items={questions} /></span>} />
      <RevealGroup className="grid gap-4 md:grid-cols-2 [&>*]:min-w-0">
        <Answer n="01" label="How we do it" href="/how-it-works" more="See how it works" art={<HowWeDoItArt />}>
          A trained editor works on your brackets. A second person checks every image before it reaches you.
        </Answer>
        <Answer n="02" label="Our process" href="/how-it-works" more="Follow an order" art={<ProcessArt />}>
          Upload after the shoot. We edit while you sleep, and the set is ready by morning.
        </Answer>
        <Answer n="03" label="Our prices" href="/pricing" more="See all prices" art={<PricesArt />}>
          From $0.50 an image. Three levels, mixed per shoot, billed only for photos we deliver.
        </Answer>
        <Answer n="04" label="How to start" href="/free-trial" more="Try 10 photos free" art={<OptInArt />}>
          Send ten photos free. No card, no contract. Judge us on your own shoot.
        </Answer>
        <RevealItem className="md:col-span-2">
          <Spotlight className="grid items-center md:grid-cols-[1fr_1.1fr] [&>*]:min-w-0">
            <div className="order-2 px-5 pb-5 pt-6 md:order-1 md:px-8">
              <Num n="05" label="How to contact" />
              <h3 className="text-h3">Talk to an editor, not a ticket. <ScrollFill text="WhatsApp, email or a call." /></h3>
              <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-3">
                <div><dt className="font-mono text-label uppercase text-ink-2">WhatsApp</dt><dd className="text-[15px] font-medium">+91 96530 59304</dd></div>
                <div><dt className="font-mono text-label uppercase text-ink-2">Email</dt><dd className="text-[15px] font-medium">{site.contact.email}</dd></div>
              </dl>
              <More href="/contact">All the ways to reach us</More>
            </div>
            <div className="order-1 md:order-2"><ContactArt /></div>
          </Spotlight>
        </RevealItem>
      </RevealGroup>
    </section>
  );
}

function Answer({ n, label, href, more, art, children }: { n: string; label: string; href: string; more: string; art: ReactNode; children: ReactNode }) {
  return (
    <RevealItem>
      <Spotlight className="h-full">
        {art}
        <div className="px-4 pb-4 pt-6 md:px-5">
          <Num n={n} label={label} />
          <h3 className="text-h4 tracking-[-0.015em]">{children}</h3>
          <More href={href}>{more}</More>
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
    <Link href={href} className="mt-4 inline-flex items-center gap-1.5 text-small font-medium text-blue after:absolute after:inset-0 after:z-20 after:rounded-card">
      {children} <ArrowIcon size={14} className="transition-transform duration-200 group-hover/card:translate-x-[3px]" />
    </Link>
  );
}
