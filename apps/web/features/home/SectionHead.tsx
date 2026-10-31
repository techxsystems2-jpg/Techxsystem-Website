import type { ReactNode } from "react";
import { Eyebrow } from "@techx/ui/Eyebrow";
import { Reveal } from "@/features/motion/Reveal";
import { ScrollFill } from "@/features/motion/ScrollFill";

/** Mono label + two-tone heading (lead in ink, the rest muted, filling to ink word by word on scroll). Rises into view. */
export function SectionHead({ label, lead, rest, center = false, side }: { label: string; lead: string; rest: ReactNode; center?: boolean; side?: ReactNode }) {
  return (
    <Reveal className={center ? "mx-auto mb-14 max-w-[780px] text-center" : "mb-12 flex flex-wrap items-end justify-between gap-8"}>
      <div>
        <Eyebrow className="mb-4.5 block">{label}</Eyebrow>
        <h2 className={`text-h2 ${center ? "" : "max-w-[740px]"}`}>{lead} {typeof rest === "string" ? <ScrollFill text={rest} /> : <span className="text-ink-3">{rest}</span>}</h2>
      </div>
      {side}
    </Reveal>
  );
}
