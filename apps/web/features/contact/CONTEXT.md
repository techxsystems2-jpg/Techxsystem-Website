# Feature: Contact (`/contact`)

Read this file, `DESIGN.md` §1–6, and the files under **Uses**. Nothing else is needed for this feature.

- **Figma:** [Contact, node 34:155](https://www.figma.com/design/WGW3zGaOx1NkmCCPomJTbV?node-id=34-155) (page "03 — Direction B", 2051 × 2576 capture). Figma wins for UI and copy.
- **Route:** `app/contact/page.tsx` composes the sections in this folder.
- **Uses:** `features/site-shell` (SkyHero, FinalCta), `lib/site.ts`.
- **Content rule:** WhatsApp number to confirm (two numbers in Figma).

## Copy (transcribed 2026-11-02 from one get_screenshot of Figma node 34:155)
- **Head:** CONTACT · "Talk to a person." + muted "An editor, not a ticket queue." · lede "WhatsApp, email or a call. Ask about a shoot, a price or a style, any time of day." · right: the WhatsApp chat (reuses `ContactArt`: JM "Can you do twilights for three listings tonight?" / "Yes. Upload by 9 PM and they're ready by 8 AM EST." / "Perfect. Uploading now.").
- **Channels:** WhatsApp "The fastest way to reach the studio. An editor replies." · number · Open WhatsApp. Email "For quotes, invoices and anything with attachments." · address · Copy address. Call "Weekdays 9 AM – 7 PM IST. Book a call for US hours." · phone · Book a call.
- **Form:** "Send a message" · Name (Your name) · Email (you@studio.com) · Message (How can we help?) · "Send message →".
- **Studio:** STUDIO · location · hours rows (Studio hours, New York, Sydney).
- **FAQ:** QUESTIONS · "Before you write" · "Still unsure? Message the studio on WhatsApp. An editor replies." · Chat on WhatsApp · How fast do you reply? ("Usually within the hour on WhatsApp, day or night your time.") · Can I visit the studio? · Do you sign NDAs?

## Changes from Figma (and why)
- Studio shows **India** only (owner rule, again 2026-11-03: "only India, not Aligarh"); Figma's town and street are dropped. The full office addresses live in the Offices section (owner, 2026-11-03), from the old site. Line under it: "Editing for photographers in the US, UK and Australia."
- Figma's drawn map → TechX's own drone edit (`tx-aer.jpg`), with a live "Studio open now / closed" pill.
- Hours are converted live from 9 AM – 7 PM IST (Intl, so daylight saving is right); **London** added (UK market).
- Phone shown as **+91 571 297 6655** (Figma: "0571 297 6655") so overseas callers can dial it.
- "Book a call" opens WhatsApp with "I'd like to book a call" typed; "Copy address" copies the email.
- Form has no backend yet: sending opens the visitor's mail app with the message written, and the card says so. Replace `send` in `MessageForm.tsx` with a POST when a backend exists.
- FAQ answers 2–3 aren't in Figma (collapsed). Written from OPEN_ITEMS claims: visits "by appointment", NDAs "send yours and we'll sign and return it". **Confirm with TechX.**
- Page ends with `FinalCta` (information map rule 1), though Figma goes straight to the footer.

## Home design language (owner, 2026-11-02: "follow the home design")
- Hero = Home hero: sky + clouds (`hero-sky`, masked fade, hidden on White), live studio badge in the trust-badge pill, two-line display headline rising word by word, lede, WhatsApp + "Send a message", four blue-icon pointers.
- Channels = Home answer cards: Spotlight, the channel acted out on a real device with a story caption (`ContactScenes.tsx`, owner 2026-11-03: WhatsApp chat on a phone, a mail with attachments on the Mac, a call on a phone that ends on "Book a call"), maroon 01–03 + mono label, one line, value, blue link stretched over the card.
- "Write to the studio" uses Home's `SectionHead`; form (04) and studio (05) cards use the same number + label head, equal height.
- Studio clock is shared (`useStudioClock.ts`): hero badge and studio card.

## Status
- [x] Copy transcribed from Figma (2026-11-02)
- [x] Built (`app/contact/page.tsx`, `Channels`, `MessageForm`, `StudioCard`; `Faq` now takes title / lede / questions)
- [x] Desktop + phone (390px) checked on the owner's dev server: no overflow, no console errors
