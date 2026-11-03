import { createHash } from "node:crypto";
import { db } from "./db";
import { kvDel, kvGet, kvSet, storeKind } from "./kv";
import { DEFAULTS, type ContentKey, type ContentMap, type Post, type Service } from "@/lib/content/types";

/* Where each admin section is stored (owner, 2026-11-03: "all the services record and all the things include the
   blog should be saved here"). With PostgreSQL (DATABASE_URL):
   - services   → table `services`, one row per service (db/migrations/0002_services_and_posts.sql)
   - blog       → table `blog_posts`, one row per post
   - the rest   → table `site_content`, one row per section (facts, pricing, testimonials, faqs, timeline, values,
                  team, work, seo; 0001)
   Without a database every section is one JSON value in the key-value store (lib/server/kv.ts), as before.
   Photos are links (Blob / Drive / site files), never stored in the database.
   Reads return null when nothing is saved, and callers fall back to the built-in defaults (lib/content). */

export const contentKey = (key: ContentKey) => `techx:content:${key}`;
const RECORDS = new Set<ContentKey>(["services", "blog"]);
const usesTables = (key: ContentKey) => storeKind() === "postgres" && RECORDS.has(key);
const missingTable = (e: unknown) => (e as { code?: string })?.code === "42P01";

const json = (v: unknown) => JSON.stringify(v ?? null);
/** JSON with object keys sorted, so two copies of a record compare equal whatever order their fields were built in. */
/** Short fingerprint of a stored section: the admin sends back the one it loaded, so a stale tab can't overwrite newer content. */
export const versionOf = (v: unknown) => createHash("sha256").update(same(v)).digest("base64url").slice(0, 16);

const same = (v: unknown): string => JSON.stringify(v, (_k, x) => (x && typeof x === "object" && !Array.isArray(x) ? Object.fromEntries(Object.keys(x).sort().map((k) => [k, (x as Record<string, unknown>)[k]])) : x));
const parse = <T>(s: string | null | undefined, fallback: T): T => { try { return s ? (JSON.parse(s) as T) : fallback; } catch { return fallback; } };

/* ── services ─────────────────────────────────────────────────────────────────────────────────────────────────── */

type ServiceRow = {
  slug: string; name: string; short_name: string; line: string; starting_at: string; turnaround: string; tag: string; image: string;
  scene: string; show_levels: boolean; work: string[]; hero: string; fixes: string; faqs: string; note: string; seo_title: string; seo_description: string;
};
const serviceCols = (sql: ReturnType<typeof db>) => sql`slug, name, short_name, line, starting_at, turnaround, tag, image, scene, show_levels, work,
  hero::text as hero, fixes::text as fixes, faqs::text as faqs, note, seo_title, seo_description`;
const toService = (r: ServiceRow): Service => ({
  slug: r.slug, name: r.name, short: r.short_name, line: r.line, from: r.starting_at, turnaround: r.turnaround, tag: r.tag, image: r.image,
  scene: r.scene, levels: r.show_levels, work: r.work ?? [],
  hero: parse(r.hero, { lead: "", rest: "", lede: "" }), fixes: parse(r.fixes, { lead: "", rest: "", items: [] }), faqs: parse(r.faqs, []),
  note: r.note, seo: { title: r.seo_title, description: r.seo_description },
});

async function loadServices(): Promise<Service[] | null> {
  const sql = db();
  const rows = await sql<ServiceRow[]>`select ${serviceCols(sql)} from services order by position, name`;
  return rows.length ? rows.map(toService) : null;
}

