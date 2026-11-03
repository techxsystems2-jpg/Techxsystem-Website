import type { Metadata } from "next";
import { SectionHead } from "@/features/home/SectionHead";

/* Lab: test-only previews (owner, 2026-11-02: "create a preview in another page for testing only"). Nothing here is
   linked from the site, it's noindex and blocked in robots.txt, and it's not in the sitemap. Each idea waits here
   for the owner's yes before it moves into a real page. */
export const metadata: Metadata = {
  title: "Lab (test only)",
  robots: { index: false, follow: false },
};

// Proposals from the skill passes that change approved UI or an owner decision. Each: what, where, why.
const proposals = [
  // Still open after the owner's review on 2026-11-03 (the rest were applied to the site).
  ["Drop the \"Client logo\" placeholders", "Home logo strip", "Owner: keep them for now, revisit next time."],
  ["Hero trust badge: flags, the 4.9 source and the shine", "Home hero (approved)", "Owner: next run. Flags arrive at 60% with a fade instead of from nothing; show where 4.9 comes from; play the shine once."],
  ["A fuller Luxury level", "Pricing", "Needs TechX to say what Luxury really includes."],
  ["Short promo video", "Home or social", "A 15-second cut of the site's own UI (onetake skill)."],
] as const;

export default function Lab() {
  return (
    <>
      <section className="wrap pt-24 md:pt-32">
        <p className="font-mono text-label uppercase text-maroon">Lab · test only · not indexed</p>
        <h1 className="mt-4 max-w-[820px] text-h1">Previews waiting for your yes.</h1>
        <p className="mt-4 max-w-[620px] text-lede text-ink-2">Nothing on this page is live on the site. Look, decide, and tell me which ones to move into the real pages.</p>
      </section>

      <section className="wrap pt-24">
        <SectionHead label="Proposals" lead="What else could change." rest="Each needs your OK first." />
        <ol className="divide-y divide-line rounded-card bg-surface shadow-hair">
          {proposals.map(([t, where, why], i) => (
            <li key={t} className="grid gap-1 p-5 md:grid-cols-[2.5rem_1fr_1.2fr] md:gap-6 md:p-6">
              <span className="font-mono text-label text-maroon">{String(i + 1).padStart(2, "0")}</span>
              <span>
                <span className="block text-[16px] font-medium">{t}</span>
                <span className="mt-0.5 block text-small text-ink-2">{where}</span>
              </span>
              <span className="text-small text-ink-2">{why}</span>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
