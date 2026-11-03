# Feature: Services (template for all six) (`/services`)

Read this file, `DESIGN.md` §1–6, and the files under **Uses**. Nothing else is needed for this feature.

- **Figma:** [Services (template for all six), node 28:155](https://www.figma.com/design/WGW3zGaOx1NkmCCPomJTbV?node-id=28-155) (page "03 — Direction B", 2051 × 4570 capture). Figma wins for UI and copy.
- **Route:** `app/services/page.tsx` composes the sections in this folder.
- **Uses:** `features/site-shell` (SkyHero, FinalCta), `lib/site.ts`.
- **Template:** one page design reused for every slug in `lib/site.ts` `services` (copy, fixes and prices swap per service). Only Photo editing & HDR is designed.
- **Uses also:** `features/before-after`.

## Copy (Figma 28:155, Photo editing & HDR)
**Transcribed from Figma 2026-11-02** (one full-height `get_screenshot`, cropped into bands). Where the build departs from Figma, it says why; disagreements are logged in `docs/OPEN_ITEMS.md`.
- Hero: breadcrumb "Services / Photo editing & HDR" · H1 "Bright, straight, true to life." / muted "Photo editing by hand." · lede "Every bracket blended, every window pulled, every vertical straightened. Then a second editor checks the set before it reaches you." · "Try 10 photos free" · "See prices" · stats FROM $0.70 / image · TURNAROUND 12–16 hours · REVISIONS Free. **Built:** From = the service's starting price (lib/site.ts); turnaround from the Figma price list (12–24 h).
- Service tabs: Photo editing & HDR · Virtual twilight · Virtual staging · Drone & aerial · Floor plans · Video editing.
- What's included: H2 "Eight fixes on every photo." / "No add-on menu, no surprises on the invoice." 01 HDR blending "Brackets merged with natural highlights and shadows." · 02 Window pulls "The view outside shows clearly, without grey haze." · 03 Lens correction "Verticals straightened, barrel distortion removed." · 04 Colour correction "White balance matched across the whole set." · 05 Sky replacement "Grey skies swapped for blue, matched to the light." · 06 Lawn greening "Patchy grass made green without looking painted." · 07 Fire in fireplace "A warm, realistic fire in every cold hearth." · 08 TV screen fill "Black screens replaced with a clean, neutral image." **Built:** heading "Eight fixes, done by hand." / "Pick the level that covers what your shoot needs." (Figma's "on every photo" contradicts the levels: sky, lawn, fire and TV are Signature).
- Choose a level: "Three levels, one standard of care." / "Pick per shoot; mix them in one order." Essential $0.50 · Signature $1.00 (Most chosen) · Luxury (Highend Editing) "Commercial & Architectural Buildings" $1.75. **Built:** Home's Pricing (Essential 0.50 · Signature 1.00 · Luxury 1.50, all "From").
- Recent work: "From last week's orders." / "The raw bracket on the left, our edit on the right." cards Living room AUSTIN, TX · Front elevation PERTH, WA · Pool at dusk SCOTTSDALE, AZ · "See all work". **Built:** "From our studio." / "Finished edits, as they went back to the photographer." with TechX's real edits (no raw pairs or locations exist yet).
- Questions: "About photo editing" · How many brackets should I send? → "Three to seven exposures per angle. We blend whatever you shoot." · Can you match my existing style? · Do you edit flash-ambient blends? (no answers in Figma; the last is replaced with "Which files do you accept?" from Home until TechX confirms flash-ambient).
- Final CTA: "Try it on your own photos." / "Ten images, free, back by morning."

## Other five services
Not designed. Same template, content in `data.ts` from the old site's facts (docs/old-site-content.md) and the Figma price-list turnarounds. Staging has a visible "to confirm" note. Index `/services` is assembled from Home parts (not in Figma).

## Files
`app/services/page.tsx` (index) · `app/services/[slug]/page.tsx` (template) · `data.ts` · `ServiceHero.tsx` · `ServiceSections.tsx` (Fixes, RecentWork). Uses `features/service-art`, `features/home` (Pricing, Faq, Compare, ServicesGrid), `features/work/portfolio.ts`.

## Status
- [x] Copy transcribed from Figma (2026-11-02)
- [x] Built (2026-11-02)
- [x] Desktop + phone (390px) checked (2026-11-02)
