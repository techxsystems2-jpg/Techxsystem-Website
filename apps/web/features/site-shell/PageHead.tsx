import type { ReactNode } from "react";
import { Eyebrow } from "@techx/ui/Eyebrow";
import { ScrollFill } from "@/features/motion/ScrollFill";

/** Inner-page header: mono label, two-tone H1 (lead in ink, the rest muted), optional lede. */
export function PageHead({ label, lead, rest, children }: { label: string; lead: string; rest: string; children?: ReactNode }) {
  return (
    <section className="wrap rise pt-28 md:pt-36">
      <Eyebrow>{label}</Eyebrow>
      <h1 className="mt-5 max-w-[900px] text-h1">
        {lead} <ScrollFill text={rest} />
      </h1>
      {children && <p className="mt-5 max-w-[620px] text-lede text-ink-2">{children}</p>}
    </section>
  );
}
