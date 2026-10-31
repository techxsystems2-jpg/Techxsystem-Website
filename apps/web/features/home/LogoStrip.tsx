import { Eyebrow } from "@techx/ui/Eyebrow";

/** Client logos drift past in a slow marquee (pauses on hover). Placeholders until TechX sends logos with permission. */
export function LogoStrip() {
  const logos = Array.from({ length: 6 }, (_, i) => i);
  return (
    <section className="wrap pt-20 text-center">
      <Eyebrow>Editing for real estate photographers in the US, Australia and the UK</Eyebrow>
      <div className="marquee-mask mt-6 overflow-hidden">
        <ul className="marquee flex w-max gap-16">
          {[...logos, ...logos].map((i, k) => (
            <li key={k} aria-hidden={k >= logos.length} className="whitespace-nowrap text-[20px] font-semibold tracking-[-0.02em] text-line-2">Client logo</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
