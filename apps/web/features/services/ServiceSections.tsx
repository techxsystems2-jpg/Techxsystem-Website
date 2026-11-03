import Image from "next/image";
import Link from "next/link";
import { buttonClass } from "@techx/ui/Button";
import { ArrowIcon } from "@techx/ui/Icons";
import { SectionHead } from "@/features/home/SectionHead";
import { RevealGroup, RevealItem } from "@/features/motion/Reveal";
import { shotsFor, toShots } from "@/features/work/portfolio";
import { getContent } from "@/lib/content";
import type { WorkCat } from "./data";

/** "What's included" (Figma 28:155): numbered fixes in a hairline grid, four across on desktop (three when the count is six), so no row ends early. */
export function Fixes({ lead, rest, items, note }: { lead: string; rest: string; items: { title: string; text: string }[]; note?: string }) {
  return (
    <section className="wrap pt-24 md:pt-32">
      <SectionHead label="What's included" lead={lead} rest={rest} />
      <RevealGroup as="ul" className={`grid gap-px overflow-hidden rounded-card bg-line shadow-hair sm:grid-cols-2 ${items.length % 4 ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}>
        {items.map(({ title: t, text: d }, i) => (
          <RevealItem as="li" key={t} className="bg-surface p-6 md:p-7">
            <span className="font-mono text-label text-maroon">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="mt-5 text-[17px] font-medium tracking-[-0.01em]">{t}</h3>
            <p className="mt-1.5 text-small text-ink-2">{d}</p>
          </RevealItem>
        ))}
      </RevealGroup>
      {note && <p className="mt-4 font-mono text-[12px] uppercase tracking-[0.04em] text-ink-2">{note}</p>}
    </section>
  );
}

/** "Recent work": three of TechX's finished edits in this service's category, with a link to the full gallery. */
export async function RecentWork({ cats }: { cats: string[] }) {
  const [work, all] = await Promise.all([getContent("work"), getContent("categories")]);
  const shots = shotsFor(cats, 3, toShots(work, all));
  return (
    <section className="wrap pt-24 md:pt-32">
      <SectionHead
        label="Recent work"
        lead="From our studio."
        rest="Finished edits, as they went back to the photographer."
        side={<Link href={cats[0] ? `/work?cat=${cats[0]}` : "/work"} className={buttonClass("secondary")}>See all work <ArrowIcon className="transition-transform duration-200 group-hover:translate-x-0.5" /></Link>}
      />
      <RevealGroup as="ul" className="grid gap-3 sm:grid-cols-3">
        {shots.map((s) => (
          <RevealItem as="li" key={s.src} className="rounded-card bg-surface p-1.5 shadow-hair">
            <div className={`relative aspect-[16/13] overflow-hidden rounded-inner outline-1 -outline-offset-1 outline-black/10 ${s.square ? "bg-white" : "bg-sunk"}`}>
              <Image src={s.src} alt={`${s.label} edit by TechX`} fill sizes="(min-width: 640px) 390px, 100vw" className={s.square ? "object-contain p-3" : "object-cover"} />
            </div>
            <p className="px-1.5 pb-0.5 pt-2.5 font-mono text-[11px] uppercase tracking-[0.04em] text-ink-2">{s.label}</p>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
