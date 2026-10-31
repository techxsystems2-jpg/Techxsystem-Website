# Feature: Service art (one animation per service)

Read this file and `features/motion/CONTEXT.md`. Nothing else is needed.

`ServiceArt.tsx` renders a 3:2 card per service slug (`lib/site.ts` `services`). Owner, 2026-10-31: the whole edit on one
screen, like the answer illustrations. After on the left, before on the right, a divider between them, and the fixes
ticking off in a glass strip along the bottom. Each tick pushes the divider right (22% → 78%, owner 2026-10-31), so the after grows as the
work is done. Rest frame (off screen / reduced motion): 50/50 split, every fix ticked.

| Slug | Before → after (tags) | Fixes that tick | Photos |
|---|---|---|---|
| photo-editing | 3 brackets → HDR edit | Merge · Windows · Sky · Verticals | tx-ext.jpg (raw = filter) |
| virtual-twilight | Day → Dusk | Dusk sky · Lights on · Pool glow | tx-twi.jpg (day = filter) |
| virtual-staging | Empty room → Staged | Rug · Sofa · Decor | empty.webp → int.webp (stock; no TechX staging yet) |
| drone-editing | Raw aerial → Edited | Colour match · Sky · Lot lines (dashed lot outline appears) | tx-aer.jpg |
| floor-plans | Your sketch → 2D plan | Walls · Rooms · Sizes | tx-plan.jpg (sketch = blur/sepia filter) |
| video-editing | timeline of four clips, preview plays the clip under the playhead | Cut · Music (music bar) · Titles ("Just listed" title card) | tx-ext/int/twi/aer |

Fix names come from the old site's service lists (techxsystems.com). When real before/after pairs arrive, swap the
filtered "before" for the real raw frame (same crop).
