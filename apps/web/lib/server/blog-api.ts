import { revalidateTag } from "next/cache";
import { cleanPosts } from "./clean-posts";
import { getContent } from "@/lib/content";
import { coerce, sectionOf } from "@/lib/content/fields";
import type { Post } from "@/lib/content/types";
import { isAdmin } from "./admin";
import { tagsToRefresh, writeSection } from "./content-store";
import { explainDbError } from "./db";

/* Shared by the blog API routes (owner, 2026-11-03). Reads are public (published posts only); writes need the admin
   session cookie, the same sign-in as /admin. Every write goes through the admin's own rules (field shaping, slug and
   date clean-up), so the API can't store anything the panel couldn't. */

export const json = (data: unknown, status = 200) => Response.json(data, { status, headers: { "Cache-Control": status === 200 ? "public, max-age=60" : "no-store" } });
export const fail = (status: number, error: string) => Response.json({ error }, { status, headers: { "Cache-Control": "no-store" } });

/** The public shape of a post (drafts and search overrides stay private). */
export const publicPost = (p: Post, full = false) => ({
  slug: p.slug, title: p.title, excerpt: p.excerpt, cover: p.cover, date: p.date, author: p.author, tags: p.tags,
  url: `/blog/${p.slug}`, ...(full ? { body: p.body } : {}),
});

export async function requireAdmin() {
  return (await isAdmin()) ? null : fail(401, "Sign in at /admin first.");
}

export async function readBody(req: Request) {
  if (!req.headers.get("content-type")?.includes("application/json")) return null;
  try { return (await req.json()) as Record<string, unknown>; } catch { return null; }
}

/** Shapes, cleans and stores the whole list, then refreshes the blog pages. Returns the stored list. */
export async function storePosts(rows: unknown[]): Promise<Post[]> {
  const section = sectionOf("blog")!;
  const shaped = coerce(section.field, rows, await getContent("blog")) as Record<string, unknown>[];
  const before = await getContent("blog");
  const clean = cleanPosts(shaped) as unknown as Post[];
  const tags = tagsToRefresh("blog", before, clean);
  if (!tags.length) return clean;
  try {
    await writeSection("blog", clean);
  } catch (e) {
    console.error("[blog api] store failed", e);
    throw new StoreFailure(explainDbError(e));
  }
  for (const t of tags) revalidateTag(t, { expire: 0 });
  return clean;
}

/** A save that the store (database) refused; the route answers 503 with a readable message instead of a crash page. */
export class StoreFailure extends Error {}

/** Wraps a route handler so a StoreFailure becomes a JSON 503. */
export function guard<A extends unknown[]>(handler: (...args: A) => Promise<Response>) {
  return async (...args: A) => {
    try {
      return await handler(...args);
    } catch (e) {
      if (e instanceof StoreFailure) return fail(503, e.message);
      throw e;
    }
  };
}
