"use client";

import Image from "next/image";
import { Spotlight } from "@/features/motion/Spotlight";
import { site } from "@/lib/site";
import { STUDIO_CLOSE_UTC, STUDIO_OPEN_UTC, fmt, todayAt, useStudioClock } from "./useStudioClock";

/* Studio card (Figma 34:155), in the Home card style: Spotlight surface, picture inset in the card, maroon number + mono
   label. Figma's drawn aerial map is TechX's own drone edit (docs/PHOTO_CREDITS.md). Location is "India" only (owner
   rule: never the town). The studio day is converted live into the clients' cities, so the hours stay right through
   daylight saving (Figma's fixed New York hours are only right half the year); London added for the UK market. */
const cities = [
  { name: "New York", tz: "America/New_York" },
  { name: "London", tz: "Europe/London" },
  { name: "Sydney", tz: "Australia/Sydney" },
] as const;

export function StudioCard() {
  const clock = useStudioClock();
  return (
    <Spotlight className="flex h-full flex-col">
      <div className="relative aspect-[16/8] overflow-hidden rounded-inner">
        <Image src="/photos/tx-aer.jpg" alt="A drone photo edited by TechX: suburban homes and gardens from above" fill sizes="(min-width: 768px) 480px, 100vw" className="object-cover" />
        {clock && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-surface/90 px-3 py-1.5 text-[12.5px] font-medium shadow-hair backdrop-blur">
            <span className={`relative size-2 rounded-full ${clock.open ? "bg-green" : "bg-ink-3"}`}>
              {clock.open && <span className="absolute inset-0 animate-ping rounded-full bg-green/60 motion-reduce:hidden" />}
            </span>
            {clock.open ? "Open now" : "Closed now"} · <span className="tabular-nums">{clock.indiaTime}</span> in India
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col px-4 pb-3 pt-6 md:px-5">
        <p className="mb-2.5 flex gap-2.5 font-mono text-label uppercase">
          <b className="font-medium text-maroon">05</b><span className="text-ink-2">Studio</span>
        </p>
        <h2 className="text-h4 tracking-[-0.015em]">{site.contact.studio}. Editing for photographers in the US, UK and Australia.</h2>
        <dl className="mt-4 divide-y divide-line text-small">
          <Row k="Studio hours" v={site.contact.hours} />
          {cities.map((c) => (
            <Row key={c.name} k={c.name} v={clock ? `${fmt(todayAt(clock.now, STUDIO_OPEN_UTC), c.tz)} – ${fmt(todayAt(clock.now, STUDIO_CLOSE_UTC), c.tz)}` : null} />
          ))}
        </dl>
      </div>
    </Spotlight>
  );
}

function Row({ k, v }: { k: string; v: string | null }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <dt className="text-ink-2">{k}</dt>
      <dd className="font-mono text-[12.5px] tabular-nums text-ink">
        {v ?? <span className="inline-block h-3 w-[136px] rounded-sm bg-sunk align-middle" aria-hidden="true" />}
      </dd>
    </div>
  );
}
