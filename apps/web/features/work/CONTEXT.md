# Feature: Work (portfolio) (`/work`)

Read this file, `DESIGN.md` §1–6, and the files under **Uses**. Nothing else is needed for this feature.

- **Figma:** [Work (portfolio), node 29:155](https://www.figma.com/design/WGW3zGaOx1NkmCCPomJTbV?node-id=29-155) (page "03 — Direction B", 2051 × 2963 capture). Figma wins for UI and copy.
- **Route:** `app/work/page.tsx` composes the sections in this folder.
- **Uses:** `features/site-shell` (PageHead, FinalCta), `lib/site.ts`.
- **Uses also:** `features/before-after` (hover-to-raw tiles), `@techx/ui` Chip + segmented toggle.

## Copy
**Not yet pulled from Figma.** The owner edited content in Figma and the layer names are stale, so don't trust `get_metadata` names or the old HTML.
Before building: one `get_screenshot` of node 29:155 at `maxDimension` = the frame height, crop it into 1000px bands, and transcribe every
string into this section (verified date + source). Figma reads are limited (Starter plan, View seat): one call per page, no more.

## Status
- [ ] Copy transcribed from Figma
- [ ] Built
- [ ] Desktop + phone (390px) screenshot checked
