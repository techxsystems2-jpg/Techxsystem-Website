import Link from "next/link";
import { buttonClass } from "@techx/ui/Button";
import { Eyebrow } from "@techx/ui/Eyebrow";
import { ArrowIcon } from "@techx/ui/Icons";
import { Reveal } from "@/features/motion/Reveal";
import { ScrollFill } from "@/features/motion/ScrollFill";
import { site } from "@/lib/site";

/** Every page ends with the free-trial call to action and the contact strip (information map rule 1). */
export function FinalCta({ lead = "You capture the media.", rest = "Send us ten photos and we'll do the rest." }: { lead?: string; rest?: string }) {
  const { contact } = site;
  return (
    <section className="wrap mt-24 md:mt-34">
      <Reveal className="relative overflow-hidden rounded-panel bg-surface px-6 py-16 text-center shadow-hair md:py-24">
        <div aria-hidden="true" className="absolute inset-x-[10%] -bottom-[60%] h-[420px] bg-[radial-gradient(50%_50%_at_35%_50%,rgb(48_116_254/0.16),transparent_70%),radial-gradient(45%_50%_at_68%_50%,rgb(142_31_63/0.12),transparent_70%)] blur-[10px]" />
        <div className="relative">
          <Eyebrow>Free trial</Eyebrow>
          <h2 className="mx-auto my-5 max-w-[820px] text-cta">
            {lead} <ScrollFill text={rest} />
          </h2>
          <p className="text-[18px] text-ink-2">No card · No contract · Back by morning</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
            <Link href="/free-trial" className={buttonClass("primary")}>Try 10 photos free <ArrowIcon className="transition-transform duration-200 group-hover:translate-x-0.5" /></Link>
            <a href={contact.whatsappUrl} className={buttonClass("secondary")} rel="noopener">Chat on WhatsApp</a>
          </div>
          <dl className="mt-10 flex flex-wrap justify-center gap-x-10 gap-y-4 text-left">
            {[["WhatsApp", contact.whatsapp], ["Email", contact.email], ["Studio", `${contact.studio} · ${contact.hours}`]].map(([k, v]) => (
              <div key={k}>
                <dt className="font-mono text-label uppercase text-ink-2">{k}</dt>
                <dd className="text-[15px] font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Reveal>
    </section>
  );
}
