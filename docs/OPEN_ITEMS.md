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
- [ ] Timeline milestones (2017 Aligarh studio, 2019 video and floor plans)
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

- [ ] Direction B mobile layouts (Direction A has a mobile Home only)
- [ ] Resources: blog, FAQ, "TechX vs AI editors", shoot guides
- [ ] Legal pages, client portal and upload flow
- [ ] Remaining five service pages (copy, fixes and prices per service)
- [ ] Real photography to replace the illustrated stand-in scenes
- [ ] Logo refresh, if wanted

## Figma limitations hit in this session

- **Starter plan:** 3 pages per file, 1 mode per variable collection (which is why there's no dark/light token switch), and **20 MCP read calls a month** on a View seat. The limit ran out during the session.
- Because of that, Direction B was built as HTML and captured with `generate_figma_design` (exempt from the limit). The captures are **flat frames, not linked to the page-1 components**.
- Upgrading to Professional with a Full seat (200 calls a day) would allow rebuilding Direction B from proper components and cleaning up the dark draft.

## Raised during the build (2026-10-30)

- [ ] **Starting price:** the owner set "from $0.50 an image" (always a starting price). Figma levels are Essential $0.70, Signature $1.00, Luxury $1.50. Reconcile.
- [ ] **Turnaround:** Figma says "10–16 hours" (hero), "12 hours" (answer card), "12–24 hours" (steps, FAQ).
- [ ] **WhatsApp number:** +91 74176 20537 (final CTA) vs +91 96530 59304 (Home answer card).
- [ ] **Drone & aerial** shows "From $0.70 / image" in Figma; confirm against the $0.50 starting price.
- [ ] **Hero trust badge:** "Serving 500+ clients" and "4.9 rating" are the owner's figures (2026-10-30). Confirm both with TechX before launch, and know where the 4.9 comes from in case a client asks (`lib/site.ts` → `site.trust`).

## Time zones in "Our process" (2026-10-31)
- Figma labels "Quality check 5:42 AM IST", but next to "Editing 11:40 PM" (New York) it only works as New York time (5:42 AM IST would be 8:12 PM ET, before editing starts). The illustration now shows New York (ET) and India (IST) clocks side by side and treats 5:42 AM as ET (3:12 PM IST). Conversion uses EDT (IST = ET + 9:30); in winter (EST) it is + 10:30. Confirm the times with TechX.
