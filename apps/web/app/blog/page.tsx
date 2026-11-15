import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal, RevealGroup, RevealItem } from "@/features/motion/Reveal";
import { FinalCta } from "@/features/site-shell/FinalCta";
import { HeroBadge, SkyHero } from "@/features/site-shell/SkyHero";
import { postDate, publishedPosts, readingMinutes } from "@/lib/content/blog";
import { pageMetadata } from "@/lib/content/seo";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";

/* Blog index (owner, 2026-11-03). Posts are written in the admin (Blog); only published ones show, newest first.
   Before the first post: an honest empty state, no invented articles. */
export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("blog", {
    title: "Blog: real estate photo editing tips",
    description: "Notes from the TechX studio on shooting and editing real estate photos: brackets, twilights, windows, skies and getting listings ready faster.",
    alternates: { canonical: "/blog" },
  });
}

export default async function Blog() {
  const posts = await publishedPosts();
  return (
    <>
      <JsonLd data={breadcrumbSchema("/blog")} />
      <SkyHero
        badge={<HeroBadge><span className="size-2 rounded-full bg-blue" aria-hidden="true" />From the studio</HeroBadge>}
        lead="The TechX blog."
        rest="Shooting and editing, from the studio."
        lede="Practical notes for real estate photographers: brackets, windows, skies, twilights and getting listings out faster."
      />
      <section className="wrap mt-14">
        {posts.length === 0 ? (
          <Reveal className="mx-auto max-w-[560px] rounded-card bg-surface p-8 text-center shadow-hair">
            <p className="text-h4">The first posts are on their way.</p>
            <p className="mt-2 text-ink-2">Meanwhile, see how the studio works or send ten photos to try us.</p>
            <p className="mt-5 flex justify-center gap-4 text-small font-medium">
              <Link href="/how-it-works" className="text-blue-2 hover:underline">How it works</Link>
              <Link href="/free-trial" className="text-blue-2 hover:underline">Free trial</Link>
            </p>
          </Reveal>
        ) : (
          <RevealGroup as="ul" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <RevealItem as="li" key={p.slug} className="flex">
                <Link href={`/blog/${p.slug}`} className="group flex w-full flex-col rounded-card bg-surface p-2 shadow-hair transition-[box-shadow,translate,scale] duration-200 hover:-translate-y-0.5 hover:shadow-raised active:scale-[0.99]">
                  {/* a post without a cover photo shows no empty box (2026-11-04) */}
                  {p.cover && (
                    <span className="relative block aspect-[16/10] overflow-hidden rounded-inner bg-sunk outline-1 -outline-offset-1 outline-black/10">
                      <Image src={p.cover} alt="" fill sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
                    </span>
                  )}
                  <span className="flex flex-1 flex-col px-3 pb-3 pt-4">
                    <span className="font-mono text-[11px] uppercase tracking-[0.04em] text-ink-2">{postDate(p.date)} · {readingMinutes(p.body)} min read</span>
                    <span className="mt-2 text-h4">{p.title}</span>
                    {p.excerpt && <span className="mt-2 text-small text-ink-2">{p.excerpt}</span>}
                    {p.tags.length > 0 && <span className="mt-auto flex flex-wrap gap-1.5 pt-4">{p.tags.map((t) => <span key={t} className="rounded-md bg-sunk px-2 py-0.5 text-[12px] text-ink-2">{t}</span>)}</span>}
                  </span>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        )}
      </section>
      <FinalCta />
    </>
  );
}
