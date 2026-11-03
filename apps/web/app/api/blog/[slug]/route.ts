import { getContent } from "@/lib/content";
import { publishedPost } from "@/lib/content/blog";
import { fail, json, publicPost, readBody, requireAdmin, storePosts, guard } from "@/lib/server/blog-api";

/* One post (owner, 2026-11-03).
   GET    /api/blog/<slug> → { post } a published post with its body (public)
   PUT    /api/blog/<slug> → update (admin session); send only the fields to change
   DELETE /api/blog/<slug> → remove (admin session) */
type Ctx = { params: Promise<{ slug: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const p = await publishedPost((await params).slug);
  return p ? json({ post: publicPost(p, true) }) : fail(404, "No published post at that address.");
}

export const PUT = guard(async function PUT(req: Request, { params }: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const slug = (await params).slug;
  const body = await readBody(req);
  if (!body) return fail(400, "Send JSON with the fields to change.");
  const posts = await getContent("blog");
  const i = posts.findIndex((p) => p.slug === slug);
  if (i < 0) return fail(404, "No post at that address.");
  const next = posts.map((p, j) => (j === i ? { ...p, ...body } : p));
  const stored = await storePosts(next);
  return json({ post: stored[i] });
});

export const DELETE = guard(async function DELETE(_req: Request, { params }: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const slug = (await params).slug;
  const posts = await getContent("blog");
  if (!posts.some((p) => p.slug === slug)) return fail(404, "No post at that address.");
  await storePosts(posts.filter((p) => p.slug !== slug));
  return json({ deleted: slug });
});
