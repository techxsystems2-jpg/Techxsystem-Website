# Feature: About (`/about`)

Read this file, `DESIGN.md` §1–6, and the files under **Uses**. Nothing else is needed for this feature.

- **Figma:** [About, node 33:155](https://www.figma.com/design/WGW3zGaOx1NkmCCPomJTbV?node-id=33-155) (page "03 — Direction B", 2051 × 3805 capture). Figma wins for UI and copy.
- **Route:** `app/about/page.tsx` composes the sections in this folder.
- **Uses:** `features/site-shell` (PageHead, FinalCta), `lib/site.ts`.
- **Content rule:** team, timeline and studio photo are unconfirmed (docs/OPEN_ITEMS.md). Placeholders stay visible.

## Copy
**Not yet pulled from Figma.** The owner edited content in Figma and the layer names are stale, so don't trust `get_metadata` names or the old HTML.
Before building: one `get_screenshot` of node 33:155 at `maxDimension` = the frame height, crop it into 1000px bands, and transcribe every
string into this section (verified date + source). Figma reads are limited (Starter plan, View seat): one call per page, no more.

## Status
- [ ] Copy transcribed from Figma
- [ ] Built
- [ ] Desktop + phone (390px) screenshot checked
