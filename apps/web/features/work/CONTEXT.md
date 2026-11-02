# Feature: Work (portfolio) (`/work`)

Read this file, `DESIGN.md` §1–6, and the files under **Uses**. Nothing else is needed for this feature.

- **Figma:** [Work (portfolio), node 29:155](https://www.figma.com/design/WGW3zGaOx1NkmCCPomJTbV?node-id=29-155) (page "03 — Direction B", 2051 × 2963 capture). Figma wins for UI and copy.
- **Route:** `app/work/page.tsx` composes the sections in this folder.
- **Uses:** `features/site-shell` (PageHead, FinalCta), `lib/site.ts`.
- **Uses also:** `features/before-after` (hover-to-raw tiles), `@techx/ui` Chip + segmented toggle.

## Copy (Figma 29:155)
**Transcribed from Figma 2026-11-02** (one full-height `get_screenshot`, cropped into bands). Where the build departs from Figma, it says why; disagreements are logged in `docs/OPEN_ITEMS.md`.
- Hero: label "WORK · 87 BEFORE/AFTER PAIRS" · H1 "The work." / "Every image shown before and after." · toggle Latest / Most viewed · chips All · 87, Interior · 33, Exterior · 18, Drone · 15, Yacht · 10, Twilight · 8, Floor plan · 3.
- Grid: one large before/after per row with "AFTER" tag, studio name (Northlight Media, Coastline Media, Keyline Photo, Arcos Studio, Harbour & Co., Parcel & Pine, Westfield Visuals, Lumen Homes, Brightside Realty: placeholders) and category · "Show 24 more".
- Final CTA: "Like what you see?" / "Send us ten photos and judge your own."

**Built:** TechX's real 87 finished edits from the old site (same counts as Figma), filter chips, pages of 24, full-size viewer. No before/after (no raw files yet), no studio names (Figma's are placeholders), no Latest / Most viewed (no data). Hero: "The work." / "Real shoots, edited by our studio." with a visible "raw and edited pairs coming soon" note.

## Files
`app/work/page.tsx` · `Gallery.tsx` · `portfolio.ts` · photos in `public/photos/work/` (docs/PHOTO_CREDITS.md).

## Status
- [x] Copy transcribed from Figma (2026-11-02)
- [x] Built (2026-11-02)
- [x] Desktop + phone (390px) checked (2026-11-02)
