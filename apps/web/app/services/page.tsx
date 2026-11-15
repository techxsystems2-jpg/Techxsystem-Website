import type { ReactNode } from "react";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/content/seo";
import Link from "next/link";
import { buttonClass } from "@techx/ui/Button";
import { ArrowIcon } from "@techx/ui/Icons";
import { Compare } from "@/features/home/Compare";
import { Faq } from "@/features/home/Faq";
import { ServicesGrid } from "@/features/home/ServicesGrid";
import { FinalCta } from "@/features/site-shell/FinalCta";
import { HeroBadge, POINT_ICONS, Pointers, SkyHero } from "@/features/site-shell/SkyHero";
import { getContent, getSite } from "@/lib/content";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";

/* Services index. Not designed in Figma (only the per-service template, 28:155), so it's assembled from Home's
   verified parts in the shared page design: SkyHero, the six service cards (each opens its template page),
   "Why a team", the Home questions and the final CTA. */
export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return pageMetadata("services", {
  title: "Real estate photo editing services",
  description: `Photo editing and HDR, virtual twilight, staging, drone, floor plans and video from one studio. From ${site.startingPrice} an image. Try 10 photos free.`,
  alternates: { canonical: "/services" },
  });
}

const pointers: { text: string; icon: ReactNode }[] = [
  { text: "One order, one invoice", icon: POINT_ICONS.card },
  { text: "Back in 10–16 hours", icon: POINT_ICONS.clock },
  { text: "Every photo checked twice", icon: POINT_ICONS.shield },
];

export default async function Services() {
  const [site, services, faqs] = await Promise.all([getSite(), getContent("services"), getContent("faqs")]);
  return (
    <>
      <JsonLd data={breadcrumbSchema("/services")} />
      <SkyHero
        badge={<HeroBadge><span className="size-2 rounded-full bg-blue" aria-hidden="true" />{services.length} services · from {site.startingPrice} an image</HeroBadge>}
        lead="One team for every edit."
        rest="Send the whole shoot."
        lede="Photos, twilights, staging, drone, floor plans and video, edited by one studio and billed on one invoice."
      >
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 [--i:3]">
          <Link href="/free-trial" className={buttonClass("primary")}>Try 10 photos free <ArrowIcon className="transition-transform duration-200 group-hover:translate-x-0.5" /></Link>
          <Link href="/pricing" className={buttonClass("secondary")}>See prices</Link>
        </div>
        <Pointers items={pointers} className="[--i:4]" />
      </SkyHero>

      <h2 className="sr-only">All services</h2>
      <ServicesGrid head={false} />
      <Compare />
      <Faq faqs={faqs.home} />
      <FinalCta />
    </>
  );
}
