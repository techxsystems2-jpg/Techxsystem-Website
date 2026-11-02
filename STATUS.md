# STATUS.md

**Phase:** Build. Every page in Figma is built: Home, Services (index + 6-service template), Work, How it works, Pricing, About, Contact, Free trial, 404. Header and hero approved; the rest awaits owner review.
**Last updated:** 2026-11-02

## Resume here (read this first)
- **This repo is self-contained** (owner, 2026-11-02): all website context lives here. The `TechX System` folder elsewhere in `projects/` is a separate project; don't read or edit it for website work. Content facts: `docs/old-site-content.md`; decisions: `docs/decisions-log.md`.
- Repo: `/Users/gauravrana/projects/techx-website` (Turborepo, Next.js 16.4, Tailwind v4, Motion). `npm run dev` → http://localhost:3000.
- **Port rule:** 3000 is the owner's dev server. Agents preview on 4310 and only stop their own process (AGENTS.md §3.10).
- Home order (`app/page.tsx`): Hero (+ before/after tray) → Logo strip → Five answers → Services → How it works → Pricing → Why a team → Testimonials → FAQ → Final CTA → Footer.
- Last done (2026-11-02): all inner pages built from Figma (see Log). Next: owner review page by page.
- Done 2026-10-31: service cards now tell the whole edit on one screen (`features/service-art/ServiceArt.tsx`).

## Approved (owner, 2026-10-30): don't redesign without asking
- **Header** (`features/site-shell/SiteHeader.tsx`): apple.com-style full-width 48px bar, 1024px column, items spread evenly, 13px links, small blue pill CTA. Transparent at top, Apple material on scroll. Services → full-width flyout (big names left, photo cards right, page behind blurred). Phone: full-screen frosted sheet, scroll locked. No WhatsApp in header.
- **Hero** (`features/home/Hero.tsx`, `HeroStage.tsx`, `TrustBadge.tsx`, `Flags.tsx`): animated trust badge (flags, "Serving 500+ clients", ★ 4.9 rating) → "You shoot the listing. / We do the rest." → promise → Glide-style upload card → four Pikaicons pointers → before/after tray with real photos. Billow-style sky gradient from the top.
- Checked at 360/390/768/1024/1440: no overflow; lint, typecheck, build clean.

