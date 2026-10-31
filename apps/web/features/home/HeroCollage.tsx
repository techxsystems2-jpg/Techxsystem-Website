"use client";

import { useRef, type CSSProperties } from "react";
import Image from "next/image";
import { useInView, useReducedMotion } from "motion/react";

/* Hero collage behind the before/after tray (owner, 2026-10-31; reference: devin.ai's hero). TechX's own portfolio
   work fills the band around the tray at once and slides slowly left to right, in two full-width layers: a back layer
   blurred and faint (~180s per crossing) and a front layer sharp (~140s), each tile at its own pace. Square tiles, no border, radius or shadow,
   multiplied into the page. Every tile runs the same CSS pan (`collage-pan`, globals.css) with a negative delay that
   spreads the tiles evenly along the track, so the screen is full from the first frame and stays full.
   CSS animation: transform only, off the main thread; paused off screen and under reduced motion.
   Photos: public/photos/field (docs/PHOTO_CREDITS.md). */

const PHOTOS = ["f01", "f13", "f07", "f16", "f02", "f10", "f14", "f05", "f11", "f17", "f03", "f08", "f15", "f06", "f12", "f18", "f04", "f09"];
// [width, height] at full scale, devin.ai's rhythm: portrait, landscape, square, small and the odd large one
const SIZES = [[143, 107], [83, 110], [195, 146], [110, 83], [107, 143], [66, 50], [143, 143], [120, 90], [90, 120], [260, 195], [110, 110], [150, 200]] as const;
// band heights (0 top … 1 bottom), fixed so server and client render the same; alternate high/low so tiles don't stack
const TOPS = [0.05, 0.55, 0.28, 0.86, 0.12, 0.7, 0.4, 0.95, 0.2, 0.62, 0.02, 0.78, 0.34, 0.9, 0.48, 0.16];
// base seconds per crossing; each tile then runs at its own speed by size (bigger glides a bit faster, smaller drifts
// slower), so the field reads as depth rather than one belt (owner, 2026-10-31: slower, and not all the same speed)
const LAYERS = [
  { n: 16, duration: 180, offset: 3, style: { filter: "blur(6px)", opacity: 0.6 } },
  { n: 16, duration: 140, offset: 0, style: {} },
] as const;
const pace = (w: number, h: number) => 1.35 - Math.min(Math.sqrt(w * h) / 200, 1) * 0.55; // ~0.8 (large) … ~1.3 (small)

export function HeroCollage() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "100px" });
  const reduce = useReducedMotion();
  const state = inView && !reduce ? "running" : "paused";
  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-x-0 -bottom-[110px] -top-[50px] [--s:0.7] md:[--s:0.85] lg:[--s:1]">
      {LAYERS.map((layer, l) => (
        <div key={l} className="absolute inset-y-0 left-[calc(50%-50vw)] w-screen overflow-hidden"
          style={{ ...layer.style, "--track": "calc(max(100vw, 1900px) + 260px)" } as CSSProperties}>
          {Array.from({ length: layer.n }, (_, i) => {
            const k = i + layer.offset;
            const src = PHOTOS[(k * 7 + l * 5) % PHOTOS.length]!;
            const [w, h] = SIZES[(k * 5 + l * 3) % SIZES.length]!;
            const top = TOPS[(k + l * 7) % TOPS.length]!;
            const d = layer.duration * pace(w, h);
            return (
              <div key={i} className="collage-tile absolute left-[-260px] overflow-hidden mix-blend-multiply"
                style={{
                  width: `calc(${w}px * var(--s))`, height: `calc(${h}px * var(--s))`,
                  top: `calc(${top} * (100% - ${h}px * var(--s)))`,
                  animationDuration: `${d}s`,
                  animationDelay: `${-((i + l * 0.5) / layer.n) * d}s`,
                  animationPlayState: state,
                }}>
                <Image src={`/photos/field/${src}.webp`} alt="" fill sizes={`${w * 2}px`} className="object-cover" />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
