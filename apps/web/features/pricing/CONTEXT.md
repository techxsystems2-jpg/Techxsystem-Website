# Feature: Pricing (`/pricing`)

Read this file, `DESIGN.md` §1–6, and the files under **Uses**. Nothing else is needed for this feature.

- **Figma:** [Pricing, node 31:155](https://www.figma.com/design/WGW3zGaOx1NkmCCPomJTbV?node-id=31-155) (page "03 — Direction B", 2051 × 5064 capture). Figma wins for UI and copy.
- **Route:** `app/pricing/page.tsx` composes the sections in this folder.
- **Uses:** `features/site-shell` (SkyHero, FinalCta), `lib/site.ts`.
- **Rates:** levels and notes are already verified in `features/home/CONTEXT.md` §7. Starting price is "from $0.50" (owner, 2026-10-30), always phrased as a starting price.
- **Calculator:** listings, photos, level, twilights → monthly total, tabular figures (Motion `animate` on the number).

## Copy (Figma 31:155)
**Transcribed from Figma 2026-11-02** (one full-height `get_screenshot`, cropped into bands). Where the build departs from Figma, it says why; disagreements are logged in `docs/OPEN_ITEMS.md`.
- Hero: label PRICING · H1 "Pay for what we deliver." / "No contract, no minimum." · "Choose a level per shoot. You're billed at month end, only for the photos we delivered." · toggle "Pay per image" / "Studio plans · 500+ a month" (dropped: the bulk row covers it).
- Levels: Essential $0.70 · Signature $0.75 (Most chosen) · Luxury $1.50, with Home's descriptions and ticks. **Built:** Home's Pricing (from $0.50 / $1.00 / $1.50, owner).
- Studio row: "Editing 500+ images a month?" "Studio plans add a dedicated editor, a priority queue and volume pricing. Tell us your numbers and we'll quote within a day." · "Talk to the studio". **Built:** Home's Bulk editing row.
- Calculator: "Work out a month in seconds." / "Using our real rates." Listings per month 20 · Photos per listing 30 · Level Signature · $1.00 · Twilights per listing 1 → ESTIMATED MONTHLY COST $620 · "About $31.00 a listing" · Start free trial. **Built:** "Using our starting rates."; total on the blue tint, not Figma's black card (owner rejected black cards on pricing).
- How billing works: "You see the price before we start." / "Every order shows its total." 1 Per image "Pick a level per shoot; mix levels in one order." · 2 Monthly invoice "Billed at month end, only for delivered photos." · 3 Revisions "Always free, usually back the same day." Art: price knob invoice (built with Home's PricesArt).
- Every service: "The full price list." / "Mix any of these in one order." Photo editing & HDR $0.70–$1.50 / image 12–24 h MOST ORDERED · Virtual twilight $1.00–$2.00 12–24 h · Virtual staging From $8 / room 24 h NEW · Drone & aerial $0.70–$1.50 12–24 h · Floor plans · 2D / 3D $5–$8 / floor 24 h · Video editing From $25 / video 24–48 h · "Prices in USD. Revisions are always free." **Built:** every price as "From" (lib/site.ts).
- Questions: "Questions about pricing" · When am I charged? → "At the end of each month, only for photos we delivered. Your first 10 are free." · Do you charge for revisions? · Which payment methods do you take? · Is there a minimum order?
- Final CTA: "Not sure which level?" / "Send ten photos and we'll suggest one."

## Files
`app/pricing/page.tsx` · `Calculator.tsx`. Uses `features/home/Pricing` (exports `plans`), `PricesArt`.

## Status
- [x] Copy transcribed from Figma (2026-11-02)
- [x] Built (2026-11-02)
- [x] Desktop + phone (390px) checked (2026-11-02)
