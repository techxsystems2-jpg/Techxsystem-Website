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
| Type roles | `text-display` (hero) · `text-h1` · `text-cta` · `text-h2` · `text-h3` · `text-h4` · `text-lede` · `text-body` · `text-small` · `text-label` + `font-mono uppercase` |
| Radius | `rounded-input` 12 · `rounded-inner` 20 · `rounded-card` 28 · `rounded-tray` 32 · `rounded-panel` 40 · `rounded-full` pills |
| Elevation | `shadow-hair` (rest) · `shadow-raised` (hover, sticky, form card) · `shadow-overlay` (menus, toasts) · `shadow-cta` (primary button) |
| Motion | `ease-brand`; 150ms hover/press, 220ms chips/cards, 320ms slider snap and reveals |
| Layout | `wrap` (max 1200, 20/24px gutters) · `dots` (illustration canvas) · `raw` (unedited photo look) · `rise` (hero entrance) |

Shared components: `@techx/ui/Button` (`buttonClass` for links), `Chip`, `Badge`, `Eyebrow`, `Icons`.
