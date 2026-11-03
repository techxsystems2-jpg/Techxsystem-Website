import type { Metadata } from "next";
import Link from "next/link";
import { buttonClass } from "@techx/ui/Button";
import { ArrowIcon } from "@techx/ui/Icons";
import { Compare } from "@/features/home/Compare";
import { Reveal } from "@/features/motion/Reveal";
import { FinalCta } from "@/features/site-shell/FinalCta";
import { HeroBadge, SkyHero } from "@/features/site-shell/SkyHero";

/* TechX vs AI editors (owner, 2026-11-04). The comparison table is Home's (features/home/Compare.tsx); the two cards
   say plainly when an app is enough and when a team pays off. Facts only: what TechX's edits include (old site list),
   the second check, the turnaround and the price. Copy via marketing-skills:copywriting. */
export const metadata: Metadata = {
  title: "TechX vs AI photo editors",
  description: "AI apps edit a photo in seconds. A TechX editor works on your brackets and a second one checks every image, from $0.50 an image.",
  alternates: { canonical: "/techx-vs-ai-editors" },
};

const cards = [
  {
    title: "An AI app is enough when",
    items: ["You need one or two photos for a social post", "You have time to fix what it gets wrong", "Nobody will look closely at windows, skies or verticals"],
  },
  {
    title: "A team is worth it when",
    items: ["The listing goes live and buyers zoom in on every room", "You shoot several listings a week and can't check each image", "You want twilights, staging, floor plans or video in the same order"],
  },
];

export default function VsAi() {
  return (
    <>
      <SkyHero
        badge={<HeroBadge><span className="size-2 rounded-full bg-blue" aria-hidden="true" />From $0.50 an image</HeroBadge>}
        lead="TechX vs AI editors."
        rest="Fast is good. Checked is better."
        lede="AI apps edit a photo in seconds. Here's what an editor adds, a second check on every image, and when an app is all you need."
      />
      <Compare />
      <section className="wrap pt-20 md:pt-28">
        <div className="grid gap-3 md:grid-cols-2">
          {cards.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.06} className="h-full">
              <div className="h-full rounded-card bg-surface p-6 shadow-hair md:p-8">
                <h2 className="text-h4">{c.title}</h2>
                <ul className="mt-4 grid gap-2.5 text-ink-2">
                  {c.items.map((t) => <li key={t} className="flex gap-2.5"><span aria-hidden="true" className="mt-[9px] size-1.5 shrink-0 rounded-full bg-ink-3" />{t}</li>)}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-8 text-center">
          <Link href="/free-trial" className={buttonClass("primary")}>Compare on your own photos <ArrowIcon className="transition-transform duration-200 group-hover:translate-x-0.5" /></Link>
        </p>
        <p className="mt-3 text-center text-small text-ink-2">Send ten photos free. No card.</p>
      </section>
      <FinalCta />
    </>
  );
}
