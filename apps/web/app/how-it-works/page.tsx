import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { buttonClass } from "@techx/ui/Button";
import { ArrowIcon } from "@techx/ui/Icons";
import { Overnight } from "@/features/home/HowItWorks";
import { StepRows } from "@/features/how-it-works/StepRows";
import { Reveal } from "@/features/motion/Reveal";
import { FinalCta } from "@/features/site-shell/FinalCta";
import { HeroBadge, POINT_ICONS, Pointers, SkyHero } from "@/features/site-shell/SkyHero";

/* How it works (Figma node 30:155; copy in features/how-it-works/CONTEXT.md), in the shared page design: SkyHero →
   the four steps as rows with their illustrations → the overnight timeline (Home's, New York and India) → files we
   accept and ways to send → final CTA. "Ways to send" lists what the site really takes today (upload, Dropbox or Google
   Drive link); Figma's client portal and WeTransfer are open items (docs/OPEN_ITEMS.md). */
export const metadata: Metadata = {
  title: "How it works: listing-ready by morning",
  description: "Four steps, and you only do the first. Upload your brackets, tell us your style once, we edit and check overnight, you download by morning. Revisions free.",
  alternates: { canonical: "/how-it-works" },
};

const pointers: { text: string; icon: ReactNode }[] = [
  { text: "Back in 12–24 hours", icon: POINT_ICONS.clock },
  { text: "Every photo checked twice", icon: POINT_ICONS.shield },
  { text: "Your files stay private", icon: POINT_ICONS.lock },
];

const files = ["CR2", "CR3", "NEF", "ARW", "DNG", "RAF", "JPEG", "TIFF"];
const ways = ["Upload on our site", "Dropbox link", "Google Drive link", "Email or WhatsApp for notes"];

export default function HowItWorksPage() {
  return (
    <>
      <SkyHero
        badge={<HeroBadge><span className="size-2 rounded-full bg-maroon" aria-hidden="true" />Four steps · you do the first</HeroBadge>}
        lead="From shoot to listing,"
        rest="while you sleep."
        lede="Four steps, and you only do the first one. Here's everything that happens between your upload and your download."
      >
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 [--i:3]">
          <Link href="/free-trial" className={buttonClass("primary")}>Start free trial <ArrowIcon className="transition-transform duration-200 group-hover:translate-x-0.5" /></Link>
          <Link href="/pricing" className={buttonClass("secondary")}>See prices</Link>
        </div>
        <Pointers items={pointers} className="[--i:4]" />
      </SkyHero>

      <section className="wrap mt-14">
        <StepRows />
        <Overnight />
      </section>

      <section className="wrap grid gap-10 pt-20 md:grid-cols-2 md:pt-28">
        {([["Files we accept", files], ["Ways to send", ways]] as const).map(([label, items], k) => (
          <Reveal key={label} delay={k * 0.08}>
            <h2 className="font-mono text-label uppercase text-ink-2">{label}</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {items.map((x) => (
                <li key={x} className="rounded-[8px] bg-surface px-3 py-2 text-[14px] font-medium shadow-hair">{x}</li>
              ))}
            </ul>
          </Reveal>
        ))}
      </section>

      <FinalCta lead="Step one takes two minutes." rest="We'll do the rest tonight." />
    </>
  );
}
