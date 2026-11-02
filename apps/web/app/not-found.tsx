import type { Metadata } from "next";
import Link from "next/link";
import { buttonClass } from "@techx/ui/Button";
import { ArrowIcon } from "@techx/ui/Icons";
import { NotFoundStage } from "@/features/site-shell/NotFoundArt";

/* 404 (owner, 2026-11-02): written for the people who'll land here: real-estate photographers and listers in the UK,
   US and Australia. v3 (owner reference: dot-matrix 404, made TechX and real estate; light, following the White / Blue
   background): the 404
   printed in halftone from a TechX twilight edit, a flashlight that lights it up. Message in the listers' words; the
   way out is the free trial (the one primary button) and home, with prices / how it works / contact one tap away.
   Copy follows marketing-skills:copywriting (plain, the reader's words, no invented claims). */
export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

const links = [
  { href: "/pricing", label: "Prices" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/contact", label: "Contact" },
];

export default function NotFound() {
  return (
    <NotFoundStage>
        <p className="mt-6 font-mono text-label uppercase text-ink-2"><b className="font-medium text-maroon">404</b> · No listing at this address</p>
        <h1 className="mx-auto mt-4 max-w-[760px] text-h2">Nothing&rsquo;s listed at this address.</h1>
        <p className="mx-auto mt-4 max-w-[520px] text-[17px] leading-[1.6] text-ink-2">
          This page doesn&rsquo;t exist or has moved. Head back home, or send us ten photos and see what we can do with them.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-2.5">
          <Link href="/free-trial" className={buttonClass("primary")}>Try 10 photos free <ArrowIcon className="transition-transform duration-200 group-hover:translate-x-0.5" /></Link>
          <Link href="/" className={buttonClass("secondary")}>Back to the homepage</Link>
        </div>
        <nav aria-label="More pages" className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 font-mono text-label uppercase">
          {links.map((l) => <Link key={l.href} href={l.href} className="text-ink-2 underline-offset-4 transition-colors duration-150 hover:text-ink hover:underline">{l.label}</Link>)}
        </nav>
    </NotFoundStage>
  );
}
