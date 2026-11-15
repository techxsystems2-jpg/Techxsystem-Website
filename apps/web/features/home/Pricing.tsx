import Link from "next/link";
import { buttonClass } from "@techx/ui/Button";
import { ArrowIcon } from "@techx/ui/Icons";
import { RevealGroup, RevealItem } from "@/features/motion/Reveal";
import { SectionHead } from "./SectionHead";
import { getContent } from "@/lib/content";

/* Pricing (owner, 2026-11-02): layout after the owner's reference. Each level is a soft tray holding a raised header
   panel (name + who it's for), then the starting price, the trial button, a dotted rule, a mono "includes" label and the
   list. Colours follow the rest of the site (owner): white cards with the hairline shadow, a faint sky header panel;
   Signature is featured with the brand-blue moving edge and a blue-tint header. A full-width bulk-editing row sits underneath.
   Copy rewritten from TechX's own site (techxsystems.com): the fixes in each level are the old site's photo-editing
   list, split across the Figma levels; 12–24 h and 24/7 support are the old site's words. Every price is a starting
   price ("From"); Essential from $0.50 (owner). */
// Levels and the bulk row are admin-managed (lib/content, key "pricing"); defaults in lib/content/types.ts.

// Pikaicons (free pack) check-tick-circle, as used in HowItWorks
const Tick = ({ className = "" }: { className?: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`shrink-0 ${className}`}>
    <path d="m8.5 12.513 2.341 2.338A15 15 0 0 1 15.4 9.915l.101-.069M21.15 12a9.15 9.15 0 1 1-18.3 0 9.15 9.15 0 0 1 18.3 0Z" />
  </svg>
);

export async function Pricing({ head = true }: { head?: boolean }) {
  const { plans, bulk } = await getContent("pricing");
  return (
    <section id="pricing" className={`wrap ${head ? "pt-28 md:pt-40" : ""}`}>
      {head && <SectionHead center label="Pricing" lead="Pay for what we deliver." rest="No contract, no minimum." />}
      <RevealGroup className={`grid items-stretch gap-4 ${["", "lg:grid-cols-1", "lg:grid-cols-2", "lg:grid-cols-3", "md:grid-cols-2 xl:grid-cols-4"][plans.length] ?? "lg:grid-cols-3"}`}>
        {plans.map((p) => (
          // Signature keeps the site's featured treatment: the moving brand-blue edge (edge-glow), no heavy shadow
          <RevealItem key={p.name} className={`flex rounded-card ${p.featured ? "edge-glow p-[1.5px]" : ""}`}>
            <div className={`flex w-full flex-col rounded-[14.5px] bg-surface p-2 ${p.featured ? "" : "shadow-hair"}`}>
              <div className={`rounded-inner px-6 py-6 ${p.featured ? "bg-blue-tint" : "bg-[linear-gradient(180deg,#F6F9FF_0%,#FFFFFF_100%)] shadow-hair"}`}>
                <p className="flex items-center justify-between gap-3">
                  <span className="text-h4">{p.name}</span>
                  {p.featured && <span className="rounded-md bg-surface px-2 py-[3px] font-mono text-[11px] uppercase tracking-[0.04em] text-blue-2">Most chosen</span>}
                </p>
                <p className="mt-2 text-body text-ink-2">{p.who}</p>
              </div>
              <div className="flex flex-1 flex-col px-6 pb-6 pt-7">
                <p className="flex items-baseline gap-2">
                  <span className="text-small text-ink-2">From</span>
                  <span className="text-[48px] font-medium leading-none tabular-nums tracking-[-0.03em]">{p.price}</span>
                  <span className="text-small text-ink-2">/ image</span>
                </p>
                <Link href="/free-trial" className={buttonClass(p.featured ? "primary" : "secondary", "mt-7 w-full")}>
                  Start free trial {p.featured && <ArrowIcon className="transition-transform duration-200 group-hover:translate-x-0.5" />}
                </Link>
                <div className="mt-8 border-t border-dotted border-line-2" />
                <p className="mt-7 font-mono text-[11px] uppercase tracking-[0.06em] text-ink-2">{p.label}:</p>
                <ul className="mt-5 space-y-3.5">
                  {p.items.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-body text-ink"><Tick className={p.featured ? "text-blue-2" : "text-ink-3"} />{f}</li>
                  ))}
                </ul>
              </div>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>

      {/* Bulk editing: the enterprise row, full width under the levels, same card language */}
      <RevealGroup className="mt-4">
        <RevealItem className="grid gap-2 rounded-card bg-surface p-2 shadow-hair lg:grid-cols-[minmax(0,380px)_1fr]">
          <div className="flex flex-col rounded-inner bg-[linear-gradient(180deg,#F6F9FF_0%,#FFFFFF_100%)] p-6 shadow-hair">
            <h3 className="text-h4">Bulk editing</h3>
            <p className="mt-2 text-body text-ink-2">For studios and teams sending 500+ photos a month. Pricing built around your volume.</p>
            <Link href="/contact" className={buttonClass("secondary", "mt-6 w-full")}>Talk to the studio <ArrowIcon className="transition-transform duration-200 group-hover:translate-x-0.5" /></Link>
          </div>
          <ul className="grid content-center gap-x-10 gap-y-3.5 px-6 py-6 sm:grid-cols-2 md:px-10">
            {bulk.map((f) => (
              <li key={f} className="flex items-center gap-3 text-body text-ink"><Tick className="text-ink-3" />{f}</li>
            ))}
          </ul>
        </RevealItem>
      </RevealGroup>

      <p className="mt-6 text-center text-body text-ink-2">Prices are starting rates. Your final rate depends on the edit and volume, and you&rsquo;ll see it before we start.</p>
    </section>
  );
}
