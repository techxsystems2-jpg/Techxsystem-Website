"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useServices } from "@/features/content/ContentProvider";

/* Service tabs (apple-design review, 2026-11-02). On phones the row scrolls sideways, so:
   - the current service is scrolled into view on arrival (wayfinding: "where am I" is never off screen);
   - the edges fade where more tabs sit beyond them, instead of cutting a tab in half (scroll edge effect);
   - tabs press in on pointer-down.
   From xl the page shows ServiceList (left column) instead, so this row is phone and tablet only (owner, 2026-11-14). */
export function ServiceTabs({ slug }: { slug: string }) {
  const services = useServices();
  const row = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const ul = row.current;
    const on = ul?.querySelector<HTMLElement>("[aria-current=page]");
    if (!ul || !on) return;
    ul.scrollLeft = on.offsetLeft - (ul.clientWidth - on.offsetWidth) / 2; // centre it, no animation on arrival
  }, [slug]);

  return (
    <nav aria-label="Services" className="relative mt-14">
      <ul ref={row} className="-mx-5 flex snap-x scroll-px-5 gap-1.5 overflow-x-auto px-5 pb-1 [mask-image:linear-gradient(to_right,transparent,#000_20px,#000_calc(100%-20px),transparent)] [scrollbar-width:none] md:mx-0 md:justify-center md:px-0 md:[mask-image:none]">
        {services.map((x) => {
          const on = x.slug === slug;
          return (
            <li key={x.slug} className="shrink-0 snap-start">
              <Link
                href={`/services/${x.slug}`}
                aria-current={on ? "page" : undefined}
                scroll={false}
                className={`flex h-11 items-center rounded-[10px] px-4 text-[14px] font-medium transition-[background-color,color,scale] duration-200 active:scale-[0.96] active:duration-100 ${on ? "bg-ink text-white" : "text-ink-2 hover:bg-surface hover:text-ink"}`}
              >
                {x.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Desktop: the services as a sticky list in the page's left column (owner, 2026-11-14), so another service is one
    click away anywhere on the page. */
export function ServiceList({ slug }: { slug: string }) {
  const services = useServices();
  return (
    <nav aria-label="Services" className="sticky top-24">
      <Link href="/services" className="block px-3 font-mono text-label uppercase text-ink-2 hover:text-ink">All services</Link>
      <ul className="mt-3 grid gap-1">
        {services.map((x) => {
          const on = x.slug === slug;
          return (
            <li key={x.slug}>
              <Link
                href={`/services/${x.slug}`}
                aria-current={on ? "page" : undefined}
                className={`flex min-h-11 items-center rounded-[10px] px-3 py-2 text-[14px] font-medium leading-snug transition-[background-color,color,scale] duration-200 active:scale-[0.97] active:duration-100 ${on ? "bg-ink text-white" : "text-ink-2 hover:bg-surface hover:text-ink"}`}
              >
                {x.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
