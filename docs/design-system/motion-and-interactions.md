# Motion and micro-interactions

Quick and quiet. Motion confirms an action or reveals the edit. It never decorates.

## Tokens

| Token | Value | Use |
|---|---|---|
| Fast | 150 ms | Hover, press, focus |
| Base | 220 ms | Tabs, chips, accordions, card lifts |
| Slow | 320 ms | Slider snap, modals, section reveals |
| Easing | `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out; from transitions.dev) | Everything that enters or moves |
| Loops | 2.4 s – 7 s, linear | Illustration ambience |

`--ease: cubic-bezier(.22,1,.36,1)` in `styles.css`.

## Interaction spec

| Element | Trigger | What changes | Time | Status |
|---|---|---|---|---|
| Button | Hover / press / focus | Fill darkens to Blue 600; arrow nudges 2px right; press shifts 1px down; focus shows a 4px ring | 150 / 100 ms | Figma prototype + HTML |
| Chip | Click | Outline → ink fill, white label | 220 ms | Figma prototype + HTML |
| Segmented toggle | Click | White pill slides under the active option | 220 ms | HTML |
| FAQ item | Click | Answer expands; plus rotates to minus | 220 ms | Figma prototype + HTML (`<details>`) |
| Service / answer card | Hover | Lifts 2px to Raised shadow; service photo crossfades to the raw bracket, "After" badge swaps to "Before"; "more →" arrow nudges | 220–320 ms | Figma prototype + HTML |
| Before/after slider | Drag | Divider follows the pointer; on release snaps to the nearest third (20 / 50 / 80%) | 320 ms | Figma prototype (drag variant) + HTML |
| Scene chips under slider | Click | Swaps the scene (Exterior / Interior / Twilight / Aerial) | instant | HTML |
| Work tile | Hover | Photo shifts to raw; "Hover to see the raw" pill rises in | 220–320 ms | HTML |
| Navigation | Scroll past 24px | Frosted background gains a hairline bottom border | 220 ms | HTML |
| Prompt / upload box | Hover | Gradient glow behind it brightens | 320 ms | HTML |
| Section reveal | Enters viewport | Fades in and rises 8px; children stagger 60 ms | 320–600 ms | HTML (hero only so far) |
| Calculator | Slider drag | Total updates in tabular figures | live | HTML (Pricing) |
| Upload row | File added | Progress bar fills; row ticks green | real time | Spec |
| Toast | Form sent | Rises 8px and fades in; leaves after 4 s | 220 ms | Spec + Figma component |
| Illustrations | In view / hover | Beam pulse (2.4 s), chat bubbles appear 0.5 s apart, price knob glides between levels (6 s), card stack fans on hover, pending ring spins | 2.4–7 s | HTML |
| Reduce motion | OS setting | All animation and transition off; illustrations show their final frame | — | HTML (`prefers-reduced-motion`) |

## Figma prototype interactions

These live in the Figma file `WGW3zGaOx1NkmCCPomJTbV`, page 1. They use Smart Animate with the custom bezier above:

- **Button:** Default → (hover) Hover → (press) Pressed.
- **Chip:** Selected false ↔ true on click.
- **FAQ item:** Open false ↔ true on click.
- **Service card:** Default → (hover) Hover, which shows the raw photo and the Raised shadow.
- **Before/after:** Center ↔ Revealed on drag.

To try them, open a desktop page and press ▶ (Present).
