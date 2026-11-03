"use client";

import { useId, useState, type CSSProperties } from "react";
import Link from "next/link";
import NumberFlow from "@number-flow/react";
import { buttonClass } from "@techx/ui/Button";
import { Chip } from "@techx/ui/Chip";
import { ArrowIcon } from "@techx/ui/Icons";
import type { Plan } from "@/lib/content/types";

/* Monthly calculator (Figma 31:155): listings, photos per listing, level, twilights per listing → an estimated monthly
   cost and the cost per listing. Figma's defaults (20 × 30 at Signature + 1 twilight = $620, $31.00 a listing).
   Rates are the starting rates shown on the site (Pricing plans; twilight from $1.00). Figma draws the total on a black
   card; the owner rejected black cards on pricing, so it sits on the featured blue tint. Numbers change with NumberFlow. */
const TWILIGHT = 1;
const usd = (digits: number) => ({ style: "currency", currency: "USD", minimumFractionDigits: digits, maximumFractionDigits: digits }) as const;

export function Calculator({ plans }: { plans: Plan[] }) {
  const [listings, setListings] = useState(20);
  const [photos, setPhotos] = useState(30);
  const [level, setLevel] = useState(1);
  const [twilights, setTwilights] = useState(1);
  const rate = Number(plans[level].price.slice(1));
  const perListing = photos * rate + twilights * TWILIGHT;
  const total = listings * perListing;

  return (
    <div className="grid gap-2 rounded-card bg-surface p-2 shadow-hair lg:grid-cols-[1.4fr_1fr]">
      <div className="divide-y divide-line px-4 md:px-6">
        <Slider label="Listings per month" value={listings} min={1} max={100} onChange={setListings} />
        <Slider label="Photos per listing" value={photos} min={5} max={80} onChange={setPhotos} />
        <fieldset className="py-6">
          <legend className="float-left text-[15px] font-medium">Level</legend>
          <div className="clear-both flex flex-wrap gap-2 pt-3.5">
            {plans.map((p, i) => (
              <Chip key={p.name} selected={level === i} onClick={() => setLevel(i)} className="h-11 tabular-nums">{p.name} · {p.price}</Chip>
            ))}
          </div>
        </fieldset>
        <Slider label="Twilights per listing" value={twilights} min={0} max={10} onChange={setTwilights} />
      </div>

      <div className="flex flex-col rounded-inner bg-blue-tint p-6 md:p-8" aria-live="polite">
        <p className="font-mono text-label uppercase text-ink-2">Estimated monthly cost</p>
        <p className="mt-3 text-[44px] font-medium leading-none tracking-[-0.03em] tabular-nums min-[400px]:text-[56px] md:text-[64px]">
          <NumberFlow value={total} format={usd(0)} locales="en-US" />
        </p>
        <p className="mt-3 text-small text-ink-2">
          About <span className="tabular-nums text-ink"><NumberFlow value={perListing} format={usd(2)} locales="en-US" /></span> a listing
        </p>
        {/* how the total is made (stageshow review, 2026-11-03: this used to be an empty band above the button) */}
        <dl className="mt-6 grid gap-2 border-t border-blue/15 pt-4 text-small">
          <div className="flex justify-between gap-4"><dt className="text-ink-2">{(listings * photos).toLocaleString("en-US")} photos × {plans[level].price} ({plans[level].name})</dt><dd className="tabular-nums text-ink"><NumberFlow value={listings * photos * rate} format={usd(0)} locales="en-US" /></dd></div>
          <div className="flex justify-between gap-4"><dt className="text-ink-2">{(listings * twilights).toLocaleString("en-US")} twilights × $1.00</dt><dd className="tabular-nums text-ink"><NumberFlow value={listings * twilights * TWILIGHT} format={usd(0)} locales="en-US" /></dd></div>
        </dl>
        <p className="mt-4 text-small text-ink-2">Starting rates. Your final rate depends on the edit and volume, and you&rsquo;ll see it before we start.</p>
        <Link href="/free-trial" className={buttonClass("primary", "mt-auto w-full max-lg:mt-6")}>Start free trial <ArrowIcon className="transition-transform duration-200 group-hover:translate-x-0.5" /></Link>
      </div>
    </div>
  );
}

function Slider({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  const id = useId();
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="py-6">
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-[15px] font-medium">{label}</label>
        <output htmlFor={id} className="text-[20px] font-medium tabular-nums"><NumberFlow value={value} locales="en-US" /></output>
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
          "mt-2 block h-11 w-full cursor-pointer appearance-none bg-transparent focus-visible:outline-none",
          // track: blue up to the thumb, hairline after (Chrome/Safari, then Firefox)
          "[&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-[linear-gradient(to_right,var(--color-blue)_var(--p),var(--color-line-2)_var(--p))]",
          "[&::-moz-range-track]:h-1.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-[linear-gradient(to_right,var(--color-blue)_var(--p),var(--color-line-2)_var(--p))]",
          "[&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_0_0_2px_var(--color-blue),0_2px_6px_rgb(10_10_11/0.2)] [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:duration-150 active:[&::-webkit-slider-thumb]:scale-110",
          "[&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-[0_0_0_2px_var(--color-blue),0_2px_6px_rgb(10_10_11/0.2)]",
          "focus-visible:[&::-webkit-slider-thumb]:shadow-[0_0_0_2px_var(--color-blue),0_0_0_6px_rgb(48_116_254/0.25)]",
        ].join(" ")}
      />
    </div>
  );
}
