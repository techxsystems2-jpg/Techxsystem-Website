"use client";

import Link from "next/link";
import { buttonClass } from "@techx/ui/Button";

/* Shown when a page fails to render (production readiness, 2026-11-03). The header and footer stay, so prices, how it
   works and contact are still one tap away. The error's digest is shown so the owner can find it in the Vercel logs. */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="mx-auto max-w-[640px] px-6 pb-24 pt-36 text-center">
      <p className="font-mono text-label uppercase text-ink-2">Something went wrong</p>
      <h1 className="mt-4 text-h2">This page didn&rsquo;t load.</h1>
      <p className="mx-auto mt-4 max-w-[480px] text-[17px] leading-[1.6] text-ink-2">
        It&rsquo;s on our side, not yours. Try again, or reach us on the contact page and we&rsquo;ll sort it out.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-2.5">
        <button type="button" onClick={reset} className={buttonClass("primary")}>Try again</button>
        <Link href="/contact" className={buttonClass("secondary")}>Contact us</Link>
      </div>
      {error.digest && <p className="mt-8 font-mono text-[13px] text-ink-2">Reference: {error.digest}</p>}
    </main>
  );
}
