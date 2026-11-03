import type { Metadata } from "next";
import { getContent } from "./index";
import type { SeoPage } from "./types";

/* Page metadata with the admin's search settings on top (owner, 2026-11-03; admin → Search & sharing).
   Empty admin fields keep the page's built-in title / description; a share image replaces the default one;
   "Hide from search engines" adds noindex. The layout's title template adds "· TechX Systems". */
export async function pageMetadata(page: SeoPage, base: Metadata): Promise<Metadata> {
  const p = (await getContent("seo"))[page];
  return withSeo(base, p);
}

/** Same, for anything with its own search fields (a service, a blog post). */
export function withSeo(base: Metadata, p: { title?: string; description?: string; image?: string; noindex?: boolean }): Metadata {
  const title = p.title || base.title;
  const description = p.description || base.description || undefined;
  const ogTitle = typeof title === "string" ? title : title && typeof title === "object" && "absolute" in title ? title.absolute : undefined;
  return {
    ...base,
    // only set when there is one: an explicit `title: undefined` wipes the layout's default and the page ships with no
    // <title> at all (Lighthouse caught it on Home, 2026-11-03)
    ...(title ? { title } : {}),
    description,
    openGraph: { ...(base.openGraph ?? {}), ...(ogTitle ? { title: ogTitle } : {}), ...(description ? { description } : {}), ...(p.image ? { images: [{ url: p.image }] } : {}) },
    twitter: { card: "summary_large_image", ...(ogTitle ? { title: ogTitle } : {}), ...(description ? { description } : {}), ...(p.image ? { images: [p.image] } : {}) },
    ...(p.noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
