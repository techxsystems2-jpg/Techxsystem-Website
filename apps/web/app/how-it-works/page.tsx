import type { ReactNode } from "react";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/content/seo";
import Link from "next/link";
import { buttonClass } from "@techx/ui/Button";
import { ArrowIcon } from "@techx/ui/Icons";
import { Overnight } from "@/features/home/HowItWorks";
import { StepRows } from "@/features/how-it-works/StepRows";
import { Reveal } from "@/features/motion/Reveal";
import { FinalCta } from "@/features/site-shell/FinalCta";
import { HeroBadge, POINT_ICONS, Pointers, SkyHero } from "@/features/site-shell/SkyHero";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";

/* How it works (Figma node 30:155; copy in features/how-it-works/CONTEXT.md), in the shared page design: SkyHero →
   the four steps as rows with their illustrations → the overnight timeline (Home's, New York and India) → files we
   accept and ways to send → final CTA. "Ways to send" lists what the site really takes today (upload, Dropbox or Google
   Drive link); Figma's client portal and WeTransfer are open items (docs/OPEN_ITEMS.md). */
export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("how-it-works", {
  title: "How it works: listing-ready by morning",
  description: "Four steps, and you only do the first. Upload your brackets, tell us your style once, we edit and check overnight, you download by morning. Revisions free.",
  alternates: { canonical: "/how-it-works" },
});
}

const pointers: { text: string; icon: ReactNode }[] = [
  { text: "Back in 10–16 hours", icon: POINT_ICONS.clock },
  { text: "Every photo checked twice", icon: POINT_ICONS.shield },
  { text: "Your files stay private", icon: POINT_ICONS.lock },
];

const files = ["CR2", "CR3", "NEF", "ARW", "DNG", "RAF", "JPEG", "TIFF"];
// an image file, same line weight as the upload and notes icons (owner, 2026-11-04)
const FILE_ICON = <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M8.5 17l2.5-3 2 2 1.5-1.5 2 2.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />;
// icons (owner, 2026-11-04): line icons for upload and notes; Dropbox and Drive marks (Simple Icons, CC0) in the same grey
const ways: [string, ReactNode][] = [
  ["Upload on our site", <path key="u" d="M12 15V4m-4 4 4-4 4 4M5 15v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />],
  ["Dropbox link", <path key="d" fill="currentColor" d="M6 1.807 0 5.629l6 3.822 6.001-3.822L6 1.807zM18 1.807l-6 3.822 6 3.822 6-3.822-6-3.822zM0 13.274l6 3.822 6.001-3.822L6 9.452l-6 3.822zM18 9.452l-6 3.822 6 3.822 6-3.822-6-3.822zM6 18.371l6.001 3.822 6-3.822-6-3.822L6 18.371z" />],
  ["Google Drive link", <path key="g" fill="currentColor" d="M12.01 1.485c-2.082 0-3.754.02-3.743.047.01.02 1.708 3.001 3.774 6.62l3.76 6.574h3.76c2.081 0 3.753-.02 3.742-.047-.005-.02-1.708-3.001-3.775-6.62l-3.76-6.574zm-4.76 1.73a789.828 789.861 0 0 0-3.63 6.319L0 15.868l1.89 3.298 1.885 3.297 3.62-6.335 3.618-6.33-1.88-3.287C8.1 4.704 7.255 3.22 7.25 3.214zm2.259 12.653-.203.348c-.114.198-.96 1.672-1.88 3.287a423.93 423.948 0 0 1-1.698 2.97c-.01.026 3.24.042 7.222.042h7.244l1.796-3.157c.992-1.734 1.85-3.23 1.906-3.323l.104-.167h-7.249z" />],
  ["Email or WhatsApp for notes", <path key="n" d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4A2.5 2.5 0 0 1 4 13.5Z" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />],
];

export default function HowItWorksPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema("/how-it-works")} />
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
        {([["Files we accept", files.map((f): [string, ReactNode] => [f, FILE_ICON])], ["Ways to send", ways]] as const).map(([label, items], k) => (
          <Reveal key={label} delay={k * 0.08}>
            <h2 className="font-mono text-label uppercase text-ink-2">{label}</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {items.map(([x, icon]) => (
                <li key={x} className="flex items-center gap-2 rounded-[8px] bg-surface px-3 py-2 text-[14px] font-medium shadow-hair">
                  {icon && <svg viewBox="0 0 24 24" className="size-4 shrink-0 text-ink-2" aria-hidden="true">{icon}</svg>}
                  {x}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </section>

      <FinalCta lead="Step one takes two minutes." rest="We'll do the rest tonight." />
    </>
  );
}
