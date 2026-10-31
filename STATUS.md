# STATUS.md

**Phase:** Build. Home page fully assembled (all Figma sections) with motion; header and hero approved. Inner pages not built.
**Last updated:** 2026-10-31

## Resume here (read this first)
- Repo: `/Users/gauravrana/projects/techx-website` (Turborepo, Next.js 16.4, Tailwind v4, Motion). `npm run dev` → http://localhost:3000.
- **Port rule:** 3000 is the owner's dev server. Agents preview on 4310 and only stop their own process (AGENTS.md §3.10).
- Home order (`app/page.tsx`): Hero (+ before/after tray) → Logo strip → Five answers → Services → How it works → Pricing → Why a team → Testimonials → FAQ → Final CTA → Footer.
- Last done: the five answer illustrations each tell their process as a story (caption pill + step dots synced to the animation, `features/illustrations/Canvas.tsx` `Story`).
- Done 2026-10-31: service cards now tell the whole edit on one screen (`features/service-art/ServiceArt.tsx`).

## Approved (owner, 2026-10-30): don't redesign without asking
- **Header** (`features/site-shell/SiteHeader.tsx`): apple.com-style full-width 48px bar, 1024px column, items spread evenly, 13px links, small blue pill CTA. Transparent at top, Apple material on scroll. Services → full-width flyout (big names left, photo cards right, page behind blurred). Phone: full-screen frosted sheet, scroll locked. No WhatsApp in header.
- **Hero** (`features/home/Hero.tsx`, `HeroStage.tsx`, `TrustBadge.tsx`, `Flags.tsx`): animated trust badge (flags, "Serving 500+ clients", ★ 4.9 rating) → "You shoot the listing. / We do the rest." → promise → Glide-style upload card → four Pikaicons pointers → before/after tray with real photos. Billow-style sky gradient from the top.
- Checked at 360/390/768/1024/1440: no overflow; lint, typecheck, build clean.

