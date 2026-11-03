import type { Metadata } from "next";
import { pageMetadata } from "@/lib/content/seo";
import { Channels } from "@/features/contact/Channels";
import { ContactHero } from "@/features/contact/ContactHero";
import { MessageForm } from "@/features/contact/MessageForm";
import { StudioCard } from "@/features/contact/StudioCard";
import { Faq } from "@/features/home/Faq";
import { SectionHead } from "@/features/home/SectionHead";
import { Reveal } from "@/features/motion/Reveal";
import { FinalCta } from "@/features/site-shell/FinalCta";
import { getContent, getSite } from "@/lib/content";

/* Contact (Figma node 34:155; copy in features/contact/CONTEXT.md). Built in the Home design language (owner,
   2026-11-02): the Home hero's sky and word-by-word headline, the answer-card bento with working illustrations,
   section heads with the scroll-filled muted half, the Home questions block and the final call to action. */
export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return pageMetadata("contact", {
  title: "Contact",
  description: `Talk to an editor on WhatsApp, by email or by phone. ${site.contact.whatsapp} · ${site.contact.email}. Ask about a shoot, a price or a style, any time of day.`,
  alternates: { canonical: "/contact" },
  });
}


export default async function Contact() {
  const { contact } = await getContent("faqs");
  return (
    <>
      <ContactHero />
      <Channels />

      <section className="wrap pt-28 md:pt-40">
        <SectionHead label="Write to the studio" lead="Prefer to write it down?" rest="Send a message, or plan around our hours." />
        <div className="grid items-stretch gap-3 md:grid-cols-[1.15fr_1fr]">
          <Reveal className="h-full"><MessageForm /></Reveal>
          <Reveal className="h-full" delay={0.08}><StudioCard /></Reveal>
        </div>
      </section>

      <Faq title="Before you write." lede="Still unsure? Message the studio on WhatsApp. An editor replies." faqs={contact} />
      <FinalCta />
    </>
  );
}
