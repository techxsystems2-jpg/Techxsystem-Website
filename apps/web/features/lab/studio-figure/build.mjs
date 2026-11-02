// Studio bench (anatomy skill, lab preview 2026-11-02). Run: node apps/web/features/lab/studio-figure/build.mjs
// Writes studio-art.ts next to this file: the static SVG plus the screen vectors the live component moves parts along.
// The object is the explanation: one listing photo rides a carriage past five stations of the TechX studio.
//   1 Bracket feeder (your exposures in) → 2 Merge press (HDR blend) → 3 Retouch arm (an editor's hand work)
//   → 4 Inspection loupe + stamp (the second check) → 5 Delivery tray (your finished set).
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "../iso/iso-kit.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const WIDTH = 760;
const HEIGHT = 440;

// world: x along the rails (left → right), y front (+) / back (−), z up
const PLATE = { x: -168, y: -64, w: 336, d: 124, r: 8 };
const PLATE_H = 12;
const FOOT_H = 5;
const RAIL_Y = [-6, 16];
const RAIL_FROM = -150;
const RAIL_TO = 150;
const STOPS = [-118, -60, 0, 60, 118]; // carriage centre at each station
const CARRIAGE = { x: -20, y: -12, w: 40, d: 36, r: 3 };
const C_Z = 3;
const C_TOP = 8;
const PHOTO = { x: -15, y: -7, w: 30, d: 22, r: 0.8 };
const PHOTO_Z = C_TOP + 1.2;
const PHOTO_TOP = PHOTO_Z + 1.2;
const POST_Y = -44;
const ARM_Z = 54;
const CY = 4; // photo centre y, where every head works

const P = k.fitProjection(
  [...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0), [STOPS[1], POST_Y, ARM_Z + 12], [STOPS[3], POST_Y, ARM_Z + 12], [STOPS[0], -50, 44]],
  WIDTH,
  HEIGHT,
  { pad: 26, azimuth: 38 },
);

const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const screws = (plan, inset, z, size = 0.5) => D(k.corners(plan, inset).map(([x, y]) => at([x, y, z])), { size });
const byDepth = (pts) => [...pts].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));

