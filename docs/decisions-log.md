# Decisions log

Each step of the 17–18 October 2026 session: what was asked, what was decided, and why. Read this alongside `transcript.md`.

| # | Request | Decision | Why |
|---|---|---|---|
| 1 | Check the Figma connection | Connected the Figma MCP (Pixel Caption team, Starter plan, View seat) | Needed for all design work |
| 2 | Read the TechX research PDF | Summarised company, history, team, services, prices, weak spots | Basis for every later decision |
| 3 | Fetch the "Freight Options" Figma sheet | Found it holds two competitor homepage captures: fotello.co and imagen-ai.com | Became the main competitor reference |
| 4 | Create a sitemap to show the client | FigJam sitemap v1 | Quick visual for the client |
| 5 | Study Fotello and Imagen first, then make an interactive wireframe the client can ask questions on | Sitemap v2 (FigJam), plus an interactive HTML proposal page with comment pins ("Ask") on every section | Client should feel welcome and able to ask anything |
| 6 | Home page with heading, description, CTA and a before/after slider; answer customer questions one by one | Question-led grey wireframe in Figma: each section paired with the customer question it answers | Both competitors lead with a before/after; the question order makes the page read like a conversation |
| 7 | "Feels like an agent made it." Make it designer-first, study transitions.dev and vibrant.design, follow the checklist, design the whole site | New Figma file with a full style sheet, components, 8 desktop pages and mobile Home. Removed all sticky-note annotations from the canvas | The checklist order: strategy → content → type → colour → layout → components → mobile |
| 8 | Add micro-interactions and Aceternity-style illustrations; never lose five pieces of information | Added prototype interactions, 5 illustrations, a "Five answers, up front" section, an information map, and changed the nav to Services · Work · How it works · Pricing · Contact | The information is the one thing that can't be compromised |
| 9 | Don't delete the old file; make a new page with a new design | Started Direction B on page 3 as a dark ("After dark") variant | Starter plan allows 3 pages and 1 variable mode, so it needed its own colour collection |
| 10 | No dark mode; keep it premium and keep the main messaging | **Direction B rebuilt light and premium** as HTML, captured into Figma | The Figma monthly read limit (20 calls) was used up, and HTML capture is exempt |
| 11 | Build the rest of the pages in this design | 7 more pages (Services, Work, How it works, Pricing, Free trial, About, Contact), captured into Figma | Completes Direction B |
| 12 | Save everything to a "TechX System" folder for next year | This folder | Reference for the full build |

## Directions tried and their status

| Direction | Where | Status |
|---|---|---|
| Grey question-led wireframe | Figma file "TechX Systems – Home Wireframe" | Kept, superseded |
| Direction A: light, component-based (Geist, blue/maroon) | Figma "TechX Systems — Website Design", pages 1–2 | Source of the design system and components |
| Direction B, dark "After dark" draft | Figma page 3, frame "B · Home" (top half only) | **Rejected** by Gaurav: no dark mode |
| **Direction B, light premium** | Figma page 3 (captures) and `05-html/direction-b/` | **Current direction** |

## Rules that came out of the conversation

- The heading, description, CTA and before/after slider make up the Home hero.
- Answer customer questions one by one, in the order a photographer asks them.
- Designer-first: no agent-style notes on the canvas. Explanations live in the style sheet and these docs.
- Micro-interactions should be subtle (150–320 ms) and guide attention.
- Illustrations follow the Aceternity approach: small, real UI objects on a dotted canvas.
- Premium, light, and the main messaging stays intact: "You capture the media. We do the rest."

## Website build decisions, 2 November 2026 (owner)

