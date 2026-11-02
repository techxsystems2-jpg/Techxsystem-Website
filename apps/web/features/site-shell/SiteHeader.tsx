"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { buttonClass } from "@techx/ui/Button";
import { BgToggle } from "./BgToggle";
import { Mark } from "@techx/ui/Icons";
import { announcement, nav, services } from "@/lib/site";

/* Header, after apple.com's global nav (owner, 2026-10-30):
   - full-width 48px bar; content held to a centred 1024px column with items spread evenly across it;
   - small type (13px, regular, slightly tightened, ink at 80%), the CTA a small pill;
   - transparent at the top of the page; once it scrolls, Apple's material (translucent tint, saturate 180%, blur 20px);
   - Services opens a full-width flyout in the same material, aligned to the column, and the page behind blurs and dims.
     Opens on hover, focus or click; closes 160ms after the pointer leaves, or on Escape.
   Announcement bar (owner, 2026-10-31): a 40px ink strip above the nav. Once the page scrolls or the phone menu opens,
   the whole header slides up 40px so only the nav stays. layout.tsx holds a matching 40px spacer. */

const spring = { type: "spring", bounce: 0, duration: 0.4 } as const;
const thumbs: Record<string, string> = {
  "photo-editing": "/photos/ext.webp",
  "virtual-twilight": "/photos/twi.webp",
  "virtual-staging": "/photos/int.webp",
  "drone-editing": "/photos/aer.webp",
  "floor-plans": "/photos/plan.webp",
  "video-editing": "/photos/ext.webp",
};

