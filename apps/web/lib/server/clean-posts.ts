/* Shaping helpers for admin saves. Kept out of the "use server" actions file: every export there is a public endpoint,
   and these are plain functions, not actions (security review, 2026-11-03). */

/** Page addresses: made from the name when empty, lower-case words joined by hyphens, never repeated. */
export const slugify = (s: string) => s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);

/** Blog posts: an address from the title when empty, unique; a real YYYY-MM-DD date (today if not); untitled posts dropped. */
export function cleanPosts(rows: Record<string, unknown>[]) {
  const seen = new Set<string>();
  const today = new Date().toISOString().slice(0, 10);
  return rows.filter((r) => !!r.title).map((r) => {
    const base = slugify(String(r.slug || r.title)) || "post";
    let slug = base, n = 2;
    while (seen.has(slug)) slug = `${base}-${n++}`;
    seen.add(slug);
    const date = /^\d{4}-\d{2}-\d{2}$/.test(String(r.date)) && !Number.isNaN(Date.parse(String(r.date))) ? String(r.date) : today;
    return { ...r, slug, date };
  });
}