| Request | Decision | Why |
|---|---|---|
| Keep this website separate from the "TechX System" folder | This repo is self-contained; its context lives here only (AGENTS.md §1) | The folder is a different project (October proposal archive); mixing them confused which site was being edited |
| Use techxsystems.com as the content source | Facts captured in `docs/old-site-content.md`; copy rephrases, never contradicts | It's TechX's own wording for services, fixes, prices and process |
| Starting price | Essential **from $0.50**; every price shown as "From $…", with a starting-rate note under the levels | Prices depend on the edit and volume (old site: "Depends upon the Nature & Quantity of Works") |
| Pricing layout (reference screenshot) | Header panel per level, "includes" lists, full-width Bulk editing row; in the site's own colours, hairline shadows, Signature on the blue edge-glow | Reference used as inspiration only; grey trays, a black card and heavy shadows were rejected |
| Step cards | No connector line between cards; "who · when" tags aligned on one line | Owner preference |
| Service cards | Equal full height, prices on one line; before/after divider follows the mouse (drag on touch) | Nothing should sit higher or lower than its neighbours; let visitors compare |
| Overnight timeline | US and India flags beside New York and India | The two places read at a glance |
| WhatsApp buttons | Green WhatsApp-style `whatsapp` button variant with the WhatsApp logo | Should look like a WhatsApp chat button; overrides the blue-only button rule for this one case |
| Studio location on the site | Show "India" only, never "Aligarh" (final CTA studio line, footer tagline; `lib/site.ts` `contact.studio`) | Owner preference, same as the "Our process" illustration |
| Testimonials | Use the five real quotes from techxsystems.com, trimmed, never reworded | Real proof only; replaces placeholders |
| How it works illustrations | Small step illustrations on the dotted canvas, playing once in sequence | Shows each step instead of just naming it |
| Contact strip | Icon per channel, links, wider spacing | Easier to scan and tap |
| Testimonials layout | One-row auto slider with faded edges, dots, pause on hover (replaces the 3 + 2 grid) | Owner: less on screen at once, reference image |
| Showing the editing | A photo editor on screen (layers, before/after, then two checks) wherever editing is shown: answer card 01 and step card 03 | Owner: show the real work, edit then check; light theme, no Adobe branding (trademark) |
| Step cards 02 and 04 | Show the visitor's actions: typing the style guide and saving; the ready email, Download all, downloaded | Owner: a flow the user does, not a static card |
| Reviews slider controls | Swipe/drag with momentum, pause button, arrow keys, no slide under reduced motion | apple-design review: direct manipulation, user control, accessibility |
| Five answers layout | Compact bento, numbered in reading order: 01 how we do it · 02 start · 03 contact · 04 process · 05 prices | Owner: smaller, all five at once, numbers must read 1→5 |
| Five answers animations | Every answer keeps its own illustration: bento is three over two (01 editor, 02 ten photos, 03 chat / 04 process, 05 invoice) | Owner: the animations were designed per answer; keep them, keep 1→5 order |
| Reviews layout (revised) | Small cards in a continuous, smooth moving strip; pause on hover and a pause button; no dots | Owner: the slider was too big and its animation too busy |
| Five answers order | Always 01 how we do it · 02 process · 03 prices · 04 start · 05 contact; arrange layouts around this order, never renumber to fit | Owner: it's the process sequence the site follows (information map) |
| Corner radius | Softer scale: card 16, inner 10, tray 18, panel 24, input 8; pills stay | Owner: corners were too bold; wants a slight curve |
| Button corners | Buttons 8/10/12 by size, chips 8, no pills (switches and round icon buttons excepted) | Owner: same hierarchy as the softer card corners |
| Page background | Both kept: Blue (sky, default) and White, with a White / Blue switch in the header | Owner wants to compare / offer both; decide before launch |
| Final CTA on White | Sky-blue gradient panel with a faint blue edge, White mode only | Owner: the last call to action should be the highlighted surface on a white page |
| Final CTA motion (White) | Drifting blue sky patches plus a glow that follows the mouse | Owner: make the CTA the highlight of the white page |
| Collage layout | Three depth layers (far blurred, mid soft, near sharp), one speed per layer in fixed lanes | Owner: tiles overlapped; wants devin-style depth |
| Typeface | Satoshi for headings and body; Geist Mono for labels | Chosen for real-estate listers in the UK/US/AU: trustworthy, readable on phones, clear numerals, not the generic Inter look |
| 404 page | Halftone 404 printed from a TechX twilight photo, flashlight on hover, on the page's own sky (no panel, no border), "Nothing's listed at this address" (replaced the viewfinder, then the off-market card) | Owner: relatable to listers, creative, after a dot-matrix reference; light and on-theme |
