"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { useInView, useReducedMotion } from "motion/react";

/* Hero collage behind the before/after tray (owner, 2026-10-31; reference: devin.ai's hero). TechX's own portfolio
   work fills the band around the tray at once and slides slowly left to right. Reworked 2026-11-02 (owner: tiles
   overlapped; wants devin-style depth, every image on a layer 1, 2, 3):
   - Three depth layers: 1 far (small, heavy blur + grain, faint, slowest), 2 mid (medium, light blur + grain),
     3 near (large, sharp, fastest). Nearer moves faster, so the field reads as depth (parallax).
   - No overlaps inside a layer: every tile in a layer shares one speed and sits in a fixed lane, evenly spaced along the
     track, so tiles can never catch up with each other. Lanes are set so tiles in neighbouring lanes don't touch either;
     where a near tile passes over a far one it reads as depth, not a pile-up.
   Every tile runs the same CSS pan (`collage-pan`, globals.css) from 420px off the left edge; a negative delay places it
   along the track, so the band is full from the first frame. Transform only; paused off screen and under reduced motion.
   Size scale --s: 1 phone · 1.25 tablet · 1.5 desktop (owner: photos big enough to see).
   Owner, 2026-11-02: ~1.7× faster (140 / 110 / 80s per crossing); near tiles are solid (no multiply blend), so a
   blurred tile behind never shows through a sharp one.
   Photos: public/photos/field (docs/PHOTO_CREDITS.md).
   Speed pass (2026-11-03): the 27 tiles' photos (~400 KB) load only after the page has loaded and the browser is idle,
   then fade in, so they never compete with the hero photo (the page's LCP) on a slow phone. */

const PHOTOS = ["f01", "f13", "f07", "f16", "f02", "f10", "f14", "f05", "f11", "f17", "f03", "f08", "f15", "f06", "f12", "f18", "f04", "f09"];
// [width, height] before the layer and screen scale: landscape, portrait, square, the odd large one
const SIZES = [[143, 107], [107, 143], [195, 146], [120, 90], [143, 143], [90, 120], [260, 195], [150, 112], [110, 146]] as const;

type Layer = { scale: number; blur: number; opacity: number; duration: number; lanes: readonly number[]; perLane: number; phase: number };
// lanes are band heights (0 top … 1 bottom); perLane tiles are spread evenly along the track; phase shifts the layer
const LAYERS: readonly Layer[] = [
  { scale: 0.55, blur: 10, opacity: 0.5, duration: 140, lanes: [0.15, 0.5, 0.85], perLane: 5, phase: 0.25 }, // 1 · far
  { scale: 0.8, blur: 4, opacity: 0.8, duration: 110, lanes: [0.3, 0.7], perLane: 4, phase: 0.6 },          // 2 · mid
  { scale: 1.1, blur: 0, opacity: 1, duration: 80, lanes: [0.03, 0.97], perLane: 3, phase: 0 },              // 3 · near
];

export function HeroCollage() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "100px" });
  const reduce = useReducedMotion();
  const state = inView && !reduce ? "running" : "paused";
  const [ready, setReady] = useState(false);
  useEffect(() => {
    // after load, at the next idle moment (Safari has no requestIdleCallback: a short timeout instead)
    let t: ReturnType<typeof setTimeout> | undefined;
    const go = () => { t = setTimeout(() => (typeof requestIdleCallback === "function" ? requestIdleCallback(() => setReady(true), { timeout: 2000 }) : setReady(true)), 0); };
    if (document.readyState === "complete") go();
    else addEventListener("load", go, { once: true });
    return () => { removeEventListener("load", go); clearTimeout(t); };
  }, []);
  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-x-0 -bottom-[110px] -top-[50px] [--s:1] md:[--s:1.25] lg:[--s:1.5]">
      {/* one shared noise definition for the grain on the soft tiles */}
      <svg width="0" height="0" className="absolute"><filter id="hero-grain"><feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves={4} stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter></svg>
      {LAYERS.map((layer, l) => (
        <div key={l} className="absolute inset-y-0 left-[calc(50%-50vw)] w-screen overflow-hidden"
          style={{ opacity: layer.opacity, "--track": "calc(max(100vw, 1900px) + 420px)" } as CSSProperties}>
          {layer.lanes.flatMap((lane, li) =>
            Array.from({ length: layer.perLane }, (_, j) => {
              const k = l * 20 + li * layer.perLane + j; // tile number, so photos and sizes vary across the field
              const src = PHOTOS[(k * 7 + l * 5) % PHOTOS.length]!;
              const [bw, bh] = SIZES[(k * 4 + l) % SIZES.length]!;
              const w = bw * layer.scale, h = bh * layer.scale;
              // even spacing in the lane; neighbouring lanes sit half a gap apart so they never line up
              const at = (j + li * 0.5 + layer.phase) / layer.perLane;
              return (
                <div key={`${li}-${j}`} className={`collage-tile absolute left-[-420px] overflow-hidden transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"} ${layer.blur ? "mix-blend-multiply" : ""}`}
                  style={{
                    width: `calc(${w}px * var(--s))`, height: `calc(${h}px * var(--s))`,
                    top: `calc(${lane} * (100% - ${h}px * var(--s)))`,
                    animationDuration: `${layer.duration}s`,
                    animationDelay: `${-(at % 1) * layer.duration}s`,
                    animationPlayState: state,
                  }}>
                  {/* decoration: low priority so the hero photo (the LCP) gets the bandwidth first; blurred tiles don't need
                      retina pixels or full quality (speed pass, 2026-11-03) */}
                  {ready && <Image src={`/photos/field/${src}.webp`} alt="" fill sizes={`${Math.round(layer.blur ? w : w * 2)}px`} fetchPriority="low"
                    quality={layer.blur ? 50 : 75} className="object-cover" style={layer.blur ? { filter: `blur(${layer.blur}px)`, transform: "scale(1.12)" } : undefined} />}
                  {/* film grain on the soft (blurred) layers only: static noise, overlay-blended inside the tile */}
                  {layer.blur > 0 && <svg className="absolute inset-0 size-full mix-blend-overlay"><rect width="100%" height="100%" filter="url(#hero-grain)" /></svg>}
                </div>
              );
            }),
          )}
        </div>
      ))}
    </div>
  );
}
