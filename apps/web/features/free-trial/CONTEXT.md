# Feature: Free trial (`/free-trial`)

Read this file, `DESIGN.md` §1–6, and the files under **Uses**. Nothing else is needed for this feature.

- **Figma:** [Free trial, node 32:155](https://www.figma.com/design/WGW3zGaOx1NkmCCPomJTbV?node-id=32-155) (page "03 — Direction B", 2051 × 2264 capture). Figma wins for UI and copy.
- **Route:** `app/free-trial/page.tsx` composes the sections in this folder.
- **Uses:** `features/site-shell` (SkyHero, FinalCta), `lib/site.ts`.
- **Form:** name, studio, email, photos-per-month chips, drop zone, notes. Sent state: Figma page "02", Direction A. Backend not chosen yet.

## Copy (transcribed 2026-11-02 from one get_screenshot of Figma node 32:155)
- **Head:** FREE TRIAL · "Send ten photos." + muted "Judge the result." · "No card, no contract. If you like the edits, keep sending. If you don't, you've lost nothing but two minutes."
- **Illustration:** "10 / 10 FREE" stack → "Drop to start · FREE TRIAL" (built: Home's `OptInArt`).
- **Steps:** 1 You upload "Ten photos or brackets. Two minutes." · 2 We edit tonight "Back within 24 hours, with a link by email." · 3 You decide "Request changes, set your style, or walk away."
- **Form:** "Your details" · Name (Jake Morrison) · Studio (Northlight Media) · Email (jake@northlight.media) "We'll send your edited photos here." · Photos per month: Under 200 / 200–1,000 / 1,000+ · drop zone "Drop up to 10 photos or brackets" / "or paste a Dropbox / Drive link" · "Anything we should know?" Optional "Bright and airy, blue skies, keep wall colours…" · "Send my free trial →" · ticks No card · Back in 24 h · Your files stay private.
- **Quotes:** placeholders in Figma → the real quotes from Home (`Testimonials`).
- **FAQ:** QUESTIONS · "About the trial" · "Still unsure? Message the studio on WhatsApp. An editor replies." · What happens after the trial? ("Nothing, unless you send more. There's no subscription to cancel.") · Can I send brackets? · Will you use my photos? (answers 2–3 written; 3 to confirm).

## Built (2026-11-02)
- Design = every other page (owner): shared `SkyHero` (site-shell) centred like Home/Contact, pointers, then the form card beside a Home answer card (illustration + maroon-numbered steps). No final CTA (the page is the CTA).
- Form uploads straight to the admin's Dropbox or Google Drive: **docs/uploads.md** (setup, folders, limits, files).
- Sent state written here (Figma's Direction A sent state not read): "Thanks, Jake. Your photos are with the studio." + 24-hour line; warns if any file failed.

## Status
- [x] Copy transcribed from Figma (2026-11-02)
- [x] Built, with uploads (dev destination tested end to end: curl + browser, files arrive byte-for-byte, report written)
- [x] Desktop + 390px checked (no page overflow)
- [ ] Dropbox / Google Drive tested with the owner's keys
