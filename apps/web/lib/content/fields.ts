import { COUNTRIES, SEO_PAGES, WORK_CATEGORIES, type ContentKey } from "./types";

/* What the admin panel shows for each content key, and the rules a save must pass. One description drives both the
   form (features/admin/Editor.tsx) and the server-side clean-up (`coerce`, run by the save action), so the panel can
   never store something the site can't render. */

export type Field =
  | { type: "text"; max?: number; placeholder?: string; big?: boolean } // big: the title of a post
  | { type: "textarea"; max?: number; rows?: number; rich?: boolean } // rich: the post editor (toolbar, preview, photos)
  | { type: "number"; min?: number; max?: number; step?: number }
  | { type: "toggle" }
  | { type: "lines"; max?: number; help?: string } // one entry per line → string[]
  | { type: "image" }
  | { type: "select"; options: { value: string; label: string }[]; source?: OptionSource }
  | { type: "multi"; options: { value: string; label: string }[]; source?: OptionSource } // tick any number → string[]
  | { type: "object"; fields: { key: string; label: string; help?: string; field: Field; side?: boolean }[]; fold?: boolean } // side: settings column beside the main form; fold: its groups open one at a time
  | { type: "list"; item: Field; fixed?: boolean; max?: number; title?: (row: Record<string, unknown>, i: number) => string; add?: string;
      /** long items (posts, services): a list of rows, each opening on its own screen; the value names one ("post") */
      detail?: string; meta?: (row: Record<string, unknown>) => string };

/** Options that come from saved content instead of the code (e.g. the Work categories the owner adds in the admin). */
export type OptionSource = "categories";
const CODE = /^[a-z0-9][a-z0-9-]{0,39}$/;

const t = (max = 160, placeholder?: string): Field => ({ type: "text", max, placeholder });
const ta = (max = 1200, rows = 3): Field => ({ type: "textarea", max, rows });
const qaList = (): Field => ({ type: "list", max: 30, add: "Add a question", title: (r) => String(r.q || "New question"),
  item: { type: "object", fields: [{ key: "q", label: "Question", field: t(200) }, { key: "a", label: "Answer", field: ta(1200, 3) }] } });

export type Section = { key: ContentKey; title: string; blurb: string; field: Field; pages: string[] };

