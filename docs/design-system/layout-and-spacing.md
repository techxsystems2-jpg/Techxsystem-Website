# Layout, spacing and surfaces

## Spacing

An 8-point system with a 4-point half step. These are Figma variables in the "Spacing & radius" collection:

`4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128`

- **Desktop section rhythm:** 128–136px between sections. 96px hero top padding (Direction B: 96 Home, 88 inner pages).
- **Mobile section rhythm:** 64px.
- **Card padding:** 24–40px. Nested trays: 8px.
- **Gaps:** 16px between cards in a grid, 24px between grid rows in Direction A.

## Grid and breakpoints

| Breakpoint | Width | Columns | Margin | Gutter |
|---|---|---|---|---|
| Mobile | 375 | 4 | 20 | 16 |
| Tablet | 768 | 8 | 32 | 20 |
| Desktop | 1280 | 12 | 120 | 24 |
| Wide | 1440+ | 12 | content max 1200 | 24 |

Direction B uses `.wrap { max-width: 1200px; padding: 0 24px; margin: 0 auto }`. Tap targets are at least 44 × 44. Mobile Home has a sticky bottom bar ("10 photos free · Start trial").

## Corner radius

> **Website build (2026-11-02, owner):** softer scale in code: input 8 · inner 10 · card 16 · tray 18 · panel 24 · pills 999. Nested surfaces stay concentric (inner ≈ card − padding). The table below is the original Figma set.

| Token | Value | Use |
|---|---|---|
| radius/sm | 8 | Inputs (Direction B inputs use 12) |
| radius/md | 12 | Images inside cards |
| radius/lg | 20 | Cards |
| radius/xl | 28 | Panels, trays (Direction B: 28–40 for the big CTA panel) |
| radius/pill | 999 | Buttons, chips, badges-as-pills |

**Nested cards:** an outer frame at 20–32 with 8px padding, and the inner image or illustration at 12–26, so the inside curve runs parallel to the outside one. Used for the slider tray, answer cards, service cards and how-it-works rows.

## Elevation

| Style | Value | Use |
|---|---|---|
| Hairline | `0 0 0 1px rgba(17,19,24,.06), 0 1px 2px rgba(17,19,24,.04)` | Cards and inputs at rest |
| Raised | `0 0 0 1px rgba(17,19,24,.06), 0 12px 32px -12px rgba(17,19,24,.16)` | Hover, sticky nav, prompt box, form card |
| Overlay | `0 0 0 1px rgba(17,19,24,.08), 0 24px 48px -12px rgba(17,19,24,.16)` | Menus, modals, toasts |
| Focus ring | `0 0 0 4px rgba(47,91,234,.35)` | Keyboard focus |

## Imagery

| Ratio | Use |
|---|---|
| 3 : 2 | Before/after pairs, service heroes, cards |
| 4 : 5 or free (masonry) | Portfolio grid |
| 1 : 1 | Team portraits |
| 16 : 9 / 16 : 8.6 | Hero slider, video |

- Use real TechX edits only, and credit the photographer, camera and location under each.
- Before and after share one crop.
- WebP/AVIF under 250 KB, lazy-loaded below the fold.
- Until real photos arrive, illustrated stand-in scenes are used: Exterior, Twilight, Interior, Aerial and Floor plan, each with a **Raw** state (desaturated, underexposed, hazy; in CSS `filter: saturate(.22) brightness(.82) contrast(.9)`).
