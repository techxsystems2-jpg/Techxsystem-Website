# Feature: Services (template for all six) (`/services`)

Read this file, `DESIGN.md` §1–6, and the files under **Uses**. Nothing else is needed for this feature.

- **Figma:** [Services (template for all six), node 28:155](https://www.figma.com/design/WGW3zGaOx1NkmCCPomJTbV?node-id=28-155) (page "03 — Direction B", 2051 × 4570 capture). Figma wins for UI and copy.
- **Route:** `app/services/page.tsx` composes the sections in this folder.
- **Uses:** `features/site-shell` (PageHead, FinalCta), `lib/site.ts`.
- **Template:** one page design reused for every slug in `lib/site.ts` `services` (copy, fixes and prices swap per service). Only Photo editing & HDR is designed.
- **Uses also:** `features/before-after`.

## Copy
**Not yet pulled from Figma.** The owner edited content in Figma and the layer names are stale, so don't trust `get_metadata` names or the old HTML.
Before building: one `get_screenshot` of node 28:155 at `maxDimension` = the frame height, crop it into 1000px bands, and transcribe every
string into this section (verified date + source). Figma reads are limited (Starter plan, View seat): one call per page, no more.

## Status
- [ ] Copy transcribed from Figma
- [ ] Built
- [ ] Desktop + phone (390px) screenshot checked
