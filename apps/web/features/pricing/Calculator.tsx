"use client";

import { useId, useState, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import NumberFlow from "@number-flow/react";
import { buttonClass } from "@techx/ui/Button";
import { ArrowIcon } from "@techx/ui/Icons";
import type { Plan } from "@/lib/content/types";

/* Monthly calculator (Figma 31:155): listings, photos per listing, level, twilights per listing → an estimated monthly
   cost and the cost per listing. Figma's defaults (20 × 30 at Signature + 1 twilight = $620, $31.00 a listing).
   Rates are the starting rates shown on the site (Pricing plans; twilight from $1.00). The total sits on the featured
   blue tint (the owner rejected black cards on pricing). Numbers change with NumberFlow.
   Polish pass (owner, 2026-11-04, impeccable + make-interfaces-feel-better): each control shows its value with its
   unit and its range; the level is a segmented picker with each level's starting rate; the summary reads as a receipt
   ending in the total, so the panel has no empty band; corners are concentric (16 = 10 + 6). */
const TWILIGHT = 1;
const usd = (digits: number) => ({ style: "currency", currency: "USD", minimumFractionDigits: digits, maximumFractionDigits: digits }) as const;

export function Calculator({ plans }: { plans: Plan[] }) {
  const [listings, setListings] = useState(20);
  const [photos, setPhotos] = useState(30);
  const [level, setLevel] = useState(Math.min(1, plans.length - 1));
  const [twilights, setTwilights] = useState(1);
  const plan = plans[level] ?? plans[0]!;
  const rate = Number(plan.price.replace(/[^\d.]/g, "")) || 0;
  const perListing = photos * rate + twilights * TWILIGHT;
  const total = listings * perListing;
  const levelId = useId();

  return (
    <div className="grid gap-1.5 rounded-card bg-surface p-1.5 shadow-hair lg:grid-cols-[1.35fr_1fr]">
      <div className="grid content-start gap-1 px-4 py-3 md:px-7 md:py-5">
        <Slider label="Listings per month" unit={["listing", "listings"]} value={listings} min={1} max={100} onChange={setListings} />
        <Slider label="Photos per listing" unit={["photo", "photos"]} value={photos} min={5} max={80} onChange={setPhotos} />

        <div role="radiogroup" aria-labelledby={levelId} className="border-t border-line py-5">
          <p id={levelId} className="text-[15px] font-medium">Editing level</p>
          <div className="mt-3 grid gap-1 rounded-inner bg-sunk p-1" style={{ gridTemplateColumns: `repeat(${plans.length}, minmax(0, 1fr))` }}>
            {plans.map((p, i) => {
              const on = level === i;
              return (
                <button
                  key={p.name}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setLevel(i)}
                  className={`grid min-h-14 content-center gap-0.5 rounded-[7px] px-2 text-center transition-[background-color,box-shadow,color,scale] duration-[220ms] ease-brand active:scale-[0.97] active:duration-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue ${
                    on ? "bg-surface text-ink shadow-[0_0_0_1px_rgb(10_10_11/0.08),0_2px_6px_-2px_rgb(10_10_11/0.16)]" : "text-ink-2 hover:text-ink"
                  }`}
                >
                  <span className="text-[14px] font-medium">{p.name}</span>
                  <span className="font-mono text-[12px] tabular-nums text-ink-2">from {p.price}</span>
                </button>
              );
            })}
          </div>
        </div>

        <Slider label="Twilights per listing" unit={["twilight", "twilights"]} value={twilights} min={0} max={10} onChange={setTwilights} />
      </div>

      <div className="flex flex-col rounded-inner bg-blue-tint p-6 md:p-8" aria-live="polite">
        <p className="font-mono text-label uppercase text-ink-2">Estimated monthly cost</p>
        <p className="mt-3 flex items-baseline gap-2">
          <span className="text-[44px] font-medium leading-none tracking-[-0.03em] tabular-nums min-[400px]:text-[56px] md:text-[64px]">
            <NumberFlow value={total} format={usd(0)} locales="en-US" />
          </span>
          <span className="text-small text-ink-2">a month</span>
        </p>
        <p className="mt-2 text-small text-ink-2">
          About <span className="tabular-nums text-ink"><NumberFlow value={perListing} format={usd(2)} locales="en-US" /></span> a listing
        </p>

        {/* how the total is made, as a receipt */}
        <dl className="mt-6 grid gap-2.5 border-t border-dashed border-ink/15 pt-5 text-small">
          <Line k={<>{(listings * photos).toLocaleString("en-US")} photos × {plan.price} <span className="text-ink-2/80">· {plan.name}</span></>} v={listings * photos * rate} />
          <Line k={<>{(listings * twilights).toLocaleString("en-US")} twilights × $1.00</>} v={listings * twilights * TWILIGHT} />
          <div className="mt-1 flex items-baseline justify-between gap-4 border-t border-dashed border-ink/15 pt-3.5">
            <dt className="font-medium text-ink">Total a month</dt>
            <dd className="font-mono text-[15px] font-medium tabular-nums text-ink"><NumberFlow value={total} format={usd(0)} locales="en-US" /></dd>
          </div>
        </dl>
        <p className="mt-4 text-small leading-[1.6] text-ink-2">Starting rates. Your final rate depends on the edit and volume, and you&rsquo;ll see it before we start.</p>

        <div className="mt-auto pt-7">
          <Link href="/free-trial" className={buttonClass("primary", "w-full")}>Start free trial <ArrowIcon className="transition-transform duration-200 group-hover:translate-x-0.5" /></Link>
          <p className="mt-2.5 text-center text-[13px] text-ink-2">First 10 photos free. No card.</p>
        </div>
      </div>
    </div>
  );
}

