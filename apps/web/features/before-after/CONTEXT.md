# Feature: Before/after slider

Read this file and `DESIGN.md` §4 (radius, imagery) and §6 (motion). Nothing else is needed.

- **Figma:** Home slider (node 26:155, under the hero) and the "Before/after" component on page "01 — Style sheet & components".
- **Behaviour:** drag (pointer or keyboard via a native range input); on release, snap to 20 / 50 / 80% in 320ms with the brand ease (Motion `animate`). Reduced motion: no snap animation.
- **Look:** white tray (`rounded-tray`, 8px padding, `shadow-hair`) → image `rounded-[24px]`, aspect 16 / 8.6. White 2px divider, 44px round knob with ↔, glass tags "Before · raw bracket" / "After · TechX edit". Under it: scene chips (left) and the mono photographer credit (right).
- **Images:** illustrated stand-in scenes (`Scenes.tsx`: ext, int, twi, aer, plan) until TechX sends real pairs. Raw = `raw` utility (desaturate, underexpose, haze). Real photos: same crop for both, AVIF/WebP via `next/image`, under 250 KB.
