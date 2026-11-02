# DESIGN.md: TechX design system

The design system's source of truth is `docs/design-system/` (carried over from the TechX System research folder).
**UI layouts and copy come from Figma, not from these docs** (AGENTS.md §1). The tokens live in
`packages/brand/theme.css` as Tailwind classes; use the classes, never raw hex values.

| § | Topic | File |
|---|---|---|
| 1 | Brand, strategy, voice, headline pattern, logo | `docs/design-system/brand-and-voice.md` |
| 2 | Typography | `docs/design-system/typography.md` |
| 3 | Colour and contrast | `docs/design-system/color.md` |
| 4 | Layout, spacing, grid, radius, elevation, imagery | `docs/design-system/layout-and-spacing.md` |
| 5 | Components | `docs/design-system/components.md` |
| 6 | Motion and micro-interactions | `docs/design-system/motion-and-interactions.md` |

## Token → class cheat sheet

| Token | Class |
|---|---|
| Page / surface / tray | `bg-page` · `bg-surface` · `bg-sunk` |
| Text: primary / secondary / muted half of headings | `text-ink` · `text-ink-2` · `text-ink-3` |
| Action (buttons and links only) | `bg-blue` / `text-blue`, hover `bg-blue-2`, tint `bg-blue-tint` |
| "After" / step numbers | `text-maroon`, `bg-maroon-tint` |
| Borders | `border-line` · `border-line-2` |
| Typefaces | **Geist** (headings 500–520 and body; `next/font/google`, SIL OFL) · **Geist Mono** for labels, prices in lists, timestamps. Owner, 2026-11-02: one family across the site (replaces Satoshi, before that Inter Tight / Inter) |
| Type roles | `text-display` (hero) · `text-h1` · `text-cta` · `text-h2` · `text-h3` · `text-h4` · `text-lede` · `text-body` · `text-small` · `text-label` + `font-mono uppercase` |
| Radius | `rounded-input` 8 · `rounded-inner` 10 · `rounded-card` 16 · `rounded-tray` 18 · `rounded-panel` 24 · buttons 8/10/12 by size (sm/md/lg), chips 8; `rounded-full` only for switches and round icon controls (softer scale, owner 2026-11-02; was 12/20/28/32/40). Objects drawn inside illustrations: 12 max |
| Elevation | `shadow-hair` (rest) · `shadow-raised` (hover, sticky, form card) · `shadow-overlay` (menus, toasts) · `shadow-cta` (primary button) |
| Motion | `ease-brand`; 150ms hover/press, 220ms chips/cards, 320ms slider snap and reveals |
| Layout | `wrap` (max 1200, 20/24px gutters) · `dots` (illustration canvas) · `raw` (unedited photo look) · `rise` (hero entrance) |

Shared components: `@techx/ui/Button` (`buttonClass` for links), `Chip`, `Badge`, `Eyebrow`, `Icons`.
