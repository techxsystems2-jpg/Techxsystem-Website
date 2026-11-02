import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@techx/ui/Icons";
import { Faq } from "@/features/home/Faq";
import { Pricing } from "@/features/home/Pricing";
import { SectionHead } from "@/features/home/SectionHead";
import { PricesArt } from "@/features/illustrations/AnswerArt";
import { Reveal, RevealGroup, RevealItem } from "@/features/motion/Reveal";
import { Spotlight } from "@/features/motion/Spotlight";
import { Calculator } from "@/features/pricing/Calculator";
import { FinalCta } from "@/features/site-shell/FinalCta";
import { HeroBadge, SkyHero } from "@/features/site-shell/SkyHero";
import { services, site } from "@/lib/site";

/* Pricing (Figma node 31:155; copy in features/pricing/CONTEXT.md), in the shared page design: SkyHero → the three
   levels and bulk row (Home's Pricing) → calculator → how billing works → the full price list → questions → final CTA.
   Figma's level prices ($0.70 / $0.75 / $1.50) and price-list ranges predate the owner's starting prices: every price
   here is "from", Essential from $0.50 (owner, 2026-11-02). Figma's "Pay per image / Studio plans" toggle is dropped:
   the bulk row under the levels already carries studio plans. */
export const metadata: Metadata = {
  title: "Pricing: from $0.50 an image",
  description: `Real estate photo editing from ${site.startingPrice} an image. Three levels, no contract, no minimum, billed monthly for delivered photos only. Revisions free.`,
  alternates: { canonical: "/pricing" },
};

// Turnarounds from the Figma price list; staging price is a placeholder to confirm (lib/site.ts).
const turnaround: Record<string, string> = {
  "photo-editing": "12–24 h", "virtual-twilight": "12–24 h", "virtual-staging": "24 h",
  "drone-editing": "12–24 h", "floor-plans": "24 h", "video-editing": "24–48 h",
};
const tag: Record<string, string> = { "photo-editing": "Most ordered", "virtual-staging": "New" };

const billing = [
  ["Per image", "Pick a level per shoot, and mix levels in one order."],
  ["Monthly invoice", "Billed at month end, only for delivered photos."],
  ["Revisions", "Always free, usually back the same day."],
] as const;

// Answer 1 from Figma; 2 and 4 restate the page's own terms; 3 is an open claim to confirm (docs/OPEN_ITEMS.md).
const faqs = [
  ["When am I charged?", "At the end of each month, only for photos we delivered. Your first 10 are free."],
  ["Do you charge for revisions?", "No. Ask for a change on any image and we'll redo it free, usually the same day."],
  ["Which payment methods do you take?", "Card, PayPal or bank transfer."],
  ["Is there a minimum order?", "No. Send one photo or a thousand. Studios sending 500+ a month can talk to us about volume pricing."],
] as const;

export default function PricingPage() {
  return (
    <>
      <SkyHero
        badge={<HeroBadge><span className="size-2 rounded-full bg-blue" aria-hidden="true" />From {site.startingPrice} an image · first 10 free</HeroBadge>}
        lead="Pay for what we deliver."
        rest="No contract, no minimum."
        lede="Choose a level per shoot. You're billed at month end, only for the photos we delivered."
      />

      <h2 className="sr-only">Editing levels</h2>
      <div className="pt-8"><Pricing head={false} /></div>

      <section className="wrap pt-24 md:pt-32">
        <SectionHead label="Calculator" lead="Work out a month in seconds." rest="Using our starting rates." />
        <Reveal><Calculator /></Reveal>
      </section>

      <section className="wrap grid items-center gap-10 pt-24 md:pt-32 lg:grid-cols-2 lg:gap-14">
        <Reveal className="min-w-0"><Spotlight><PricesArt /></Spotlight></Reveal>
        <div>
          <SectionHead label="How billing works" lead="You see the price before we start." rest="Every order shows its total." />
          <RevealGroup as="ul" className="-mt-4 divide-y divide-line border-t border-line">
            {billing.map(([t, d], i) => (
              <RevealItem as="li" key={t} className="flex gap-4 py-5">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-sunk font-mono text-[12px] text-maroon">{i + 1}</span>
                <span>
                  <span className="block text-[17px] font-medium tracking-[-0.01em]">{t}</span>
                  <span className="mt-0.5 block text-small text-ink-2">{d}</span>
                </span>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="wrap pt-24 md:pt-32">
        <SectionHead label="Every service" lead="The full price list." rest="Mix any of these in one order." />
        <Reveal className="overflow-x-auto rounded-card bg-surface shadow-hair">
          <table className="w-full min-w-[560px] text-left">
            <thead>
              <tr className="border-b border-line font-mono text-label uppercase text-ink-2">
                <th scope="col" className="px-5 py-4 font-normal md:px-6">Service</th>
                <th scope="col" className="px-5 py-4 font-normal">Price</th>
                <th scope="col" className="px-5 py-4 font-normal">Turnaround</th>
                <th scope="col" className="px-5 py-4"><span className="sr-only">Details</span></th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.slug} className="group border-b border-line last:border-b-0">
                  <th scope="row" className="px-5 py-5 font-medium md:px-6">
                    <Link href={`/services/${s.slug}`} className="hover:text-blue">{s.name}</Link>
                    {tag[s.slug] && <span className={`ml-3 rounded-md px-1.5 py-0.5 align-middle font-mono text-[10.5px] uppercase tracking-[0.04em] ${s.slug === "virtual-staging" ? "bg-blue-tint text-blue" : "bg-sunk text-ink-2"}`}>{tag[s.slug]}</span>}
                  </th>
                  <td className="px-5 py-5 tabular-nums text-ink-2">{s.from}</td>
                  <td className="px-5 py-5 tabular-nums text-ink-2">{turnaround[s.slug]}</td>
                  <td className="px-5 py-5 text-right">
                    <Link href={`/services/${s.slug}`} aria-label={`${s.name} details`} className="inline-grid size-9 place-items-center rounded-full text-ink-3 transition-colors duration-200 hover:bg-blue hover:text-white"><ArrowIcon size={14} /></Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
        <p className="mt-4 text-small text-ink-2">Prices in USD. Starting prices: the final rate depends on the type and volume of work, and we confirm it before we start. Revisions are always free.</p>
      </section>

      <Faq title="Questions about pricing" lede="Still unsure? Message the studio on WhatsApp. An editor replies." faqs={faqs} />
      <FinalCta lead="Not sure which level?" rest="Send ten photos and we'll suggest one." />
    </>
  );
}
