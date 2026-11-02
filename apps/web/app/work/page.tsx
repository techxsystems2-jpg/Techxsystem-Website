import type { Metadata } from "next";
import Link from "next/link";
import { buttonClass } from "@techx/ui/Button";
import { ArrowIcon } from "@techx/ui/Icons";
import { Reveal } from "@/features/motion/Reveal";
import { FinalCta } from "@/features/site-shell/FinalCta";
import { HeroBadge, SkyHero } from "@/features/site-shell/SkyHero";
import { Gallery } from "@/features/work/Gallery";
import { portfolio } from "@/features/work/portfolio";

/* Work (Figma node 29:155; copy in features/work/CONTEXT.md), in the shared page design: SkyHero, the filterable
   gallery of TechX's 87 finished edits, final CTA. Figma's headline promises before/after pairs and credits named
   studios; TechX hasn't sent raw files or credits yet, so the page shows finished edits and says so (AGENTS.md rule 2). */
export const metadata: Metadata = {
  title: "Work: real estate photo edits",
  description: `${portfolio.length} finished edits from TechX's studio: interiors, exteriors, drone, yachts, twilights and floor plans. Try 10 photos of your own free.`,
  alternates: { canonical: "/work" },
};

export default function Work() {
  return (
    <>
      <SkyHero
        badge={<HeroBadge><span className="size-2 rounded-full bg-maroon" aria-hidden="true" />{portfolio.length} finished edits</HeroBadge>}
        lead="The work."
        rest="Real shoots, edited by our studio."
        lede="Interiors, exteriors, drone, yachts, twilights and floor plans, as they went back to the photographer."
      >
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 [--i:3]">
          <Link href="/free-trial" className={buttonClass("primary")}>Try 10 photos free <ArrowIcon className="transition-transform duration-200 group-hover:translate-x-0.5" /></Link>
          <Link href="/pricing" className={buttonClass("secondary")}>See prices</Link>
        </div>
      </SkyHero>

      <section className="wrap mt-14">
        <Reveal>
          <Gallery />
        </Reveal>
        {/* placeholder, visibly marked until TechX sends raw files (docs/OPEN_ITEMS.md) */}
        <p className="mx-auto mt-8 max-w-[560px] text-center font-mono text-[12px] uppercase tracking-[0.04em] text-ink-2">
          Side-by-side raw and edited pairs coming soon
        </p>
      </section>

      <FinalCta lead="Like what you see?" rest="Send us ten photos and judge your own." />
    </>
  );
}
