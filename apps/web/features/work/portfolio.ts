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

/* What each of the 87 original photos shows (SEO audit, 2026-11-14: generic alt text). Used as the photo's alt text
   when the admin hasn't written a description of its own. Keyed by file name. */
const DESCRIBED: Record<string, string> = {
  "int-1": "Bathroom with a floating stone vanity, round basin, freestanding tub and walk-in shower",
  "int-2": "Open living room with a grey sofa, tiled floor and sliding doors to a water-view balcony",
  "int-3": "Living room with a grey sofa and glass doors opening onto a balcony over the water",
  "int-4": "Bathroom with a corner tub under two windows and a dark wood double vanity",
  "int-5": "Kitchen with dark cabinets, white subway tile and a butcher-block island",
  "int-6": "Bright bedroom with a white bed, ceiling fan and doors to a balcony",
  "int-7": "White bathroom with grey drawer cabinets, a long counter and high windows",
  "int-8": "Dining room with a round table, carved chairs, chandelier and bay windows",
  "int-9": "Kitchen with a white island, range hood and arches through to the living room",
  "int-10": "White kitchen with granite counters, glass-front cabinets and a steel fridge",
  "int-11": "Sunroom living area with sofas and tall windows looking onto a pool",
  "int-12": "Large living room with leather sofas, patterned rug and windows to the water",
  "int-13": "Kitchen with a breakfast bar, stools and a white fridge",
  "int-14": "Dining area with blue walls, a wooden table and an arch through to the kitchen",
  "int-15": "Open family room with a tan sofa, blue walls and the kitchen beyond",
  "int-16": "Bedroom with a tufted headboard, white beams and a ceiling fan",
  "int-17": "Long white hallway with wood floors",
  "int-18": "Open-plan living room with white sofas, a glass coffee table and the kitchen behind",
  "int-19": "Entry with arched double doors in wrought iron and glass",
  "int-20": "Kitchen with cream cabinets, a granite island and a red feature wall",
  "int-21": "Marble bathroom with a raised corner tub, glass shower and tall windows",
  "int-22": "Blue bedroom with a patterned rug and sliding doors to a screened pool",
  "int-23": "Powder room with green wallpaper, an ornate mirror and a dark vanity",
  "int-24": "Formal living room with a chandelier, cream sofas and a carved coffee table",
  "int-25": "Formal dining room with a chandelier, framed prints and a set table",
  "int-26": "Home office with wood cabinets, an arched window and a desk with speakers",
  "int-27": "Bathroom with a black marble tub surround under an arched shuttered window",
  "int-28": "Bedroom with a sleigh bed, curtains and French doors",
  "int-29": "Breakfast nook with a round glass table and wicker chairs by a window",
  "int-30": "Kitchen with wood cabinets, a granite island and bar stools",
  "int-31": "Family room with a built-in TV niche, leather chairs and water views",
  "int-32": "Bedroom with a four-poster bed, blue bedding and a lake view",
  "int-33": "Kitchen with wood cabinets, pendant lights and a long island with a sink",
  "ext-1": "Modern two-storey house in blue and white with a stone wall and red tropical plants",
  "ext-2": "Front entry with a timber door, stone pillar and blue cladding",
  "ext-3": "Red cottage-style house with a gravel drive beside a lake",
  "ext-4": "Stone patio with outdoor dining sets beside the house",
  "ext-5": "Lawn sloping down to a lake through tall trees",
  "ext-6": "Wooden dock with lounge chairs on a lake under a blue sky",
  "ext-7": "Lakeside deck with Adirondack chairs and a boathouse",
  "ext-8": "Café terrace with tables on a tree-lined shopping street",
  "ext-9": "Garden with a white pergola and gravel path",
  "ext-10": "Rectangular pool beside a single-storey house with a red tile roof",
  "ext-11": "White lattice gazebo framed by climbing plants",
  "ext-12": "Timber deck with a dining table and umbrella overlooking open fields",
  "ext-13": "Small grey house with a front porch and snow on the lawn",
  "ext-14": "Jewellery shop front with display windows and a stone base",
  "ext-15": "Jewellery shop front seen at an angle along the street",
  "ext-16": "Brick bungalow with a front lawn and garden beds",
  "ext-17": "Covered patio with an orange outdoor sofa beside a pool",
  "ext-18": "Yellow house with a curved pool and blue chairs",
  "aer-1": "Drone view of a house on a large green lot with trees",
  "aer-2": "Drone view of a suburban street of houses with big lawns",
  "aer-3": "Drone view of a corner lot beside a curving road",
  "aer-4": "Drone view of a house on a cul-de-sac with mature gardens",
  "aer-5": "Top-down drone view of a house and lawn by a curved road",
  "aer-6": "Top-down drone view of houses along a winding street",
  "aer-7": "High drone view of a neighbourhood with curving roads",
  "aer-8": "Drone view of a large house with a pool and patio behind",
  "aer-9": "Drone view of a green house on a corner with palm trees",
  "aer-10": "Drone view of a house with a tiled roof on a street corner",
  "aer-11": "Top-down drone view of a tiled roof and driveway",
  "aer-12": "Drone view of a house on a curving hillside street",
  "aer-13": "Drone view of a tiled-roof house at the bend of a cul-de-sac",
  "aer-14": "Drone view of hillside homes along a winding road",
  "aer-15": "Wide drone view of a hillside neighbourhood with green hills behind",
  "yacht-1": "Yacht galley with white cabinets, stove and windows",
  "yacht-2": "Yacht saloon with a round table, cushioned seating and a fire extinguisher",
  "yacht-3": "Yacht helm station with control panels and switchboard",
  "yacht-4": "Yacht saloon with a table, fruit bowl and wraparound seating",
  "yacht-5": "Yacht cabin with a made double bed and overhead hatch",
  "yacht-6": "Yacht cabin bed with folded towels under a skylight hatch",
  "yacht-7": "Yacht bathroom with a porthole and mirror",
  "yacht-8": "Yacht cabin with a bed, pillows and towels under a hatch",
  "yacht-9": "Yacht cockpit with blue cushions and a harbour view",
  "yacht-10": "Yacht cockpit with a table and seating at the stern",
  "twi-1": "Modern house at twilight with lit interiors, outdoor sofas and a pool",
  "twi-2": "Two-storey house at dusk with lights on and a paved drive",
  "twi-3": "Stone-walled waterfront at sunset with palm trees",
  "twi-4": "Shop front lit up at dusk on a city street",
  "twi-5": "Shop with a mural on its side wall at dusk",
  "twi-6": "Calm river at twilight with trees reflected in the water",
  "twi-7": "Modern house with a lit pool and terrace at dusk",
  "twi-8": "White two-storey house with a porch at dusk",
  "plan-1": "2D floor plan with lounge, kitchen, bedrooms and garage",
  "plan-2": "2D floor plan with family room, kitchen and three bedrooms",
  "plan-3": "2D floor plan of a two-level home",
};
const described = (src: string) => DESCRIBED[src.match(/([a-z]+-\d+)\.webp$/)?.[1] ?? ""];

