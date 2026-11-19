import { Suspense } from "react";
import type { Metadata } from "next";
import { withSeo } from "@/lib/content/seo";
import { notFound } from "next/navigation";
import { getItem } from "@/lib/content";
import { ServicePage } from "@/features/services/ServicePage";
import { services } from "@/lib/site";

/* Services template (Figma node 28:155; copy in features/services/CONTEXT.md): one design for all six services.
   Desktop: a sticky services list on the left, the page on the right. Hero with the service's film → what's included → the three levels (photo editing and drone) → recent work →
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
  return <ServicePage service={s} />;
}
