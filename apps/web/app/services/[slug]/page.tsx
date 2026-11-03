import { Suspense } from "react";
import type { Metadata } from "next";
import { withSeo } from "@/lib/content/seo";
import { notFound } from "next/navigation";
import { Faq } from "@/features/home/Faq";
import { Pricing } from "@/features/home/Pricing";
import { SectionHead } from "@/features/home/SectionHead";
import type { WorkCat } from "@/features/services/data";
import { ServiceHero } from "@/features/services/ServiceHero";
import { Fixes, RecentWork } from "@/features/services/ServiceSections";
import { FinalCta } from "@/features/site-shell/FinalCta";
import { JsonLd, serviceSchema } from "@/lib/schema";
import { getContent, getItem } from "@/lib/content";
import { services } from "@/lib/site";

/* Services template (Figma node 28:155; copy in features/services/CONTEXT.md): one design for all six services.
   Hero with the service's film → what's included → the three levels (photo editing and drone) → recent work →
   questions → final CTA. Content per service: features/services/data.ts. */

type Props = { params: Promise<{ slug: string }> };

// slugs are fixed (routes); names, lines and prices come from the content store
const find = (slug: string) => getItem("services", slug);

// the six original services are prebuilt; services added in the admin render on their first visit, then stay cached
export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = await find((await params).slug);
  if (!s) return {};
  return withSeo({
    title: `${s.name}: ${s.from.toLowerCase()}`,
    description: `${s.line} ${s.from}, back in ${s.turnaround}, revisions free. Try 10 photos free.`,
    alternates: { canonical: `/services/${s.slug}` },
  }, s.seo);
}

// Suspense: services added in the admin aren't known at build time, so their address is read while the page streams.
// The fallback is taller than the screen, so the footer starts below the fold and nothing visible moves when the body
// streams in (speed pass 2026-11-03: at 80svh the footer showed, then jumped down: CLS 0.035).
export default function Service({ params }: Props) {
  return (
    <Suspense fallback={<div className="wrap min-h-[160svh] pt-36" aria-busy="true" />}>
      <ServiceBody params={params} />
    </Suspense>
  );
}

async function ServiceBody({ params }: Props) {
  const s = await find((await params).slug);
  if (!s) notFound();
  const { plans } = await getContent("pricing");
  return (
    <>
      <JsonLd data={serviceSchema(s, s.hero.lede)} />
      <ServiceHero service={s} lead={s.hero.lead || s.name} rest={s.hero.rest} lede={s.hero.lede || s.line} turnaround={s.turnaround} pricesHref={s.levels ? "#levels" : "/pricing"} />
      {s.fixes.items.length > 0 && <Fixes lead={s.fixes.lead} rest={s.fixes.rest} items={s.fixes.items} note={s.note} />}

      {s.levels && (
        <div id="levels" className="scroll-mt-16 pt-24 md:pt-32">
          <div className="wrap"><SectionHead center label="Choose a level" lead={`${["One level", "Two levels", "Three levels", "Four levels"][plans.length - 1] ?? "Our levels"}, one standard of care.`} rest="Pick per shoot, mix them in one order." /></div>
          <Pricing head={false} />
        </div>
      )}

      {s.work.length > 0 && <RecentWork cats={s.work} />}
      {s.faqs.length > 0 && <Faq title={`About ${s.short.toLowerCase()}`} lede="Still unsure? Message the studio on WhatsApp. An editor replies." faqs={s.faqs} />}
      <FinalCta lead="Try it on your own photos." rest="Ten images, free, back by morning." />
    </>
  );
}
