# STATUS.md

**Phase:** Build. Every page in Figma is built: Home, Services (index + 6-service template), Work, How it works, Pricing, About, Contact, Free trial, 404. Header and hero approved; the rest awaits owner review.
**Last updated:** 2026-11-03

## Resume here (read this first)
- **This repo is self-contained** (owner, 2026-11-02): all website context lives here. The `TechX System` folder elsewhere in `projects/` is a separate project; don't read or edit it for website work. Content facts: `docs/old-site-content.md`; decisions: `docs/decisions-log.md`.
- Repo: `/Users/gauravrana/projects/techx-website` (Turborepo, Next.js 16.4, Tailwind v4, Motion). `npm run dev` → http://localhost:3000.
- **Port rule:** 3000 is the owner's dev server. Agents preview on 4310 and only stop their own process (AGENTS.md §3.10).
- Home order (`app/page.tsx`): Hero (+ before/after tray) → Logo strip → Five answers → Services → How it works → Pricing → Why a team → Testimonials → FAQ → Final CTA → Footer.
- Last done (2026-11-02): all inner pages built from Figma (see Log). Next: owner review page by page.
- Done 2026-10-31: service cards now tell the whole edit on one screen (`features/service-art/ServiceArt.tsx`).

## Approved (owner, 2026-10-30): don't redesign without asking
- **Header** (`features/site-shell/SiteHeader.tsx`): apple.com-style full-width 48px bar, 1024px column, items spread evenly, 13px links, small blue pill CTA. Transparent at top, Apple material on scroll. Services → full-width flyout (big names left, photo cards right, page behind blurred). Phone: full-screen frosted sheet, scroll locked. No WhatsApp in header.
- **Hero** (`features/home/Hero.tsx`, `HeroStage.tsx` (collage switch removed 2026-11-03), `TrustBadge.tsx`, `Flags.tsx`): animated trust badge (flags, "Serving 500+ clients", ★ 4.9 rating) → "You shoot the listing. / We do the rest." → promise → Glide-style upload card → four Pikaicons pointers → before/after tray with real photos. Billow-style sky gradient from the top.
- Checked at 360/390/768/1024/1440: no overflow; lint, typecheck, build clean.

## Owner preferences (keep applying)
- UI/copy from Figma; design rules from `docs/design-system/`; all copy via `marketing-skills:copywriting`.
- Light only. Brand blue `#3074FE` / hover `#1E4FD6` / tint `#EBF1FF`. Geist for headings at 500–520 and body, Geist Mono labels (owner, 2026-11-02; replaced Satoshi, before that Inter Tight / Inter).
- Gradient buttons with inner highlight + soft shadow, soft-cornered (8/10/12 by size, not pills; owner 2026-11-02). No noise/ring CTAs. No new libraries unless asked (approved: motion, torph, @number-flow/react, lenis).
- Real photos (public/photos, docs/PHOTO_CREDITS.md), never drawn stand-ins. Icons: Pikaicons free pack.
- No optimisation passes unless asked.
- Rejected (don't bring back): framed glass tab header, glass capsule, floating proof cards, square grid + rails, brush underline, split hero, lens hero, studio-window tiles, Glide environment scene, gradient headline text, isometric/technical-drawing figures (anatomy skill: owner, 2026-11-02, don't use that skill on this project).

## Next steps
1. Owner review, page by page (header and hero approved; everything else waits).
2. Promo film: owner watches `video/overnight-15s/draft.mp4` → changes → sound → 4K60 final.
3. Next run (owner): hero trust badge (flags arrive without popping from nothing, the 4.9 source, the shine plays once) and the logo strip placeholders (/lab).
4. From TechX: raw/edited pairs (Work, sliders), portraits + studio photo (About), logos, staging details, what Luxury includes, permission for the 87 edits and the quotes.
5. Pages still missing from the footer: Blog, FAQ, TechX vs AI editors, Shoot guides, Client login, legal (Privacy, Terms, Refunds).
6. Before production: the email alert for new trials, upload keys (Dropbox / Google), Vercel env vars (docs/admin.md "Before going live"). Security audit done 2026-11-03 (Log).
7. Admin panel phase 2: every page's headings and text blocks.

## Open questions (full list in docs/OPEN_ITEMS.md)
- **Before every production deploy (owner, 2026-11-02):** run Cloudflare's security audit skill (github.com/cloudflare/security-audit-skill) and `security-review`, and report the results before the owner ships. Installed by the owner (2026-11-02) as the `security-audit` skill. Read its files before its first run.
- Uploads: owner to create the Dropbox app and/or Google OAuth client, Upstash, and set env vars (docs/uploads.md). Email alert to the studio when a trial arrives: not built.
- Turnaround: 10–16 h vs 12–24 h. Trust figures 500+ / 4.9 to confirm. WhatsApp number. Client portal ("Log in"). Replace sample photos with TechX's real pairs.

