import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostBody } from "@/features/blog/render";
import { FinalCta } from "@/features/site-shell/FinalCta";
import { JsonLd } from "@/lib/schema";
import { postDate, publishedPost, publishedPosts, readingMinutes } from "@/lib/content/blog";
import { withSeo } from "@/lib/content/seo";
import { site } from "@/lib/site";

/* One blog post (owner, 2026-11-03). Published posts are prebuilt; posts published later render on their first visit
   (Suspense) and stay cached until the next edit. BlogPosting structured data for search. */
type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await publishedPosts();
  // Cache Components needs at least one entry; a placeholder that 404s keeps the build valid before the first post
  return posts.length ? posts.map((p) => ({ slug: p.slug })) : [{ slug: "__none" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await publishedPost((await params).slug);
  if (!p) return { title: "Post not found", robots: { index: false } };
  return withSeo({
    title: p.title,
    description: p.excerpt,
    alternates: { canonical: `/blog/${p.slug}` },
    openGraph: { type: "article", publishedTime: p.date, ...(p.cover ? { images: [{ url: p.cover }] } : {}) },
  }, p.seo);
}

export default function PostPage({ params }: Props) {
  return (
    <Suspense fallback={<div className="wrap min-h-[80svh] pt-36" aria-busy="true" />}>
      <Post params={params} />
    </Suspense>
  );
}

async function Post({ params }: Props) {
  const p = await publishedPost((await params).slug);
  if (!p) notFound();
  const url = new URL(`/blog/${p.slug}`, site.url).toString();
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: p.title,
        description: p.excerpt,
        datePublished: p.date,
        author: p.author ? { "@type": "Person", name: p.author } : { "@type": "Organization", name: site.name },
        publisher: { "@id": new URL("/#organization", site.url).toString() },
        mainEntityOfPage: url,
        url,
        ...(p.cover ? { image: new URL(p.cover, site.url).toString() } : {}),
        ...(p.tags.length ? { keywords: p.tags.join(", ") } : {}),
      }} />
      <article className="wrap max-w-[760px] pt-24 md:pt-32">
        <nav aria-label="Breadcrumb" className="font-mono text-label uppercase text-ink-2">
          <Link href="/blog" className="hover:text-ink">Blog</Link> <span aria-hidden="true">/</span> <span className="text-ink">{postDate(p.date)}</span>
        </nav>
        <h1 className="mt-5 text-h1">{p.title}</h1>
        {p.excerpt && <p className="mt-5 text-lede text-ink-2">{p.excerpt}</p>}
        <p className="mt-5 font-mono text-[12px] uppercase tracking-[0.04em] text-ink-2">
          {p.author ? `${p.author} · ` : ""}{postDate(p.date)} · {readingMinutes(p.body)} min read
        </p>
        {p.cover && (
          <span className="relative mt-8 block aspect-[16/9] overflow-hidden rounded-card bg-sunk outline-1 -outline-offset-1 outline-black/10">
            <Image src={p.cover} alt="" fill priority sizes="(min-width: 768px) 760px, 100vw" className="object-cover" />
          </span>
        )}
        <div className="mt-10"><PostBody body={p.body} /></div>
        {p.tags.length > 0 && <p className="mt-10 flex flex-wrap gap-1.5">{p.tags.map((t) => <span key={t} className="rounded-md bg-sunk px-2 py-0.5 text-[13px] text-ink-2">{t}</span>)}</p>}
        <p className="mt-10"><Link href="/blog" className="text-small font-medium text-blue-2 hover:underline">← All posts</Link></p>
      </article>
      <FinalCta lead="Try it on your own photos." rest="Ten images, free, back by morning." />
    </>
  );
}
