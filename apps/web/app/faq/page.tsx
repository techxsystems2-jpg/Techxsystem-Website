import type { Metadata } from "next";
import { Faq } from "@/features/home/Faq";
import { FinalCta } from "@/features/site-shell/FinalCta";
import { HeroBadge, SkyHero } from "@/features/site-shell/SkyHero";
import { getContent } from "@/lib/content";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";

/* FAQ (owner, 2026-11-04): every question from the site in one place, grouped the way people ask them. The answers
   are the ones edited in the admin (Questions), so this page and the other pages never disagree. */
export const metadata: Metadata = {
  title: "Questions",
  description: "Turnaround, prices, files, revisions and the free trial: every question photographers ask TechX, answered.",
  alternates: { canonical: "/faq" },
};

export default async function FaqPage() {
  const faqs = await getContent("faqs");
  const count = faqs.home.length + faqs.pricing.length + faqs.contact.length + faqs.trial.length;
  return (
    <>
      <JsonLd data={breadcrumbSchema("/faq")} />
      <SkyHero
        badge={<HeroBadge><span className="size-2 rounded-full bg-blue" aria-hidden="true" />{count} questions</HeroBadge>}
        lead="Questions, answered."
        rest="Before you send your first shoot."
        lede="Turnaround, prices, files, revisions and the free trial. Can't find yours? An editor answers on WhatsApp."
      />
      <Faq title="The basics." lede="How it works, how fast, and what you send us." faqs={faqs.home} />
      <Faq title="Prices and billing." lede="Starting rates, levels and how you're billed." faqs={faqs.pricing} />
      <Faq title="The free trial." lede="Ten photos, edited free, no card." faqs={faqs.trial} />
      <Faq title="Reaching the studio." lede="Hours, visits and the paperwork." faqs={faqs.contact} />
      <FinalCta />
    </>
  );
}
