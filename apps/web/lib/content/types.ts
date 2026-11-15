import { announcement, services as serviceDefaults, site as siteDefaults } from "@/lib/site";
import { categories, portfolio } from "@/features/work/portfolio";
import { details } from "@/features/services/data";

/* Everything the admin panel can edit (owner, 2026-11-03: "the whole website can be managed from there", phase 1).
   Each key's default is what the site shipped with, so a fresh store shows today's site and nothing breaks before
   the first save. Saved values live in the content store (lib/server/kv.ts) under `techx:content:<key>`.
   Shared by the server (lib/content/index.ts), the admin and the client provider; no server-only code here. */

export type Facts = {
  startingPrice: string;
  trust: { clients: number; rating: number };
  contact: { whatsapp: string; email: string; phone: string; studio: string; hours: string };
  offices: Office[];
  announcement: { text: string; short: string };
  /** On: every public page shows the maintenance page (proxy.ts); the admin and the contact form keep working. */
  maintenance: boolean;
};
/** A service and everything its page (/services/<slug>) shows. The six built-in slugs keep their animated cards;
    a service added in the admin uses its photo instead. */
export type Service = {
  slug: string; name: string; short: string; line: string; from: string; scene: string;
  turnaround: string; tag: string; image: string;
  hero: { lead: string; rest: string; lede: string };
  fixes: { lead: string; rest: string; items: { title: string; text: string }[] };
  levels: boolean; work: string[]; faqs: QA[]; note: string;
  seo: { title: string; description: string };
};
export type Quote = { q: string; name: string; from: string };
/** An office on the Contact page. `country` is a two-letter code (IN, GB, US, AU); `address` and `phones` are lines. */
export type Office = { label: string; city: string; country: string; address: string[]; phones: string[] };
export const COUNTRIES = [{ value: "IN", label: "India" }, { value: "GB", label: "United Kingdom" }, { value: "US", label: "United States" }, { value: "AU", label: "Australia" }];
export type QA = { q: string; a: string };
export type Faqs = { home: QA[]; pricing: QA[]; contact: QA[]; trial: QA[] };
export type Milestone = { year: string; title: string; text: string };
export type Value = { title: string; text: string };
export type Member = { name: string; role: string; photo: string };
export type Shot = { src: string; cat: string; label: string };
/** A Work category (owner, 2026-11-04: categories can be added from the admin). `key` is the short code photos refer to. */
export type WorkCategory = { key: string; label: string };
/** Search settings for one page. Empty strings mean "use the page's built-in title / description / share image". */
export type PageSeo = { title: string; description: string; image: string; noindex: boolean };
export const SEO_PAGES = [
  { key: "home", label: "Home", path: "/" },
  { key: "services", label: "Services", path: "/services" },
  { key: "pricing", label: "Pricing", path: "/pricing" },
  { key: "how-it-works", label: "How it works", path: "/how-it-works" },
  { key: "work", label: "Work", path: "/work" },
  { key: "about", label: "About", path: "/about" },
  { key: "contact", label: "Contact", path: "/contact" },
  { key: "free-trial", label: "Free trial", path: "/free-trial" },
  { key: "blog", label: "Blog", path: "/blog" },
] as const;
export type SeoPage = (typeof SEO_PAGES)[number]["key"];
export type Seo = Record<SeoPage, PageSeo>;

/** A blog post (owner, 2026-11-03). `body` is plain text with light formatting (see features/blog/render.tsx). */
export type Post = {
  slug: string; title: string; excerpt: string; cover: string; date: string; author: string; tags: string[];
  body: string; published: boolean; seo: { title: string; description: string };
};

export type Plan = { name: string; who: string; price: string; label: string; items: string[]; featured: boolean };
export type Pricing = { plans: Plan[]; bulk: string[] };

export type ContentMap = {
  facts: Facts;
  pricing: Pricing;
  services: Service[];
  testimonials: Quote[];
  faqs: Faqs;
  timeline: Milestone[];
  values: Value[];
  team: Member[];
  work: Shot[];
  categories: WorkCategory[];
  seo: Seo;
  blog: Post[];
};
export type ContentKey = keyof ContentMap;

const qa = (rows: [string, string][]): QA[] => rows.map(([q, a]) => ({ q, a }));

