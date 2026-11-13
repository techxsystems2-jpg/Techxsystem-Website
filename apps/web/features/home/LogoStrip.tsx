import { Eyebrow } from "@techx/ui/Eyebrow";

/** Who we edit for, under the hero. Placeholder client logos removed (owner, 2026-11-14) until TechX sends real ones with permission. */
export function LogoStrip() {
  return (
    <section className="wrap pt-4 text-center md:pt-6">
      {/* Only the three markets stand out: the one fact a visitor checks at a glance. */}
      <Eyebrow>
        Editing for real estate photographers in the <b className="font-semibold text-ink">US</b>,{" "}
        <b className="font-semibold text-ink">Australia</b> and the <b className="font-semibold text-ink">UK</b>
      </Eyebrow>
    </section>
  );
}
