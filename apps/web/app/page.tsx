import { Answers } from "@/features/home/Answers";
import { Compare } from "@/features/home/Compare";
import { Faq } from "@/features/home/Faq";
import { Hero } from "@/features/home/Hero";
import { HowItWorks } from "@/features/home/HowItWorks";
import { LogoStrip } from "@/features/home/LogoStrip";
import { Pricing } from "@/features/home/Pricing";
import { WorkBand } from "@/features/home/WorkBand";
import { ServicesGrid } from "@/features/home/ServicesGrid";
import { Testimonials } from "@/features/home/Testimonials";
import { FinalCta } from "@/features/site-shell/FinalCta";
import { getContent } from "@/lib/content";

import type { Metadata } from "next";
import { pageMetadata } from "@/lib/content/seo";

// Own description and canonical (seo-technical, 2026-11-02): site.description runs past 160 characters for a snippet.
export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("home", {
  title: { absolute: "TechX Systems · Real estate photo editing, overnight" },
  description: "Real estate photo editing by hand. Send brackets tonight, get listing-ready photos by morning, checked twice. From $0.50 an image. Try 10 photos free.",
  alternates: { canonical: "/" },
});
}

// Section order and copy: features/home/CONTEXT.md (Figma node 26:155).
export default async function Home() {
  const [faqs, quotes] = await Promise.all([getContent("faqs"), getContent("testimonials")]);
  return (
    <>
      <Hero />
      <LogoStrip />
      <Answers />
      <ServicesGrid />
      <WorkBand />
      <HowItWorks />
      <Pricing />
      <Compare />
      <Testimonials quotes={quotes} />
      <Faq faqs={faqs.home} />
      <FinalCta />
    </>
  );
}
