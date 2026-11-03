"use client";

import { useState } from "react";
import { BeforeAfter } from "@/features/before-after/BeforeAfter";
import { HeroCollage } from "./HeroCollage";
import type { SceneName } from "@/features/before-after/Scenes";

/* Hero stage: the before/after tray (owner: "like the earlier slider") with scene chips and the photographer credit. */

// Sample photos (CC0, docs/PHOTO_CREDITS.md) until TechX supplies real before/after pairs.
const scenes: { id: SceneName; label: string; photo: string; alt: string }[] = [
  { id: "ext", label: "Exterior", photo: "/photos/ext.webp", alt: "Two-storey white house with a pool, front elevation" },
  { id: "int", label: "Interior", photo: "/photos/int.webp", alt: "Living room with a brick wall and grey sofa" },
  { id: "twi", label: "Twilight", photo: "/photos/twi.webp", alt: "Single-storey white house under an orange sunset sky" },
  { id: "aer", label: "Aerial", photo: "/photos/aer.webp", alt: "Drone view of houses with pools" },
];


export function HeroStage() {
  const [i, setI] = useState(0);

  return (
    <div className="relative">
      {/* tray padding 4px, radius 28 = photo 24 + 4 (owner, 2026-10-31). the before/after tray, as earlier: white tray, labelled photo, scene chips and photographer credit, now sitting in
          a slow two-layer collage of TechX's own edits (HeroCollage) */}
      <div className="wrap">
        <div className="relative mx-auto max-w-[1180px]">
        {/* collage always on: the review switch was removed before launch (owner, 2026-11-03) */}
        <HeroCollage />
        <div className="relative z-10 rounded-tray bg-surface p-1 shadow-[0_0_0_1px_rgb(10_10_11/0.05),0_1px_2px_rgb(10_10_11/0.04),0_-10px_30px_-14px_rgb(48_116_254/0.12),0_18px_40px_-26px_rgb(10_10_11/0.10)]">
          <BeforeAfter scene={scenes[i]!.id} photo={scenes[i]!.photo} alt={scenes[i]!.alt} className="aspect-[16/10] rounded-[14px] md:aspect-[16/8.6]" />
          <div className="flex flex-wrap items-center justify-between gap-3 px-2 pb-1.5 pt-3">
            <div role="tablist" aria-label="Scenes" className="flex flex-wrap gap-1">
              {scenes.map((sc, k) => (
                <button key={sc.id} role="tab" aria-selected={k === i} onClick={() => setI(k)}
                  className={`h-[34px] rounded-[8px] px-4 text-[14px] transition-colors duration-200 ${k === i ? "bg-ink text-white" : "text-ink-2 hover:bg-sunk hover:text-ink"}`}>
                  {sc.label}
                </button>
              ))}
            </div>
            <span className="font-mono text-label uppercase text-ink-2 max-sm:hidden">Sample listing · drag to compare</span>
          </div>
        </div>
        </div>
      </div>

    </div>
  );
}