export type Shot = { src: string; cat: string; label: string; square: boolean; alt: string };

const shotsOf = (c: (typeof categories)[number]): Shot[] =>
  Array.from({ length: c.count }, (_, i) => ({ src: `/photos/work/${c.key}-${i + 1}.webp`, cat: c.key, label: c.label, square: c.key === "plan", alt: "" }));

const byCat = Object.fromEntries(categories.map((c) => [c.key, shotsOf(c)])) as Record<WorkCat, Shot[]>;

/** Every shot, interleaved across categories so "All" opens with a mix rather than 33 interiors in a row. */
export const portfolio: Shot[] = (() => {
  const out: Shot[] = [];
  const queues = categories.map((c) => [...byCat[c.key]]);
  while (queues.some((q) => q.length)) for (const q of queues) { const s = q.shift(); if (s) out.push(s); }
  return out;
})();

type Cat = { key: string; label: string };

/** The gallery as stored by the admin (lib/content, key "work": src, category, label) → display shots. The label falls
    back to the category's name from the admin's category list (lib/content key "categories"). */
export function toShots(items: { src: string; cat: string; label: string; alt?: string }[], cats: Cat[] = categories): Shot[] {
  return items.map((s) => {
    const label = s.label || (cats.find((c) => c.key === s.cat)?.label ?? "");
    // alt: the admin's description, else the built-in one for an original photo, else the old generic line
    return { src: s.src, cat: s.cat, label, square: s.cat === "plan", alt: s.alt || described(s.src) || `${label} edit by TechX` };
  });
}

/** Category chips with live counts (categories with no photos are left out). */
export const countsOf = (shots: Shot[], cats: Cat[] = categories) => cats.map((c) => ({ ...c, count: shots.filter((s) => s.cat === c.key).length })).filter((c) => c.count > 0);

/** The first few shots of the given categories, alternating between them (service pages' "Recent work"). */
export function shotsFor(cats: string[], n = 3, from: Shot[] = portfolio): Shot[] {
  const per = Object.fromEntries(cats.map((c) => [c, from.filter((s) => s.cat === c)])) as Record<string, Shot[]>;
  const out: Shot[] = [];
  for (let i = 0; out.length < n && i < 40; i++) for (const c of cats) { const s = per[c][i]; if (s && out.length < n) out.push(s); }
  return out;
}
