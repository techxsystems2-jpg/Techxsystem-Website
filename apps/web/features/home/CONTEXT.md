# Feature: Home (`/`)

Read this file, `DESIGN.md` §1–6, and the files listed under **Uses**. Nothing else is needed for Home work.

- **Figma:** [Home, node 26:155](https://www.figma.com/design/WGW3zGaOx1NkmCCPomJTbV?node-id=26-155) (page "03 — Direction B", 1864 × 9166 capture)
- **Copy below verified against Figma:** 2026-10-30 (full-resolution screenshot + design context). Figma wins over any other doc for UI and copy.
- **Route:** `app/page.tsx` composes the sections in this folder, in this order.
- **Uses:** `features/site-shell` (nav, final CTA, footer), `features/before-after`, `features/illustrations`, `lib/site.ts` (services, contact).

## Owner direction, 2026-10-30 (overrides the Figma hero layout)
- Apple-style materials and motion everywhere; the first screen must say "real estate photo editing specialists" at once.
- Hero now follows the owner's reference: floating house tile → badge "Real estate photo editing · since 2016" → headline with the
  house-and-camera tile inline → lede → Start free trial + See prices → proof row → **Expertise** (`Expertise.tsx`): four
  specialities with an auto-advancing progress line, driving the before/after in a "TechX Studio" editor window that tilts up on scroll.
- The Figma prompt box and the "Virtual staging is back" badge were dropped from the hero ("New" tag now sits on Virtual staging).
- Services cards each run their own film: `features/service-art`. Logo strip: eyebrow line only; placeholder logos removed (owner, 2026-11-14) until real ones arrive.
- The owner will paste the remaining sections (answers, how it works, pricing, comparison, testimonials, FAQ).

## Sections and exact copy (top to bottom, from Figma)

### 1. Hero (centred)
- Badge: `NEW` (blue badge) + "Virtual staging is back, from $8 a room"
- H1: "You capture the media." / muted: "We do the rest."
- Lede: "Real estate post production by people, not presets. Upload after the shoot and it's ready by morning, US time, from $0.50 an image."
- Prompt box (links to `/free-trial` until upload exists): placeholder "Drop your brackets, or paste a Dropbox link…" · `+` button · level chip "Level Signature · $1.00" · mono "10 photos free · no card" · round ink send button with ↑
- Proof row (blue ticks): "Back in 10–16 hours" · "A person checks every photo" · "Free revisions" · "Billed only for delivered photos"

### 2. Before/after slider → `features/before-after`
- Scene chips: Exterior · Interior · Twilight · Aerial
- Credit (mono): "Northlight Media · Austin, TX · Sony A7 IV · 5 brackets" (placeholder until real credits)
- Tags: "Before · raw bracket" / "After · TechX edit"

### 3. Logo strip
- "Editing for real estate photographers in the US, Australia and the UK" + 5 × "Client logo" placeholders

### 4. Five answers (bento, 2 + 2 + 1 full width)
- Label "Before you decide" · H2 "Five answers, up front." / muted "How we work, what it costs, how to start and who to call."
- 01 How we do it: "Your brackets go to a trained editor, then a second person checks every image." → "See how it works" (`/how-it-works`). Illustration: DSC_0412.ARW → studio "Editing" → gallery, cursor "Akash · checking".
- 02 Our process: "Upload tonight. We edit through your night and deliver by morning." → "Follow an order". Illustration rows: Uploaded · New York 7:02 PM / Editing · India 11:40 PM / Quality check 5:42 AM IST / Delivered 7:58 AM.
- 03 Our prices: "From $0.50 an image, three levels, billed only for what we deliver." → "See all prices" (`/pricing`). Illustration: price knob "$1.00 / image" over Essential $0.70 · Signature $1.00 · Luxury $1.50; "30 photos × $1.00 = $30.00", "1 twilight × $1.00 = $1.00", "Per listing $31.00".
- 04 How to start: "Send ten photos free. No card, no contract, back in 12 hours." → "Start free trial". Illustration: "10 / 10 free" card stack, "Drop to start · Free trial".
- 05 How to contact (wide): H3 "Talk to an editor, not a ticket." / "WhatsApp, email or a call." · WhatsApp "+91 9653059304" · Email "support@techxsystems.com" → "All the ways to reach us" (`/contact`). Chat illustration: JM "Can you do twilights for three listings tonight?" → TechX "Yes. Upload by 9 PM and they're ready by 8 AM EST." → JM "Perfect. Uploading now."

### 5. Services (6 cards, 3 × 2) → data in `lib/site.ts` `services`
- Label "Services" · H2 "One team for every edit." / muted "Send the whole shoot, get every deliverable back on one invoice." · secondary button "All services"
- Each card: scene image with "After" badge (hover shows raw + "Before"), name, one line, mono price, arrow.

### 6. How it works (4 step cards + timeline)
- Label "How it works" · H2 "Upload tonight." / muted "Listing-ready by morning. You only do step one."
- 01 Upload the shoot: "Drag RAW or JPEG brackets into the portal, or paste a Dropbox or Drive link." · `YOU · 2 MINUTES`
- 02 Tell us once: "Your notes become a saved style guide every editor follows." · `YOU · ONCE`
- 03 Edit, then check: "One editor works on your set. A team lead checks every image." · `TECHX · OVERNIGHT`
- 04 Download and revise: "Ready by morning. Ask for changes on any image, free." · `YOU · 12–24 H LATER`
- Timeline card: "We edit while you sleep." / muted "Our studio in India works through your night." · mono "Shown for New York" · 7:00 PM (You upload) → 5:30 AM IST (We edit, then check; maroon dot, blue night band) → 8:00 AM (You download)

### 7. Pricing (centred)
- Label "Pricing" · H2 "Pay for what we deliver." / muted "No contract, no minimum."
- **Rebuilt 2026-11-02 (owner), see STATUS.md log; copy below is the earlier Figma version.** Essential now **from $0.50**, all levels shown as "From", plus a Bulk editing row and the starting-rate note.
- Essential **$0.70** per image: "HDR blend, colour, verticals and window pull. For everyday listings." · secondary "Start free trial" · ticks: HDR blend and window pull / Verticals and lens correction / Free revisions
- Signature **$1.00** (featured: blue outline + glow, badge "Most chosen", primary button with arrow): "Everything in Essential, plus sky swaps, lawn, fire and TV screens." · ticks: Everything in Essential / Sky, lawn, fire and TV fill / Saved style guide
- Luxury **$1.50**: "Hand-masked blends and object removal, for high-end homes." · ticks: Everything in Signature / Hand-masked blends / Object removal
- Notes row (sunk cards): "Per image: Pick a level per shoot; mix levels in one order." · "Monthly invoice: Billed at month end, only for delivered photos." · "Studios, 500+ a month: Dedicated editor and volume pricing. Talk to us" (link)

### 8. Why a team (comparison table)
- Label "Why a team" · H2 "AI is fast." / muted "Your listings still need someone to check it."
- Columns: TechX (tinted, blue dot values) · AI editing apps · Editing in-house
- A person checks every photo: Always · Paid extra · Your own time
- Fire, TV fill, object removal: Included · Limited · Hours in Photoshop
- Floor plans and video in one order: Yes · No · No
- Someone to message at 2 AM: WhatsApp · Help centre · You
- Price per photo (last row): From $0.50 · $0.22–0.50 · Your hourly rate

### 9. Testimonials (real quotes from techxsystems.com since 2026-11-02; see docs/old-site-content.md; Figma placeholders below)
- Label "Clients" · H2 "Photographers stay for years." / muted "Here's why, in their words."
- Three cards: "[Real client quote about turnaround and quality.]" / "…consistency across shoots." / "…service and communication." · "Client name" · Studio · Austin, TX / Brisbane, QLD / Orlando, FL

### 10. FAQ (two columns)
- Left: label "Questions" · H2 "Before you send your first shoot." · "Still unsure? Message the studio on WhatsApp. An editor replies." · secondary "Chat on WhatsApp"
- Right (first one open): How fast will I get my photos back? → "Within 12–24 hours. Send them by evening in the US or Australia and they're usually ready by morning." · Do I need to pay before you start? · What if I don't like an edit? · Are your edits MLS-compliant? · Which files do you accept? (answers for the last four: in the Direction B HTML until Figma has them; confirm)

### 11. Final CTA → `features/site-shell/FinalCta.tsx` with defaults

## Open questions for this page (also in docs/OPEN_ITEMS.md)
- **Turnaround differs across the page:** hero "10–16 hours", answer 04 "12 hours", steps and FAQ "12–24 hours". Pick one.
- ~~Starting price vs levels~~ Settled 2026-11-02 (owner): Essential from $0.50; every level is a starting price.
- **WhatsApp number:** answer card shows +91 9653059304, final CTA shows +91 74176 20537.

## Build notes
- Hero renders without JavaScript (CSS `.rise` entrance). Only the slider, chips, FAQ and hover states are client-side.
- One primary (blue) button per view. Two-tone headings: lead in `text-ink`, rest in `text-ink-3`.
- Illustrations: Motion (`motion/react`) for loops and in-view triggers; show the final frame under reduced motion.

## Copy rewrite, 2026-10-30 (owner asked; marketing-skills:copywriting)
The live copy in the components now differs from the Figma strings above in these places. The components are the source:
hero lede and placeholder, CTAs "Try 10 photos free", answer cards 01–04 and the section subline, services subline and
service one-liners (`lib/site.ts`), how-it-works steps 02–03, FAQ side note, meta description. The headline
"You capture the media. We do the rest." is unchanged. No new claims were added.
Hero headline (owner, 2026-10-30): "You shoot the listing. / We do the rest." (second line in the blue gradient). The final CTA keeps the original "You capture the media."