export function SiteHeader() {
  const path = usePathname();
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false); // phone menu
  const [flyout, setFlyout] = useState(false); // Services flyout (desktop)
  const closeT = useRef<ReturnType<typeof setTimeout> | null>(null);
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 8));

  const openFly = () => { if (closeT.current) clearTimeout(closeT.current); setFlyout(true); };
  const closeFly = () => { closeT.current = setTimeout(() => setFlyout(false), 160); };

  // Phone menu is a full-screen sheet: the page behind doesn't scroll while it's open
  useEffect(() => {
    document.documentElement.style.overflow = menu ? "hidden" : "";
    return () => { document.documentElement.style.overflow = ""; };
  }, [menu]);

  useEffect(() => {
    if (!flyout) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setFlyout(false); };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [flyout]);

  const solid = scrolled || menu || flyout;
  const barAway = scrolled || menu;
  const current = (href: string) => path === href || path.startsWith(`${href}/`);

  return (
    <>
      {/* page scrim while the flyout is open: blurs and dims what's behind, like apple.com */}
      <AnimatePresence>
        {flyout && (
          <motion.div aria-hidden="true" className="fixed inset-0 z-30 bg-white/30 backdrop-blur-[20px] max-lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} />
        )}
      </AnimatePresence>

      <header className={`fixed inset-x-0 top-0 z-40 transition-transform duration-300 ease-[var(--ease-brand)] ${barAway ? "-translate-y-10" : ""}`} onMouseLeave={closeFly}>
        <div className="flex h-10 items-center justify-center gap-3 bg-ink px-5 text-[13px] tracking-[-0.01em] text-white/80" inert={barAway} onMouseEnter={closeFly}>
          <span className="rounded-md bg-white/12 px-1.5 py-0.5 font-mono text-[11px] uppercase tracking-[0.04em] text-white max-sm:hidden">{announcement.tag}</span>
          <span className="max-sm:hidden">{announcement.text}</span>
          <span className="sm:hidden">{announcement.short}</span>
          {path !== announcement.cta.href && (
            <Link href={announcement.cta.href} className="group -my-1 inline-flex min-h-11 items-center gap-1 font-medium text-white underline decoration-white/35 underline-offset-[3px] transition-[text-decoration-color] duration-150 hover:decoration-white">
              {announcement.cta.label}
              <span aria-hidden="true" className="inline-block transition-transform duration-150 group-hover:translate-x-0.5">→</span>
            </Link>
          )}
        </div>
        <div className={`transition-[background-color,box-shadow] duration-300 ${menu ? "max-lg:bg-[rgb(251_251_253/0.96)]" : ""} ${solid ? "solid-bar bg-[rgb(251_251_253/0.8)] shadow-[0_1px_0_rgb(10_10_11/0.06)] backdrop-blur-[20px] backdrop-saturate-[1.8]" : "bg-transparent"}`}>
          <nav aria-label="Main" className="mx-auto flex h-12 max-w-[1024px] items-center justify-between px-5">
            <Link href="/" aria-label="TechX Systems, home" className="flex items-center gap-2 text-[14px] font-medium tracking-[-0.01em]" onMouseEnter={closeFly}>
              <Mark className="scale-[0.85]" /> <span>TechX <span className="text-ink-3">Systems</span></span>
            </Link>

            {nav.map((l) =>
              l.href === "/services" ? (
                <button
                  key={l.href}
                  type="button"
                  aria-expanded={flyout}
                  aria-controls="services-flyout"
                  onMouseEnter={openFly}
                  onFocus={openFly}
                  onClick={() => setFlyout((f) => !f)}
                  className={`flex h-12 items-center gap-1 text-[13px] tracking-[-0.01em] transition-colors duration-200 max-lg:hidden ${flyout || current(l.href) ? "text-ink" : "text-ink/80 hover:text-ink"}`}
                >
                  {l.label}
                  <motion.svg width="10" height="10" viewBox="0 0 12 12" aria-hidden="true" animate={{ rotate: flyout ? 180 : 0 }} transition={spring}>
                    <path d="M3 4.5L6 7.5 9 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </motion.svg>
                </button>
              ) : (
                <Link key={l.href} href={l.href} onMouseEnter={closeFly} aria-current={current(l.href) ? "page" : undefined}
                  className={`flex h-12 items-center text-[13px] tracking-[-0.01em] transition-colors duration-200 max-lg:hidden ${current(l.href) ? "text-ink" : "text-ink/80 hover:text-ink"}`}>
                  {l.label}
                </Link>
              ),
            )}

            <div className="flex items-center gap-1" onMouseEnter={closeFly}>
              <BgToggle className="mr-2 max-lg:hidden" />
              <Link href="/free-trial" className={buttonClass("primary", "!h-8 !px-3.5 !text-[12.5px]", "sm")}>Start free trial</Link>
              <button type="button" onClick={() => setMenu((o) => !o)} aria-expanded={menu} aria-controls="mobile-menu" aria-label={menu ? "Close menu" : "Open menu"} className="grid size-10 place-items-center rounded-[10px] lg:hidden">
                <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                  <motion.path animate={{ d: menu ? "M4 4L14 14" : "M3 6.5H15" }} transition={spring} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <motion.path animate={{ d: menu ? "M14 4L4 14" : "M3 11.5H15" }} transition={spring} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </nav>

          {/* Services flyout: full width, content aligned to the 1024px column */}
          <AnimatePresence initial={false}>
            {flyout && (
              <motion.div id="services-flyout" className="overflow-hidden max-lg:hidden" onMouseEnter={openFly}
                initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={spring}>
                <motion.div className="mx-auto grid max-w-[1024px] grid-cols-[220px_1fr] gap-12 px-5 pb-14 pt-8"
                  initial={reduce ? false : { opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ ...spring, delay: 0.05 }}>
                  <div>
                    <p className="text-[12px] text-ink-2">Explore services</p>
                    <ul className="mt-3 space-y-1.5">
                      {services.map((s) => (
                        <li key={s.slug}>
                          <Link href={`/services/${s.slug}`} onClick={() => setFlyout(false)} className="font-display text-[22px] font-semibold leading-tight tracking-[-0.02em] text-ink transition-colors duration-150 hover:text-blue">{s.short}</Link>
                        </li>
                      ))}
                    </ul>
                    <Link href="/services" onClick={() => setFlyout(false)} className="mt-5 inline-block text-[12.5px] text-ink-2 hover:text-ink">All services →</Link>
                  </div>
                  <ul className="grid grid-cols-3 gap-x-4 gap-y-5">
                    {services.map((s, i) => (
                      <motion.li key={s.slug} initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.08 + i * 0.03 }}>
                        <Link href={`/services/${s.slug}`} onClick={() => setFlyout(false)} className="group block">
                          <span className="relative block aspect-[16/10] overflow-hidden rounded-xl bg-sunk">
                            <Image src={thumbs[s.slug]!} alt="" fill sizes="240px" className={`transition-transform duration-500 ease-[var(--ease-brand)] group-hover:scale-[1.05] ${s.slug === "floor-plans" ? "bg-white object-contain p-2" : "object-cover"}`} />
                          </span>
                          <span className="mt-2 block text-[13px] font-medium text-ink">{s.name}</span>
                          <span className="mt-0.5 block font-mono text-[11px] uppercase tracking-[0.03em] text-ink-2 group-hover:text-blue">{s.from}</span>
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* phone menu: large links, Apple-style */}
          <AnimatePresence initial={false}>
            {menu && (
              <motion.nav id="mobile-menu" aria-label="Main" className="overflow-hidden lg:hidden" initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={spring}>
                <div className="grid h-[calc(100dvh-3rem)] content-start overflow-y-auto px-8 pb-10 pt-4">
                  {nav.map((l, i) => (
                    <motion.div key={l.href} initial={reduce ? false : { opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.04 * i }}>
                      <Link href={l.href} onClick={() => setMenu(false)} className="flex min-h-12 items-center font-display text-[28px] font-semibold tracking-[-0.02em] text-ink">{l.label}</Link>
                    </motion.div>
                  ))}
                  <div className="mt-8 flex items-center gap-3"><span className="text-small text-ink-2">Background</span><BgToggle /></div>
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </header>
    </>
  );
}
