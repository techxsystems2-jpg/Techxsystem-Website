# Open items

## To confirm with TechX

**Prices and offers**
- [ ] Virtual staging price ("from $8 a room" is a placeholder)
- [ ] The middle **Signature $1.00** level (invented to fit within the $0.70–1.50 range) and what each level includes
- [ ] Studio plans for 500+ images a month: discounts, dedicated editor, priority queue
- [ ] Free revisions and pay-after-delivery (on the 2018 site, not the current one)
- [ ] Free trial size (10 photos used throughout)

**Claims written into the copy**
- [ ] "Usually replies within the hour" on WhatsApp
- [ ] Payment methods: card, PayPal, bank transfer
- [ ] Studio visits by appointment
- [ ] Signing NDAs
- [ ] "We only use your photos with written permission"
- [ ] Building a style guide from 2–3 sample photos
- [ ] Studio hours of 9 AM – 7 PM IST
- [ ] Timeline milestones: 2016 founded in Aligarh (confirmed by owner, 2026-11-03); 2017 Delhi studio and 2019 video and floor plans still to confirm
- [ ] Client portal and "Log in" (does a portal exist?)

**People and places**
- [ ] Which team members to show, and their current roles
- [ ] Which offices to list: Aligarh, Delhi, London (London looks like a virtual office)
- [ ] Platform: Webflow, or something else

## Content needed from TechX

- [ ] 10–20 real before/after pairs per category, with photographer credit, camera and city
- [ ] 5–6 client logos or studio names, with permission
- [ ] Three short client quotes, or one 30-second video
- [ ] Team portraits and a studio photo
- [ ] A real review score, if one exists

## Design work not done yet

- [x] Direction B mobile layouts: every page built responsive and checked at 390px (2026-11-03)
- [ ] Resources: blog, FAQ, "TechX vs AI editors", shoot guides
- [ ] Legal pages, client portal and upload flow
- [x] Remaining five service pages: built from the old site's facts (2026-11-02); staging details still to confirm
- [ ] Real photography to replace the illustrated stand-in scenes
- [ ] Logo refresh, if wanted

## Figma limitations hit in this session

- **Starter plan:** 3 pages per file, 1 mode per variable collection (which is why there's no dark/light token switch), and **20 MCP read calls a month** on a View seat. The limit ran out during the session.
- Because of that, Direction B was built as HTML and captured with `generate_figma_design` (exempt from the limit). The captures are **flat frames, not linked to the page-1 components**.
- Upgrading to Professional with a Full seat (200 calls a day) would allow rebuilding Direction B from proper components and cleaning up the dark draft.

## Raised during the build (2026-10-30)

- [x] **Starting price** (settled 2026-11-02: Essential from $0.50, every price "From"): the owner set "from $0.50 an image" (always a starting price). Figma levels are Essential $0.70, Signature $1.00, Luxury $1.50. Reconcile.
- [x] **Turnaround:** settled 2026-11-04 (owner): photo edits **10–16 hours** everywhere. Was: Figma says "10–16 hours" (hero), "12 hours" (answer card), "12–24 hours" (steps, FAQ).
- [ ] **WhatsApp number:** +91 74176 20537 (final CTA) vs +91 96530 59304 (Home answer card).
- [x] **Drone & aerial** now "From $0.50 / image" (2026-11-02); was "From $0.70" in Figma; confirm against the $0.50 starting price.
- [ ] **Hero trust badge:** "Serving 500+ clients" and "4.9 rating" are the owner's figures (2026-10-30). Confirm both with TechX before launch, and know where the 4.9 comes from in case a client asks (`lib/site.ts` → `site.trust`).

## Time zones in "Our process" (2026-10-31)
- Figma labels "Quality check 5:42 AM IST", but next to "Editing 11:40 PM" (New York) it only works as New York time (5:42 AM IST would be 8:12 PM ET, before editing starts). The illustration now shows New York (ET) and India (IST) clocks side by side and treats 5:42 AM as ET (3:12 PM IST). Conversion uses EDT (IST = ET + 9:30); in winter (EST) it is + 10:30. Confirm the times with TechX.

## Inner pages built (2026-11-02): Figma disagreements and claims to confirm
- [ ] **Level prices:** Figma Pricing shows Essential $0.70 · Signature $0.75 · Luxury $1.50; Figma Services shows $0.50 · $1.00 · Luxury (Highend Editing, "Commercial & Architectural Buildings") $1.75. Built with the settled $0.50 / $1.00 / $1.50, all "From". Confirm Luxury and whether "Highend / commercial" is a separate level.
- [ ] **Price list:** Figma shows ranges ($0.70–$1.50, $1.00–$2.00, $5–$8); built as "From". Turnarounds per service (Figma): staging and floor plans 24 h, video 24–48 h, the rest 12–24 h. Services hero said 12–16 hours.
- [x] **About dates** (settled 2026-11-03, owner): TechX started in Aligarh in 2016; studio in Delhi in 2017. Timeline as in Figma; story says Aligarh. Figma's "2013" headline stays 2016.
- [ ] **About team:** names and roles from Figma (Adnan Khan, Faraz Ahmad, Akash Kumar, SM Swaleh); portraits are visible placeholders. Confirm who to show; send portraits and a studio photo.
- [ ] **Work:** Figma promises before/after pairs and credits studios by name (placeholders). Built with TechX's 87 finished edits only. Need raw/edited pairs and photographer permission to show these edits.
- [ ] **Ways to send:** Figma lists Client portal and WeTransfer; the site takes uploads and Dropbox / Google Drive links only.
- [ ] **Claims on the new pages:** payment methods "Card, PayPal or bank transfer"; "flash-ambient blends" (Figma question, not answered or built); twilight "costs less than a twilight shoot" (old site: "more cost-effective"); lot lines on aerials; 360° stitching (old site); staging styles and price.
- [ ] **Unknown service slugs** (e.g. /services/xyz) show the 404 page with noindex but return HTTP 200 (streamed render under Cache Components).
