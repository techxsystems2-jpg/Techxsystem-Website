import Image from "next/image";
import Link from "next/link";
import { buttonClass } from "@techx/ui/Button";
import { ArrowIcon } from "@techx/ui/Icons";
import { Reveal } from "@/features/motion/Reveal";
import { toShots } from "@/features/work/portfolio";
import { getContent } from "@/lib/content";
import { SectionHead } from "./SectionHead";

/* Real work on Home (impeccable bolder, owner 2026-11-04: "implement all"): between the hero and the testimonials Home
   showed cards and drawn screens only, so this band puts TechX's own finished edits at full strength. One large
   twilight beside one edit from each other category, from the admin's Work gallery; each opens Work on its category.
   Photos are 800 px wide, so no tile is drawn wider than that. Copy reuses the Work page's verified lines. */
const ORDER = ["twi", "int", "ext", "aer", "yacht"];

export async function WorkBand() {
  const [work, cats] = await Promise.all([getContent("work"), getContent("categories")]);
  const shots = toShots(work, cats);
  const picks = ORDER.map((c) => shots.find((s) => s.cat === c)).filter((s) => s !== undefined);
  if (picks.length < 3) return null;
  return (
    <section className="wrap pt-28 md:pt-40">
      <SectionHead
        label="Recent work"
        lead="Real shoots, edited by our studio."
        rest="Finished edits, as they went back to the photographer."
        side={<Link href="/work" className={buttonClass("secondary")}>See all {shots.length} edits <ArrowIcon className="transition-transform duration-200 group-hover:translate-x-0.5" /></Link>}
      />
      <Reveal>
        <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:grid-rows-2">
          {picks.map((s, i) => (
            <li key={s.src} className={i === 0 ? "col-span-2 lg:row-span-2" : ""}>
              <Link href={`/work?cat=${s.cat}`} className="group block h-full rounded-card bg-surface p-1.5 shadow-hair transition-[box-shadow,translate,scale] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-raised active:scale-[0.99]">
                <span className={`relative block h-full overflow-hidden rounded-inner bg-sunk outline-1 -outline-offset-1 outline-black/10 ${i === 0 ? "aspect-[16/13] lg:aspect-auto" : "aspect-[16/13]"}`}>
                  <Image src={s.src} alt={`${s.label} edit by TechX`} fill sizes={i === 0 ? "(min-width: 1024px) 590px, 100vw" : "(min-width: 1024px) 290px, 50vw"} className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]" />
                  <span className="absolute bottom-2.5 left-2.5 rounded-md bg-ink/70 px-2 py-1 font-mono text-[11px] uppercase tracking-[0.04em] text-white backdrop-blur-sm">{s.label}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
