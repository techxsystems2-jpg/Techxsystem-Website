import { COUNTRIES, type Office } from "@/lib/content/types";
import { Spotlight } from "@/features/motion/Spotlight";
import { Reveal } from "@/features/motion/Reveal";
import { SectionHead } from "@/features/home/SectionHead";

/* Offices (owner, 2026-11-03: "on the contact us page add that"), from TechX's current site; edited in the admin under
   Site facts → Offices. One card per office in the Home card style: mono label, city, the address as a real <address>,
   numbers that dial on a tap, and directions in Google Maps. Copy follows marketing-skills:copywriting (plain, factual). */
const country = (code: string) => COUNTRIES.find((c) => c.value === code)?.label ?? code;
const tel = (p: string) => `tel:+${p.replace(/[^\d]/g, "")}`;
const maps = (o: Office) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([...o.address, country(o.country)].join(", "))}`;

export function Offices({ offices }: { offices: Office[] }) {
  if (!offices.length) return null;
  const india = offices.filter((o) => o.country === "IN").length, abroad = offices.filter((o) => o.country !== "IN");
  const rest = india && abroad.length === 1 ? `${india === 1 ? "One" : india === 2 ? "Two" : india} in India, one in ${abroad[0]!.city}.` : "Call or visit by appointment.";
  return (
    <section className="wrap pt-28 md:pt-40">
      <SectionHead label="Offices" lead="Visit or call an office." rest={rest} />
      <div className="grid gap-3 md:grid-cols-3">
        {offices.map((o, i) => (
          <Reveal key={`${o.city}-${i}`} className="h-full" delay={i * 0.06}>
            <Spotlight className="flex h-full flex-col px-4 pb-4 pt-5 md:px-5">
              <p className="mb-2.5 font-mono text-label uppercase text-ink-2">{o.label} · {country(o.country)}</p>
              <h3 className="text-h4 tracking-[-0.015em]">{o.city}</h3>
              <address className="mt-3 text-[16px] not-italic leading-[1.6] text-ink-2">
                {o.address.map((l) => <span key={l} className="block">{l}</span>)}
              </address>
              <ul className="mt-4 divide-y divide-line border-t border-line">
                {o.phones.map((p) => (
                  <li key={p}>
                    <a href={tel(p)} className="flex min-h-11 items-center gap-2.5 font-mono text-[14px] tabular-nums text-ink transition-colors duration-150 hover:text-blue-2">
                      <svg viewBox="0 0 24 24" className="size-4 shrink-0 text-ink-2" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M5 4h3.5l1.5 4-2 1.5a11 11 0 0 0 6.5 6.5l1.5-2 4 1.5V19a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
                      </svg>
                      {p}
                    </a>
                  </li>
                ))}
              </ul>
              <a href={maps(o)} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex min-h-11 items-center gap-1.5 pt-3 text-small font-medium text-blue-2 underline-offset-4 hover:underline">
                Get directions<span className="sr-only"> to the {o.city} office (opens Google Maps)</span> <span aria-hidden>↗</span>
              </a>
            </Spotlight>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
