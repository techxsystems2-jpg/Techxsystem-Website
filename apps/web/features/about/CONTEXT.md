# Feature: About (`/about`)

Read this file, `DESIGN.md` §1–6, and the files under **Uses**. Nothing else is needed for this feature.

- **Figma:** [About, node 33:155](https://www.figma.com/design/WGW3zGaOx1NkmCCPomJTbV?node-id=33-155) (page "03 — Direction B", 2051 × 3805 capture). Figma wins for UI and copy.
- **Route:** `app/about/page.tsx` composes the sections in this folder.
- **Uses:** `features/site-shell` (PageHead, FinalCta), `lib/site.ts`.
- **Content rule:** team, timeline and studio photo are unconfirmed (docs/OPEN_ITEMS.md). Placeholders stay visible.

## Copy (Figma 33:155)
**Transcribed from Figma 2026-11-02** (one full-height `get_screenshot`, cropped into bands). Where the build departs from Figma, it says why; disagreements are logged in `docs/OPEN_ITEMS.md`.
- Hero: label ABOUT TECHX · H1 "Started by two people in 2013." / "Now a studio of editors in Aligarh, India." Studio photo placeholder "Team at work in the Aligarh studio · natural light".
- Our story: "Our founder spent years marketing property for developers like DLF, Jaypee and Ansals, and saw how much a good photograph sells a home. In 2016 he started TechX with one other editor in Delhi." / "A year later the studio moved to Aligarh. It grew one trained editor at a time, working through the American and Australian night so photographers wake up to finished galleries. Ten years on, the job is the same: make every room look the way it felt to stand in it."
- Timeline: 2016 Founded in Aligarh "Two people, one client list, real estate first." · 2017 Studio in Delhi "A dedicated team and a second-check process." · 2019 Video and floor plans "One studio for everything a listing needs." · 2026 Virtual staging returns "A new site and a free trial for every photographer."
- Team: "The people editing your photos." / "Real names, real desks." Adnan Khan Founder · Faraz Ahmad Operations & technology · Akash Kumar Editing team lead · SM Swaleh Client relationships (portrait placeholders).
- Values: A person checks every photo "Software helps us work fast. People decide when a photo is finished." · Your style, every time "One style guide per client, followed by every editor on every job." · Honest about the edit "We never change the property itself, and staged rooms are labelled."
- Final CTA: "Meet the team on your next shoot." / "Ten photos, free."

**Built:** 2013 → 2016 and Delhi first (Figma contradicts itself; matches the company brief); studio shown as "India" (owner); "Our own studio" for 2017; "A new site" for 2026 (staging unconfirmed). Studio photo: TechX's drone edit with a visible "studio photo to come" label. Portraits: initials with "Portrait to come". Real client quotes added before the CTA.

## Status
- [x] Copy transcribed from Figma (2026-11-02)
- [x] Built (2026-11-02)
- [x] Desktop + phone (390px) checked (2026-11-02)