function base() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(PLATE, 24))) {
    out.push(S(k.cylinder(x, y, 8, -PLATE_H - FOOT_H, 1.6, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 6, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: "lo" }));
  }
  out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.6), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "lo" }));
  const c = k.corners(PLATE, 11);
  out.push(L(c.map(([x, y]) => k.ring(x, y, 2.4, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(c.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  // ruler along the front edge, a major tick under every station
  const strip = { x: -150, y: PLATE.y + PLATE.d - 16, w: 300, d: 7, r: 1 };
  out.push(S(k.slabOf(strip, 0, 0.6, P, 3), { tone: "lo", crease: "none" }));
  const t = k.topTicks(strip.x + 4, strip.x + strip.w - 4, 4, 5, strip.y + 0.8, 0.6, [2, 3.6], P);
  out.push(L(t.minor, { tone: "lo" }), L(t.major, { tone: "mid" }));
  out.push(D(STOPS.map((x) => at([x, strip.y + 5.4, 0.6])), { size: 0.7, tone: "hi" }));
  // label plate, engraved
  const label = { x: 96, y: PLATE.y + PLATE.d - 34, w: 52, d: 12, r: 1.2 };
  out.push(S(k.slabOf(label, 0, 0.8, P, 3, 0.3), { tone: "lo" }));
  out.push(k.faceTextSvg(k.topMatrix([label.x + 4, label.y + 7.6], 0.8, P, "x"), "TECHX · STUDIO", { size: 3.2, tone: "mid" }));
  out.push(screws(label, 2, 0.8, 0.4));
  return out.join("");
}

function rails() {
  const out = [];
  for (const y of RAIL_Y) {
    out.push(S(k.slabOf({ x: RAIL_FROM, y, w: RAIL_TO - RAIL_FROM, d: 5, r: 1 }, 0, 3, P, 3, 0.4), { tone: "mid" }));
    out.push(D([RAIL_FROM + 8, -90, -30, 30, 90, RAIL_TO - 8].map((x) => at([x, y + 2.5, 3])), { size: 0.4 }));
  }
  for (const x of [RAIL_FROM - 6, RAIL_TO]) {
    const stop = { x, y: RAIL_Y[0] - 4, w: 6, d: RAIL_Y[1] - RAIL_Y[0] + 13, r: 1.2 };
    out.push(S(k.slabOf(stop, 0, 8, P, 3, 0.5), { tone: "mid" }));
    out.push(D([at([x + 3, stop.y + 3, 8]), at([x + 3, stop.y + stop.d - 3, 8])], { size: 0.45 }));
  }
  return out.join("");
}

// 1 · bracket feeder: a hopper of three exposures (dark, mid, bright) and a chute down to the rail
function feeder() {
  const x0 = STOPS[0];
  const box = { x: x0 - 22, y: -60, w: 44, d: 28, r: 2 };
  const out = [S(k.slabOf(box, 0, 26, P, 4, 0.8), { tone: "mid" })];
  out.push(L(k.planOutline(k.insetPlan(box, 3), 26, P), { tone: "faint" }));
  out.push(screws(box, 3.5, 26, 0.45));
  ["lo", "mid", "hi"].forEach((tone, i) => {
    out.push(S(k.slabOf({ x: x0 - 15 + i * 2, y: -55 + i * 4, w: 30, d: 18, r: 0.6 }, 26 + i * 2.4, 1.2, P, 2), { tone }));
  });
  const chute = { x: x0 - 9, y: -32, w: 18, d: 22, r: 1 };
  out.push(S(k.slabOf(chute, 0, 10, P, 3, 0.5), { tone: "mid" }));
  out.push(L(k.lineOnTop([x0 - 6, -30], [x0 - 6, -12], 10, P) + k.lineOnTop([x0 + 6, -30], [x0 + 6, -12], 10, P), { tone: "faint" }));
  return out.join("");
}

// a post on a round foot with a collar, carrying an arm forward over the rail
function post(x, top) {
  const out = [S(k.cylinder(x, POST_Y, 9, 0, 3, P, 32, 0.5), { tone: "mid" })];
  out.push(L(k.ring(x, POST_Y, 6.5, 3, P, 24), { tone: "lo" }));
  out.push(D([[x - 6.5, POST_Y], [x + 6.5, POST_Y]].map(([a, b]) => at([a, b, 3])), { size: 0.4 }));
  out.push(S(k.cylinder(x, POST_Y, 3.6, 3, top - 3, P, 24), { tone: "mid", crease: "none" }));
  out.push(L([20, 36].map((z) => k.sideArc(x, POST_Y, 3.6, z, P, 12)).join(""), { tone: "faint" }));
  return out.join("");
}

function arm(x, z, w = 10) {
  const plan = { x: x - w / 2, y: POST_Y - 6, w, d: CY - POST_Y + 12, r: 2 };
  const out = [S(k.slabOf({ x: x - 7, y: POST_Y - 7, w: 14, d: 14, r: 2.5 }, z - 2, 10, P, 4, 0.6), { tone: "mid" })];
  out.push(S(k.slabOf(plan, z, 5, P, 4, 0.5), { tone: "mid" }));
  out.push(D([at([x, POST_Y + 2, z + 5]), at([x, CY - 2, z + 5])], { size: 0.45 }));
  // thumb screw on the collar
  out.push(S(k.cylinder(x + 9.5, POST_Y, 2.6, z, 6, P, 20), { tone: "mid" }));
  out.push(L(k.knurl(x + 9.5, POST_Y, 2.6, z, z + 6, 18, P), { tone: "lo" }));
  return out.join("");
}

// 2 · merge press: guide rod, spring and a platen that comes down on the photo
const PLATEN = { x: STOPS[1] - 13, y: CY - 10, w: 26, d: 20, r: 1.2 };
const PLATEN_REST = 30;
function pressHead() {
  const x = STOPS[1];
  // two guide rods either side of the screw keep the platen square as it comes down
  // the rods are fixed to the arm (pressRods); only the platen and its screw slide down them
  const out = [S(k.cylinder(x, CY, 2.4, PLATEN_REST + 6, ARM_Z - PLATEN_REST - 6, P, 18), { tone: "lo", crease: "none" })];
  out.push(L([PLATEN_REST + 12, PLATEN_REST + 16].map((z) => k.sideArc(x, CY, 2.4, z, P, 12)).join(""), { tone: "faint" }));
  out.push(S(k.slabOf(PLATEN, PLATEN_REST, 6, P, 4, 0.6), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(PLATEN, 2.5), PLATEN_REST + 6, P), { tone: "faint" }));
  return out.join("");
}

function pressRods() {
  const x = STOPS[1];
  return [-8, 8].map((dx) => S(k.cylinder(x + dx, CY, 1.4, 14, ARM_Z - 14, P, 14), { tone: "mid", crease: "none" })).join("");
}

// 3 · retouch arm: a fine stylus in a chuck
const STYLUS_REST = 26;
function stylus() {
  const x = STOPS[2];
  const out = [S(k.cylinder(x, CY, 4.2, STYLUS_REST + 12, 8, P, 24), { tone: "mid" })];
  out.push(L(k.knurl(x, CY, 4.2, STYLUS_REST + 13, STYLUS_REST + 19, 24, P), { tone: "lo" }));
  out.push(S(k.cylinder(x, CY, 1.6, STYLUS_REST + 2, 10, P, 16), { tone: "hi" }));
  out.push(S(k.cylinder(x, CY, 0.7, STYLUS_REST, 2, P, 12), { tone: "hi" }));
  return out.join("");
}

// 4 · inspection: a loupe ring over the rail and a stamp that marks the check
const STAMP_REST = 24;
function loupe() {
  const x = STOPS[3];
  const out = [S(k.cylinder(x - 7, CY, 9, 34, 4, P, 40, 0.4), { tone: "mid" })];
  out.push(L(k.ring(x - 7, CY, 6.6, 38, P, 40), { tone: "lo" }));
  out.push(L(k.ring(x - 7, CY, 5, 38, P, 40), { tone: "faint" }));
  return out.join("");
}
function stamp() {
  const x = STOPS[3] + 8;
  const out = [S(k.cylinder(x, CY, 1.6, STAMP_REST + 6, ARM_Z - STAMP_REST - 6, P, 16), { tone: "mid", crease: "none" })];
  out.push(S(k.slabOf({ x: x - 5, y: CY - 5, w: 10, d: 10, r: 1 }, STAMP_REST, 6, P, 3, 0.5), { tone: "mid" }));
  return out.join("");
}

// 5 · delivery tray with finished prints
function tray() {
  const x0 = STOPS[4];
  const t = { x: x0 - 24, y: -62, w: 48, d: 30, r: 2 };
  const out = [S(k.slabOf(t, 0, 4, P, 4, 0.5), { tone: "mid" })];
  for (const lip of [{ x: t.x, y: t.y, w: t.w, d: 3, r: 1 }, { x: t.x, y: t.y, w: 3, d: t.d, r: 1 }, { x: t.x + t.w - 3, y: t.y, w: 3, d: t.d, r: 1 }]) {
    out.push(S(k.slabOf(lip, 4, 7, P, 2, 0.3), { tone: "mid" }));
  }
  [0, 1, 2].forEach((i) => out.push(S(k.slabOf({ x: x0 - 15 + i, y: -56 + i * 1.5, w: 30, d: 22, r: 0.6 }, 4 + i * 1.3, 1, P, 2), { tone: "hi" })));
  out.push(screws(t, 2.5, 4, 0.4));
  return out.join("");
}

// the carriage and the photo it carries (the one lit part)
function carriage() {
  const out = [`<path class="iso-halo" d="${k.haloOf(k.insetPlan(CARRIAGE, 3), C_Z, 0.1, P)}" style="filter:blur(4px)"/>`];
  out.push(S(k.slabOf(CARRIAGE, C_Z, C_TOP - C_Z, P, 5, 0.6), { tone: "mid" }));
  out.push(L(k.lineOnTop([CARRIAGE.x, RAIL_Y[0] + 2.5], [CARRIAGE.x + CARRIAGE.w, RAIL_Y[0] + 2.5], C_TOP, P), { tone: "faint" }));
  out.push(L(k.lineOnTop([CARRIAGE.x, RAIL_Y[1] + 2.5], [CARRIAGE.x + CARRIAGE.w, RAIL_Y[1] + 2.5], C_TOP, P), { tone: "faint" }));
  out.push(screws(CARRIAGE, 3, C_TOP, 0.4));
  out.push(S(k.slabOf(k.insetPlan(PHOTO, -2), C_TOP, 1.2, P, 3, 0.3), { tone: "mid" }));
  out.push(`<g data-part="photo">${S(k.slabOf(PHOTO, PHOTO_Z, 1.2, P, 3, 0.2), { tone: "hi", lit: true })}`);
  // the listing in the photo: roofline, house, door, and the horizon
  const roof = k.lineOnTop([-8, 5], [0, -1], PHOTO_TOP, P) + k.lineOnTop([0, -1], [8, 5], PHOTO_TOP, P);
  const house = k.lineOnTop([-6, 5], [-6, 11], PHOTO_TOP, P) + k.lineOnTop([6, 5], [6, 11], PHOTO_TOP, P) + k.lineOnTop([-6, 11], [6, 11], PHOTO_TOP, P);
  const door = k.lineOnTop([-1.4, 11], [-1.4, 7.6], PHOTO_TOP, P) + k.lineOnTop([-1.4, 7.6], [1.4, 7.6], PHOTO_TOP, P) + k.lineOnTop([1.4, 7.6], [1.4, 11], PHOTO_TOP, P);
  out.push(L(roof + house + door, { tone: "hi" }));
  out.push(L(k.lineOnTop([PHOTO.x, 11], [PHOTO.x + PHOTO.w, 11], PHOTO_TOP, P), { tone: "mid" }));
  out.push(`<path data-part="check" class="iso-line" data-tone="lit" d="${k.lineOnTop([8.5, 0], [10, 1.6], PHOTO_TOP, P)}${k.lineOnTop([10, 1.6], [13, -2.4], PHOTO_TOP, P)}" style="opacity:0"/>`);
  out.push(`</g>`);
  // pull handle at the front
  const hx = CARRIAGE.x + CARRIAGE.w - 8;
  out.push(S(k.slabOf({ x: hx - 2, y: CARRIAGE.y + CARRIAGE.d - 1, w: 4, d: 4, r: 1 }, C_Z + 1, 3, P, 2), { tone: "mid", crease: "none" }));
  out.push(S(k.cylinder(hx, CARRIAGE.y + CARRIAGE.d + 4, 3, C_Z, 5, P, 20), { tone: "mid" }));
  out.push(L(k.knurl(hx, CARRIAGE.y + CARRIAGE.d + 4, 3, C_Z, C_Z + 5, 18, P), { tone: "lo" }));
  return out.join("");
}

const move = (part, by, inner) => `<g data-part="${part}" transform="${k.translateAlong(P, by)}">${inner}</g>`;
const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label:
    "A photo-finishing bench with five stations along two rails: a bracket feeder holding three exposures, a press that merges them, a retouch stylus, a loupe and stamp that check the result, and a tray of finished prints. A carriage carries one listing photo from station to station.",
  body: [
    base(),
    rails(),
    feeder(),
    tray(),
    post(STOPS[1], ARM_Z),
    post(STOPS[2], ARM_Z),
    post(STOPS[3], ARM_Z),
    move("carriage", [STOPS[0], 0, 0], carriage()),
    pressRods(),
    move("platen", [0, 0, 0], pressHead()),
    arm(STOPS[1], ARM_Z, 12),
    move("stylus", [0, 0, 0], stylus()),
    arm(STOPS[2], ARM_Z),
    loupe(),
    move("stamp", [0, 0, 0], stamp()),
    arm(STOPS[3], ARM_Z, 26),
  ],
});

const unit = (by) => {
  const m = k.translateAlong(P, by).match(/translate\(([-\d.e]+) ([-\d.e]+)\)/);
  return [Number(m[1]), Number(m[2])];
};
const ts = `// Generated by build.mjs (anatomy skill). Do not edit by hand: change build.mjs and run it again.
export const STUDIO_SVG = ${JSON.stringify(svg)};
/** Screen offset per world unit along x (the rails) and along z (up). Translations are linear, so the live component
    moves parts with these alone and ships no geometry. */
export const AX = ${JSON.stringify(unit([1, 0, 0]))} as const;
export const AZ = ${JSON.stringify(unit([0, 0, 1]))} as const;
export const STOPS = ${JSON.stringify(STOPS)} as const;
/** How far each head travels down to touch the photo, in world units. */
export const DROP = { platen: ${PLATEN_REST - PHOTO_TOP}, stylus: ${STYLUS_REST - PHOTO_TOP}, stamp: ${STAMP_REST - PHOTO_TOP} } as const;
`;
writeFileSync(join(HERE, "studio-art.ts"), ts);
console.log("wrote studio-art.ts", (svg.length / 1024).toFixed(1), "KB");
