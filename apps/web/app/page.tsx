import { Answers } from "@/features/home/Answers";
import { Compare } from "@/features/home/Compare";
import { Faq } from "@/features/home/Faq";
import { Hero } from "@/features/home/Hero";
import { HowItWorks } from "@/features/home/HowItWorks";
import { LogoStrip } from "@/features/home/LogoStrip";
import { Pricing } from "@/features/home/Pricing";
import { ServicesGrid } from "@/features/home/ServicesGrid";
import { Testimonials } from "@/features/home/Testimonials";
import { FinalCta } from "@/features/site-shell/FinalCta";

// Section order and copy: features/home/CONTEXT.md (Figma node 26:155).
export default function Home() {
  return (
    <>
      <Hero />
      <LogoStrip />
      <Answers />
      <ServicesGrid />
      <HowItWorks />
      <Pricing />
      <Compare />
      <Testimonials />
      <Faq />
      <FinalCta />
    </>
  );
}