async function saveServices(list: Service[]) {
  // only rows that changed are written (or moved), so updated_at says which service was actually edited
  const before = new Map(((await loadServices().catch(() => null)) ?? []).map((s, i) => [s.slug, same([i, s])]));
  await db().begin(async (sql) => {
    for (const [i, s] of list.entries()) {
      if (before.get(s.slug) === same([i, s])) continue;
      await sql`insert into services (slug, position, name, short_name, line, starting_at, turnaround, tag, image, scene, show_levels, work, hero, fixes, faqs, note, seo_title, seo_description, updated_at)
        values (${s.slug}, ${i}, ${s.name}, ${s.short ?? ""}, ${s.line ?? ""}, ${s.from ?? ""}, ${s.turnaround ?? ""}, ${s.tag ?? ""}, ${s.image ?? ""}, ${s.scene ?? ""}, ${!!s.levels},
          array(select jsonb_array_elements_text(${json(s.work ?? [])}::text::jsonb)), ${json(s.hero)}::text::jsonb, ${json(s.fixes)}::text::jsonb, ${json(s.faqs ?? [])}::text::jsonb,
          ${s.note ?? ""}, ${s.seo?.title ?? ""}, ${s.seo?.description ?? ""}, now())
        on conflict (slug) do update set position = excluded.position, name = excluded.name, short_name = excluded.short_name, line = excluded.line,
          starting_at = excluded.starting_at, turnaround = excluded.turnaround, tag = excluded.tag, image = excluded.image, scene = excluded.scene,
          show_levels = excluded.show_levels, work = excluded.work, hero = excluded.hero, fixes = excluded.fixes, faqs = excluded.faqs, note = excluded.note,
          seo_title = excluded.seo_title, seo_description = excluded.seo_description, updated_at = now()`;
    }
    // services taken out of the list in the admin leave the table
    await sql`delete from services where not (slug = any(array(select jsonb_array_elements_text(${json(list.map((s) => s.slug))}::text::jsonb))))`;
  });
}

/* ── blog posts ───────────────────────────────────────────────────────────────────────────────────────────────── */

type PostRow = { slug: string; title: string; excerpt: string; cover: string; date: string; author: string; tags: string[]; body: string; published: boolean; seo_title: string; seo_description: string };
const postCols = (sql: ReturnType<typeof db>) => sql`slug, title, excerpt, cover, to_char(published_on, 'YYYY-MM-DD') as date, author, tags, body, published, seo_title, seo_description`;
const toPost = (r: PostRow): Post => ({
  slug: r.slug, title: r.title, excerpt: r.excerpt, cover: r.cover, date: r.date, author: r.author, tags: r.tags ?? [], body: r.body,
  published: r.published, seo: { title: r.seo_title, description: r.seo_description },
});

async function loadPosts(): Promise<Post[] | null> {
  const sql = db();
  const rows = await sql<PostRow[]>`select ${postCols(sql)} from blog_posts order by published_on desc, created_at desc`;
  return rows.map(toPost); // an empty blog is a real state, not "nothing saved"
}

async function savePosts(list: Post[]) {
  // only posts that changed are written, so updated_at says which post was actually edited
  const before = new Map(((await loadPosts().catch(() => null)) ?? []).map((p) => [p.slug, same(p)]));
  await db().begin(async (sql) => {
    for (const p of list) {
      if (before.get(p.slug) === same(p)) continue;
      await sql`insert into blog_posts (slug, title, excerpt, cover, published_on, author, tags, body, published, seo_title, seo_description, updated_at)
        values (${p.slug}, ${p.title}, ${p.excerpt ?? ""}, ${p.cover ?? ""}, ${p.date}::date, ${p.author ?? ""},
          array(select jsonb_array_elements_text(${json(p.tags ?? [])}::text::jsonb)), ${p.body ?? ""}, ${!!p.published}, ${p.seo?.title ?? ""}, ${p.seo?.description ?? ""}, now())
        on conflict (slug) do update set title = excluded.title, excerpt = excluded.excerpt, cover = excluded.cover, published_on = excluded.published_on,
          author = excluded.author, tags = excluded.tags, body = excluded.body, published = excluded.published,
          seo_title = excluded.seo_title, seo_description = excluded.seo_description, updated_at = now()`;
    }
    // posts deleted in the admin or through the API leave the table
    await sql`delete from blog_posts where not (slug = any(array(select jsonb_array_elements_text(${json(list.map((p) => p.slug))}::text::jsonb))))`;
  });
}

/* ── the API the rest of the site uses ────────────────────────────────────────────────────────────────────────── */

/** A whole section as saved, or null when nothing is saved (the caller uses the built-in default). */
export async function readSection<K extends ContentKey>(key: K): Promise<ContentMap[K] | null> {
  if (usesTables(key)) {
    try {
      return (key === "services" ? await loadServices() : await loadPosts()) as ContentMap[K] | null;
    } catch (e) {
      if (!missingTable(e)) throw e; // tables not set up yet: fall back to the section's JSON copy, if any
    }
  }
  return kvGet<ContentMap[K]>(contentKey(key));
}

