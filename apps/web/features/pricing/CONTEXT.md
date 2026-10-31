# Feature: Pricing (`/pricing`)

Read this file, `DESIGN.md` §1–6, and the files under **Uses**. Nothing else is needed for this feature.

- **Figma:** [Pricing, node 31:155](https://www.figma.com/design/WGW3zGaOx1NkmCCPomJTbV?node-id=31-155) (page "03 — Direction B", 2051 × 5064 capture). Figma wins for UI and copy.
- **Route:** `app/pricing/page.tsx` composes the sections in this folder.
- **Uses:** `features/site-shell` (PageHead, FinalCta), `lib/site.ts`.
- **Rates:** levels and notes are already verified in `features/home/CONTEXT.md` §7. Starting price is "from $0.50" (owner, 2026-10-30), always phrased as a starting price.
- **Calculator:** listings, photos, level, twilights → monthly total, tabular figures (Motion `animate` on the number).

## Copy
**Not yet pulled from Figma.** The owner edited content in Figma and the layer names are stale, so don't trust `get_metadata` names or the old HTML.
Before building: one `get_screenshot` of node 31:155 at `maxDimension` = the frame height, crop it into 1000px bands, and transcribe every
string into this section (verified date + source). Figma reads are limited (Starter plan, View seat): one call per page, no more.

## Status
- [ ] Copy transcribed from Figma
- [ ] Built
- [ ] Desktop + phone (390px) screenshot checked
