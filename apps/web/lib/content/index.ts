import { cacheLife, cacheTag } from "next/cache";
import { readItem, readSection } from "@/lib/server/content-store";
import { DEFAULTS, siteFrom, type ContentKey, type ContentMap } from "./types";

/* Reading admin-managed content on the server. Cached ('use cache', tag `content:<key>`, life 'max'), so pages stay
   prerendered and fast; the admin's save action calls updateTag(`content:<key>`) and the next request gets the new
   value (lib/content/actions.ts). A missing or broken value falls back to the default, so the site never breaks. */

export { contentKey } from "@/lib/server/content-store";

/** The cache tag of one service or post page. */
export const itemTag = (key: "services" | "blog", slug: string) => `content:${key}:${slug}`;

export async function getContent<K extends ContentKey>(key: K): Promise<ContentMap[K]> {
  "use cache";
  cacheTag(`content:${key}`);
  cacheLife("max");
  const saved = await readSection(key).catch((e) => { console.error("[content] read failed", key, e); return null; });
  if (saved == null) return DEFAULTS[key];
  // objects: fill any field the saved copy lacks (a field added after the last save); lists: the saved list wins
  return (Array.isArray(DEFAULTS[key]) ? saved : deepFill(DEFAULTS[key], saved)) as ContentMap[K];
}

/** One service or post by its page address, read straight from the store in its own cache entry (keyed by the
    address, same tag). Pages for addresses created after the build need this: a list read would come from the
    build-time snapshot those pages start from, which an admin save doesn't refresh. */
export async function getItem<K extends "services" | "blog">(key: K, slug: string): Promise<ContentMap[K][number] | undefined> {
  "use cache";
  cacheTag(itemTag(key, slug)); // its own tag: saving another service or post leaves this page cached
  cacheLife("max");
  const found = await readItem(key, slug).catch((e) => { console.error("[content] read failed", key, slug, e); return null; });
  // null: nothing saved at all, so the item comes from the built-in content
  return found === null ? (DEFAULTS[key] as ContentMap[K][number][]).find((x) => x.slug === slug) : found;
}

/** The site facts in the shape components use (`site.contact.whatsappUrl`, `site.startingPrice` …). */
export async function getSite() {
  return siteFrom(await getContent("facts"));
}

function deepFill<T>(base: T, over: unknown): T {
  if (typeof base !== "object" || base === null || Array.isArray(base)) return (over ?? base) as T;
  const o = (over ?? {}) as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const k of Object.keys(base as object)) out[k] = deepFill((base as Record<string, unknown>)[k], o[k]);
  return out as T;
}
