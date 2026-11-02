"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonClass } from "@techx/ui/Button";

/** Mobile only: keeps "Start trial" on screen once the hero has scrolled away (information map rule 3). */
export function StickyTrialBar() {
  const path = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const on = () => setShow(scrollY > innerHeight * 0.8);
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);

  if (path === "/free-trial") return null;

  return (
    <div
      className={`fixed inset-x-3 bottom-[max(12px,env(safe-area-inset-bottom))] z-30 flex items-center justify-between gap-3 rounded-card bg-surface py-2 pl-5 pr-2 shadow-overlay transition-[opacity,translate] duration-[320ms] md:hidden ${show ? "" : "pointer-events-none translate-y-4 opacity-0"}`}
      aria-hidden={!show}
    >
      <span className="text-small text-ink-2">10 photos free · no card</span>
      <Link href="/free-trial" tabIndex={show ? 0 : -1} className={buttonClass("primary", "", "sm")}>
        Start trial
      </Link>
    </div>
  );
}
