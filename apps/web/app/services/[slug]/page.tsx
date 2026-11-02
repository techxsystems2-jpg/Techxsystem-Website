import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Faq } from "@/features/home/Faq";
import { Pricing } from "@/features/home/Pricing";
import { SectionHead } from "@/features/home/SectionHead";
import { details, type Slug } from "@/features/services/data";
import { ServiceHero } from "@/features/services/ServiceHero";
import { Fixes, RecentWork } from "@/features/services/ServiceSections";
import { FinalCta } from "@/features/site-shell/FinalCta";
import { JsonLd, serviceSchema } from "@/lib/schema";
import { services } from "@/lib/site";

/* Services template (Figma node 28:155; copy in features/services/CONTEXT.md): one design for all six services.
   Hero with the service's film → what's included → the three levels (photo editing and drone) → recent work →
   questions → final CTA. Content per service: features/services/data.ts. */

type Props = { params: Promise<{ slug: string }> };

const find = (slug: string) => services.find((s) => s.slug === slug);

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = find((await params).slug);
  if (!s) return {};
  const d = details[s.slug];
  return {
    title: `${s.name}: ${s.from.toLowerCase()}`,
    description: `${s.line} ${s.from}, back in ${d.turnaround}, revisions free. Try 10 photos free.`,
    alternates: { canonical: `/services/${s.slug}` },
  };
}

export default async function Service({ params }: Props) {
  const s = find((await params).slug);
  if (!s) notFound();
  const slug: Slug = s.slug;
  const d = details[slug];
  return (
    <>
      <JsonLd data={serviceSchema(slug, d.lede)} />
      <ServiceHero slug={slug} lead={d.lead} rest={d.rest} lede={d.lede} turnaround={d.turnaround} pricesHref={d.levels ? "#levels" : "/pricing"} />
      <Fixes lead={d.fixes.lead} rest={d.fixes.rest} items={d.fixes.items} note={d.confirm} />

      {d.levels && (
        <div id="levels" className="scroll-mt-16 pt-24 md:pt-32">
          <div className="wrap"><SectionHead center label="Choose a level" lead="Three levels, one standard of care." rest="Pick per shoot, mix them in one order." /></div>
          <Pricing head={false} />
        </div>
      )}

      {d.work && <RecentWork cats={d.work} />}
      <Faq title={`About ${s.short.toLowerCase()}`} lede="Still unsure? Message the studio on WhatsApp. An editor replies." faqs={d.faqs} />
      <FinalCta lead="Try it on your own photos." rest="Ten images, free, back by morning." />
    </>
  );
}
