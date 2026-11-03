import { getContent } from "@/lib/content";
import { publishedPosts } from "@/lib/content/blog";
import { fail, json, publicPost, readBody, requireAdmin, storePosts, guard } from "@/lib/server/blog-api";

/* Blog API (owner, 2026-11-03).
   GET  /api/blog          → { posts: [...] } published posts, newest first (public, no body)
   POST /api/blog          → create a post (admin session). JSON: { title, body, excerpt?, cover?, date?, author?, tags?, published?, slug?, seo? }
   One post: /api/blog/<slug> (GET, PUT, DELETE). */
export async function GET() {
  return json({ posts: (await publishedPosts()).map((p) => publicPost(p)) });
}

export const POST = guard(async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const body = await readBody(req);
  if (!body || typeof body.title !== "string" || !body.title.trim()) return fail(400, "Send JSON with at least a title.");
  const before = await getContent("blog");
  const stored = await storePosts([...before, { published: false, tags: [], seo: { title: "", description: "" }, ...body }]);
  const created = stored.find((p) => !before.some((b) => b.slug === p.slug));
  return created ? json({ post: created }, 201) : fail(400, "The post couldn't be created.");
});