## Log
**2026-11-04 · Pre-production security check (security-audit guidance mode + security-review)**
- security-audit (scoped to changes since 2026-11-03): no confirmed findings. No secrets in tracked files (4 pattern hits were lockfile/icon/font base64); only .env.example tracked; npm audit --omit=dev 0; /admin/contacts is per-request (prebuilt shell holds only the public support@ address).
- security-review (subagent over `git diff HEAD` + new files): no candidate vulnerabilities (contacts SQL parameterised, isAdmin before data, https-only trial link, Drive query escaped, ?cat never rendered).
- Smoke test on a fresh production build: all 27 routes 200, 404 page 404, 6 security headers present, no server errors; typecheck, lint, 4 tests pass.
**2026-11-04 · Phone scenes: content under the status bar (dev server)**
- `features/stage-kit/phone.css` was wrapped in `@layer stageshow`. A layer ranks by which stylesheet names it first; on the dev server phone.css could load before globals.css, so the layer ranked below Tailwind's base reset and `.ss-phone__content` lost its 62px top padding (chat header and call logo under the notch). Rules are now unlayered (same rank as production had). Checked on the owner's dev server (:3000, view only): padding 62px, status bar clear on all three Contact cards. Note for testing: don't `scrollIntoView` an element inside a Canvas; it scrolls the clipped canvas too.
**2026-11-04 · Bold pass: real work on Home; header link spacing**
- `features/home/WorkBand.tsx` after ServicesGrid on Home (impeccable bolder): one large twilight + interior, exterior, drone, yacht from the admin's Work gallery, each linking to /work?cat=…; "See all N edits". Copy reused from the Work page. Photos are 800 px wide, so tiles stay ≤ 590 px. Detector: 0 findings.
- Header (owner): the five links are one group with a 28px gap (was spread evenly across 1024px); logo left, button right. The approved header is otherwise unchanged.
- Not done (needs owner assets): real before/after pairs, real client logos, About portraits.
**2026-11-04 · Vercel web-design-guidelines installed and applied**
- Installed `vercel-labs/agent-skills@web-design-guidelines` (.claude/skills; Safe/0 alerts). Rules fetched from vercel-labs/web-interface-guidelines and checked over the public site (admin excluded).
- Passed already: no transition-all, no clickable divs, raw imgs or zoom lock; skip link; focus rings; reduced motion (MotionConfig + global CSS); tap highlight/touch-action; text-wrap balance/pretty; testimonials and logo marquee pause on hover.
- Fixed: looping illustrations stop after two passes on their finished frame (`useSequence` AnswerArt, ServiceArt `useSteps`, `useEditSteps`; checked: 0 DOM changes after 33 s on /contact); `spellCheck={false}` + autoCapitalize none on email/link inputs (contact, trial); Work filter in the URL (`/work?cat=aer`, useSyncExternalStore, replaceState) and service "See all work" links to its category; photo viewer `overscroll-contain`.
- Not applied (conflict with DESIGN.md §1 voice): Title Case headings, avoiding "we", "&" for "and".
**2026-11-04 · Audit fixes 1–5, file-type icons, contact list in the admin**
- 1 Stale-tab protection: `versionOf()` (content-store) fingerprints a stored section; the admin page passes it to Editor, every save sends it back, `saveContent` refuses with `stale` if the stored section changed (another tab, blog API); success returns the new version; Editor shows Reload. Tested with two tabs on the throwaway DB: tab B refused, tab A keeps saving.
- 2 Drive: `gdriveFolderIn()` finds the sub-folder before creating it; dead `subs` map removed. 4 email: local "mail-dup" mark removed (Resend Idempotency-Key handles repeats; failed sends can retry). 5 `cleanName`: dot-only names → "untitled".
- 3 Tests: `apps/web/tests/core.test.ts` (node --test, `npm test`): token purpose / expiry / tampering, `toBlocks` (moved to `features/blog/blocks.ts`). tsconfig `allowImportingTsExtensions`. coerce and cleanName not covered (their modules use @/ imports Node can't resolve).
- Contact list: migration `db/migrations/0003_contacts.sql` (**owner runs `npm run db:setup` in apps/web**), `lib/server/contacts.ts` (addContact / listContacts, never fails a visitor), contact route records first and counts it as received (folder, email or list), trial start records after the folder exists; `/admin/contacts` (Inbox → Contact list): type, India time, name/studio, mailto, message or trial details. Read-only, newest 1,000 (shortcut comment). Tested on the throwaway DB.
- /how-it-works "Files we accept": an image-file icon on each format (owner asked again).
**2026-11-04 · Ponytail audit (report only) + Ways-to-send icons**
- Removed the duplicate project copy `.claude/skills/ponytail` (+ skills-lock entry); the plugin (ponytail@ponytail 5.3.3) is the one in use.
- `/ponytail-audit` findings, NOT fixed yet (owner to pick): **1 must** admin save deletes posts/services added elsewhere (stale tab sends whole list; savePosts/saveServices delete what's missing) → reject saves when the stored section changed since the tab loaded; **2 must** Google Drive: every contact message makes a new "Contact messages" folder (`subs` map never filled) → look the folder up first; **3** no tests for seal/unseal, coerce, toBlocks → one node --test file; **4** failed email counts as sent (dedupe/caps before fetch); **5** cleanName keeps "."/".." → Dropbox rejects.
- /how-it-works "Ways to send": icons (upload, Dropbox, Google Drive, chat). "Files we accept" left as text (same icon ×8 adds nothing; owner can ask).
**2026-11-04 · Ponytail skill installed and applied**
- Installed `DietrichGebert/ponytail` (MIT; instruction-only skill, no scripts/hooks) with `npx skills add … --skill ponytail` → `.claude/skills/ponytail` (scanners: Safe / 0 alerts / Low risk). The full plugin (status band, lifecycle hooks, /ponytail-review, /ponytail-audit) needs the owner's `/plugin marketplace add DietrichGebert/ponytail` + `/plugin install ponytail@ponytail`.
- Applied (knip scan + manual review): deleted dead `features/site-shell/PageHead.tsx`, `defaultOf()` (fields.ts), `kvUpdatedAt()` (kv.ts) and the unused `contentKey` re-export (lib/content/index.ts); one shared `redis()` (rate-limit.ts, imported by kv.ts). Feature CONTEXT.md files now name SkyHero instead of PageHead.
- Kept on purpose: per-component `spring` constants, the four illustration `Tick` icons, exported names used inside their own files (removing `export` is churn). knip false positives: eslint config, @techx/brand and tailwind (used from CSS).
- Typecheck, lint, build clean; pages 200; contact API 422 on an empty form.
**2026-11-04 · Audit follow-ups: facts, first screen, new pages**
- Turnaround standardised on **10–16 hours** for photo editing, twilight and drone (hero, Services/How it works pointers, How it works steps, Essential level, FAQ, service data, TURNAROUND); staging/plans 24 h and video 24–48 h unchanged; free trial still says "within 24 hours" (owner to confirm). **120+ clients** in the trust badge (rating 4.9 kept). Same changes applied to saved content in Neon (facts, pricing, faqs, services table), guarded.
- Hero first screen: lede now opens with "**Real estate photo editing** by people, not presets." + scope + price; the four pointers became three numbered steps (Upload after the shoot · Edited by hand, checked twice · Back in 10–16 hours). Checked desktop + phone.
- New pages: /faq (all four question groups from the admin), /techx-vs-ai-editors (Home's Compare table + "when an app is enough / when a team is worth it"), /privacy (Google Analytics + Search Console, marketing use only), /terms, /refunds (only promises the site already makes), /shoot-guides and /client-login as Coming soon (noindex). Shared `features/site-shell/TextPage.tsx` (TextPage, ComingSoon). Footer links them all; legal row is now links. Sitemap + llms.txt updated.
- Blog: post "How we use analytics on our website" (/blog/how-we-use-analytics) inserted into blog_posts, published, 2026-11-04. Blog cards hide the image box when a post has no cover.
- `features/blog/render.tsx` toBlocks(): a "## " heading or a "- " list no longer needs a blank line around it (headings were swallowing the paragraph under them).
- Legal pages are plain-language drafts: have them reviewed. When GA is added, CSP needs Google's hosts (googletagmanager.com, google-analytics.com).
- Logo strip placeholders kept (owner, "keep it for now").
**2026-11-04 · Luxury content; Work categories editable in the admin**
- Luxury includes (owner confirmed, 2026-11-04; old site has no levels): Hand-masked blends · Flash and ambient frames blended by hand · Object removal · Cords, wires and small clutter removed · Colour and white balance matched across the whole set · Commercial and architectural buildings. In DEFAULTS (`lib/content/types.ts`). Saved pricing in Neon updated too (owner asked, 2026-11-04): only Luxury.items, guarded on the old 2 items, in a transaction; now Essential 7 · Signature 7 · Luxury 6. A fresh build shows 6/6 on /pricing and Home; the owner's running dev server keeps its in-memory cache until restarted or a Pricing save.
- New content key `categories` (admin "Work categories", Proof and writing): name + code (code made from the name, unique, a–z/0–9/-). Photo Category select and each service's "Recent work" pick from it (`source: "categories"` on select/multi; Editor `Sources` context; `app/admin/[section]` passes them for work/services); `coerce` accepts any well-formed code for sourced fields. Work page chips and labels, service Recent work use the saved list (`toShots`/`countsOf` take it). Defaults = the six from the old site.
- `lib/server/admin.ts` adminEmail: `await connection()` first (the expiry check read Date.now during prefetch prerender: "unstable value" warnings on /admin pages); warnings gone.
- Typecheck, lint, build clean; checked via throwaway preview admin on 127.0.0.1 (read only, nothing saved).
**2026-11-04 · Pricing calculator polish; admin photo cards; admin select chevron**
- `features/pricing/Calculator.tsx` (impeccable polish + make-interfaces-feel-better): value pill with unit on each slider plus min/max marks; 8px track, 24px thumb, touch-pan-y; level as a full-width segmented radiogroup (name + "from $X"); summary as a receipt (dashed rules, "Total a month"), "$X a month", CTA bottom-aligned with "First 10 photos free. No card." (verified announcement copy); concentric corners (p-1.5: 16 = 10 + 6). Rates and copy unchanged.
- Admin photo lists (Work, Team): `FieldView compact` stacks fields one column inside the card (row grid used screen breakpoints, so Category/Label were squeezed: "Interi", wrapped "Label (optional)"); no "Photo" label; footer row with position number + move/remove; grid 1/2/3/4 columns at sm/lg/2xl.
- `features/admin/ui/input.tsx` NativeSelect: lucide ChevronDown (the data-URL background arrow never rendered).
- Checked in Chrome (desktop) incl. /admin/work via a throwaway preview-only admin on 127.0.0.1; impeccable detect: 0 findings; typecheck, lint, build clean.
**2026-11-04 · Blob token renamed to BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN (owner's Vercel name)**
- `lib/server/media.ts` `blobToken()` reads the new name and passes `token` to `put()` (the library only auto-reads BLOB_READ_WRITE_TOKEN); `mediaStoreKind`, `next.config.ts` (image host), `instrumentation.ts`, admin overview hint, `turbo.json` env lists, `.env.example`, `docs/admin.md` all use the new name. Not set in local .env files (local uploads go to public/uploads). Typecheck, lint, build clean.
**2026-11-03 · Contact: Offices section**
- `features/contact/Offices.tsx` after "Write to the studio": one card per office (label · country, city, `<address>`, tap-to-call numbers, Google Maps directions). Data in Site facts → `offices` (`lib/site.ts` defaults from docs/old-site-content.md; admin-editable list; saved facts without offices fall back to the defaults). Organization schema now lists the three addresses and office phones.
- `lib/site.ts` had been replaced at 22:00 by an older copy (no trust/phone/announcement, older service lines) and the build broke. Owner chose: restore the committed file, keep the new site description; studio stays "India" (owner: India only, not Aligarh). The 22:00 copy is in the session scratchpad.
- Typecheck, lint, build clean; checked in Chrome at desktop width. 390px not seen (window resize had no effect).
**2026-11-03 · Production readiness + call-screen icons**
- `turbo.json`: build/dev tasks list every env var (Turbo 2 strict mode hid DATABASE_URL / BLOB_READ_WRITE_TOKEN from `turbo run build`, so prerendered pages would use defaults); build `cache: false` so a redeploy never replays old prerendered content.
- `app/error.tsx` (inside the site shell, Try again + Contact, error reference) and `app/global-error.tsx` (self-styled last resort).
- `instrumentation.ts`: on production start, logs missing/weak settings (never values). Local run flags ADMIN_PASSWORD under 16 characters.
- Contact call scene: mute / keypad / speaker icons in the in-call buttons (`CALL_BUTTONS`, ContactScenes.tsx); layout unchanged. Then (owner): "ringing…" touched the buttons; caller block pt-10→pt-6 and phone-like line heights (1.2 name, 1.35 number/status): 22px gap, buttons unmoved.
- Checked: typecheck, lint, build clean; npm audit 0.
**2026-11-03 · Full Content-Security-Policy; Resend email alerts**
- CSP (`next.config.ts`): default-src 'self'; scripts/styles self + 'unsafe-inline' (kept so pages stay prerendered and cached; nonces would make every page dynamic); images self, data:, blob:, own Blob store; connect self + content.dropboxapi.com + www.googleapis.com (trial uploads); frame-src 'none'; object-src 'none'; base-uri/form-action 'self'; frame-ancestors 'self'; upgrade-insecure-requests on Vercel; vercel.live only on preview deploys; 'unsafe-eval' only in dev. Checked in Chrome on 13 pages: React runs, CSS loads, 0 broken images, 0 violations while scrolling; outside image/fetch/script refused.
- Email (`lib/server/email.ts`, Resend REST, no SDK): one alert to the studio (MAIL_TO, default site email) per contact message and per free trial (sent with `after()`); visitor only as Reply-To. Gates: route guards → 10-min duplicate check → monthly cap (MAIL_MONTHLY_CAP 2900) → daily cap (MAIL_DAILY_CAP 90), counted in Upstash. Contact: if Dropbox/Drive is down, the email alone counts. Tested with a dummy key, cap 2, Redis off: repeat dropped, 2 sent (401), 2 capped. Waiting on MAIL_FROM (verified Resend domain) from the owner; RESEND_API_KEY is in .env.local (send-only key).
**2026-11-03 · Pre-production security audit (security-audit skill, guidance mode) + security review**
- Fixed (medium): `/admin`, `/admin/[section]`, `/admin/uploads` were prerendered at build, so the prebuilt HTML/RSC held drafts and settings for anyone signed out (the layout's sign-in card only hid it). Removed `generateStaticParams`; each page checks `isAdmin()` before reading data. Verified signed out: sign-in card only, no draft or settings in HTML or RSC.
- Hardening: sealed tokens are purpose-bound (`seal(data, ttl, purpose)` / `unseal(token, purpose)`: admin-session, trial-ticket, local-upload, oauth-state), so one kind can't stand in for another. Old admin cookies are invalid: the owner signs in once more. Checked: real session → editor; no-purpose and trial-ticket tokens → sign-in card.
- `cleanPosts` + `slugify` moved out of the `"use server"` file to `lib/server/clean-posts.ts` (every export there is a public endpoint; this one was harmless but needless).
- Image optimiser limited to this project's own Blob store (host read from `BLOB_READ_WRITE_TOKEN` at build); headers add HSTS (2 years) and a safe CSP subset (`object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'`). A full script CSP needs nonces (not done).
- Dependencies: root `overrides` pins `@vercel/cli-config`'s zod to ^4.6.7; `npm audit --omit=dev` = 0.
- Reviewed, no finding: OAuth (state + nonce + admin), local upload (off in production, path confined), trial routes (rate limits, size caps, signed tickets), contact route, blog API (admin check on writes), JSON-LD escaping, blog `safeHref`, crypto (HMAC + timingSafeEqual), cookie flags, `.gitignore` (only `.env.example` tracked).
- `security-review` skill could not run: it diffs against `origin/HEAD`, which isn't fetched here (fetch is G1). Its server-action/route auth sweep was done by hand.
**2026-11-03 · Autosave, per-item cache tags, admin shimmer**
- Editor autosaves 1.5 s after the last edit (single-flight + re-run, ⌘S immediate, Retry on error; Save/Discard buttons removed). `saveContent` skips unchanged saves; `saveServices`/`savePosts` write only changed rows (order-independent compare `same()`), so updated_at reflects real edits.
- Cache tags: `getItem` now tags `content:<key>:<slug>`; saves refresh `tagsToRefresh(key, before, after)` = section tag + changed item tags only (admin actions via updateTag, blog API via revalidateTag). Reset refreshes old + default items.
- Shimmer: `features/admin/ui/skeleton.tsx` (+ `.admin-shimmer` in globals.css, still under reduced motion), `features/admin/Skeletons.tsx` (overview, section, shell), `app/admin/loading.tsx`, `app/admin/[section]/loading.tsx`, layout Suspense fallback, uploads fallback.
- Live Neon checked read-only: services 6 rows, site_content 9, blog_posts 0 (owner ran setup + save-everything).
- Tested on the throwaway local PostgreSQL with a throwaway test login (env only): shimmer shows within 60 ms of opening Services; autosave "Unsaved changes" → "Saved" ~1.6 s with no click; row updated; service page and Pricing show it; second edit updated only that service's row. Test value restored.
**2026-11-03 · Admin sign-in by email + password; admin follows the site theme**
- `lib/server/admin.ts`: `ADMIN_EMAIL` + `ADMIN_PASSWORD` (both compared in constant time; one message for either wrong), session cookie carries the email (changing ADMIN_EMAIL signs everyone out), `adminEmail()`. `login` action rate-limits per address and per email, keeps the typed email on failure. `.env.example` has ADMIN_EMAIL; `.env.local` set to the owner's email (password unchanged). Sidebar shows the signed-in email.
- Theme: sign-in page on the site's hero sky + clouds with the TechX mark; admin tokens in brand colours (primary/sidebar-primary #1E4FD6, ring #3074FE, sky-tinted sidebar #F4F8FE, accent #EEF4FF); sidebar logo tile is the TechX mark.
- Checked: typecheck, lint, build; sign-in page screenshot; wrong email/password message. Not checked by me: the signed-in dashboard in the new colours (needs the owner's password).
**2026-11-03 · Every record in PostgreSQL; Redis checked**
- Live Neon database checked (read-only): `site_content` existed, empty. New `db/migrations/0002_services_and_posts.sql`: `services` (one row per service, real columns + jsonb for hero/fixes/faqs) and `blog_posts` (one row per post). `lib/server/content-store.ts` routes sections: services/blog → tables, the rest → `site_content`, no DB → kv as before; falls back to `site_content` if 0002 isn't applied yet. lib/content, admin save/reset, blog API and the overview badges use it.
- Admin overview: "Save everything to the database" (`saveAllToStore` → `seedMissing`, never overwrites; blog excluded when empty).
- Redis (Upstash) checked: PONG, empty. Its role: shared rate limits (contact, free trial, and now admin sign-in 10/15 min + 40/day). Admin sign-in shows "That password isn't right." / "Too many tries…" (`features/admin/LoginForm.tsx`, `login` returns state); before, a wrong password reloaded silently.
- Tested on the throwaway local PostgreSQL with Redis blanked: both migrations, the save-everything button (6 service rows, 9 site_content rows), service page from the table, blog API create/get/delete via `blog_posts`, wrong-password message. Upstash counter self-test (60 s key). **Owner to do:** run `npm run db:setup` again (applies 0002 to Neon; agents can't, G2), then Admin → "Save everything to the database".
**2026-11-03 · PostgreSQL backend for admin content**
- Owner will paste a PostgreSQL link as `DATABASE_URL`. `lib/server/db.ts` (postgres.js v4 pool: max 3, no prepared statements so poolers work, TLS unless localhost) and `lib/server/kv.ts` now use PostgreSQL first (table `site_content`: key, value jsonb, updated_at), then Upstash, then `.data/` files. Upload settings moved onto the same store. Admin saves and the blog API return readable errors (`explainDbError`; blog API 503 via `guard`).
- Owner runs once: `npm run db:setup` (scripts/db-setup.mjs: applies `db/migrations/*.sql`, copies `.data/` content without overwriting). Agents don't run it (GUARDRAILS G2).
- Caught in testing: v4 double-encoded `${raw}::jsonb` (stored a JSON string); fixed with `::text::jsonb` in kv.ts and the setup script.
- Tested on a throwaway local PostgreSQL (port 54329, scratchpad, stopped): setup script, admin save → row is an object → Contact page shows it, blog API create/get/delete. Not tested: the owner's own database (link not yet pasted), Vercel.
**2026-11-03 · Speed pass, round 2 (all at once)**
- Root cause of 3–4 s LCP on most pages: `Reveal`/`RevealGroup`/`RevealItem` started content at opacity 0 and faded it in only after JavaScript loaded. Rewritten as plain elements + a CSS scroll-driven animation (`.reveal`, `animation-timeline: view()` in globals.css): on-screen content is drawn finished at first paint, lower content rises and sharpens as it scrolls in (no fade, so text never measures low-contrast), no support / reduced motion = shown. Same component API; no call sites changed; Motion no longer needed for reveals.
- Hero photo tray (Home) and service-page photo: `.rise-in-place` (rise only, no delayed fade/blur), so the LCP image paints at once. Hero copy keeps its approved fade.
- Lenis: loaded with `import()` after window load + idle, only on mouse/trackpad devices (it never smoothed touch). Hero collage photos load after load + idle and fade in. Service cards load their photos within ~300px of the screen (first `/services` card and service heroes eager). Geist Mono not preloaded.
- Accessibility to 100 everywhere: brand green token → #147A3A (packages/brand/theme.css), ScrollFill words start at 0.6 opacity, step numbers / chat bubbles / small buttons / video title contrast.
- Lighthouse mobile (local prod build): Performance 100 on Pricing, How it works, Work, About, Contact, Free trial, Blog; 90–92 Services and service page; 87–90 Home. SEO, Accessibility, Best practices 100 on all ten. Real LCP 0.11–0.45 s; the remaining simulated 3.4–3.8 s on photo-led pages is Lighthouse charging the image for ~270 KB of JS (React 70 KB + Motion 43 KB). Next lever: replace Motion in the header and scenes with CSS. Confirm with field data (Search Console / Vercel Speed Insights) after deploy first.
**2026-11-03 · Speed, caching and SEO files pass (Lighthouse mobile, local production build)**
- Fixed: Home had no `<title>` (seo.ts passed `title: undefined`, wiping the layout default; Home now sets an absolute title). Site header, announcement bar and footer were missing from the server HTML (Suspense fallback null + HideOnAdmin) → header's fallback is the header itself (`SiteHeaderShell`), footer/spacer render directly, hidden on /admin by CSS (`[data-site-chrome]`). HideOnAdmin removed.
- LCP: hero word/rise keyframes start at opacity 0.01 (same look, counted at first paint); hero photo uses `loading="eager" fetchPriority="high"` (was deprecated `priority`); /services first row and service-page heroes load eagerly (`ServiceArt eager`); hero collage tiles `fetchPriority="low"`, blurred ones at 1x and quality 50 (`images.qualities: [50, 75]`). Client gets only `ServiceLink` fields (toLinks in lib/content/types.ts), not full service records.
- `experimental.inlineCss` tested and rejected (CSS copied 3× into the page; LCP worse); note left in next.config.ts.
- Caching: `/photos/*` 30 days + SWR (was max-age=0); optimised images `minimumCacheTTL` 31 days (was 4 h). Pages already s-maxage 30 days + SWR, invalidated by admin saves.
- A11y to 100: blue text → `text-blue-2` (brand blue fails 4.5:1 for small text; buttons keep brand blue); FinalCta contact list is a `ul`; hero link uses its visible text as its name; contrast fixes (badges, WhatsApp grey, step numbers #8B8B93, hero placeholder). Service page Suspense fallback 160svh (CLS 0.035 → 0).
- SEO files added: `app/manifest.ts`, `app/apple-icon.tsx`; sitemap carries the 87 Work photos as image entries. Existing: robots.txt, sitemap.xml, llms.txt, icon.svg, opengraph-image, canonicals, JSON-LD.
- Scores now (mobile, simulated slow 4G): SEO 100 and Best practices 100 on all 9 pages; Accessibility 100 on all; Performance 100 How it works / Work / Free trial, 89–94 Home / Pricing / About / Contact / service page, 84 /services. Remaining: simulated LCP 3.4–4.4 s on image-led pages, bounded by ~270 KB JS (react-dom 70 KB, motion 43 KB). Next: field data after deploy (Vercel Speed Insights / Search Console), then trim motion on non-interactive parts if field LCP is over 2.5 s.
**2026-11-03 · Stageshow pass on the rest of the site (all pages except /admin)**
- Reviewed Home (every section), Services, a service page, Pricing, How it works timeline, Work, About, Free trial, Blog, 404 at 1440 and 390. Header and hero left as approved; "Client logo" placeholders kept (owner).
- Home step cards (`StepArt`): 03 uses the new `EditCloseUp` (photo + Layers, header ends on "Checked") instead of a cropped editor window; 04's mail is visible from the first beat (no empty card); mono status labels → sans. `EditorScreen` lost its unused window variant.
- Service cards (`ServiceArt`): floor plan spans the card (was small in blank paper, "before" side empty); corner tags in sentence-case sans.
- Pricing calculator: a breakdown (photos × rate, twilights × $1) fills the empty band above the button. Testimonials: initials get a per-client tint instead of a grey disc. Free trial: steps no longer spread to the form's height; the card is sticky beside the form.
- No change needed: pricing cards, comparison table, FAQ, final CTA, Work gallery, About, Blog, 404 (real UI, nothing stageshow flags).
**2026-11-03 · Stageshow fixes applied to every mock-up (Home answers + step card 03, How it works, Contact, trust badge)**
- New `Shot` in `features/illustrations/Canvas.tsx`: scenes draw at a readable size and are cropped by the panel (corner bleed: gutter top-left, off the right and bottom; on phones it crops around each scene's focus instead of shrinking type). `mode="fit"` for whole compositions. Shared `SHADOW_HERO` / `SHADOW_SATELLITE`; `Story` captions cross-fade (never blank). `Fit` removed.
- How it works: Mac is the screen only (no bezel/base), no menu-bar clock (it was cut by the crop); windows shortened so actions sit above the crop; step 04 opens on the mail (no blank desk); step 02's style guide lands as the mail leaves. Editor (`EditorScreen`): `desk` / `window` variants drawn at design size; Layers kept whole; checks pill inside the crop.
- Contact: stageshow's iPhone copied to `features/stage-kit/` (MIT, LICENSE kept; only the Phone + a few tokens in `.ss-tokens`, not the stage reset, which would undo Tailwind). Phones 268px, pinned top, fading at the foot; chat starts with its first message; booking sheet rises into view. Email card: Mail window left, files under it, larger type.
- Home answers: 01 is a close-up (photo + Layers panel straddling it); duplicate labels removed (checked-twice bar, billed stamp, dashed free-trial box); 04's thumbnails are the raw shots (no grey); 05 has no empty first beat; mono labels → sans (mono kept for prices, times, file names).
- Trust badge shows the real 500+ / 4.9 from the first frame (no count-up from 0).
- Checked: typecheck, lint, build; desktop 1440 and 390 frames of Home, How it works, Contact.
**2026-11-03 · Stageshow review of the site's faux UI (no code changed)**
- Installed `stageshow` (benjitaylor/skills) at `.agents/skills/stageshow`, symlinked for Claude Code; `skills-lock.json` added. Reviewed every mockup at 1440 and 390 by its rules (framing, hierarchy, motion, polish). Main asks: 390px versions of the Mac/phone scenes (type is ~5px on phones); bigger, cropped devices on Contact; no empty or captionless frames mid-loop (How it works 04, Contact captions); fewer gray filler bars on the Answers cards; one figure language across pages. Awaiting owner's pick before building.
**2026-11-03 · Admin redesigned in the shadcn/ui dashboard style (admin only)**
- Owner asked for the shadcn dashboard on the backend, not the frontend. Added `radix-ui`, `lucide-react`, `class-variance-authority`, `clsx`, `tailwind-merge` (imported only under /admin). shadcn parts hand-written in `features/admin/ui/` (button, card, badge, input/textarea/select/label, switch, separator, dropdown-menu, breadcrumb); no shadcn CLI, so `globals.css` and the site components were not rewritten. shadcn tokens (`background`, `primary`, `muted`, `sidebar`…) are defined only inside `[data-admin]`; their names don't overlap the brand tokens. Borders use the border token via a base-layer rule scoped to the admin.
- `features/admin/AdminShell.tsx` replaces `AdminNav`: inset sidebar with grouped sections and icons, collapsible to icons (cookie `admin_sidebar`), slide-in sheet on phones, top bar with breadcrumbs and View website, user menu with Sign out. Overview is a dashboard (counts of services, Work photos, testimonials, posts; section cards with Original/Edited; storage line). Sign-in is a shadcn login card. Editor, photo fields, post editor and the Uploads page restyled with the same parts; behaviour unchanged.
- Checked: typecheck, lint, build; desktop (expanded and collapsed sidebar), service and post screens, Search & sharing, 390px with the menu open.
**2026-11-03 · Admin UX pass across every admin page**
- Checked all 13 admin screens at 1512px and 390px, then fixed: Search & sharing pages fold shut with a Built-in/Custom badge (was nine huge empty photo boxes); short fields (prices, years, numbers, choices) sit side by side; loose top-level fields get cards like their neighbours; photo fields max 360px; lists open fully only when short and small, collapsed rows show a summary (levels show price); settings column no longer sticky (it was taller than the screen); sidebar grouped (Offer, Proof and writing, About page, Site-wide); phones get View site / Sign out; "Reset to original" moved out of the save bar to the foot of the form; "Undo changes" renamed Discard; save bar respects the phone safe area; Blog blurb no longer shows formatting codes; overview page names readable; Uploads page title fixed and its storage warning only shows on Vercel.
- Typecheck, lint, build clean; screens re-checked in the browser.
**2026-11-03 · Admin UX: post editor, item screens, settings column**
- `features/admin/PostEditor.tsx` (blog body, `rich: true` textarea): toolbar (Paragraph/Heading/Subheading, bold, italic, link, list, quote, photo upload; paste/drop photos), ⌘B/⌘I/⌘K, Enter continues lists, Write / Side by side / Preview (real `PostBody`), A−/A+ text size, full screen (Esc), word count. Writes the same plain-text format, so nothing stored changes. Renderer now skips an empty trailing "- " list item.
- `Editor.tsx`: lists with `detail` (blog "post", services "service") show a list of rows (title + `meta`) and open each item on its own screen (back, previous/next, remove). Object fields marked `side` go into a sticky settings column. Remove has an Undo instead of a confirm box. ⌘S saves; in-admin links ask before leaving unsaved changes. Big title input (`big`).
- Checked: typecheck, lint, build, routes 200. Toolbar actions verified in the browser before the screen overhaul; the new list/item screens were not yet looked at in a browser (owner stopped the browser session).
**2026-11-03 · Admin: add/remove services and levels; per-page SEO; blog with API**
- Services are a full record (name, short, page address, line, from, turnaround, tag, photo, page header, what's included, questions, levels on/off, Work categories, search title/description); add / remove / reorder in the admin. Addresses made from the name and kept unique on save. The six originals keep their films (`ServiceVisual`), new ones show their photo; new service pages stream (Suspense) and read via `getItem()`. Pricing levels: add / remove up to four, grid adapts. Header menu, price table, sitemap read the records.
- SEO: admin "Search & sharing" per page (title, description, share image, noindex) via `lib/content/seo.ts` on every page's metadata; services and posts have their own search fields; hidden pages leave the sitemap.
- Blog: `/blog` (cards, empty state until the first post), `/blog/<address>` (formatted body built as React elements, BlogPosting JSON-LD, Suspense), footer link, sitemap, llms.txt. Admin "Blog" section (draft/published, date, author, cover, summary, tags, body, search). API: GET /api/blog, GET /api/blog/<slug> public; POST / PUT / DELETE with the admin session, same validation as the panel (docs/admin.md).
- Found and fixed: pages for addresses created after the build read a build-time snapshot that saves don't refresh; per-item cached reads (`getItem`) fix it (tested: create via API → page 200 at once; update; delete → gone).
- Tested on the 4310 preview: add a service → in grid + own page; blog create/update/delete via API and admin, post page and index; SEO title override on /pricing → restored. Test data removed. tsc, eslint, build clean.

**2026-11-03 · Admin panel, phase 1: edit the website without a redeploy**
- Owner: manage the whole website from an admin panel; storage Upstash (text) + Vercel Blob (photos); everything, in phases. Phase 1 built; phase 2 = every page's headings and text blocks.
- `/admin`: sign-in (ADMIN_PASSWORD), sidebar, overview (Original / Edited per section, store status), one editor per section: Site facts, Pricing levels, Services, Testimonials, Questions, Timeline, How we work, Team, Work gallery; Free-trial uploads moved to `/admin/uploads`. Site header, footer and trial bar hidden on admin pages.
- Content layer: `lib/content/types.ts` (types + defaults = the site as shipped), `fields.ts` (form description + server-side shaping), `index.ts` (`getContent`, `getSite`: 'use cache' + tag, updateTag on save), `lib/server/kv.ts` (Upstash or `.data/`), `lib/server/media.ts` (Blob or `public/uploads/`, bytes checked), `features/admin/*` (Editor, ImageField with in-browser WebP shrink, AdminNav), `features/content/ContentProvider.tsx` (facts + services for client components).
- Site rewired to read content: ~30 files (pages, header, footer, CTAs, contact, pricing + calculator, services, testimonials, FAQs, About, Work, schema, llms.txt, share image). About's team returns automatically once every member has a portrait. Pricing levels moved out of `Pricing.tsx` into content. Header/trial bar wrapped in Suspense (needed for pages to re-render after a save). New dependency: `@vercel/blob`. next.config: Blob image host, server action body 4 MB.
- Tested on the 4310 preview: sign in, edit the starting price → /pricing title and badge changed at once → restored; Work, Pricing editors render. Photo upload not tested end to end (needs `npm run dev`; `next start` doesn't serve new files) and not on Vercel (needs Upstash + Blob keys). tsc, eslint, build clean.
- Owner to do: create Upstash Redis and a Vercel Blob store, redeploy (docs/admin.md).

**2026-11-03 · UI skills pass (make-interfaces-feel-better, mobile-native; apple-design and emil rules re-checked)**
- Testimonials client buttons: role="tab" without panels → plain buttons with aria-pressed. Photo frames in Work and Recent work get a 1px black/10% inner outline. Buttons don't select their label on long-press (globals.css). Android keyboard resizes the layout (`interactiveWidget: "resizes-content"`, layout.tsx).
- Already fine: 16px inputs, tap highlight off, touch-action manipulation, safe-area padding on the sticky bar, hover gated by Tailwind v4, reduced motion on every new scene, press feedback on new controls.
- impeccable detect on today's files: clean. tsc, eslint, build (29 pages) clean. OPEN_ITEMS and Next steps refreshed.

**2026-11-03 · Promo film, concept C "You sleep, we edit": 1080p draft**
- Owner picked C; owner is handling onetake's licence (PolyForm Noncommercial) for commercial use. Source in `video/overnight-15s/` (README there): `comp.html` (pure f(t)), onetake's `motion.js`, `look.json`→`look.js` (TechX colours, Geist inlined), TechX photos in `img/`. Tools in `~/.cache/onetake-venv`.
- Draft `video/overnight-15s/draft.mp4` (1920×1080, 30 fps, 15 s, silent; renders are git-ignored). onetake's checks all pass: varied shot lengths, a 3.4 s still stretch, bursts, the photo carries every boundary, never leaves the frame, motion blur on the hops.
- Next: owner review → optional sound (synth palette or recorded sources) → 4K60 final.

**2026-11-03 · Contact: channel cards on real devices**
- Owner: same treatment as How it works. `features/contact/ContactScenes.tsx` replaces the three channel illustrations (captions and card copy unchanged): 01 WhatsApp chat on a phone (ask about twilights → editor typing → reply → "Uploading now" + a photo) · 02 Mail on the Mac (subject types, cursor drags two files in, Send, the reply with the quote PDF lands) · 03 a call on a phone (calling → ringing → connected timer → "Book a call" sheet for US hours, booked 10:30 AM ET). Loops while on screen; finished frame off screen / reduced motion / server render.
- Shared device parts exported from `features/how-it-works/StepScenes.tsx` (Mac, Win, Cursor, Fit, Tick). `ChannelArt.tsx` (old Email/Call art) deleted; Home's answer card keeps `ContactArt`.
- Checked on the 4310 preview at 1440 and 390; tsc, eslint, build clean.

**2026-11-03 · About: TechX started in Aligarh**
- Owner: TechX started in Aligarh, not Delhi. About story now "…one other person in Aligarh"; timeline as in Figma: 2016 Founded in Aligarh · 2017 Studio in Delhi · 2019 Video and floor plans · 2026 Virtual staging returns ("A new site and a free trial for every photographer."). OPEN_ITEMS "About dates" closed; about/CONTEXT.md updated. (The "India only" rule still applies to studio location labels elsewhere.)

**2026-11-03 · How it works: each step on a Mac (same copy)**
- Owner: show each step as it really happens on a Mac. `features/how-it-works/StepScenes.tsx` (replaces StepArt on this page; Home keeps StepArt, its unused `big` variant removed). One shared Mac frame (menu bar, desktop, base) scaled to fit:
  01 Safari on the TechX free-trial page + a Finder window of the shoot; the cursor selects five brackets, drags them (stack with a count badge) onto the drop zone, they upload, "5 brackets uploaded" · 02 Mail to the studio: notes typed line by line, two reference photos attached, Send, then "Saved as your style guide" · 03 the Photoshop-like editor on the laptop (`EditorScreen`, no Adobe name/logo), replayed per run · 04 the "Your photos are ready" mail with a Dropbox share: Download all → Downloaded, then a note on one photo, "A touch brighter, please?" → "Revised · free".
- Plays once per row in view, replays on mouse enter; finished frame at rest / reduced motion / no JS. Transform, opacity, clip-path only; cursor on the strong ease-in-out.
- Work page and service "Recent work" tiles: "After" tag removed (owner: no before is shown, so the label misleads).
- Checked at 1440 and 390 on the 4310 preview; tsc, eslint, build clean.

**2026-11-03 · Owner's picks from the critique applied**
- Owner: keep logo placeholders for now; keep the illustrations (real images belong on About); hero flags/badge next run; go ahead with the rest.
- WhatsApp buttons are now the secondary style with WhatsApp's mark in green (`@techx/ui/Button` `whatsapp` variant), so blue is the only filled button.
- Testimonials: one big quote with the five clients as tabs, auto-advancing every 7s with a time bar, holds on hover/focus, no auto-advance under reduced motion (`features/home/Testimonials.tsx`). Replaces the moving strip.
- About: team grid and stand-in studio photo removed until TechX sends portraits and a studio photo. Contact studio card: the US drone photo replaced by the "Our process" New York/India illustration; open/closed status moved into the card text.
- Work: editorial grid under "All" (every tenth photo and the one six after it run two columns wide, alternating sides), floor plans in their own row; viewer steps within the row it opened from.
- Review switches removed before launch: White/Blue background (Blue stays; BgToggle, CtaFx, the saved-background script and the White CSS deleted) and the hero Collage switch (collage stays on).
- Services menu photo zoom 500 → 300ms.
- Checked on the 4310 preview at 1440 and 390 (no overflow); tsc, eslint, build clean. /lab now lists only what's still open.

**2026-11-02 · impeccable critique (premium + trust) and polish**
- Critique by two independent reviews (design review; detector + browser overlay on 5 pages). Score 27/36 on Nielsen's heuristics. Peak: the hero before/after. Weak spots: the first proof after the hero is a strip of blank "Client logo" placeholders; below the hero the site is carried by UI mockups rather than photos; repeated blocks and the same final CTA flatten the rhythm; placeholder portraits on About.
- Applied (objective): footer column headings ink-3 → ink-2 (2.3:1 → 7.1:1); "Most chosen" badge text-blue-2 (6.7:1); "After" badges 11px; `text-wrap: pretty` on running text; brand accent/caret/selection colours (globals.css).
- Not applied, on /lab for the owner (they change approved UI or owner decisions): drop logo placeholders, photos instead of some illustrations, WhatsApp as secondary button, one big quote as end peak, hide unfinished About/Contact blocks, editorial Work grid (needs raw files), fuller Luxury level (needs TechX), hero 4.9 source + single sweep, no pop-from-zero, remove review switches before launch, faster flyout zoom, promo video.

**2026-11-02 · Skills pass (emil-design-eng, break-ui, improve-animations, SEO) + /lab test page**
- emil-design-eng: Work viewer opens 300ms / closes 200ms; arrow-key steps swap instantly (no animation on keyboard actions); gallery hover 200ms, photo zoom 300ms.
- break-ui (320px, 200% text, calculator extremes): fixed Pricing billing art overflow (`min-w-0`) and the calculator total at $13,000 on 320px (44px → 56px from 400px). Everything else held.
- improve-animations (audit only, not applied): ticks in `AnswerArt.tsx:36` and flags in `TrustBadge.tsx:42` scale from 0; flyout photo zoom 500ms (`SiteHeader.tsx:149`). Listed on /lab for the owner's OK (two are in approved UI).
- SEO: JSON-LD (`lib/schema.tsx`: Organization + WebSite site-wide; Service with starting-price Offer + BreadcrumbList per service; no FAQPage, Google retired it), favicon `app/icon.svg`, default share image `app/opengraph-image.tsx`, `/llms.txt` generated from lib/site.ts, Home canonical + own description, titles ≤55 and descriptions ≤155 chars on every page.
- **/lab (test only, owner's request):** noindex, disallowed in robots.txt, not in the sitemap or nav. Holds the list of proposed UI changes waiting for the owner. (An isometric studio figure from the anatomy skill was tried there and rejected by the owner the same day; removed with its files.)
- Not done yet: onetake promo video (listed on /lab as a proposal; say the word and it gets built). Cloudflare security-audit skill now installed: run it with security-review before production.

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