function Line({ k, v }: { k: ReactNode; v: number }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-ink-2">{k}</dt>
      <dd className="font-mono text-[13.5px] tabular-nums text-ink"><NumberFlow value={v} format={usd(0)} locales="en-US" /></dd>
    </div>
  );
}

function Slider({ label, unit, value, min, max, onChange }: { label: string; unit: [string, string]; value: number; min: number; max: number; onChange: (v: number) => void }) {
  const id = useId();
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="border-line py-5 [&:not(:first-child)]:border-t">
      <div className="flex items-center justify-between gap-4">
        <label htmlFor={id} className="text-[15px] font-medium">{label}</label>
        <output htmlFor={id} className="inline-flex min-w-[112px] items-baseline justify-end gap-1.5 rounded-input bg-sunk px-3 py-1.5 tabular-nums">
          <span className="text-[17px] font-medium text-ink"><NumberFlow value={value} locales="en-US" /></span>
          <span className="text-[13px] text-ink-2">{value === 1 ? unit[0] : unit[1]}</span>
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ "--p": `${pct}%` } as CSSProperties}
        className={[
          "mt-3 block h-8 w-full cursor-pointer touch-pan-y appearance-none bg-transparent focus-visible:outline-none",
          // track: blue up to the thumb, hairline after (Chrome/Safari, then Firefox)
          "[&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-[linear-gradient(to_right,var(--color-blue)_var(--p),var(--color-line-2)_var(--p))]",
          "[&::-moz-range-track]:h-2 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-[linear-gradient(to_right,var(--color-blue)_var(--p),var(--color-line-2)_var(--p))]",
          "[&::-webkit-slider-thumb]:-mt-[8px] [&::-webkit-slider-thumb]:size-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_0_0_1px_rgb(10_10_11/0.10),0_2px_6px_rgb(10_10_11/0.22)] [&::-webkit-slider-thumb]:transition-[scale,box-shadow] [&::-webkit-slider-thumb]:duration-150 active:[&::-webkit-slider-thumb]:scale-110",
          "[&::-moz-range-thumb]:size-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-[0_0_0_1px_rgb(10_10_11/0.10),0_2px_6px_rgb(10_10_11/0.22)]",
          "focus-visible:[&::-webkit-slider-thumb]:shadow-[0_0_0_1px_rgb(10_10_11/0.10),0_0_0_5px_rgb(48_116_254/0.30)]",
          "focus-visible:[&::-moz-range-thumb]:shadow-[0_0_0_1px_rgb(10_10_11/0.10),0_0_0_5px_rgb(48_116_254/0.30)]",
        ].join(" ")}
      />
      <div aria-hidden className="mt-1 flex justify-between font-mono text-[11.5px] tabular-nums text-ink-2">
        <span>{min}</span><span>{max}</span>
      </div>
    </div>
  );
}
