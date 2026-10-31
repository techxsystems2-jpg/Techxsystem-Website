# Colour

Neutrals carry the page so the photographs can be the colour. TechX blue is kept for actions only. Maroon, from the logo roof, marks the edited result.

## Figma variables (collection "Color", Direction A)

### Neutral ramp: 60% of every page

| Token | Hex | Role |
|---|---|---|
| neutral/0 | `#FFFFFF` | Surfaces, cards |
| neutral/50 | `#F6F7F9` | Page background |
| neutral/100 | `#EEF0F3` | Subtle fills, trays |
| neutral/200 | `#E2E5EA` | Default borders |
| neutral/300 | `#C9CED6` | Strong borders |
| neutral/400 | `#9AA1AD` | Muted half of two-tone headlines, decoration (2.6:1, never body text) |
| neutral/500 | `#6B7280` | Secondary text (4.8:1 on white) |
| neutral/600 | `#4B5260` | — |
| neutral/800 | `#23262D` | — |
| neutral/900 | `#121316` | Ink: primary text, dark bands |

### Brand

| Token | Hex | Role |
|---|---|---|
| brand/blue-500 | `#2F5BEA` | **Action colour.** Primary buttons and links only. ~10% of the page |
| brand/blue-600 | `#2349C8` | Hover and pressed |
| brand/blue-50 | `#EDF2FF` | Selected chips, info panels |
| brand/maroon-500 | `#8E1F3F` | "After" labels, highlights, step numbers. Never on buttons |
| brand/maroon-50 | `#F8ECF0` | Highlighted table column |

### Semantic

| Token | Hex |
|---|---|
| success | `#1F9D55` |
| error | `#D93636` |
| warning | `#D98A0B` |
| info | `#2F5BEA` |

### Aliases

`bg/page` → neutral/50 · `bg/surface` → neutral/0 · `bg/inverse` → neutral/900 · `text/primary` → neutral/900 · `text/secondary` → neutral/500 · `text/tertiary` → neutral/400 · `text/inverse` → neutral/0 · `border/default` → neutral/200 · `action/primary` → blue-500 · `accent/default` → maroon-500

## Direction B HTML palette (current)

A slightly cooler, brighter take, in `05-html/direction-b/styles.css`:

| CSS variable | Hex | Equivalent |
|---|---|---|
| `--page` | `#FBFBFC` | bg/page |
| `--surface` | `#FFFFFF` | bg/surface |
| `--sunk` | `#F4F5F7` | neutral/100 (trays, illustration canvas) |
| `--line` / `--line-2` | `#E7E9EE` / `#D5D9E0` | border default / strong |
| `--ink` | `#111318` | text/primary |
| `--ink-2` | `#5F6672` | text/secondary |
| `--ink-3` | `#9AA1AD` | text/tertiary, muted headline half |
| `--blue` / `--blue-2` | `#2F5BEA` / `#2349C8` | action / hover |
| `--blue-tint` | `#EEF2FF` | blue-50 |
| `--maroon` / `--maroon-tint` | `#8E1F3F` / `#F9EEF2` | accent |
| `--green` | `#1F9D55` | success |

Hero and CTA glows use soft radial gradients of blue (≈10–16% opacity) and maroon (≈8–12%).

## Rules

- **60 · 30 · 10:** 60% neutral surfaces, 30% ink (text and occasional dark elements), 10% blue action.
- The CTA colour (blue) appears nowhere except actions, so it always draws the eye.
- Featured plans use a blue outline and glow, not a louder fill.
- Don't rely on colour alone: ticks, dashes and crosses go with colour in tables.
- **Light only.** A dark direction was tried and rejected (October 2026).

## Contrast (WCAG AA)

| Pair | Ratio | Result |
|---|---|---|
| Ink on white | 18.6 : 1 | AA, AAA |
| Secondary `#6B7280` on white | 4.8 : 1 | AA body |
| White on blue `#2F5BEA` | 5.5 : 1 | AA body |
| White on maroon `#8E1F3F` | 8.6 : 1 | AA, AAA |
| `#9AA1AD` on white | 2.6 : 1 | Decoration and large muted headline text only |
