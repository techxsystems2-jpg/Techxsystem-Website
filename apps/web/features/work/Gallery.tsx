"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Chip } from "@techx/ui/Chip";
import { countsOf, type Shot } from "./portfolio";
import type { WorkCat } from "@/features/services/data";

const PAGE = 24;

/* Work gallery (Figma 29:155): filter chips with counts, the finished edits in a grid, "Show N more" in pages of 24.
   A photo opens full size in the viewer below (Esc closes, arrow keys or a swipe step through the current filter).
   Tiles press in on pointer-down. Reduced motion: no slides or scaling.
   Editorial rhythm (impeccable critique, owner approved 2026-11-03): under "All", every tenth photo and the one six
   after it run two columns wide in a panoramic crop (32/13 keeps them one row tall), alternating left and right, and
   the floor plans (line drawings, not photos) sit in their own small row under the photos. */
const wideAt = (i: number) => i % 10 === 0 || i % 10 === 6;

export function Gallery({ items: portfolio }: { items: Shot[] }) {
  const categories = countsOf(portfolio);
  const [cat, setCat] = useState<WorkCat | "all">("all");
  const [shown, setShown] = useState(PAGE);
  // `at` outlives `on`, so the viewer closes showing its photo; `set` says which row the photo came from
  const [view, setView] = useState<{ at: number; on: boolean; set: "photos" | "plans" }>({ at: 0, on: false, set: "photos" });
  const reduce = useReducedMotion();
  const all = cat === "all";
  const list = all ? portfolio.filter((s) => s.cat !== "plan") : portfolio.filter((s) => s.cat === cat);
  const plans = all ? portfolio.filter((s) => s.cat === "plan") : [];
  const visible = list.slice(0, shown);
  const more = Math.min(PAGE, list.length - shown);
  const viewing = view.set === "plans" ? plans : visible;

  const pick = (c: WorkCat | "all") => { setCat(c); setShown(PAGE); };

  return (
    <>
      <div role="group" aria-label="Filter by category" className="flex flex-wrap justify-center gap-2">
        <Chip selected={all} onClick={() => pick("all")}>All · {portfolio.length}</Chip>
        {categories.map((c) => (
          <Chip key={c.key} selected={cat === c.key} onClick={() => pick(c.key)}>{c.label} · {c.count}</Chip>
        ))}
      </div>

      <ul className="mt-10 grid grid-flow-dense grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3">
        <AnimatePresence initial={false} mode="popLayout">
          {visible.map((s, i) => {
            const wide = all && wideAt(i);
            return (
              <motion.li key={s.src} layout={!reduce} className={wide ? "col-span-2" : ""} initial={reduce ? false : { opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={reduce ? undefined : { opacity: 0, scale: 0.97 }} transition={{ type: "spring", bounce: 0, duration: 0.4 }}>
                <Tile shot={s} wide={wide} onOpen={() => setView({ at: i, on: true, set: "photos" })} />
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>

      {more > 0 && (
        <div className="mt-10 flex justify-center">
          <button type="button" onClick={() => setShown((n) => n + PAGE)} className="h-11 rounded-[10px] bg-surface px-5 text-[14px] font-medium shadow-hair transition-[box-shadow,scale] duration-150 hover:shadow-raised active:scale-[0.97]">
            Show {more} more
          </button>
        </div>
      )}

      {plans.length > 0 && (
        <div className="mt-14">
          <h2 className="font-mono text-label uppercase text-ink-2">Floor plans · {plans.length}</h2>
          <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
            {plans.map((s, i) => (
              <li key={s.src}><Tile shot={s} onOpen={() => setView({ at: i, on: true, set: "plans" })} /></li>
            ))}
          </ul>
        </div>
      )}

      <Viewer list={viewing} at={view.at} on={view.on} onClose={() => setView((v) => ({ ...v, on: false }))} onStep={(d) => setView((v) => ({ ...v, at: (v.at + d + viewing.length) % viewing.length }))} />
    </>
  );
}

function Tile({ shot: s, wide = false, onOpen }: { shot: Shot; wide?: boolean; onOpen: () => void }) {
  return (
    <button type="button" data-src={s.src} onClick={onOpen} className="group block w-full rounded-card bg-surface p-1.5 text-left shadow-hair transition-[box-shadow,translate,scale] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-raised active:scale-[0.98] active:duration-100">
      <span className={`relative block overflow-hidden rounded-inner outline-1 -outline-offset-1 outline-black/10 ${wide ? "aspect-[16/9] lg:aspect-[32/13]" : "aspect-[16/13]"} ${s.square ? "bg-white" : "bg-sunk"}`}>
        <Image src={s.src} alt={`${s.label} edit by TechX`} fill sizes={wide ? "(min-width: 1024px) 790px, 100vw" : "(min-width: 1024px) 390px, 50vw"} className={`${s.square ? "object-contain p-3" : "object-cover"} transition-transform duration-300 ease-[var(--ease-brand)] group-hover:scale-[1.03]`} />
      </span>
      <span className="flex items-center justify-between px-1.5 pb-0.5 pt-2.5 font-mono text-[11px] uppercase tracking-[0.04em] text-ink-2">
        {s.label}
        <span className="text-ink-3 max-sm:hidden">View</span>
      </span>
    </button>
  );
}

/* The viewer (apple-design review, 2026-11-02):
   - Spatial: it grows out of the tile that was tapped and shrinks back into the tile of the photo on show
     (transform-origin set from that tile), along the same path both ways. CSS @starting-style for the enter,
     allow-discrete for the exit, since a native <dialog> leaves the top layer at once otherwise.
   - Direct: on touch the photo follows the finger 1:1 (Motion drag); on release the flick is projected forward
     (Apple's decay, d = 0.998) and steps if it would land past a quarter of the width, else springs home.
   - The next photo slides in from the side it's coming from; reduced motion cross-fades only.
   - Page scroll is locked while open; Esc, the backdrop and the close button all close it.
   emil-design-eng pass: opens in 300ms, closes faster (200ms); arrow-key steps swap instantly, no slide. */
const project = (v: number, d = 0.998) => ((v / 1000) * d) / (1 - d);

function Viewer({ list, at, on, onClose, onStep }: { list: Shot[]; at: number; on: boolean; onClose: () => void; onStep: (d: number) => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const reduce = useReducedMotion();
  const [dir, setDir] = useState(0);
  const [instant, setInstant] = useState(false); // keyboard steps swap at once (emil: never animate keyboard actions)
  const shot: Shot | undefined = list[at];

  // aim the dialog's transform-origin at the tile showing `src`, so it opens from it and closes into it
  const aim = (src?: string) => {
    const d = ref.current;
    const tile = src && document.querySelector<HTMLElement>(`[data-src="${src}"]`);
    if (!d || !tile) return;
    const t = tile.getBoundingClientRect();
    const r = d.getBoundingClientRect();
    d.style.transformOrigin = `${t.left + t.width / 2 - r.left}px ${t.top + t.height / 2 - r.top}px`;
  };

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (on && !d.open) {
      d.showModal();
      aim(shot?.src);
      document.documentElement.style.overflow = "hidden";
    }
    if (!on && d.open) d.close();
  }, [on, shot?.src]);
  useEffect(() => () => { document.documentElement.style.overflow = ""; }, []);

  const step = (k: number, kbd = false) => { setInstant(kbd); setDir(kbd ? 0 : k); onStep(k); };
  const close = () => { aim(shot?.src); document.documentElement.style.overflow = ""; onClose(); };

  return (
    <dialog
      ref={ref}
      onClose={close}
      onCancel={(e) => { e.preventDefault(); close(); }}
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
      onKeyDown={(e) => { if (e.key === "ArrowRight") step(1, true); if (e.key === "ArrowLeft") step(-1, true); }}
      aria-label={shot ? `${shot.label} edit, ${at + 1} of ${list.length}` : undefined}
      className={[
        "m-auto max-h-[92svh] w-[min(1100px,94vw)] overflow-visible bg-transparent p-0",
        "scale-90 opacity-0 transition-[opacity,scale,display,overlay] transition-discrete duration-200 ease-[var(--ease-brand)] open:scale-100 open:duration-300 open:opacity-100 starting:open:scale-90 starting:open:opacity-0 motion-reduce:scale-100",
        "backdrop:bg-ink/0 backdrop:backdrop-blur-sm backdrop:transition-[background-color,display,overlay] backdrop:transition-discrete backdrop:duration-200 open:backdrop:bg-ink/70 open:backdrop:duration-300 starting:open:backdrop:bg-ink/0",
        "[@media(prefers-reduced-transparency:reduce)]:backdrop:backdrop-blur-none",
      ].join(" ")}
    >
      {shot && (
        <figure className="rounded-card bg-surface p-2 shadow-overlay">
          <div className={`relative aspect-[16/13] max-h-[78svh] w-full overflow-hidden rounded-inner ${shot.square ? "bg-white" : "bg-sunk"}`}>
            <AnimatePresence initial={false} custom={dir}>
              <motion.div
                key={shot.src}
                custom={dir}
                className="absolute inset-0 touch-pan-y"
                initial={reduce ? { opacity: 0 } : { opacity: 0, x: dir * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, x: dir * -60 }}
                transition={instant ? { duration: 0 } : { type: "spring", bounce: 0, duration: 0.35 }}
                drag={reduce ? false : "x"}
                dragSnapToOrigin
                dragElastic={0.35}
                dragMomentum={false}
                onDragEnd={(e, info) => {
                  const w = (e.currentTarget as HTMLElement | null)?.clientWidth ?? 600;
                  const land = info.offset.x + project(info.velocity.x);
                  if (land < -w / 4) step(1);
                  else if (land > w / 4) step(-1);
                }}
              >
                <Image src={shot.src} alt={`${shot.label} edit by TechX`} fill sizes="94vw" draggable={false} className="pointer-events-none select-none object-contain" />
              </motion.div>
            </AnimatePresence>
          </div>
          <figcaption className="flex items-center justify-between gap-3 px-2 pb-1 pt-3">
            <span className="font-mono text-label uppercase text-ink-2">{shot.label} · {at + 1} / {list.length}</span>
            <span className="flex gap-1.5">
              <ViewerButton label="Previous photo" onClick={() => step(-1)} d="M15 18l-6-6 6-6" />
              <ViewerButton label="Next photo" onClick={() => step(1)} d="M9 6l6 6-6 6" />
              <ViewerButton label="Close" onClick={close} d="M6 6l12 12M18 6L6 18" />
            </span>
          </figcaption>
        </figure>
      )}
    </dialog>
  );
}

function ViewerButton({ label, onClick, d }: { label: string; onClick: () => void; d: string }) {
  return (
    <button type="button" aria-label={label} onClick={onClick} className="grid size-11 place-items-center rounded-full text-ink transition-[background-color,scale] duration-150 hover:bg-sunk active:scale-90">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
    </button>
  );
}
