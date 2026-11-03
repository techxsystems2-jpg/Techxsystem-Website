/* Site-wide facts, used by more than one feature. Copy and rates come from Figma (file WGW3zGaOx1NkmCCPomJTbV,
   page "03 — Direction B"), except the starting price, which the owner set on 2026-10-30: from $0.50 an image,
   always shown as a starting price, never a fixed one. Anything marked "confirm" is open in docs/OPEN_ITEMS.md. */

export const site = {
  name: "TechX Systems",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.techxsystems.com",
  lang: "en",
  tagline: "You capture the media. We do the rest.",
  startingPrice: "$0.50",
  description:
    "Real estate post production by people, not presets. Upload after the shoot and it's ready by morning, US time, from $0.50 an image. Ten photos free.",
  // Hero trust badge (owner, 2026-10-30). Both figures to confirm with TechX before launch (docs/OPEN_ITEMS.md).
  trust: { clients: 120, rating: 4.9 }, // owner, 2026-11-04: 120+ clients
  contact: {
    // Figma shows two WhatsApp numbers (final CTA: 74176 20537, Home answer card: 96530 59304). Confirm which one.
    whatsapp: "+91 74176 20537",
    whatsappUrl: "https://wa.me/917417620537",
    email: "support@techxsystems.com",
    // Studio landline from the old site's head office (+91 0571 2976655). Figma writes it "0571 297 6655"; shown in the
    // international form so callers in the US, UK and Australia can dial it as written.
    phone: "+91 571 297 6655",
    phoneUrl: "tel:+915712976655",
    studio: "India",
    hours: "9 AM – 7 PM IST", // confirm
  },
  // Offices and their numbers, from TechX's current site (docs/old-site-content.md; owner, 2026-11-03: show them on
  // Contact). Phones in international form so callers abroad can dial them as written.
  offices: [
    { label: "Head office", city: "Aligarh", country: "IN", address: ["Street No. 1, Dhaurra", "Aligarh, Uttar Pradesh 202002"], phones: ["+91 571 297 6655", "+91 74176 20537"] },
    { label: "Branch office", city: "New Delhi", country: "IN", address: ["G-35, 3rd Floor, Abul Fazal Enclave 2", "Shaheen Bagh, Okhla, New Delhi 110025"], phones: ["+91 96530 59304", "+91 89239 90537"] },
    { label: "London office", city: "London", country: "GB", address: ["118 Pall Mall, St James's", "London SW1Y 5EA"], phones: ["+44 7838 388450"] },
  ],
};

/** Announcement bar above the header (owner, 2026-10-31). Built from verified copy: the free-trial offer
    ("10 photos free · no card") and "Back by morning" from the final CTA. Trial size still to confirm. */
export const announcement = {
  tag: "Free trial",
  text: "Your first 10 photos are edited free. No card, back by morning.",
  short: "10 photos free · no card",
  cta: { href: "/free-trial", label: "Start free trial" },
} as const;

/** Desktop nav: five items. About and Resources live in the footer. */
export const nav = [
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
] as const;

/** Every service shows its starting price (information map rule 2). Copy from the Figma Home service cards. */
export const services = [
  { slug: "photo-editing", name: "Photo editing & HDR", short: "Photo editing", line: "Brackets blended, windows pulled, skies swapped, verticals straight.", from: "From $0.50 / image", scene: "int" },
  { slug: "virtual-twilight", name: "Virtual twilight", short: "Virtual twilight", line: "Daytime exteriors turned to dusk, with every light on.", from: "From $1.00 / image", scene: "twi" },
  { slug: "virtual-staging", name: "Virtual staging", short: "Virtual staging", line: "Empty rooms furnished in the style buyers expect.", from: "From $8 / room", scene: "int" }, // confirm price
  { slug: "drone-editing", name: "Drone & aerial", short: "Drone & aerial", line: "Aerials colour-matched to the ground set, with sky swaps and lot lines.", from: "From $0.50 / image", scene: "aer" },
  { slug: "floor-plans", name: "Floor plans", short: "Floor plans", line: "Your sketch or old plan redrawn as a clean 2D or 3D floor plan.", from: "From $5 / floor", scene: "plan" },
  { slug: "video-editing", name: "Video editing", short: "Video", line: "Two- to three-minute property tours with music and titles.", from: "From $25 / video", scene: "ext" },
] as const;

/** Footer, as in Figma. Links without a route yet render as plain text until the page exists. */
export const footer: { title: string; links: { label: string; href?: string }[] }[] = [
  { title: "Services", links: services.map((s) => ({ href: `/services/${s.slug}`, label: s.short })) },
  { title: "Company", links: [{ href: "/about", label: "About" }, { href: "/work", label: "Work" }, { href: "/pricing", label: "Pricing" }, { href: "/about#reviews", label: "Reviews" }] },
  { title: "Resources", links: [{ href: "/blog", label: "Blog" }, { href: "/faq", label: "FAQ" }, { href: "/techx-vs-ai-editors", label: "TechX vs AI editors" }, { href: "/shoot-guides", label: "Shoot guides" }] },
  { title: "Start", links: [{ href: "/free-trial", label: "Free trial" }, { href: "/client-login", label: "Client login" }, { href: "/contact", label: "Contact" }] },
];