## Owner preferences (keep applying)
- UI/copy from Figma; design rules from `docs/design-system/`; all copy via `marketing-skills:copywriting`.
- Light only. Brand blue `#3074FE` / hover `#1E4FD6` / tint `#EBF1FF`. Geist for headings at 500–520 and body, Geist Mono labels (owner, 2026-11-02; replaced Satoshi, before that Inter Tight / Inter).
- Gradient buttons with inner highlight + soft shadow, soft-cornered (8/10/12 by size, not pills; owner 2026-11-02). No noise/ring CTAs. No new libraries unless asked (approved: motion, torph, @number-flow/react, lenis).
- Real photos (public/photos, docs/PHOTO_CREDITS.md), never drawn stand-ins. Icons: Pikaicons free pack.
- No optimisation passes unless asked.
- Rejected (don't bring back): framed glass tab header, glass capsule, floating proof cards, square grid + rails, brush underline, split hero, lens hero, studio-window tiles, Glide environment scene, gradient headline text.

## Next steps
1. Owner review, page by page: Home below the hero, then Services, Work, How it works, Pricing, About.
2. Settle the Figma disagreements logged on 2026-11-02 in docs/OPEN_ITEMS.md (level prices, About dates, team, ways to send).
3. From TechX: raw/edited pairs (Work, sliders), portraits + studio photo (About), staging details, permission to show the 87 edits.
4. Footer links still without pages: Reviews, Blog, FAQ, TechX vs AI editors, Shoot guides, Client login, legal pages.

## Open questions (full list in docs/OPEN_ITEMS.md)
- **Before every production deploy (owner, 2026-11-02):** run Cloudflare's security audit skill (github.com/cloudflare/security-audit-skill) and `security-review`, and report the results before the owner ships. Not installed yet: AIs can't fetch repos (G1), so the owner installs it into `~/.claude/skills/` (command given in chat). Read the skill's files before its first run.
- Uploads: owner to create the Dropbox app and/or Google OAuth client, Upstash, and set env vars (docs/uploads.md). Email alert to the studio when a trial arrives: not built.
- Turnaround: 10–16 h vs 12–24 h. Trust figures 500+ / 4.9 to confirm. WhatsApp number. Client portal ("Log in"). Replace sample photos with TechX's real pairs.

## Log
**2026-11-02 · apple-design pass on the new pages and Home; flow fixes**
- Work viewer: grows out of the tapped tile and shrinks back into the tile of the photo on show (transform-origin from the tile, CSS @starting-style / allow-discrete); swipe follows the finger 1:1 and steps on a projected flick (Apple decay 0.998, quarter-width threshold), otherwise springs home; next photo slides in from its side (cross-fade only under reduced motion); page scroll locked while open; closes still showing its photo. Tiles, "Show more" and viewer buttons press in on pointer-down.
- Service tabs (`features/services/ServiceTabs.tsx`): current service centred on arrival on phones, edges fade where more tabs sit, press feedback, switching tabs keeps your scroll position.
- Flow: "See prices" on photo editing / drone jumps to the levels on the same page (#levels); footer "Reviews" → /about#reviews (Testimonials section now has id="reviews"); How it works rows replay their art on hover anywhere on the row.
- Shared: `Chip` presses in (scale 0.96); Home FAQ toggle presses in; reduced transparency now removes every backdrop blur and makes the scrolled header solid (globals.css + `.solid-bar`).
- Note: the dev server writes to `.next/dev`, so `next build` no longer clashes with the owner's `npm run dev` (the earlier stale-CSS warning predates this).
- Checked on the 4310 preview: viewer open/swipe/close, tabs at 390px, links, Home FAQ; tsc, eslint, build clean; no console errors.

**2026-11-02 · Inner pages built: Services (index + 6), Work, How it works, Pricing, About**
- Copy: one full-height Figma screenshot per page (5 reads: 28, 29, 30, 31, 33:155), transcribed into each feature's `CONTEXT.md` with what the build changes and why. Disagreements and claims logged in docs/OPEN_ITEMS.md.
- All pages use the shared design (SkyHero or a sky hero, SectionHead, Reveal, Home cards, FinalCta with page-specific lines). Copy follows `marketing-skills:copywriting`; facts only from Figma, the old site and the brief.
- `/services/[slug]` (generateStaticParams, 6 slugs): breadcrumb hero with the service's film (ServiceArt), From · Turnaround · Revisions, service tabs; what's included; levels (photo editing, drone); recent work; questions. Content in `features/services/data.ts`. `/services` index from Home parts.
- `/pricing`: Home levels + bulk row, calculator (`features/pricing/Calculator.tsx`, $620 at Figma defaults, NumberFlow), billing with PricesArt, full price list (all "From"), questions.
- `/how-it-works`: four step rows with StepArt (`big`), Home's overnight timeline, files and ways to send.
- `/work`: all 87 TechX edits from the old site (`public/photos/work`, 6.5 MB WebP), filter chips with counts, pages of 24, native-dialog viewer (arrows, Esc). Finished edits only; "pairs coming soon" note.
- `/about`: story, timeline, team with "Portrait to come" placeholders, values, real quotes; stand-in studio photo labelled.
- Small shared changes: `Pricing({ head })` + exported `plans`; `ServicesGrid({ head })`; `Overnight` exported; `StepArt` `big` variant. Sitemap lists every route.
- Checked: tsc, eslint, `next build` clean; preview on 4310 (owner's dev server was off) at 1440 and 390 (no overflow, one H1 each), filter and viewer work, no console errors. Preview stopped.

**2026-11-02 · Form errors, rate limits, file and ZIP checks; free-trial columns even; icons for ticks**
- Both forms (trial, contact) now: shared validation with inline errors (`features/site-shell/FormField.tsx`), server guards, durable rate limits (`lib/server/rate-limit.ts`), file checks by content and ZIP inspection (`lib/file-check.ts`), retrying uploads (`lib/uploader.ts`). Contact posts to `/api/contact` (saved to the chosen Dropbox / Drive). Full detail: `docs/uploads.md`.
- Free trial: both columns equal height (steps spread out, WhatsApp line at the foot); the tick row under the button uses icons (card, clock, lock) shared with the hero points (`POINT_ICONS` in `SkyHero.tsx`).
- Tested on the dev server (see docs/uploads.md); tsc + eslint clean.

**2026-11-02 · Free trial page + Dropbox / Google Drive uploads + Geist**
- Font: Geist for headings and body, Geist Mono for labels, site-wide (owner). `layout.tsx` + `theme.css`; Satoshi file left in `app/fonts` unused. **Restart `npm run dev`** if the old font still shows (theme.css change).
- `/free-trial` from Figma 32:155 in the shared design (new `features/site-shell/SkyHero.tsx`, now also used by Contact).
- Uploads: files go browser → TechX's Dropbox or Google Drive; admin picks the destination at `/admin`. Setup and keys: `docs/uploads.md`. Tested end to end with the development destination; Dropbox/Drive need the owner's keys.
- `/admin` returns 404 on the owner's running dev server only (the identical page renders at any other path; looks like a stale route cache). Restart `npm run dev` and check `/admin`. Local test values for APP_SECRET / ADMIN_PASSWORD are in `apps/web/.env.local` (git-ignored).

**2026-11-02 · Contact page redone in the Home design**
- Owner: follow the Home design. Hero now mirrors Home (sky, live studio badge, word-rise headline, pointers); channel cards are Home answer cards with new Email and Call illustrations; SectionHead + numbered form and studio cards. Exported `Words` (Hero) and `useSequence` (AnswerArt) for reuse. Checked desktop + 390px on the owner's dev server, no console errors; tsc + eslint clean.

**2026-11-02 · Contact page built (`/contact`)**
- From Figma 34:155 (copy in `features/contact/CONTEXT.md`): two-column head with the WhatsApp chat art, three channel cards (Open WhatsApp · Copy address · Book a call), "Send a message" form + Studio card, "Before you write" questions, final CTA. Added to the sitemap; `lib/site.ts` has the studio phone; `Faq` takes title / lede / questions.
- Owner rules applied: India only (no town), from-Figma map swapped for TechX's drone edit, hours converted live to New York / London / Sydney, phone in +91 form. Form opens the mail app (no backend yet). FAQ answers on studio visits and NDAs to confirm with TechX.
- Checked on the owner's dev server: desktop and 390px (no overflow), no console errors; tsc + eslint clean.

**2026-11-02 · 404 digits no longer clipped**
- The tighter aspect ratio cut the bottom of the 404. The halftone area's height now follows the digit size (`h-[calc(clamp(112px,24vw,420px)*1.06)]`, same clamp as the text), so it's compact at every width and never clips. Checked on the owner's dev server: text 133–553px inside area 120–565px.

**2026-11-02 · 404 compact again, no edge line**
- Owner: keep the height as compact as possible; no gradient line at the bottom. 404 section back to content height (`pt-16 md:pt-20`, no bottom padding, `-mb-10`; links → footer line 80px; section ~727px at 1440, was 1180px full-screen); halftone area tighter (`aspect-[1.9/1] sm:aspect-[2.9/1]`). The sky and the light sweep still span the whole section but are masked to fade out over the bottom ~45%, so there's no edge where the section ends.

**2026-11-02 · 404 sky across the whole screen**
- Owner: the moving gradient should cover the complete page, not half. 404 section now fills the screen under the header (`min-h-[calc(100svh-5.5rem)]`, content centred); the sky (four soft radials + gradient, fading only at the bottom), three drifting clouds and the light sweep span its full height. Checked on the owner's dev server (section 1180px in a 1268px window).

**2026-11-02 · 404 bottom spacing**
- Owner: too much space above the footer line. 404 section: no bottom padding and `-mb-10` against the footer's shared `mt-24 / md:mt-30`, so links → footer border is 80px (was ~200px). Footer margin unchanged for other pages.

**2026-11-02 · 404 v3: halftone 404 on the page's own sky**
- After a dark dot-matrix reference, then owner: not dark, match the theme, no border at all, gradient across the full width. `NotFoundArt.tsx` `NotFoundStage`: full-bleed section with the homepage hero's sky (`hero-sky`, hidden on White) fading to transparent into the page wash; a slow diagonal light sweep; giant 404 printed as halftone dots from TechX's twilight photo (background-clip text + dot mask); a flashlight follows the mouse and brings out the photo's colour in the dots. No panel, no frame. Copy: "404 · No listing at this address" / "Nothing's listed at this address." / "This page doesn't exist or has moved. Head back home, or send us ten photos and see what we can do with them." Buttons: Try 10 photos free · Back to the homepage; links Prices · How it works · Contact.
- Dev note: the owner's dev server stopped picking up `globals.css` edits (component / Tailwind class edits still hot-reload), so theme styling here uses existing classes, not new globals rules. Restarting `npm run dev` fixes it.
- Checked on the owner's dev server in Blue and White, desktop. Typecheck, lint clean.

**2026-11-02 · 404 v2: "off the market" listing**
- Owner: make it feel like a lost deal and show creativity. `NotFoundArt.tsx` is now a property listing card (Zillow / Rightmove style): TechX photo with "Off market" tag, save heart, gallery dots, 1 / 24; a maroon SOLD · PAGE 404 stamp springs down across the photo; $404,000 struck through · Price withdrawn; 404 Not Found Lane, Nowhere; 0 bd · 0 ba · 404 sq ft; MLS #404 · Days on market: ∞ · Listed by nobody. Card enters with a slight tilt, lifts on hover, photo pans. Copy: "404 · Off market" / "This page is off the market." muted "It sold, moved or never went live." Routes unchanged. Replaces the viewfinder.
- Checked on the owner's dev server at desktop and 390px (no overflow). Lint clean.

**2026-11-02 · 404 page**
- `app/not-found.tsx` + `features/site-shell/NotFoundArt.tsx` (owner: relatable to our users, personal message). Concept for real-estate photographers: a camera viewfinder over an out-of-focus TechX listing photo, focus box hunting and never locking, HUD "RAW · DSC_0404 · AF-S · Searching" and "f/8 · 1/125s · ISO 404 · No subject found". Copy: "404 · Frame not found" / "This page didn't make the shoot." muted "Not even HDR can recover this one." / "The link may be old or mistyped. Your listing photos are still in safe hands. Here's where photographers usually head next." Actions: Try 10 photos free (primary), Chat on WhatsApp, then See prices · How it works · Back to the homepage. noindex; real 404 status. Phones: viewfinder first, HUD shortened. Reduced motion: focus box rests.
- Checked on the owner's dev server at desktop and 390px (no overflow). Typecheck, lint clean.

**2026-11-02 · Collage faster, near tiles solid**
- `HeroCollage.tsx`: ~1.7× faster (far 240→140s, mid 185→110s, near 140→80s per crossing; near ≈37px/s at 2560px wide). Near (sharp) tiles no longer use `mix-blend-multiply`, so they're fully opaque and a blurred tile behind never shows through; soft layers keep multiply. Checked on the owner's dev server.

**2026-11-02 · Collage depth layers (no overlaps) + Satoshi site-wide**
- `HeroCollage.tsx` rebuilt devin-style (owner: tiles overlapped; wants every image on a depth layer): three layers, 1 far (×0.55, blur 10px + grain, 50% opacity, 240s), 2 mid (×0.8, blur 4px + grain, 80%, 185s), 3 near (×1.1, sharp, 140s). One speed per layer in fixed lanes, evenly spaced, so tiles in a layer never overlap (checked: 0 overlaps in each layer); nearer layers move faster (parallax). Flow unchanged.
- Fonts: owner picked Satoshi for headings and body (audience: real-estate listers in the UK, US, AU: trust, fast scanning, clear numbers), Geist Mono kept for labels. Satoshi variable 300–900 self-hosted via `next/font/local` (`app/fonts/Satoshi-Variable.woff2`, 42 KB, from Fontshare, ITF Free Font License: free for commercial use). Inter / Inter Tight removed; theme `--font-display` and `--font-sans` → `--font-satoshi`. `app/fonts-preview` removed.
- Checked on the owner's dev server: headings/body Satoshi (weight 520 headings), labels Geist Mono. Typecheck, lint clean (no build run).

**2026-11-02 · Hero collage grain + bigger tiles; font preview page**
- `HeroCollage.tsx`: back (soft) tiles now blur per photo (`blur-[6px]`, scaled 1.1 to hide edges) with film grain on top (shared SVG `#hero-grain` feTurbulence, overlay-blended inside each tile); front tiles stay sharp. A CSS data-URI version was dropped by the dev CSS compiler, so the grain is inline SVG. Tiles 1.5× larger (`--s` 1 / 1.25 / 1.5), start 420px off screen; flow, layers and speeds unchanged (owner).
- `app/fonts-preview` (noindex, temporary): the hero's words in six options: Current (Inter Tight + Inter), A Cabinet Grotesk + Satoshi (recommended), B Clash Display + Satoshi, C Satoshi only, D Chillax + Satoshi, E Hanken Grotesk only. Fontshare families load from api.fontshare.com, one request per family (combined requests return the wrong fonts). Waiting for the owner's pick; then self-host the chosen files and remove this page.
- Checked on the owner's dev server: grain visible on blurred tiles only, tiles 99–390px, all five preview fonts load. Typecheck, lint clean (no build run).

**2026-11-02 · Footer credit**
- `SiteFooter.tsx` bottom row: "Designed & developed by Pixel Caption", linked to https://www.pixelcaption.com/ (new tab, screen-reader note), between the copyright and the legal links.

**2026-11-02 · White CTA: stronger sky + moving gradient that follows the mouse**
- Owner saw a plain white CTA: the dev server on 3000 was serving a stale stylesheet after agent production builds wrote into the same `.next` (owner restarted it). Agents: don't run `npm run build` while the owner's dev server is up; check on 3000 instead.
- White-mode `.cta-panel` gradient made clearly blue (deeper top, carried further down, stronger blue edge).
- `features/site-shell/CtaFx.tsx` in `FinalCta.tsx` (White only via `.cta-fx`): two soft blue patches drift (14s / 18s CSS loops, stop under reduced motion) and a blue glow follows the mouse over the panel (springed, fades on leave). Behind the content, no pointer events.
- Checked on the owner's dev server (localhost:3000), White mode: drift running, glow follows the pointer. Typecheck, lint clean (no build run).

**2026-11-02 · White background: final CTA highlighted with the sky**
- Owner: on White, the final CTA should stand out with a blue gradient. `FinalCta.tsx` panel gets `cta-panel`; `globals.css` `html[data-bg="white"] .cta-panel`: the hero's sky (soft blue radials at the top, fading to white by the contact row) plus a faint blue edge and soft blue shadow. Blue background unchanged (the page sky already sits behind it).
- Checked at 1440 on White. Build clean.

**2026-11-02 · Background switch: White / Blue**
- Owner wants both backgrounds available. `features/site-shell/BgToggle.tsx`: White | Blue segmented switch in the header (desktop, left of Start free trial) and in the phone menu ("Background"). Sets `data-bg` on <html>; `globals.css`: `html[data-bg="white"] .sky-flow` → plain white, `.hero-sky` (hero sky + clouds) hidden. Blue is the default. Saved in localStorage `techx-bg`; an inline script in `layout.tsx` <head> applies it before first paint (no flash; `suppressHydrationWarning` on <html>).
- Owner review control like the Collage switch: decide before launch whether it stays.
- Checked at 1440: switch flips the page, choice survives reload. Typecheck, lint, build clean.

**2026-11-02 · Buttons on the same softer radius scale**
- Owner: buttons should follow the card hierarchy, not pills. `@techx/ui/Button` radius by size: sm 8 · md 10 · lg 12 (was rounded-full for all). `Chip` 8, hero scene tabs 8, phone sticky trial bar `rounded-card` (16 = its sm button 8 + 8 padding), menu button and skip link 10. Toggle switches and round icon-only controls stay circular.
- Checked at 1440 (header, hero, final CTA). Typecheck, lint, build clean.

**2026-11-02 · Softer corner radius site-wide**
- Owner: corners felt too round/bold; wanted "a bit curvy". Theme tokens (`packages/brand/theme.css`): input 12→8, inner 20→10, card 28→16, tray 32→18, panel 40→24; pills unchanged. Hard-coded radii brought in line: hero prompt box 13.5/12, hero tray `rounded-tray` with photo 14, pricing featured inner 14.5 and header panels `rounded-inner`, review cards 14, illustration canvas `rounded-inner`, objects inside illustrations 16→12. DESIGN.md and layout-and-spacing.md updated.
- Checked at 1440 (hero, answers, pricing). Typecheck, lint, build clean.

**2026-11-02 · Five answers back in the information-map order**
- Owner: the answers' order is fixed and must not be renumbered to fit a layout: 01 how we do it · 02 our process · 03 our prices · 04 how to start · 05 how to contact (docs/information-map.md). Bento rearranged around it: row 1 = 01 editor · 02 New York / India · 03 invoice; row 2 = 04 ten photos · 05 WhatsApp chat. Morphing heading questions back in the same order.
- Contact chat: window put in a fixed-height box (scaled 0.78) so its caption pill is no longer pushed out of the canvas.
- Checked at 1440: labels 01–03 on one line, 04–05 on the next, all five animations play. Typecheck, lint, build clean.

**2026-11-02 · Reviews as a small, continuously moving strip**
- `Testimonials.tsx`: the one-at-a-time slider (dots, drag, arrow keys) replaced by a continuous marquee (owner: too big, animation too busy). Reuses the logo strip's `marquee` / `marquee-mask` (globals.css): two identical halves, translateX(-50%), 55s linear (~31px/s at 1440), edges fade, pauses on hover; pause/play button kept. Cards 300px (330px md+), 15px quote, 20px radius; strip ~226px tall (was ~340px cards). Reduced motion: no movement, the row scrolls sideways.
- Checked at 1440: moves smoothly, seamless loop (halves 1710px each), stops on hover. Typecheck, lint, build clean.

**2026-11-02 · Five answers: every card animated again (3 over 2)**
- Owner: the illustrations designed for each answer must stay. `OptInArt` (ten photos into the free trial, edited ten back) and `ContactArt` (WhatsApp chat with the editor typing) restored from git into `AnswerArt.tsx`, animation unchanged, only sized for the bento (canvas 292px, scaled 0.84–0.9).
- Bento now three over two, numbered in reading order: 01 how we do it (editor) · 02 how to start (ten photos) · 03 how to contact (chat, with WhatsApp/email line) · then 04 our process (New York / India) · 05 our prices (invoice). All canvases 292px; card links pinned to the foot so they line up. The small text-only cards were removed. Section ~1,345px at 1440.
- Checked: desktop labels aligned per row; 390px order 01→05, no overflow. Typecheck, lint, build clean.

**2026-11-02 · "Five answers" as a compact bento; phone pass**
- `Answers.tsx` rebuilt after the owner's bento reference: all five answers in about one screen (section ~1,160px tall at 1440, was ~1,500+). Row 1: 01 How we do it (editor) · 02 How to start and 03 How to contact as two small stacked cards (icon, one-line answer, detail, link) · 04 Our process (New York / India). Row 2: 05 Our prices, wide (text left, live invoice right). Numbered in reading order (owner: 01→05 left to right, top to bottom); the morphing heading question follows the same order. Illustration canvases 292px (01, 04) and 272px (05). `OptInArt` and `ContactArt` removed (in git history).
- Phone pass at 390px (site loaded in a 390px frame; Chrome would not resize the window): no page overflow (Compare table scrolls inside its own box by design). Fixed: final-CTA contact rows now stack in one left-aligned column on phones; overnight timeline markers inset 5–95% so the end dots aren't clipped next to the flags. Checked answers, step cards 01–03, timeline, pricing, testimonials and the CTA at 390px.
- Typecheck, lint, build clean.

**2026-11-02 · Step cards 02 and 04 as real flows; apple-design review fixes**
- Step card 02 "Tell us once": the visitor types their style guide (fields fill one by one with a focus ring and caret), presses "Save style guide", it becomes "✓ Saved for every editor". Step card 04: the "Your photos are ready · 42 edited" email from TechX Studio lands (7:58 AM), the cursor clicks Download all → Downloading… → ✓ Downloaded, then "Need a change? Revision · free". Both play once with the row, replay on hover, rest on the finished frame (`StepArt.tsx`, `useTyped`, `useStage`).
- apple-design review of today's components. Already fine: buttons press on pointer-down, glass goes solid under reduced transparency, divider follows the mouse 1:1, step art rests under reduced motion. Fixed: (1) reviews slider can now be dragged/swiped 1:1 with momentum projection (decay 0.998, lands up to 2 quotes away); (2) pause/play button next to the dots (moving content needs a control); (3) arrow keys move it when focused; (4) no slide under reduced motion; (5) service cards press in slightly on pointer-down.
- Checked at 1440 in Chrome: drag, arrow keys, pause; typecheck, lint, build clean. 390px not yet checked.

**2026-11-02 · Editing shown as a photo editor on screen (edit, then check)**
- New `features/illustrations/EditorScreen.tsx` (owner, laptop reference): Photoshop-like workspace in a light theme, no Adobe name or logo. Tools left, canvas with a before/after divider, Layers panel right; HDR merge → Window pull → Sky replace → Verticals land as layers one by one, each pushing the divider into "after"; then a pill ticks 1 · Your editor and 2 · Your QC and ends on "Done". Scales itself to fit its container (ResizeObserver). TechX photo `tx-ext.jpg`.
- Used in answer card 01 "How we do it" (`EditingArt`, on a laptop, loops while on screen, captions: "Your RAW opens in our editor" · "Merge, windows, sky, verticals" · "Check 1 · your editor" · "Check 2 · your QC signs off"; not yet through Figma) and in step card 03 "Edit, then check" (window only, plays once with the row). Replaces the four-station `HowWeDoItArt` (in git history) and the old raw→edited wipe card.
- Checked at 1440: typecheck, lint, build clean. 390px not yet checked.

**2026-11-02 · Step-card illustrations, real testimonials, contact strip icons**
- How it works: each step card now has a small illustration on the dotted canvas (`features/illustrations/StepArt.tsx`): 01 brackets drop in and the bar fills; 02 the style guide fills line by line, then "Saved"; 03 a wipe takes a TechX photo raw → edited, then the QC shield stamps; 04 the gallery lands, Download presses, "Revision · free". Plays once, left to right (1.4s apart) when the row is in view; mouse hover replays a card; rests on the finished frame (also reduced motion / no JS). Replaces the animated icon tiles.
- Testimonials: the five real quotes from techxsystems.com (owner approved), trimmed and spelling fixed, never reworded; 3 across + 2 wide; names/country only, initials avatars. Confirm clients are happy to be quoted before launch.
- Testimonials then turned into a one-row slider (owner, reference image): centred quote with neighbours peeking, edges fade out (mask), auto-advances every 4.5s in an endless loop, pauses on hover/focus/off-screen, no autoplay under reduced motion, dots underneath (44px targets). Fayth's quote shortened to its first two sentences.
- Final CTA contact strip: icon chip per channel (WhatsApp logo, Pikaicons envelope, outline pin), WhatsApp and Email are links, wider spacing.
- "Aligarh" removed site-wide: studio shown as "India" (`lib/site.ts`, footer).
- Checked at 1440: typecheck, lint, build clean. 390px not yet checked.

**2026-11-02 · Pricing redesign, $0.50 start, aligned cards, draggable sliders, flags**
- Pricing (`Pricing.tsx`) rebuilt after the owner's reference, in the site's own colours (owner rejected grey trays, a black card and heavy shadows): white cards with hairline shadow; each level has a header panel (name + who it's for), "From $X / image", trial button, dotted rule, mono "includes" label, ticked list. Signature featured with the edge-glow border and a blue-tint header. New full-width **Bulk editing** row (500+ a month, "Talk to the studio"). Note under the prices: "Prices are starting rates. Your final rate depends on the edit and volume, and you'll see it before we start." (copywriting skill). Level lists come from the old site's photo-editing list (techxsystems.com), split across the Figma levels; not yet in Figma.
- Starting price settled (owner): **Essential from $0.50**; every price shown as "From". Drone card from $0.50 (`lib/site.ts`); prices illustration Essential line $0.50.
- Step cards: dashed connector between cards removed (owner); "who · when" tags pinned to the card foot so they line up across the row.
- Service cards: equal full height, price row pinned to the foot. Before/after divider is interactive (`ServiceArt.tsx` `Split`): follows the mouse on hover, sideways drag on touch, loop resumes when the pointer leaves.
- Overnight timeline: US and India flags beside New York and India (`FlagIN` added to `Flags.tsx`); city column 84px / 128px.
- Checked at 1440: typecheck, lint, build clean. 390px not yet checked.
- WhatsApp buttons (owner): new `whatsapp` variant in `@techx/ui/Button` (WhatsApp green, deepening to #0E7F3E under the label for ~5:1 contrast) + `WhatsAppIcon` (brand mark, Simple Icons CC0) in `@techx/ui/Icons`. Used for "Chat on WhatsApp" in `Faq.tsx` and `FinalCta.tsx`. Note: a second coloured button beside the blue primary in the final CTA, by owner request (AGENTS.md §3 rule 3 is blue-only).

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
