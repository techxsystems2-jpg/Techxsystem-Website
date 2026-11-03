import Link from "next/link";
import { buttonClass } from "@techx/ui/Button";
import { ArrowIcon } from "@techx/ui/Icons";
import { Words } from "@/features/home/Hero";
import { ServiceVisual } from "@/features/service-art/ServiceVisual";
import type { Service } from "@/lib/content/types";
import type { Slug } from "./data";
import { ServiceTabs } from "./ServiceTabs";

/* Service hero (Figma 28:155): breadcrumb, two-tone H1 rising word by word, lede, two actions, then From · Turnaround ·
   Revisions; on the right the service's own before/after film (the Home service card art, larger). The Home sky sits
   behind it like every other page hero. Below: tabs to the other five services (ServiceTabs). "See prices" jumps to the levels on this page when it
   has them, else to /pricing. */
export function ServiceHero({ service: s, lead, rest, lede, turnaround, pricesHref }: { service: Service; lead: string; rest: string; lede: string; turnaround: string; pricesHref: string }) {
  const slug = s.slug as Slug;
  const leadWords = lead.split(" ").length;
  return (
    <section className="relative overflow-hidden pb-4 pt-20 md:pt-28">
      <div aria-hidden="true" className="hero-sky pointer-events-none absolute inset-0 overflow-hidden [mask-image:linear-gradient(to_bottom,#000_55%,transparent)]">
        <div className="absolute inset-0 bg-[radial-gradient(55%_50%_at_18%_10%,#D2ECFF,transparent_70%),radial-gradient(50%_50%_at_82%_14%,#D8EFFF,transparent_70%),linear-gradient(to_bottom,#EAF5FF,#F3F9FF_55%,transparent)]" />
        <div className="cloud absolute left-[4%] top-[6%] h-[240px] w-[520px] rounded-full bg-white/70 blur-[60px]" />
      </div>
      <div className="wrap relative grid items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
        <div>
          <nav aria-label="Breadcrumb" className="rise">
            <ol className="flex items-center gap-2 font-mono text-label uppercase text-ink-2 [--i:0]">
              <li><Link href="/services" className="hover:text-ink">Services</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-ink">{s.name}</li>
            </ol>
          </nav>
          <h1 className="mt-5 text-h1">
            <Words text={lead} from={1} />{" "}
            <Words text={rest} from={1 + leadWords} className="text-ink-3" />
          </h1>
          <div className="rise">
            <p className="mt-5 max-w-[520px] text-[17px] leading-[1.6] text-ink-2 md:text-[18px] [--i:2]">{lede}</p>
            <div className="mt-7 flex flex-wrap gap-2.5 [--i:3]">
              <Link href="/free-trial" className={buttonClass("primary")}>Try 10 photos free <ArrowIcon className="transition-transform duration-200 group-hover:translate-x-0.5" /></Link>
              <Link href={pricesHref} className={buttonClass("secondary")}>See prices</Link>
            </div>
            <dl className="mt-9 grid max-w-[460px] grid-cols-3 gap-4 border-t border-line pt-5 [--i:4]">
              {[["From", s.from.replace(/^From /, "")], ["Turnaround", turnaround], ["Revisions", "Free"]].map(([k, v]) => (
                <div key={k}>
                  <dt className="font-mono text-label uppercase text-ink-2">{k}</dt>
                  <dd className="mt-1.5 text-[15px] font-medium tabular-nums">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        {/* the photo is the page's LCP: it rises in place without the delayed fade (speed pass, 2026-11-03) */}
        <div className="rise">
          <div className="rise-in-place rounded-tray bg-surface p-1.5 shadow-raised [--i:2]">
            <ServiceVisual slug={s.slug} image={s.image} name={s.name} eager />
          </div>
        </div>
      </div>

      <ServiceTabs slug={slug} />
    </section>
  );
}
