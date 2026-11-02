import Link from "next/link";
import { buttonClass } from "@techx/ui/Button";
import { Eyebrow } from "@techx/ui/Eyebrow";
import { ArrowIcon, WhatsAppIcon } from "@techx/ui/Icons";
import { Reveal } from "@/features/motion/Reveal";
import { ScrollFill } from "@/features/motion/ScrollFill";
import { site } from "@/lib/site";
import { CtaFx } from "./CtaFx";

/** Every page ends with the free-trial call to action and the contact strip (information map rule 1). */
export function FinalCta({ lead = "You capture the media.", rest = "Send us ten photos and we'll do the rest." }: { lead?: string; rest?: string }) {
  const { contact } = site;
  return (
    <section className="wrap mt-24 md:mt-34">
      {/* cta-panel: on the White background it gets the hero's sky gradient so the last call to action stands out (globals.css) */}
      <Reveal className="cta-panel relative overflow-hidden rounded-panel bg-surface px-6 py-16 text-center shadow-hair md:py-24">
        <CtaFx />
        <div aria-hidden="true" className="absolute inset-x-[10%] -bottom-[60%] h-[420px] bg-[radial-gradient(50%_50%_at_35%_50%,rgb(48_116_254/0.16),transparent_70%),radial-gradient(45%_50%_at_68%_50%,rgb(142_31_63/0.12),transparent_70%)] blur-[10px]" />
        <div className="relative">
          <Eyebrow>Free trial</Eyebrow>
          <h2 className="mx-auto my-5 max-w-[820px] text-cta">
            {lead} <ScrollFill text={rest} />
          </h2>
          <p className="text-[18px] text-ink-2">No card · No contract · Back by morning</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
            <Link href="/free-trial" className={buttonClass("primary")}>Try 10 photos free <ArrowIcon className="transition-transform duration-200 group-hover:translate-x-0.5" /></Link>
            <a href={contact.whatsappUrl} className={buttonClass("whatsapp")} rel="noopener"><WhatsAppIcon />Chat on WhatsApp</a>
          </div>
          {/* Contact strip (owner, 2026-11-02): an icon chip per channel, label over value, roomier gaps.
              WhatsApp and Email are links. Envelope is the Pikaicons envelope used on the overnight timeline;
              the pin is drawn in the same outline style (DESIGN.md §7). */}
          {/* phones: one left-aligned column so the icons line up; wider: a centred row */}
          <dl className="mx-auto mt-12 grid w-fit gap-y-5 text-left sm:flex sm:w-auto sm:max-w-[920px] sm:flex-wrap sm:justify-center sm:gap-x-12 md:gap-x-16">
            {[
              { k: "WhatsApp", v: contact.whatsapp, href: contact.whatsappUrl, icon: <WhatsAppIcon size={18} className="text-[#25D366]" /> },
              { k: "Email", v: contact.email, href: `mailto:${contact.email}`, icon: <Glyph d={ENVELOPE} /> },
              { k: "Studio", v: `${contact.studio} · ${contact.hours}`, icon: <Glyph d={PIN} /> },
            ].map(({ k, v, href, icon }) => (
              <div key={k} className="flex items-center gap-3.5">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-surface text-ink shadow-hair">{icon}</span>
                <div>
                  <dt className="font-mono text-label uppercase text-ink-2">{k}</dt>
                  <dd className="mt-1 text-[15px] font-medium">
                    {href ? <a href={href} rel="noopener" className="underline-offset-4 hover:text-blue hover:underline">{v}</a> : v}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </Reveal>
    </section>
  );
}

const ENVELOPE = "m21.803 7.762-5.508 3.505c-1.557.99-2.335 1.486-3.171 1.678a5 5 0 0 1-2.248 0c-.836-.192-1.614-.688-3.171-1.678L2.197 7.762m19.606 0C22 8.722 22 10.006 22 12c0 2.8 0 4.2-.545 5.27a5 5 0 0 1-2.185 2.185C18.2 20 16.8 20 14 20h-4c-2.8 0-4.2 0-5.27-.545a5 5 0 0 1-2.185-2.185C2 16.2 2 14.8 2 12c0-1.994 0-3.278.197-4.238m19.606 0a4 4 0 0 0-.348-1.032 5 5 0 0 0-2.185-2.185C18.2 4 16.8 4 14 4h-4c-2.8 0-4.2 0-5.27.545A5 5 0 0 0 2.545 6.73a4 4 0 0 0-.348 1.032";
const PIN = "M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Zm0-8.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z";

function Glyph({ d }: { d: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
  );
}
