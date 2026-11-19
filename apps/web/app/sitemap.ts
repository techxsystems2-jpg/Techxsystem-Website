import type { MetadataRoute } from "next";
import { getContent } from "@/lib/content";
import { publishedPosts } from "@/lib/content/blog";
import { photoOptions, site } from "@/lib/site";

// Add each route here as its feature ships. Services come from the admin-managed list, so new ones are included.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, posts, seo, work] = await Promise.all([getContent("services"), publishedPosts(), getContent("seo"), getContent("work")]);
  // pages hidden from search in the admin (Search & sharing) are left out
  const hidden = new Set(Object.entries({ "/": seo.home, "/services": seo.services, "/work": seo.work, "/how-it-works": seo["how-it-works"], "/pricing": seo.pricing, "/about": seo.about, "/contact": seo.contact, "/free-trial": seo["free-trial"], "/blog": seo.blog }).filter(([, v]) => v.noindex).map(([k]) => k));
  const routes = ["/", "/services", ...services.map((s) => `/services/${s.slug}`), ...photoOptions.map((o) => `/services/photo-editing/${o.slug}`), "/work", "/how-it-works", "/pricing", "/about", "/contact", "/free-trial", "/blog", "/faq", "/techx-vs-ai-editors", "/privacy", "/terms", "/refunds"].filter((r) => !hidden.has(r));
  return [
    // the Work gallery's photos ride along as an image sitemap, so they can be found in Google Images (seo pass 2026-11-03)
    ...routes.map((r) => ({ url: new URL(r, site.url).toString(), ...(r === "/work" ? { images: work.map((w) => new URL(w.src, site.url).toString()) } : {}) })),
    ...(hidden.has("/blog") ? [] : posts).map((p) => ({ url: new URL(`/blog/${p.slug}`, site.url).toString(), lastModified: p.date })),
  ];
}
