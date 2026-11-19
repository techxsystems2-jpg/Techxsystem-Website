import type { Post, Service, SiteData } from "@/lib/content/types";
import { footer, legal, nav, site } from "@/lib/site";

/* Structured data (JSON-LD), server-rendered into the HTML (claude-seo:seo-schema, 2026-11-02). Facts come only from
   lib/site.ts. FAQPage is left out on purpose: Google retired FAQ rich results in May 2026. */

const abs = (path: string) => new URL(path, site.url).toString();
const ORG_ID = abs("/#organization");

/** Renders one JSON-LD block. `<` is escaped so page text can never close the script tag. */
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

/** Site-wide: the studio and the website (live facts from the content store). */
export const siteSchema = (live: SiteData) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: site.name,
      url: site.url,
      logo: abs("/brand/logo.png"),
      slogan: site.tagline,
      description: site.description,
      foundingDate: "2012",
      email: live.contact.email,
      telephone: live.contact.phone,
      // every office from the admin (Site facts → Offices); the first is the head office
      address: live.offices.length
        ? live.offices.map((o) => ({ "@type": "PostalAddress", name: `${o.label}, ${o.city}`, streetAddress: o.address.join(", "), addressLocality: o.city, addressCountry: o.country }))
        : { "@type": "PostalAddress", addressCountry: "IN" },
      areaServed: ["US", "AU", "GB"],
      ...(live.social.length && { sameAs: live.social.map((s) => s.href) }),
      contactPoint: [
        { "@type": "ContactPoint", contactType: "customer service", email: live.contact.email, telephone: live.contact.phone, availableLanguage: "en" },
        ...live.offices.flatMap((o) => o.phones.map((p) => ({ "@type": "ContactPoint", contactType: "customer service", telephone: p, areaServed: o.country === "IN" ? undefined : o.country, availableLanguage: "en", name: `${o.label}, ${o.city}` }))),
      ],
    },
    { "@type": "WebSite", "@id": abs("/#website"), url: site.url, name: site.name, inLanguage: "en", publisher: { "@id": ORG_ID } },
  ],
});

// Page names as the nav and footer show them, so a renamed link renames its breadcrumb too.
const LABELS = new Map([...nav, ...footer.flatMap((g) => g.links), ...legal].flatMap((l) => (l.href ? [[l.href, l.label] as const] : [])));
/** A page's name: its nav or footer label, or one made from its address (/how-it-works → "How it works"). */
const pageName = (path: string) => LABELS.get(path) ?? (path.split("/").pop() ?? "").replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase());

/** Home › page (› sub-page) trail (SEO audit, 2026-11-14). Pass a page's path, or [name, path] for a page with its
    own title (a post, a service). */
export const breadcrumbSchema = (...trail: (string | [name: string, path: string])[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: ["/", ...trail]
    .map((t) => (typeof t === "string" ? [t === "/" ? "Home" : pageName(t), t] : t))
    .map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: abs(path!) })),
});

/** One blog post. A post without a named person is written by the studio, not a Person called "TechX Systems". */
export const postSchema = (p: Post) => {
  const url = abs(`/blog/${p.slug}`);
  const person = p.author && p.author !== site.name;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: p.title,
    description: p.excerpt,
    datePublished: p.date,
    // no dateModified: posts keep no edit date yet, and repeating datePublished would claim it was never edited
    image: [abs(p.cover || "/opengraph-image")],
    author: person ? { "@type": "Person", name: p.author } : { "@type": "Organization", "@id": ORG_ID, name: site.name },
    publisher: { "@id": ORG_ID },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    isPartOf: { "@type": "Blog", url: abs("/blog"), name: `${site.name} blog` },
    url,
    ...(p.tags.length ? { keywords: p.tags.join(", ") } : {}),
  };
};

/** "From $0.50 / image" → { price: 0.5, unit: "image" }. */
function startingPrice(from: string) {
  const m = from.match(/\$([\d.]+)\s*\/\s*(\w+)/);
  return m ? { price: Number(m[1]), unit: m[2] } : null;
}

/** A service page: the Service with its starting price, and the breadcrumb trail. */
export function serviceSchema(s: Service, description: string) {
  const p = startingPrice(s.from);
  const url = abs(`/services/${s.slug}`);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: s.name,
        serviceType: s.name,
        description,
        url,
        provider: { "@id": ORG_ID },
        areaServed: ["US", "AU", "GB"],
        ...(p && {
          offers: {
            "@type": "Offer",
            url,
            priceCurrency: "USD",
            // a starting price, never a fixed one (AGENTS.md §1)
            priceSpecification: { "@type": "UnitPriceSpecification", minPrice: p.price, priceCurrency: "USD", unitText: p.unit },
          },
        }),
      },
      { "@type": "BreadcrumbList", itemListElement: breadcrumbSchema("/services", [s.name, `/services/${s.slug}`]).itemListElement },
    ],
  };
}
