import type { WorkCat } from "@/features/services/data";

/* TechX's own portfolio: all 87 finished edits from the old site (techxsystems.com/img/portfolio/…), converted to WebP
   in public/photos/work (docs/PHOTO_CREDITS.md). Counts match Figma's Work filters. These are finished edits only: the
   old site has no raw files, so the Work page doesn't show before/after pairs until TechX sends them. */

export const categories: { key: WorkCat; label: string; count: number }[] = [
  { key: "int", label: "Interior", count: 33 },
  { key: "ext", label: "Exterior", count: 18 },
  { key: "aer", label: "Drone", count: 15 },
  { key: "yacht", label: "Yacht", count: 10 },
  { key: "twi", label: "Twilight", count: 8 },
  { key: "plan", label: "Floor plan", count: 3 },
];

export type Shot = { src: string; cat: WorkCat; label: string; square: boolean };

const shotsOf = (c: (typeof categories)[number]): Shot[] =>
  Array.from({ length: c.count }, (_, i) => ({ src: `/photos/work/${c.key}-${i + 1}.webp`, cat: c.key, label: c.label, square: c.key === "plan" }));

const byCat = Object.fromEntries(categories.map((c) => [c.key, shotsOf(c)])) as Record<WorkCat, Shot[]>;

/** Every shot, interleaved across categories so "All" opens with a mix rather than 33 interiors in a row. */
export const portfolio: Shot[] = (() => {
  const out: Shot[] = [];
  const queues = categories.map((c) => [...byCat[c.key]]);
  while (queues.some((q) => q.length)) for (const q of queues) { const s = q.shift(); if (s) out.push(s); }
  return out;
})();

/** The first few shots of the given categories, alternating between them (service pages' "Recent work"). */
export function shotsFor(cats: WorkCat[], n = 3): Shot[] {
  const out: Shot[] = [];
  for (let i = 0; out.length < n && i < 40; i++) for (const c of cats) { const s = byCat[c][i]; if (s && out.length < n) out.push(s); }
  return out;
}