/** One service or post by its address (its own query, so pages for new addresses see fresh data). */
export async function readItem<K extends "services" | "blog">(key: K, slug: string): Promise<ContentMap[K][number] | undefined | null> {
  if (usesTables(key)) {
    try {
      const sql = db();
      if (key === "services") {
        const r = await sql<ServiceRow[]>`select ${serviceCols(sql)} from services where slug = ${slug}`;
        if (r[0]) return toService(r[0]) as ContentMap[K][number];
        const any = await sql<{ n: number }[]>`select count(*)::int as n from services`;
        return any[0]!.n ? undefined : null; // no rows at all: nothing saved, use the defaults
      }
      const r = await sql<PostRow[]>`select ${postCols(sql)} from blog_posts where slug = ${slug}`;
      return (r[0] ? toPost(r[0]) : undefined) as ContentMap[K][number] | undefined;
    } catch (e) {
      if (!missingTable(e)) throw e;
    }
  }
  const saved = await kvGet<ContentMap[K]>(contentKey(key));
  return saved ? (saved as ContentMap[K][number][]).find((x) => x.slug === slug) : null;
}

/** Saves a whole section (already cleaned by the admin's rules). */
export async function writeSection<K extends ContentKey>(key: K, value: ContentMap[K]) {
  if (usesTables(key)) {
    if (key === "services") await saveServices(value as Service[]);
    else await savePosts(value as Post[]);
    return;
  }
  await kvSet(contentKey(key), value);
}

/** Back to the built-in content. */
export async function resetSection(key: ContentKey) {
  if (usesTables(key)) return writeSection(key, DEFAULTS[key]);
  await kvDel(contentKey(key));
}

/** Which sections have saved content (the admin overview's Edited / Original badges). */
export async function savedSections(keys: ContentKey[]): Promise<Record<string, boolean>> {
  const out: Record<string, boolean> = {};
  await Promise.all(keys.map(async (k) => {
    if (usesTables(k)) {
      try {
        const sql = db();
        const r = k === "services" ? await sql<{ n: number }[]>`select count(*)::int as n from services` : await sql<{ n: number }[]>`select count(*)::int as n from blog_posts`;
        out[k] = r[0]!.n > 0;
        return;
      } catch { /* tables not set up: fall through */ }
    }
    out[k] = (await kvGet(contentKey(k)).catch(() => null)) != null;
  }));
  return out;
}

/** Puts every section that has nothing saved yet into the store, from the built-in content (the admin's "Save
    everything to the database" button). Never overwrites a saved section. Returns the sections it wrote. */
export async function seedMissing(): Promise<ContentKey[]> {
  const keys = Object.keys(DEFAULTS) as ContentKey[];
  const saved = await savedSections(keys);
  const written: ContentKey[] = [];
  for (const k of keys) {
    if (saved[k]) continue;
    if (k === "blog" && DEFAULTS.blog.length === 0) continue; // nothing to copy; the blog table simply stays empty
    await writeSection(k, DEFAULTS[k]);
    written.push(k);
  }
  return written;
}

/** Cache tags a save has to refresh (owner, 2026-11-03: "use the cache wisely"). The section's own tag (lists, menus,
    every page that shows the section) whenever anything changed; for services and posts, also the page of each item
    that was added, edited or removed, and no other item page. Nothing at all when the save changed nothing (autosave
    often sends what's already stored). */
export function tagsToRefresh(key: ContentKey, before: unknown, after: unknown): string[] {
  if (same(before) === same(after)) return [];
  const tags = [`content:${key}`];
  if (key === "services" || key === "blog") {
    const by = (list: unknown) => new Map(((list as { slug: string }[]) ?? []).map((x) => [x.slug, same(x)]));
    const a = by(before), b = by(after);
    for (const slug of new Set([...a.keys(), ...b.keys()])) if (a.get(slug) !== b.get(slug)) tags.push(`content:${key}:${slug}`);
  }
  return tags;
}