export const SECTIONS: Section[] = [
  {
    key: "facts", title: "Site facts", pages: ["Every page"],
    blurb: "Maintenance mode, the starting price, contact details, trust figures and the announcement bar. These show up across the whole site.",
    field: { type: "object", fields: [
      { key: "maintenance", label: "Under maintenance", help: "On: visitors see the maintenance page with your contact details and the message form, instead of the site. You still see the full site while signed in here. Changes apply within about 10 seconds.", field: { type: "toggle" } },
      { key: "startingPrice", label: "Starting price", help: "Always shown as a starting price: \"from $0.50 an image\".", field: t(12, "$0.50") },
      { key: "trust", label: "Trust badge (home hero)", field: { type: "object", fields: [
        { key: "clients", label: "Clients served", field: { type: "number", min: 0, max: 100000, step: 1 } },
        { key: "rating", label: "Rating out of 5", field: { type: "number", min: 0, max: 5, step: 0.1 } },
      ] } },
      { key: "contact", label: "Contact", field: { type: "object", fields: [
        { key: "whatsapp", label: "WhatsApp number", help: "In international form, e.g. +91 73034 43810. The chat link is made from it.", field: t(30) },
        { key: "email", label: "Email", field: t(120) },
        { key: "phone", label: "Phone", help: "International form, e.g. +91 571 297 6655.", field: t(30) },
        { key: "studio", label: "Studio location (as shown)", field: t(60) },
        { key: "hours", label: "Studio hours", field: t(60) },
      ] } },
      { key: "social", label: "Social media (footer)", help: "Paste each profile's full link, starting https://. A blank one stays hidden.", field: { type: "object", fields: [
        { key: "facebook", label: "Facebook", field: t(200) },
        { key: "instagram", label: "Instagram", field: t(200) },
        { key: "linkedin", label: "LinkedIn", field: t(200) },
        { key: "youtube", label: "YouTube", field: t(200) },
      ] } },
      { key: "offices", label: "Offices (Contact page)", field: { type: "list", max: 6, add: "Add an office", title: (r) => String(r.city || "New office"), meta: (r) => String(r.label || ""), item: { type: "object", fields: [
        { key: "label", label: "Label", help: "e.g. Head office, Branch office.", field: t(40) },
        { key: "city", label: "City", field: t(40) },
        { key: "country", label: "Country", field: { type: "select", options: COUNTRIES } },
        { key: "address", label: "Address", field: { type: "lines", max: 4, help: "One line per line of the address." } },
        { key: "phones", label: "Phone numbers", field: { type: "lines", max: 4, help: "International form, one per line, e.g. +91 571 297 6655." } },
      ] } } },
      { key: "announcement", label: "Announcement bar", field: { type: "object", fields: [
        { key: "text", label: "Text (desktop)", field: t(120) },
        { key: "short", label: "Short text (phones)", field: t(40) },
      ] } },
    ] },
  },
  {
    key: "pricing", title: "Pricing levels", pages: ["Home", "Pricing", "Photo editing", "Drone"],
    blurb: "The editing levels (add, remove, reorder up to four), what each includes, and the bulk-editing row.",
    field: { type: "object", fields: [
      { key: "plans", label: "Levels (up to four)", field: { type: "list", max: 4, add: "Add a level", title: (r) => String(r.name || "New level"), meta: (r) => (r.price ? `From ${r.price} / image` : ""), item: { type: "object", fields: [
        { key: "name", label: "Name", field: t(30) },
        { key: "price", label: "Starting price", help: "Shown as \"From $X / image\".", field: t(12) },
        { key: "who", label: "Who it's for", field: ta(200, 2) },
        { key: "label", label: "List heading", field: t(60) },
        { key: "items", label: "Includes", field: { type: "lines", max: 20, help: "One item per line." } },
        { key: "featured", label: "Featured (\"Most chosen\")", field: { type: "toggle" } },
      ] } } },
      { key: "bulk", label: "Bulk editing row", field: { type: "lines", max: 12, help: "One item per line." } },
    ] },
  },
  {
    key: "services", title: "Services", pages: ["Home", "Services", "Pricing", "Header", "Footer", "Service pages"],
    blurb: "Add, remove, reorder and edit services. Each one gets its own page at /services/<page address>. The six original services keep their animated cards; a new one shows its photo.",
    field: { type: "list", max: 16, add: "Add a service", detail: "service", title: (r) => String(r.name || "New service"),
      meta: (r) => [r.from, r.turnaround].filter(Boolean).join(" · "), item: { type: "object", fields: [
      { key: "name", label: "Name", field: t(40) },
      { key: "short", label: "Short name (menus)", field: t(24) },
      { key: "slug", label: "Page address", help: "The part after /services/. Leave empty for a new service and it's made from the name. Changing it breaks old links.", side: true, field: t(40) },
      { key: "line", label: "One line (cards)", field: ta(160, 2) },
      { key: "from", label: "Starting price", help: "e.g. From $1.00 / image", side: true, field: t(30) },
      { key: "turnaround", label: "Turnaround", help: "e.g. 10–16 h", side: true, field: t(20) },
      { key: "tag", label: "Tag in the price list (optional)", help: "e.g. New, Most ordered", side: true, field: t(20) },
      { key: "image", label: "Photo (cards and menu)", side: true, field: { type: "image" } },
      { key: "hero", label: "Page header", field: { type: "object", fields: [
        { key: "lead", label: "Headline", field: t(80) },
        { key: "rest", label: "Headline, second part (grey)", field: t(80) },
        { key: "lede", label: "Intro", field: ta(320, 3) },
      ] } },
      { key: "fixes", label: "What's included", field: { type: "object", fields: [
        { key: "lead", label: "Heading", field: t(80) },
        { key: "rest", label: "Heading, second part (grey)", field: t(120) },
        { key: "items", label: "Items", field: { type: "list", max: 12, add: "Add an item", title: (r) => String(r.title || "New item"), item: { type: "object", fields: [
          { key: "title", label: "Title", field: t(60) },
          { key: "text", label: "Line", field: ta(200, 2) },
        ] } } },
      ] } },
      { key: "levels", label: "Show the editing levels on this page", side: true, field: { type: "toggle" } },
      { key: "work", label: "Recent work from these categories", field: { type: "multi", source: "categories", options: WORK_CATEGORIES.map((c) => ({ value: c.key, label: c.label })) } },
      { key: "faqs", label: "Questions", field: qaList() },
      { key: "note", label: "Note under \"What's included\" (optional)", field: t(120) },
      { key: "seo", label: "Search (Google) for this page", side: true, field: { type: "object", fields: [
        { key: "title", label: "Search title", help: "Leave empty to use the built-in title. Aim for 30–60 characters.", field: t(70) },
        { key: "description", label: "Search description", help: "Leave empty to use the built-in one. Aim for 120–155 characters.", field: ta(170, 2) },
      ] } },
    ] } },
  },
  {
    key: "testimonials", title: "Testimonials", pages: ["Home", "About", "Free trial"],
    blurb: "Real client quotes only, with their permission.",
    field: { type: "list", max: 20, add: "Add a quote", title: (r) => String(r.name || "New quote"), item: { type: "object", fields: [
      { key: "q", label: "Quote", field: ta(600, 4) },
      { key: "name", label: "Name", field: t(60) },
      { key: "from", label: "Country", field: t(40) },
    ] } },
  },
  {
    key: "faqs", title: "Questions", pages: ["Home", "Services", "Pricing", "Contact", "Free trial"],
    blurb: "The questions block on each page.",
    field: { type: "object", fields: [
      { key: "home", label: "Home and Services", field: qaList() },
      { key: "pricing", label: "Pricing", field: qaList() },
      { key: "contact", label: "Contact", field: qaList() },
      { key: "trial", label: "Free trial", field: qaList() },
    ] },
  },
  {
    key: "timeline", title: "Timeline", pages: ["About"],
    blurb: "The years on the About page.",
    field: { type: "list", max: 12, add: "Add a year", title: (r) => `${r.year || "----"} · ${r.title || "New"}`, item: { type: "object", fields: [
      { key: "year", label: "Year", field: t(8) },
      { key: "title", label: "Title", field: t(60) },
      { key: "text", label: "Line", field: ta(200, 2) },
    ] } },
  },
  {
    key: "values", title: "How we work", pages: ["About"],
    blurb: "The three cards under the timeline.",
    field: { type: "list", max: 6, add: "Add a card", title: (r) => String(r.title || "New card"), item: { type: "object", fields: [
      { key: "title", label: "Title", field: t(60) },
      { key: "text", label: "Text", field: ta(240, 2) },
    ] } },
  },
  {
    key: "team", title: "Team", pages: ["About"],
    blurb: "The team appears on About once every person has a portrait. Square photos work best.",
    field: { type: "list", max: 24, add: "Add a person", title: (r) => String(r.name || "New person"), item: { type: "object", fields: [
      { key: "photo", label: "Portrait", field: { type: "image" } },
      { key: "name", label: "Name", field: t(60) },
      { key: "role", label: "Role", field: t(60) },
    ] } },
  },
  {
    key: "work", title: "Work gallery", pages: ["Work", "Service pages"],
    blurb: "The photos on the Work page, in order. Each needs a category; the service pages show the first ones of theirs.",
    field: { type: "list", max: 400, add: "Add photos", title: (r) => String(r.label || r.cat), item: { type: "object", fields: [
      { key: "src", label: "Photo", field: { type: "image" } },
      { key: "cat", label: "Category", field: { type: "select", source: "categories", options: WORK_CATEGORIES.map((c) => ({ value: c.key, label: c.label })) } },
      { key: "label", label: "Label (optional)", field: t(40) },
      { key: "alt", label: "Description (optional)", help: "What the photo shows, for Google and screen readers, e.g. \"Kitchen with a white island and pendant lights\".", field: t(140) },
    ] } },
  },
  {
    key: "categories", title: "Work categories", pages: ["Work", "Service pages"],
    blurb: "The categories photos are sorted into (Interior, Drone and so on). Add one for a new service, and it appears in the photo menus, on the Work page filters and in each service's recent work.",
    field: { type: "list", max: 30, add: "Add a category", title: (r) => String(r.label || "New category"), meta: (r) => (r.key ? `Code: ${r.key}` : "Code made from the name"), item: { type: "object", fields: [
      { key: "label", label: "Name", help: "As shown on the Work page, e.g. Commercial.", field: t(30) },
      { key: "key", label: "Code", help: "Short code photos use. Left empty, it's made from the name. Don't change it once photos use it.", field: t(40) },
    ] } },
  },
  {
    key: "blog", title: "Blog", pages: ["Blog", "Sitemap"],
    blurb: "Write, edit and publish posts. A post stays a draft, hidden from the site, until you switch Published on.",
    field: { type: "list", max: 300, add: "Write a new post", detail: "post", title: (r) => String(r.title || "Untitled post"),
      meta: (r) => `${r.published ? "Published" : "Draft"}${r.date ? ` · ${r.date}` : ""}`, item: { type: "object", fields: [
      { key: "title", label: "Title", field: { type: "text", max: 110, big: true, placeholder: "Post title" } },
      { key: "body", label: "Post", field: { type: "textarea", max: 40000, rows: 18, rich: true } },
      { key: "published", label: "Published", side: true, field: { type: "toggle" } },
      { key: "date", label: "Date", help: "YYYY-MM-DD", side: true, field: t(10, "2026-11-03") },
      { key: "slug", label: "Page address", help: "The part after /blog/. Leave empty and it's made from the title.", side: true, field: t(80) },
      { key: "author", label: "Author", side: true, field: t(60) },
      { key: "cover", label: "Cover photo", side: true, field: { type: "image" } },
      { key: "excerpt", label: "Summary (cards and previews)", side: true, field: ta(280, 3) },
      { key: "tags", label: "Tags", side: true, field: { type: "lines", max: 8, help: "One per line." } },
      { key: "seo", label: "Search (Google)", side: true, field: { type: "object", fields: [
        { key: "title", label: "Search title", help: "Leave empty to use the built-in title. Aim for 30–60 characters.", field: t(70) },
        { key: "description", label: "Search description", help: "Leave empty to use the built-in one. Aim for 120–155 characters.", field: ta(170, 2) },
      ] } },
    ] } },
  },
  {
    key: "seo", title: "Search & sharing", pages: ["Every page"],
    blurb: "What Google and link previews show for each page: title, description, share image, and whether search engines may list the page. Empty fields use the page's built-in text.",
    field: { type: "object", fold: true, fields: SEO_PAGES.map((p) => ({ key: p.key, label: `${p.label} (${p.path})`, field: { type: "object" as const, fields: [
      { key: "title", label: "Search title", help: "30–60 characters. \"· TechX Systems\" is added for you.", field: t(70) },
      { key: "description", label: "Search description", help: "120–155 characters.", field: ta(170, 2) },
      { key: "image", label: "Share image (link previews)", field: { type: "image" as const } },
      { key: "noindex", label: "Hide this page from search engines", field: { type: "toggle" as const } },
    ] } })) },
  },
];

