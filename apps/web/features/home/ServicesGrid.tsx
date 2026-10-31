import Link from "next/link";
import { buttonClass } from "@techx/ui/Button";
import { Eyebrow } from "@techx/ui/Eyebrow";
import { ArrowIcon } from "@techx/ui/Icons";
import { Reveal, RevealGroup, RevealItem } from "@/features/motion/Reveal";
import { ServiceArt } from "@/features/service-art/ServiceArt";
import { services } from "@/lib/site";
import { ScrollFill } from "@/features/motion/ScrollFill";

/** Six services, each with its own short film of the edit, and its starting price. */
export function ServicesGrid() {
  return (
    <section id="services" className="wrap pt-28 md:pt-40">
      <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-8">
        <div>
          <Eyebrow className="mb-4.5 block">Services</Eyebrow>
          <h2 className="max-w-[720px] text-h2">One team for every edit. <ScrollFill text="Photos, twilights, staging, drone, plans and video. One order, one invoice." /></h2>
        </div>
        <Link href="/services" className={buttonClass("secondary")}>All services <ArrowIcon className="transition-transform duration-200 group-hover:translate-x-0.5" /></Link>
      </Reveal>
      <RevealGroup as="ul" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <RevealItem as="li" key={s.slug}>
            <Link href={`/services/${s.slug}`} className="group block rounded-card bg-surface p-2 shadow-hair transition-[box-shadow,translate] duration-[320ms] hover:-translate-y-1 hover:shadow-raised">
              <ServiceArt slug={s.slug} />
              <div className="px-3 pb-3 pt-4">
                <h3 className="text-h4">{s.name}</h3>
                <p className="mt-1 text-small text-ink-2">{s.line}</p>
                <p className="mt-4 flex items-center justify-between font-mono text-[13px]">
                  {s.from}
                  <span className="grid size-8 place-items-center rounded-full text-ink-3 transition-[background-color,color,translate] duration-200 group-hover:translate-x-0.5 group-hover:bg-blue group-hover:text-white"><ArrowIcon size={14} /></span>
                </p>
              </div>
            </Link>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
