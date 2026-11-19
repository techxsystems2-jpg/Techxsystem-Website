import { Faq } from "@/features/home/Faq";
import { Pricing } from "@/features/home/Pricing";
import { SectionHead } from "@/features/home/SectionHead";
import { ServiceHero, ServiceSky } from "@/features/services/ServiceHero";
import { ServiceList } from "@/features/services/ServiceTabs";
import { Fixes, RecentWork } from "@/features/services/ServiceSections";
import { VideoWork } from "@/features/services/VideoWork";
import { FinalCta } from "@/features/site-shell/FinalCta";
import { getContent } from "@/lib/content";
import type { Service } from "@/lib/content/types";
import { JsonLd, serviceSchema } from "@/lib/schema";

/** The body of a service page, shared by the service template (app/services/[slug]) and the Photo editing options
    (app/services/[slug]/[option], owner 2026-11-19). `option` is set on an option page: it adds the breadcrumb step,
    and the schema URL and FAQ title follow it. */
export async function ServicePage({ service: s, option }: { service: Service; option?: { slug: string; label: string } }) {
  const { plans } = await getContent("pricing");
  return (
    <>
      <JsonLd data={serviceSchema(option ? { ...s, slug: `${s.slug}/${option.slug}`, name: option.label } : s, s.hero.lede)} />
      {/* Desktop: services list left, the page right (owner, 2026-11-14). Sections keep their own .wrap for phones;
          from xl (1280px; at 1024 the price cards were too tight) the outer wrap holds the grid and theirs is flattened so they fill the right column. */}
      <div className="relative">
      <ServiceSky />
      <div className="relative xl:wrap xl:grid xl:grid-cols-[184px_minmax(0,1fr)] xl:gap-12 xl:[&_.wrap]:max-w-none xl:[&_.wrap]:px-0">
      {/* divider down the list's column (owner, 2026-11-14); it starts with the content (top-28), not at the page top,
          so it doesn't run up through the see-through header and the logo */}
      <aside className="relative hidden pr-6 pt-28 before:absolute before:bottom-0 before:right-0 before:top-28 before:w-px before:bg-line-2 xl:block"><ServiceList slug={s.slug} /></aside>
      <div className="min-w-0">
      <ServiceHero service={s} option={option?.label} lead={s.hero.lead || s.name} rest={s.hero.rest} lede={s.hero.lede || s.line} turnaround={s.turnaround} pricesHref={s.levels ? "#levels" : "/pricing"} workHref={s.work.length > 0 ? "#work" : s.slug === "video-editing" ? "#videos" : "/work"} />
      {s.fixes.items.length > 0 && <Fixes lead={s.fixes.lead} rest={s.fixes.rest} items={s.fixes.items} note={s.note} />}

      {s.levels && (
        <div id="levels" className="scroll-mt-16 pt-24 md:pt-32">
          <div className="wrap"><SectionHead center label="Choose a level" lead={`${["One level", "Two levels", "Three levels", "Four levels"][plans.length - 1] ?? "Our levels"}, one standard of care.`} rest="Pick per shoot, mix them in one order." /></div>
          <Pricing head={false} />
        </div>
      )}

      {s.work.length > 0 && <RecentWork cats={s.work} />}
      {s.slug === "video-editing" && <VideoWork />}
      {s.faqs.length > 0 && <Faq title={`About ${option?.label ?? s.short.toLowerCase()}`} lede="Still unsure? Message the studio on WhatsApp. An editor replies." faqs={s.faqs} />}
      </div>
      </div>
      </div>
      <FinalCta contact lead="Tell us about your next shoot." rest="An editor replies, not a bot." />
    </>
  );
}
