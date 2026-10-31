import { RevealGroup, RevealItem } from "@/features/motion/Reveal";
import { SectionHead } from "./SectionHead";

// Placeholders until TechX supplies real, approved quotes. Never replace with invented ones.
const quotes = [
  { q: "[Real client quote about turnaround and quality.]", city: "Austin, TX" },
  { q: "[Real client quote about consistency across shoots.]", city: "Brisbane, QLD" },
  { q: "[Real client quote about service and communication.]", city: "Orlando, FL" },
];

export function Testimonials() {
  return (
    <section className="wrap pt-28 md:pt-40">
      <SectionHead label="Clients" lead="Photographers stay for years." rest="Here's why, in their words." />
      <RevealGroup className="grid gap-4 md:grid-cols-3">
        {quotes.map((t) => (
          <RevealItem key={t.city} className="rounded-card bg-surface p-7 shadow-hair transition-[box-shadow,translate] duration-[320ms] hover:-translate-y-1 hover:shadow-raised">
            <p className="text-[17px] leading-relaxed">&ldquo;{t.q}&rdquo;</p>
            <p className="mt-8 flex items-center gap-3">
              <span className="size-9 rounded-full bg-sunk" />
              <span className="text-small"><span className="block font-medium">Client name</span><span className="text-ink-2">Studio · {t.city}</span></span>
            </p>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
