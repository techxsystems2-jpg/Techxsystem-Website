import type { ReactNode } from "react";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/content/seo";
import { TrialForm } from "@/features/free-trial/TrialForm";
import { Faq } from "@/features/home/Faq";
import { Testimonials } from "@/features/home/Testimonials";
import { OptInArt } from "@/features/illustrations/AnswerArt";
import { Reveal } from "@/features/motion/Reveal";
import { Spotlight } from "@/features/motion/Spotlight";
import { HeroBadge, POINT_ICONS, Pointers, SkyHero } from "@/features/site-shell/SkyHero";
import { getContent, getSite } from "@/lib/content";
import { buttonClass } from "@techx/ui/Button";
import { WhatsAppIcon } from "@techx/ui/Icons";

/* Free trial (Figma node 32:155; copy in features/free-trial/CONTEXT.md), in the design every page uses (owner,
   2026-11-02): the shared SkyHero, then the form card beside a Home answer card (the "ten photos" illustration, maroon
   numbers for the three steps), the real client quotes from Home (Figma has placeholders) and "About the trial".
   No final CTA block: the page itself is the call to action. */
export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("free-trial", {
  title: "Free trial: 10 photos edited free",
  description: "Send ten photos or brackets. No card, no contract. Edited by hand, checked twice and back within 24 hours.",
  alternates: { canonical: "/free-trial" },
});
}

// Figma ticks under the button, plus Home's "checked twice" pointer
const pointers: { text: string; icon: ReactNode }[] = [
  { text: "No card, no contract", icon: POINT_ICONS.card },
  { text: "Back in 24 hours", icon: POINT_ICONS.clock },
  { text: "Every photo checked twice", icon: POINT_ICONS.shield },
  { text: "Your files stay private", icon: POINT_ICONS.lock },
];

const steps = [
  ["You upload", "Ten photos or brackets. Two minutes."],
  ["We edit tonight", "Back within 24 hours, with a link by email."],
  ["You decide", "Request changes, set your style, or walk away."],
] as const;


export default async function FreeTrial() {
  const [site, faqs, quotes] = await Promise.all([getSite(), getContent("faqs"), getContent("testimonials")]);
  return (
    <>
      <SkyHero
        badge={<HeroBadge><span className="size-2 rounded-full bg-blue" aria-hidden="true" />{site.announcement.text}</HeroBadge>}
        lead="Send ten photos." rest="Judge the result."
        lede={<>No card, no contract. If you like the edits, keep sending. If you don&rsquo;t, you&rsquo;ve lost nothing but two minutes.</>}>
        <Pointers items={pointers} className="[--i:3]" />
      </SkyHero>

      {/* Two columns of equal height (owner, 2026-11-02): the cards stretch to the taller one; on the right the steps
          spread over the spare height and a WhatsApp line sits at the foot, so neither card ends early. */}
      <section className="wrap mt-14 grid items-start gap-3 lg:grid-cols-[1.2fr_1fr]">
        <Reveal className="h-full"><TrialForm /></Reveal>
        {/* the steps keep their own spacing and the card stays beside the form as it scrolls (stageshow review,
            2026-11-03: stretched to the form's height, the three steps were spread far apart) */}
        <Reveal delay={0.08} className="lg:sticky lg:top-24">
          {/* a Home answer card: illustration on the dotted canvas, then the mono label and maroon-numbered steps */}
          <Spotlight className="flex flex-col">
            <OptInArt />
            <div className="flex flex-col px-4 pb-3 pt-6 md:px-5">
              <p className="mb-1 font-mono text-label uppercase text-ink-2">How the trial works</p>
              <ol className="flex flex-col divide-y divide-line">
                {steps.map(([t, d], i) => (
                  <li key={t} className="flex gap-3.5 py-4">
                    <b className="pt-px font-mono text-label font-medium text-maroon">0{i + 1}</b>
                    <span>
                      <span className="block text-[17px] font-medium tracking-[-0.01em]">{t}</span>
                      <span className="mt-0.5 block text-small text-ink-2">{d}</span>
                    </span>
                  </li>
                ))}
              </ol>
              <div className="relative z-20 mt-3 flex flex-wrap items-center justify-between gap-3 rounded-inner bg-sunk p-4">
                <span>
                  <span className="block text-[15px] font-medium">Questions before you send?</span>
                  <span className="block text-small text-ink-2">An editor replies on WhatsApp.</span>
                </span>
                <a href={site.contact.whatsappUrl} rel="noopener" className={buttonClass("whatsapp", "", "sm")}><WhatsAppIcon size={15} />Chat on WhatsApp</a>
              </div>
            </div>
          </Spotlight>
        </Reveal>
      </section>

      <Testimonials quotes={quotes} />
      <Faq title="About the trial." lede="Still unsure? Message the studio on WhatsApp. An editor replies." faqs={faqs.trial} />
    </>
  );
}
