import Link from "next/link";
import { buttonClass } from "@techx/ui/Button";
import { ArrowIcon, CheckIcon } from "@techx/ui/Icons";
import { RevealGroup, RevealItem } from "@/features/motion/Reveal";
import { SectionHead } from "./SectionHead";

// Rates from Figma (open question in docs/OPEN_ITEMS.md: starting price "from $0.50" vs Essential $0.70).
const plans = [
  { name: "Essential", price: "$0.70", d: "HDR blend, colour, verticals and window pull. For everyday listings.", f: ["HDR blend and window pull", "Verticals and lens correction", "Free revisions"] },
  { name: "Signature", price: "$1.00", d: "Everything in Essential, plus sky swaps, lawn, fire and TV screens.", f: ["Everything in Essential", "Sky, lawn, fire and TV fill", "Saved style guide"], featured: true },
  { name: "Luxury", price: "$1.50", d: "Hand-masked blends and object removal, for high-end homes.", f: ["Everything in Signature", "Hand-masked blends", "Object removal"] },
];

const notes = [
  { t: "Per image", d: "Pick a level per shoot; mix levels in one order." },
  { t: "Monthly invoice", d: "Billed at month end, only for delivered photos." },
  { t: "Studios, 500+ a month", d: "Dedicated editor and volume pricing.", link: true },
];

export function Pricing() {
  return (
    <section id="pricing" className="wrap pt-28 md:pt-40">
      <SectionHead center label="Pricing" lead="Pay for what we deliver." rest="No contract, no minimum." />
      <RevealGroup className="grid items-stretch gap-4 lg:grid-cols-3">
        {plans.map((p) => (
          <RevealItem key={p.name} className={p.featured ? "edge-glow relative rounded-card p-[1.5px] shadow-[0_24px_60px_-24px_rgb(48_116_254/0.45)]" : ""}>
            <div className={`group flex h-full flex-col rounded-[26.5px] bg-surface p-8 transition-[box-shadow,translate] duration-[320ms] ${p.featured ? "" : "shadow-hair hover:-translate-y-1 hover:shadow-raised"}`}>
              <p className="flex items-center justify-between text-[17px] font-medium">
                {p.name}
                {p.featured && <span className="rounded-md bg-blue-tint px-2 py-[3px] font-mono text-[11px] uppercase tracking-[0.04em] text-blue">Most chosen</span>}
              </p>
              <p className="mt-6 flex items-baseline gap-2"><span className="text-[48px] font-medium tabular-nums tracking-[-0.03em]">{p.price}</span><span className="text-small text-ink-3">per image</span></p>
              <p className="mt-3 text-small text-ink-2">{p.d}</p>
              <Link href="/free-trial" className={buttonClass(p.featured ? "primary" : "secondary", "mt-6 w-full")}>Start free trial {p.featured && <ArrowIcon className="transition-transform duration-200 group-hover:translate-x-0.5" />}</Link>
              <ul className="mt-6 space-y-3 border-t border-line pt-6">
                {p.f.map((f) => <li key={f} className="flex items-center gap-2.5 text-small"><CheckIcon className="text-blue" />{f}</li>)}
              </ul>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
      <RevealGroup className="mt-4 grid gap-4 lg:grid-cols-3">
        {notes.map((n) => (
          <RevealItem key={n.t} className="rounded-[20px] bg-sunk px-6 py-5">
            <p className="text-[15px] font-medium">{n.t}</p>
            <p className="mt-1 text-small text-ink-2">{n.d} {n.link && <Link href="/contact" className="text-blue underline-offset-4 hover:underline">Talk to us</Link>}</p>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
