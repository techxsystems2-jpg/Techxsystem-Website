# Feature: How it works (`/how-it-works`)

Read this file, `DESIGN.md` §1–6, and the files under **Uses**. Nothing else is needed for this feature.

- **Figma:** [How it works, node 30:155](https://www.figma.com/design/WGW3zGaOx1NkmCCPomJTbV?node-id=30-155) (page "03 — Direction B", 2051 × 3889 capture). Figma wins for UI and copy.
- **Route:** `app/how-it-works/page.tsx` composes the sections in this folder.
- **Uses:** `features/site-shell` (PageHead, FinalCta), `lib/site.ts`.
- **Uses also:** `features/illustrations` (upload list, style guide, QC checklist, download gallery vignettes).

## Copy (Figma 30:155)
**Transcribed from Figma 2026-11-02** (one full-height `get_screenshot`, cropped into bands). Where the build departs from Figma, it says why; disagreements are logged in `docs/OPEN_ITEMS.md`.
- Hero: label HOW IT WORKS · H1 "From shoot to listing," / "while you sleep." · "Four steps, and you only do the first one. Here's everything that happens between your upload and your download." · Start free trial · See prices. Art: arc card Uploaded · New York 7:02 PM / Editing · Aligarh 11:40 PM / Quality check 5:42 AM IST / Delivered 7:58 AM.
- 01 Upload the shoot: "Drag RAW or JPEG brackets into the client portal, or paste a Dropbox, Google Drive or WeTransfer link. No plugins, no desktop app." YOU · 2 MINUTES. **Built:** "on our site … Dropbox or Google Drive link" (no portal or WeTransfer yet).
- 02 Tell us once: "Leave notes by email or WhatsApp the first time. We turn them into your style guide, and every editor follows it on every job after." YOU · ONCE
- 03 Edit, then check: "One editor works on your set. A team lead checks every image against your style guide before anything leaves the studio." TECHX · OVERNIGHT
- 04 Download and revise: "Your gallery is ready by morning. Download the set, or ask for a change on any image. Revisions are free and usually back the same day." YOU · 12–24 H AFTER UPLOAD
- Timeline: "We edit while you sleep." / "Our studio in India works through your night." (built with Home's Overnight).
- FILES WE ACCEPT: CR2 CR3 NEF ARW DNG RAF JPEG TIFF · WAYS TO SEND: Client portal · Dropbox · Google Drive · WeTransfer. **Built:** Upload on our site · Dropbox link · Google Drive link · Email or WhatsApp for notes.
- Final CTA: "Step one takes two minutes." / "We'll do the rest tonight."

## Files
`app/how-it-works/page.tsx` · `StepRows.tsx`. Uses `StepArt` (`big`), Home's `Overnight`.

## Status
- [x] Copy transcribed from Figma (2026-11-02)
- [x] Built (2026-11-02)
- [x] Desktop + phone (390px) checked (2026-11-02)