export const sectionOf = (key: string) => SECTIONS.find((s) => s.key === key);

/** Images the site may show: our own files, or uploads in Vercel Blob. */
export const allowedImage = (src: string) =>
  /^\/(photos|uploads)\/[\w./-]+$/.test(src) || /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\/[\w./%-]+$/i.test(src);

/** Shapes untrusted input to the field description: drops unknown keys, trims and limits strings, clamps numbers.
    `fallback` is the current (or default) value, used where the input is missing or unusable. */
export function coerce(field: Field, input: unknown, fallback: unknown): unknown {
  switch (field.type) {
    case "text":
    case "textarea": {
      const s = typeof input === "string" ? input : typeof fallback === "string" ? fallback : "";
      return s.replace(/\r\n?/g, "\n").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "").trim().slice(0, field.max ?? 400);
    }
    case "number": {
      const n = typeof input === "number" ? input : Number(input);
      const v = Number.isFinite(n) ? n : Number(fallback) || 0;
      return Math.min(field.max ?? Infinity, Math.max(field.min ?? -Infinity, v));
    }
    case "toggle":
      return input === true || input === "true" || input === "on";
    case "lines": {
      const arr = Array.isArray(input) ? input : typeof input === "string" ? input.split("\n") : (fallback as string[]) ?? [];
      return arr.map((x) => String(x).trim().slice(0, 160)).filter(Boolean).slice(0, field.max ?? 30);
    }
    case "image": {
      const s = typeof input === "string" ? input.trim() : "";
      return s === "" || allowedImage(s) ? s : typeof fallback === "string" ? fallback : "";
    }
    case "multi": {
      const arr = Array.isArray(input) ? input.map(String) : Array.isArray(fallback) ? (fallback as string[]) : [];
      // saved-content options (categories) can be any well-formed code; the rest must be one of the listed options
      if (field.source) return [...new Set(arr.filter((v) => CODE.test(v)))];
      return field.options.map((o) => o.value).filter((v) => arr.includes(v));
    }
    case "select": {
      const s = String(input ?? "");
      if (field.source) return CODE.test(s) ? s : (fallback ?? field.options[0]?.value ?? "");
      return field.options.some((o) => o.value === s) ? s : (fallback ?? field.options[0]?.value ?? "");
    }
    case "object": {
      const src = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
      const fb = (fallback && typeof fallback === "object" ? fallback : {}) as Record<string, unknown>;
      return Object.fromEntries(field.fields.map((f) => [f.key, coerce(f.field, src[f.key], fb[f.key])]));
    }
    case "list": {
      const fb = Array.isArray(fallback) ? fallback : [];
      const arr = Array.isArray(input) ? input : fb;
      // a fixed list keeps its length and order of identity (e.g. the six services keep their slugs)
      const rows = field.fixed ? fb.map((row, i) => ({ ...(row as object), ...(arr[i] as object) })) : arr.slice(0, field.max ?? 100);
      return rows.map((row, i) => {
        const shaped = coerce(field.item, row, fb[i]) as Record<string, unknown>;
        return field.fixed ? { ...(fb[i] as object), ...shaped } : shaped;
      });
    }
  }
}
