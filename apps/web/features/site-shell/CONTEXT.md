# Feature: Site shell (on every page)

Read this file and `DESIGN.md` §1–6. Nothing else is needed.

- **Figma:** nav, final CTA and footer as drawn on [Home, node 26:155](https://www.figma.com/design/WGW3zGaOx1NkmCCPomJTbV?node-id=26-155) (top and bottom). Copy verified 2026-10-30.
- **Data:** `lib/site.ts` (`site`, `nav`, `footer`). Change copy there, not in components.

| File | What | Client? |
|---|---|---|
| `SiteHeader.tsx` | Owner's reference: at the top, the nav sits in a glass tab framed by thin lines that draw in and run to the edges (desktop). After 140px of scroll a compact glass capsule materialises (blur + scale + rise). Hover pill glides between links (`layoutId`). Mobile: logo · Free trial · menu; the menu opens inside the capsule with staggered links | yes |
| `SiteHeader.tsx` · announcement bar | 40px ink strip above the nav (owner, 2026-10-31); stays out of the page's sky gradient: "Free trial" tag · "Your first 10 photos are edited free. No card, back by morning." · Start free trial → (phones: "10 photos free · no card"). Copy in `lib/site.ts` `announcement`. Slides away with the header on scroll; `app/layout.tsx` holds the 40px spacer. Page background: `sky-flow` (globals.css) wraps main + footer | yes |
| `StickyTrialBar.tsx` | Mobile only: "10 photos free · no card" + Start trial, after the hero scrolls away | yes |
| `FinalCta.tsx` | Label "Free trial" · "You capture the media." / muted "Send us ten photos and we'll do the rest." · "No card · No contract · Back by morning" · Start free trial + Chat on WhatsApp · WhatsApp / Email / Studio strip. Pages pass their own `lead` / `rest` | no |
| `SiteFooter.tsx` | Logo + "Real estate photo editing, by people, since 2016. Studio in Aligarh, India." · Services · Company · Resources · Start · "© 2026 TechX Systems" · Privacy · Terms · Refunds | no |
| `PageHead.tsx` | Inner-page header: mono label, two-tone H1, lede | no |
| `Logo.tsx` | Mark + "TechX Systems" (Figma footer stacks the mark above the wordmark) | no |

Rules: every page ends with `FinalCta` (information map rule 1). Pricing, Contact and Start free trial stay one click away at every width.
Open: "Log in" needs a client portal (does one exist?). It isn't rendered until confirmed.
