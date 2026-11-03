# You sleep, we edit · 15 s promo (concept C)

Picked by the owner on 2026-11-03 from three concepts. One frame split down the middle: New York's night on the left,
the TechX studio's day in India on the right. A listing's brackets cross the seam, get merged, edited and checked
twice, and come back finished as New York reaches sunrise; the seam opens into the end card.

- `comp.html`: the film, every value a pure function of time (onetake contract: `__seek`, `__meta`, `__motion`).
  Preview: open `comp.html?play` in Chrome; pin a frame with `?t=6.4&hud`.
- `motion.js`: onetake's move library (copied). `look.json` → `look.js`: TechX colours and Geist, inlined.
- `img/`: TechX's own edits from `apps/web/public/photos`.
- Times match the site: upload 7:02 PM ET, editing ~9:10 AM IST, delivered 7:58 AM ET.

Licence: onetake is PolyForm Noncommercial 1.0.0; the owner is sorting out commercial permission (2026-11-03).

Tools live in `~/.cache/onetake-venv` (playwright, numpy, scipy, Pillow, matplotlib, fonttools).

```bash
S=~/.claude/skills/onetake; PY=~/.cache/onetake-venv/bin/python
$PY $S/scripts/look.py apply look.json comp.html          # after any copy change
$PY $S/scripts/stills.py comp.html --times 1,3,5,7,9,11,13 --out stills.png
$PY $S/scripts/render.py comp.html --out draft.mp4         # 1080p30 draft
$PY $S/scripts/render.py comp.html --out film.mp4 --final  # 4K60, only after the cut is accepted
```
