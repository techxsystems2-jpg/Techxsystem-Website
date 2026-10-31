# Typography

## Typefaces

Two families, three weights, all free on Google Fonts:

| Family | Used for | Weights |
|---|---|---|
| **Geist** | Every heading and all body text | 400 Regular, 500 Medium, 600 SemiBold (sparingly) |
| **Geist Mono** | Photographic metadata: file names, times, prices in lists, eyebrow labels | 500 Medium, uppercase, +4% tracking |

Headings use **Medium (500) with tight negative tracking, never Bold**. This was taken from transitions.dev.

These replace the old site's Montserrat and Open Sans.

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@500&display=swap">
```

## Type scale: Figma style sheet (Direction A)

These exist as text styles in the Figma file `WGW3zGaOx1NkmCCPomJTbV`, page 1.

| Style | Size / line height | Weight | Tracking |
|---|---|---|---|
| Desktop/Display | 72 / 76 | Medium | −3% |
| Desktop/H1 | 56 / 60 | Medium | −2.5% |
| Desktop/H2 | 40 / 46 | Medium | −2% |
| Desktop/H3 | 28 / 34 | Medium | −1.5% |
| Desktop/H4 | 22 / 28 | Medium | −1% |
| Mobile/Display | 44 / 48 | Medium | −2.5% |
| Mobile/H1 | 36 / 40 | Medium | −2% |
| Mobile/H2 | 28 / 34 | Medium | −1.5% |
| Body/Large | 19 / 30 | Regular | −0.5% |
| Body/Default | 16 / 26 | Regular | 0 |
| Body/Small | 14 / 22 | Regular | 0 |
| Label/Default | 15 / 20 | Medium | −0.5% |
| Label/Small | 13 / 18 | Medium | 0 |
| Meta/Mono | 12 / 16 | Geist Mono Medium, UPPERCASE | +4% |

## Type scale: Direction B HTML (current)

Slightly larger display sizes for the premium, centred hero:

| Use | Size | Line height | Tracking |
|---|---|---|---|
| Home hero H1 | 76px | 1.02 | −0.035em |
| Inner page H1 | 64px (Free trial 56px) | 1.04 | −0.033em |
| Final CTA H2 | 56px | 1.08 | −0.025em |
| Centred section H2 | 48px | 1.08 | −0.025em |
| Section H2 | 44px | 1.08 | −0.025em |
| Card / step H3 | 21–30px | 1.25 | −0.015em |
| Lede | 19px | 1.6 | 0 |
| Body | 16px | 1.6 | 0 |
| Small | 13–14px | 1.5 | 0 |
| Mono label | 11–12px | — | +0.04em, uppercase |

## Rules

- One H1 per page, and no skipped heading levels.
- Body text is never below 16px. Lines run 50–75 characters (`max-width: 600–620px` for ledes).
- Body line height is 1.5–1.6; headings 1.02–1.1.
- Headings use `text-wrap: balance`.
- **Two-tone headlines:** the lead phrase in ink (`--ink`), the rest in muted grey (`--ink-3` / `#9AA1AD`). Use one per section heading.
- Prices, times and file names use Geist Mono, or `font-variant-numeric: tabular-nums` where numbers update (the calculator).
- Colour, size and weight all signal hierarchy. Never rely on size alone.
