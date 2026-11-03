"use server";

import { updateTag } from "next/cache";
import { isAdmin } from "@/lib/server/admin";
import { resetSection, seedMissing, tagsToRefresh, versionOf, writeSection } from "@/lib/server/content-store";
import { DEFAULTS } from "@/lib/content/types";
import { explainDbError } from "@/lib/server/db";
import { storeImage } from "@/lib/server/media";
import { getContent } from "@/lib/content";
import { coerce, sectionOf } from "@/lib/content/fields";
import { cleanPosts, slugify } from "@/lib/server/clean-posts";
import type { ContentKey } from "@/lib/content/types";

/* Admin panel saves (owner, 2026-11-03). Each action re-checks the session: a Server Action is a public endpoint.
   Input is shaped by the section's field description (lib/content/fields.ts) before it's stored, then the content's
   cache tag is updated so the live site shows the change on the next request. */

type Result = { ok: true; url?: string; version?: string } | { ok: false; error: string; stale?: boolean };
const SIGNED_OUT: Result = { ok: false, error: "Your session ended. Sign in again, then save." };

// rows that would render as nothing are dropped, so a half-filled "Add" never shows an empty card on the site
const keep: Partial<Record<ContentKey, (row: Record<string, unknown>) => boolean>> = {
  testimonials: (r) => !!r.q && !!r.name,
  timeline: (r) => !!r.year && !!r.title,
  values: (r) => !!r.title,
  team: (r) => !!r.name,
  work: (r) => !!r.src,
};
const keepQA = (r: Record<string, unknown>) => !!r.q && !!r.a;

function withSlugs(rows: Record<string, unknown>[], current: { slug: string; scene: string }[]) {
  const seen = new Set<string>();
  return rows.filter((r) => !!r.name).map((r) => {
    const base = slugify(String(r.slug || r.name)) || "service";
    let slug = base, n = 2;
    while (seen.has(slug)) slug = `${base}-${n++}`;
    seen.add(slug);
    return { ...r, slug, short: r.short || r.name, scene: current.find((c) => c.slug === slug)?.scene ?? "ext" };
  });
}

export async function saveContent(key: string, value: unknown, version?: string): Promise<Result> {
  if (!(await isAdmin())) return SIGNED_OUT;
  const section = sectionOf(key);
  if (!section) return { ok: false, error: "Unknown section." };
  const current = await getContent(section.key);
  // the tab saves a whole section: refuse if someone (another tab, the blog API) changed it since this tab loaded it
  if (version && versionOf(current) !== version) return { ok: false, stale: true, error: "This section changed somewhere else since you opened it. Reload to get the latest, then make your change again." };
  let clean = coerce(section.field, value, current) as unknown;
  const rule = keep[section.key];
  if (rule && Array.isArray(clean)) clean = (clean as Record<string, unknown>[]).filter(rule);
  if (section.key === "services") clean = withSlugs(clean as Record<string, unknown>[], current as { slug: string; scene: string }[]);
  if (section.key === "blog") clean = cleanPosts(clean as Record<string, unknown>[]);
  if (section.key === "categories") {
    const seen = new Set<string>();
    clean = (clean as { key: string; label: string }[]).filter((c) => c.label).map((c) => {
      const base = slugify(c.key || c.label).slice(0, 40).replace(/-+$/, "") || "category";
      let key = base, n = 2;
      while (seen.has(key)) key = `${base}-${n++}`;
      seen.add(key);
      return { key, label: c.label };
    });
  }
  if (section.key === "faqs") clean = Object.fromEntries(Object.entries(clean as Record<string, Record<string, unknown>[]>).map(([k, rows]) => [k, rows.filter(keepQA)]));
  // autosave often sends what's already stored: then nothing is written and no cached page is refreshed
  const tags = tagsToRefresh(section.key, current, clean);
  if (!tags.length) return { ok: true, version: versionOf(current) };
  try {
    await writeSection(section.key, clean as never);
  } catch (e) {
    console.error("[admin] save failed", section.key, e);
    return { ok: false, error: explainDbError(e) };
  }
  for (const t of tags) updateTag(t);
  return { ok: true, version: versionOf(clean) };
}

/** Back to what the site shipped with. */
export async function resetContent(key: string): Promise<Result> {
  if (!(await isAdmin())) return SIGNED_OUT;
  const section = sectionOf(key);
  if (!section) return { ok: false, error: "Unknown section." };
  const current = await getContent(section.key);
  try {
    await resetSection(section.key);
  } catch (e) {
    console.error("[admin] reset failed", section.key, e);
    return { ok: false, error: explainDbError(e) };
  }
  for (const t of tagsToRefresh(section.key, current, DEFAULTS[section.key])) updateTag(t);
  updateTag(`content:${section.key}`);
  return { ok: true };
}

export async function uploadImage(form: FormData): Promise<Result> {
  if (!(await isAdmin())) return SIGNED_OUT;
  try {
    const url = await storeImage(form.get("file") as File, String(form.get("folder") ?? "misc"));
    return { ok: true, url };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Upload failed. Try again." };
  }
}

/** "Save everything to the database": writes every section that has nothing saved yet from the built-in content
    (services and posts as rows, the rest as one row per section). Never overwrites saved content. */
export async function saveAllToStore(): Promise<Result & { written?: string[] }> {
  if (!(await isAdmin())) return SIGNED_OUT;
  try {
    const written = await seedMissing();
    for (const k of written) updateTag(`content:${k}`); // same content as the built-in defaults, so item pages stay as they are
    return { ok: true, written };
  } catch (e) {
    console.error("[admin] save all failed", e);
    return { ok: false, error: explainDbError(e) };
  }
}
