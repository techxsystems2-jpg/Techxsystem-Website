import type { ReactNode } from "react";
import Link from "next/link";
import { PostBody } from "@/features/blog/render";
import { FinalCta } from "./FinalCta";
import { HeroBadge, SkyHero } from "./SkyHero";

/* Text pages (privacy, terms, refunds; owner, 2026-11-04) in the shared page design: the sky hero, then the text in a
   readable column, written with the blog's light markup (## headings, - lists), then the final call to action. */
export function TextPage({ badge, lead, rest, lede, body }: { badge: string; lead: string; rest: string; lede: ReactNode; body: string }) {
  return (
    <>
      <SkyHero badge={<HeroBadge><span className="size-2 rounded-full bg-blue" aria-hidden="true" />{badge}</HeroBadge>} lead={lead} rest={rest} lede={lede} />
      <article className="wrap mt-10 max-w-[720px] md:mt-14">
        <PostBody body={body} />
        <p className="mt-12 border-t border-line pt-6 text-small text-ink-2">
          Questions? <Link href="/contact" className="font-medium text-blue-2 underline-offset-4 hover:underline">Contact the studio</Link> or email support@techxsystems.com.
        </p>
      </article>
      <FinalCta />
    </>
  );
}

/** A page that's planned but not built yet: says what it will be and where to go meanwhile. Kept out of search. */
export function ComingSoon({ lead, lede, meanwhile }: { lead: string; lede: string; meanwhile: { href: string; label: string }[] }) {
  return (
    <>
      <SkyHero badge={<HeroBadge><span className="size-2 rounded-full bg-maroon" aria-hidden="true" />Coming soon</HeroBadge>} lead={lead} rest="Coming soon." lede={lede}>
        <p className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-small font-medium [--i:3]">
          {meanwhile.map((l) => <Link key={l.href} href={l.href} className="inline-flex min-h-11 items-center text-blue-2 underline-offset-4 hover:underline">{l.label} →</Link>)}
        </p>
      </SkyHero>
      <FinalCta />
    </>
  );
}
