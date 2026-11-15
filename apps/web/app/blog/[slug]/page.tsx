import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostBody } from "@/features/blog/render";
import { FinalCta } from "@/features/site-shell/FinalCta";
import { JsonLd, breadcrumbSchema, postSchema } from "@/lib/schema";
import { postDate, publishedPost, publishedPosts, readingMinutes } from "@/lib/content/blog";
import { withSeo } from "@/lib/content/seo";
import { site } from "@/lib/site";

/* One blog post (owner, 2026-11-03). Published posts are prebuilt; posts published later render on their first visit
   and stay cached until the next edit. BlogPosting structured data for search (lib/schema.tsx). */
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

// Unknown slugs get their real 404 status in proxy.ts (the layout's header Suspense starts the stream before this
// page runs); notFound() here covers a database outage, where the proxy lets the request through.
export default async function PostPage({ params }: Props) {
  const p = await publishedPost((await params).slug);
  if (!p) notFound();
  return (
    <>
      <JsonLd data={postSchema(p)} />
      <JsonLd data={breadcrumbSchema("/blog", [p.title, `/blog/${p.slug}`])} />
      {/* Layout after Vercel's changelog posts (owner, 2026-11-14): plain header, meta in a right rail on desktop. */}
      <article className="wrap grid max-w-[1000px] gap-x-16 pt-24 md:pt-32 lg:grid-cols-[minmax(0,680px)_1fr]">
        <header>
          <nav aria-label="Breadcrumb" className="text-small text-ink-2">
            <Link href="/blog" className="hover:text-ink">Blog</Link>
            {p.tags[0] && <> <span aria-hidden="true">/</span> {p.tags[0]}</>}
          </nav>
          <h1 className="mt-4 text-h2">{p.title}</h1>
          <p className="mt-4 text-small text-ink">{p.author || site.name}</p>
        </header>
        <aside className="mt-6 flex gap-3 text-small text-ink-2 lg:col-start-2 lg:row-start-2 lg:mt-12 lg:block lg:self-start lg:sticky lg:top-24 lg:space-y-1.5">
          <p><time dateTime={p.date}>{postDate(p.date)}</time></p>
          <p>{readingMinutes(p.body)} min read</p>
        </aside>
        <div className="lg:col-start-1 lg:row-start-2">
          {p.cover && (
            <span className="relative mt-10 block aspect-[16/9] overflow-hidden rounded-card bg-sunk outline-1 -outline-offset-1 outline-black/10">
              <Image src={p.cover} alt="" fill priority sizes="(min-width: 768px) 680px, 100vw" className="object-cover" />
            </span>
          )}
          <div className="mt-10"><PostBody body={p.body} /></div>
          {p.tags.length > 0 && <p className="mt-10 flex flex-wrap gap-1.5">{p.tags.map((t) => <span key={t} className="rounded-md bg-sunk px-2 py-0.5 text-[13px] text-ink-2">{t}</span>)}</p>}
          <p className="mt-10"><Link href="/blog" className="text-small font-medium text-blue-2 hover:underline">← All posts</Link></p>
        </div>
      </article>
      <FinalCta lead="Try it on your own photos." rest="Ten images, free, back by morning." />
    </>
  );
}