## Owner preferences (keep applying)
- UI/copy from Figma; design rules from `docs/design-system/`; all copy via `marketing-skills:copywriting`.
- Light only. Brand blue `#3074FE` / hover `#1E4FD6` / tint `#EBF1FF`. Inter Tight headings at 500–520, Inter body, Geist Mono labels.
- Gradient buttons with inner highlight + soft shadow. No noise/ring CTAs. No new libraries unless asked (approved: motion, torph, @number-flow/react, lenis).
- Real photos (public/photos, docs/PHOTO_CREDITS.md), never drawn stand-ins. Icons: Pikaicons free pack.
- No optimisation passes unless asked.
- Rejected (don't bring back): framed glass tab header, glass capsule, floating proof cards, square grid + rails, brush underline, split hero, lens hero, studio-window tiles, Glide environment scene, gradient headline text.

## Next steps
1. Review the rest of Home with the owner section by section (none approved yet below the hero).
2. Inner pages: transcribe copy from Figma into each `CONTEXT.md` (Figma reads rationed), then build. Order: Pricing → How it works → Free trial → Services template → Work → About → Contact.
3. Add shipped routes to `app/sitemap.ts`.
4. Add `empty.webp` (Commons "Door in a white room (Unsplash)", CC0) and `plan.webp` (Commons "Bolduc House Floor Plan", public domain) to `docs/PHOTO_CREDITS.md`.

## Open questions (full list in docs/OPEN_ITEMS.md)
- "From $0.50" vs Essential $0.70. Turnaround: 10–16 h vs 12–24 h. Trust figures 500+ / 4.9 to confirm. WhatsApp number. Client portal ("Log in"). Replace sample photos with TechX's real pairs.

## Log
**2026-10-31 · How it works step cards animated**
- `StepCards` in `HowItWorks.tsx`: while on screen a highlight loops 1→4 (2.6s a step); the active card lifts, its number turns maroon, its icon tile turns solid blue, the icon acts out the step (Pikaicons split into parts: upload arrow lifts, pencil writes the flourish, tick draws in the shield, download arrow drops), and a story-progress bar fills along its foot (done steps keep a faint full bar). Mouse hover plays a card's icon. Reduced motion: no loop.

**2026-10-31 · Muted heading halves fill on scroll**
- `features/motion/ScrollFill.tsx`: the muted half of every two-tone heading starts at 35% ink and darkens word by word to 62% ink (owner: not full black, so the lead stays the main message) as the heading moves from 90% to 45% of the viewport height. Used in SectionHead (string `rest` only; the Answers morphing line stays muted), ServicesGrid, HowItWorks overnight card, Answers 05 contact, FinalCta and PageHead. Opacity only; reduced motion shows it filled.

**2026-10-31 · Overnight timeline icons**
- Pikaicons (free) on the timeline: moon / "You sleep" and a warm sun at New York's morning end; moon then sun / "Studio at work" on the India lane; each moment marker is an icon chip (upload, envelope, pencil-edit, check-tick-circle, shield-check, send-plane, download) that fills with colour as the scrubber passes; the clock pill and the phone list use the same icons. No free sunrise/sunset icon, so the morning ends use the sun in a warm tint.

**2026-10-31 · Hero collage rebuilt to devin.ai's pattern; overnight timeline full flow**
- `PhotoField.tsx` (scroll parallax) removed. `HeroCollage.tsx`: two full-width layers of TechX portfolio tiles that pan left to right forever (CSS `collage-pan`, globals.css): back layer blurred 6px / 60% (~180s), front sharp (~140s), each tile at its own pace by size; square tiles, no border or shadow, `mix-blend-multiply`; 16 tiles a layer spread along the track so the band is full from the first frame. Paused off screen and under reduced motion. Note: the production CSS minifier drops keyframes that use `max()` directly, so the track length is a CSS variable (`--track`).
- Temporary "Collage" on/off switch in the tray's footer row (owner, for review), remembered in localStorage (`techx-collage`). Remove before launch or keep as decided.
- Tray padding 8px → 4px (radius 28 = photo 24 + 4).
- Overnight timeline: city names in their own column, seven moments (upload, in our inbox, editing starts, check 1 · your editor, check 2 · your QC, sent to you, you download), dashed hand-off lines between the lanes, clock pill in the gap between lanes; phones show the moments as a list.
- Checked at 1440 and 390, no overflow; typecheck, lint, build clean.

**2026-10-31 · How it works icons + overnight timeline; hero photo field**
- Step cards: Pikaicons free icons (upload-up, pencil-edit-swoosh, shield-check, download-down) in a blue tile, via `npx pikaicons show` (CLI read before running; it only calls api.pikaicons.com).
- "We edit while you sleep" rebuilt (`HowItWorks.tsx` `Overnight`): New York and India lanes on one 7 PM–8 AM ET axis, a scrubber with both clocks sweeps the night, the shoot rides it (raw → editing → checked), milestones light as passed (same times as the Our process illustration). Scrubber is zero-width, moved in container units, so it never widens the page.
- Hero: `PhotoField.tsx` behind the before/after tray (reference devin.ai). TechX portfolio tiles at three depths (far blurred/faint, mid soft, near sharp) with scroll parallax per depth and a gentle float; md+ only; still under reduced motion.
- Checked at 1440, 1920 and 390; no overflow; typecheck, lint, build clean.

**2026-10-31 · Services cards: whole edit on one screen**
- `ServiceArt.tsx` rewritten: before | after split per service with fixes ticking along the bottom; each tick moves the divider so the after grows. Video is a four-clip timeline with Cut · Music · Titles. TechX portfolio photos throughout except staging (stock). See `features/service-art/CONTEXT.md`.
- Checked at 1440 and 390, no overflow; typecheck, lint, build clean.

**2026-10-31 · Answers 03–05 illustrations rebuilt, same approach as 01–02**
- 03 Prices: live invoice, four TechX photos each given a level, total counts to $4.20, stamped "Billed after delivery".
- 04 How to start: ten photos into the free-trial drop zone (No card · No contract), the edited ten come back underneath.
- 05 Contact: Figma chat kept, framed as a chat window (editor online/typing, read ticks) with WhatsApp · Email · Call.
- Captions via `marketing-skills:copywriting`, all 31 characters or fewer: Prices "Pick a level for each photo" · "Mix levels in one order" · "Twilight from $1.00 an image" · "Luxury for hand-masked blends" · "Billed only after delivery"; Start "Send 10 photos, free" · "No card, no contract" · "Edited and back by morning" · "Judge us on your own shoot". Not yet in Figma.
- Checked at 1440 and 390, no overflow; typecheck, lint, build clean.

**2026-10-31 · "Our process" rebuilt, old-site content and photos**
- `ProcessArt`: New York and India side by side, each with a live clock and night/day sky. The shoot flies to the India inbox overnight, the team reads the notes at 9:10 AM IST and edits, a "Checked twice" strip ticks (1 · Your editor, 2 · QC · Akash), and the set flies back for 7:58 AM ET. Studio shown as "India", not "Aligarh" (owner).
- Copy for both illustrations rewritten with `marketing-skills:copywriting` from the old site's wording (RAW files, your notes, merge / sky / windows). Captions kept to 31 characters or fewer so they don't truncate at 390px. Not yet in Figma.
- Real TechX photos from the old site's portfolio: `public/photos/tx-*.jpg` (docs/PHOTO_CREDITS.md). Time-zone mismatch in the Figma times logged in docs/OPEN_ITEMS.md.
- Old site (techxsystems.com) still has: 61 portfolio images (Exterior 18, Interior 20, Twilight 8, Drone 15), five attributed testimonials (Fayth Rebiero USA, Jerry Suhrstedt USA, Stan AUS, Patrick Maven USA, Shane Bailey AUS), the full fixes list and prices. Candidates for Testimonials and the before/after slider once the owner confirms permission.

**2026-10-31 · "How we do it" illustration rebuilt**
- `HowWeDoItArt` (`features/illustrations/AnswerArt.tsx`): the whole flow on one screen as a loop of four stations (Upload → Editing team → QC check → Delivered) that light up in turn. A one-scene-at-a-time storyboard was tried first; owner wanted everything visible at once.
- Captions: "You upload your brackets" · "Our editing team gets to work" · "A QC manager checks every image" · "Delivered to your gallery". New strings, not yet through the copywriting skill or Figma.
- Checked at 1440 and 390 (scaled 0.84 under 400px), no overflow; typecheck, lint, build clean.

**2026-10-31 · Hero mobile fixes + upload card border**
- Upload card: send button pinned right on phones (`max-sm:ml-auto`; the "10 photos free" label that pushed it is hidden there).
- Upload card border: light gradient travelling round the edge (`edge-flow` in globals.css, 6s, 3s on hover, still under reduced motion). Replaces the 1px grey ring.
- Hero pointers: a one-column phone layout was tried; owner preferred the original wrapped rows, so it was reverted.
- Checked at 360/430/1440, no overflow; typecheck, lint, build clean.

**2026-10-31 · Announcement bar**
- 40px ink strip above the nav, inside the fixed header (`SiteHeader.tsx`): "Free trial" tag · "Your first 10 photos are edited free. No card, back by morning." · Start free trial →. Phones show "10 photos free · no card". Copy lives in `lib/site.ts` (`announcement`); owner approved the wording from the Direction B HTML.
- On scroll (>8px) or when the phone menu opens, the whole header slides up 40px (transform only), so only the nav stays. `layout.tsx` has a matching 40px spacer, so hero and page heads keep their spacing.
- **Sky flow** (owner, 2026-10-31): the hero's sky gradient now carries down every page. `sky-flow` utility in `globals.css` wraps `<main>` and the footer in `layout.tsx` (not the bar): soft washes in the hero's blues alternating left/right, white between, ending in sky behind the final CTA and footer. The link hides on `/free-trial`.
- Checked: typecheck, lint, build clean; 1440 and 360/390 (no overflow), scrolled and unscrolled.

**2026-10-30 · Home assembled, header/hero approved, stories**
- All Figma Home sections built (`Answers`, `HowItWorks`, `Pricing`, `Compare`, `Testimonials`, `Faq`, `SectionHead`); answers heading morphs with torph (`features/motion/MorphCycle.tsx`).
- Header rebuilt after apple.com; hero rebuilt Glide-style and refined; copy rewritten with the copywriting skill.
- Real photos `public/photos/{ext,int,twi,aer,empty,plan}.webp`; service cards, answer thumbnails, flyout use them.
- Fixes: glass blur via Tailwind backdrop classes (hand-written `backdrop-filter` got minified to `-webkit-` only); NumberFlow `en-US`; `@ts-ignore` removed; port 3000.
- Packages: + `@number-flow/react`, `lenis`, `torph@0.1.3`; − `clsx`, `tailwind-merge`.

**2026-10-30 · Repo initialised**
- Turborepo: `apps/web`, `packages/brand`, `packages/ui`, `packages/typescript-config`; AGENTS/CLAUDE/GEMINI/GUARDRAILS/DESIGN docs; `.claude` guard hook.
