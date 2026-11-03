import { getContent, getItem } from "./index";
import type { Post } from "./types";

/* Blog reads (owner, 2026-11-03). Posts live in the content store under "blog"; only published ones are public,
   newest first. Shared by /blog, /blog/<slug>, the sitemap, llms.txt and the public API (/api/blog). */
export async function publishedPosts(): Promise<Post[]> {
  return (await getContent("blog")).filter((p) => p.published).sort((a, b) => b.date.localeCompare(a.date));
}

export async function publishedPost(slug: string): Promise<Post | undefined> {
  const p = (await getItem("blog", slug)) as Post | undefined;
  return p?.published ? p : undefined;
}

/** "3 Nov 2026" from "2026-11-03", the same everywhere (no locale surprises between server and browser). */
export const postDate = (d: string) => {
  const [y, m, day] = d.split("-").map(Number);
  return `${day} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][(m ?? 1) - 1]} ${y}`;
};

export const readingMinutes = (body: string) => Math.max(1, Math.round(body.split(/\s+/).filter(Boolean).length / 220));