// per-service extras that used to live in the pages (Figma price-list turnarounds, table tags, menu photos)
const TURNAROUND: Record<string, string> = { "photo-editing": "10–16 h", "virtual-twilight": "10–16 h", "virtual-staging": "24 h", "drone-editing": "10–16 h", "floor-plans": "24 h", "video-editing": "24–48 h" };
const TAG: Record<string, string> = { "photo-editing": "Most ordered", "virtual-staging": "New" };
const CARD_PHOTO: Record<string, string> = { "photo-editing": "/photos/ext.webp", "virtual-twilight": "/photos/twi.webp", "virtual-staging": "/photos/int.webp", "drone-editing": "/photos/aer.webp", "floor-plans": "/photos/plan.webp", "video-editing": "/photos/ext.webp" };

export const DEFAULTS: ContentMap = {
  facts: {
    startingPrice: siteDefaults.startingPrice,
    trust: { ...siteDefaults.trust },
    contact: { whatsapp: siteDefaults.contact.whatsapp, email: siteDefaults.contact.email, phone: siteDefaults.contact.phone, studio: siteDefaults.contact.studio, hours: siteDefaults.contact.hours },
    offices: siteDefaults.offices.map((o) => ({ ...o, address: [...o.address], phones: [...o.phones] })),
    announcement: { text: announcement.text, short: announcement.short },
    maintenance: false,
  },
  pricing: {
    plans: [
      { name: "Essential", who: "For everyday listings. Clean, bright and true to life.", price: "$0.50", label: "Essential includes", featured: false,
        items: ["HDR merging of your brackets", "Lens and perspective correction", "Colour, white balance and exposure", "Noise reduction", "Resizing for your listing", "Back in 10–16 hours", "Free revisions"] },
      { name: "Signature", who: "For listings that need to stand out. Skies, lawns and windows fixed.", price: "$1.00", label: "Everything in Essential, plus", featured: true,
        items: ["Window enhancement", "Sky replacement", "Grass replacement", "Fire in fireplaces", "TV screen fill", "Flash and reflection removal", "A saved style guide"] },
      { name: "Luxury", who: "For high-end homes that need hand-finished detail.", price: "$1.50", label: "Everything in Signature, plus", featured: false,
        // owner, 2026-11-04: what Luxury includes (the old site has no levels; confirmed by the owner)
        items: ["Hand-masked blends", "Flash and ambient frames blended by hand", "Object removal", "Cords, wires and small clutter removed", "Colour and white balance matched across the whole set", "Commercial and architectural buildings"] },
    ],
    bulk: ["Volume pricing", "A dedicated editor", "One monthly invoice, delivered photos only", "Photos, twilights, floor plans and video in one order", "Mix levels in one order", "24/7 support"],
  },
  services: serviceDefaults.map((s) => {
    const d = details[s.slug];
    return {
      ...s,
      turnaround: TURNAROUND[s.slug] ?? d.turnaround,
      tag: TAG[s.slug] ?? "",
      image: CARD_PHOTO[s.slug] ?? "",
      hero: { lead: d.lead, rest: d.rest, lede: d.lede },
      fixes: { lead: d.fixes.lead, rest: d.fixes.rest, items: d.fixes.items.map(([title, text]) => ({ title, text })) },
      levels: !!d.levels,
      work: d.work ?? [],
      faqs: d.faqs.map(([q, a]) => ({ q, a })),
      note: d.confirm ?? "",
      seo: { title: "", description: "" },
    };
  }),
  testimonials: [
    { q: "I began using TechX over a year ago to assist me with my workflow. Since then I've been able to shoot more, and stress less knowing they will handle the processing.", name: "Fayth Rebiero", from: "USA" },
    { q: "They are photography editing and post-production experts that have a great eye for post-production. They have also taken a large load off of our workflow. Highly recommended.", name: "Jerry Suhrstedt", from: "USA" },
    { q: "A professional and competent agency that provides a personalised service, and the quality of their images edited is excellent. I highly recommend TechX Systems.", name: "Stan", from: "Australia" },
    { q: "Their samples were good before I joined them, and my redone images and videos were even better. Reasonably priced, although their quality is high class.", name: "Patrick Maven", from: "USA" },
    { q: "Very happy and pleased with the work. I have given them a few references to service.", name: "Shane Bailey", from: "Australia" },
  ],
  faqs: {
    home: qa([
      ["How fast will I get my photos back?", "Within 10–16 hours. Send them by evening in the US or Australia and they're usually ready by morning."],
      ["Do I need to pay before you start?", "No. Your first 10 photos are free. After that you're billed monthly, only for photos we deliver."],
      ["What if I don't like an edit?", "Tell us what to change and we'll redo it free, usually the same day."],
      ["Are your edits MLS-compliant?", "Yes. We never change the property itself, and staged rooms are clearly labelled."],
      ["Which files do you accept?", "RAW (CR2, CR3, NEF, ARW, RAF), DNG, JPEG and TIFF. Brackets of 3, 5 or 7 are all fine."],
    ]),
    pricing: qa([
      ["When am I charged?", "At the end of each month, only for photos we delivered. Your first 10 are free."],
      ["Do you charge for revisions?", "No. Ask for a change on any image and we'll redo it free, usually the same day."],
      ["Which payment methods do you take?", "Card, PayPal or bank transfer."],
      ["Is there a minimum order?", "No. Send one photo or a thousand. Studios sending 500+ a month can talk to us about volume pricing."],
    ]),
    contact: qa([
      ["How fast do you reply?", "Usually within the hour on WhatsApp, day or night your time."],
      ["Can I visit the studio?", "Yes, by appointment. Message us first so an editor is free to walk you through how we work."],
      ["Do you sign NDAs?", "Yes. Send yours over before your first shoot and we'll sign and return it."],
    ]),
    trial: qa([
      ["What happens after the trial?", "Nothing, unless you send more. There's no subscription to cancel."],
      ["Can I send brackets?", "Yes. Send every exposure (brackets of 3, 5 or 7 are all fine) in RAW (CR2, CR3, NEF, ARW, RAF), DNG, JPEG or TIFF. Ten photos means ten finished images, however many brackets each takes."],
      ["Will you use my photos?", "No. Your files stay private. We only show a client's photos with their written permission."],
    ]),
  },
  timeline: [
    { year: "2016", title: "Founded in Aligarh", text: "Two people, one client list, real estate first." },
    { year: "2017", title: "Studio in Delhi", text: "A dedicated team and a second-check process." },
    { year: "2019", title: "Video and floor plans", text: "One studio for everything a listing needs." },
    { year: "2026", title: "Virtual staging returns", text: "A new site and a free trial for every photographer." },
  ],
  values: [
    { title: "A person checks every photo", text: "Software helps us work fast. People decide when a photo is finished." },
    { title: "Your style, every time", text: "One style guide per client, followed by every editor on every job." },
    { title: "Honest about the edit", text: "We never change the property itself, and staged rooms are labelled." },
  ],
  // Figma's names and roles; hidden on About until every member has a photo (owner, 2026-11-03)
  team: [
    { name: "Adnan Khan", role: "Founder", photo: "" },
    { name: "Faraz Ahmad", role: "Operations & technology", photo: "" },
    { name: "Akash Kumar", role: "Editing team lead", photo: "" },
    { name: "SM Swaleh", role: "Client relationships", photo: "" },
  ],
  work: portfolio.map((s) => ({ src: s.src, cat: s.cat, label: s.label })),
  categories: categories.map((c) => ({ key: c.key, label: c.label })),
  seo: Object.fromEntries(SEO_PAGES.map((p) => [p.key, { title: "", description: "", image: "", noindex: false }])) as Seo,
  blog: [], // no invented posts: the blog shows an empty state until the first one is published
};

export const WORK_CATEGORIES = categories.map((c) => ({ key: c.key, label: c.label }));

/** The full site facts in the shape components have always used (`site.contact.whatsappUrl` and so on). */
export function siteFrom(f: Facts) {
  const digits = (s: string) => s.replace(/[^\d]/g, "");
  return {
    ...siteDefaults,
    startingPrice: f.startingPrice,
    trust: f.trust,
    offices: f.offices,
    contact: { ...f.contact, whatsappUrl: `https://wa.me/${digits(f.contact.whatsapp)}`, phoneUrl: `tel:+${digits(f.contact.phone)}` },
    announcement: { ...announcement, text: f.announcement.text, short: f.announcement.short },
  };
}
export type SiteData = ReturnType<typeof siteFrom>;

/** What client code reads of a service (header menu, service tabs). Only these go to the browser: the full records
    (page text, what's included, questions) were sent with every page and made up most of its data (speed pass,
    2026-11-03). */
export type ServiceLink = Pick<Service, "slug" | "name" | "short" | "image" | "from">;
export const toLinks = (list: Service[]): ServiceLink[] => list.map(({ slug, name, short, image, from }) => ({ slug, name, short, image, from }));
