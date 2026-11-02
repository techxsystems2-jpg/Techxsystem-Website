# Feature: Illustrations (the five answers)

Read this file and `DESIGN.md` §6 (motion). Nothing else is needed.

- **Figma:** five components "Illustration / …" (560 × 380, dotted canvas) on page "01 — Style sheet & components"; in use on Home answer cards (node 26:155). Exact strings are in `features/home/CONTEXT.md` §4.
- **Approach:** small real UI objects on a dotted canvas (`dots` utility), Aceternity style. Not pictures of people.
- **Libraries (same as the Pixel Caption site):** `motion/react` for loops and in-view triggers (`whileInView`, `useInView`), `@number-flow/react` for numbers that change (price knob total). CSS keyframes for simple infinite loops. No GSAP or other animation libraries.

| Component | Motion |
|---|---|
| How we do it | **Replaced 2026-11-02 by `EditingArt` in `EditorScreen.tsx`**: the photo editor on a laptop, layers land one by one, then check 1 (editor) and check 2 (QC). Earlier version, still in git: whole flow in one view (owner, 2026-10-31): four stations in a loop, 01 Upload → 02 Editing team → 03 QC check → 04 Delivered. Each lights up in turn (upload bar fills, pulse runs the wire, editor cursor sweeps raw → finished, QC · Akash ticks 4 images, delivery lands); done stations keep a tick, waiting ones dim. ~9.6s loop. Rest frame: all done |
| Our process | New York and India side by side with live clocks and night/day skies (owner, 2026-10-31). The shoot flies to the India inbox, editing, two checks (your editor, then QC · Akash), the set flies back by 7:58 AM ET. ~10.8s loop |
| Prices | Live invoice (owner, 2026-10-31): one listing, four TechX photos, a level tapped onto each (Signature $1.00 · Essential $0.70 · Twilight $1.00 · Luxury $1.50); listing total counts up with NumberFlow; stamped "Billed after delivery". ~8s loop |
| Opt in | Round trip (owner, 2026-10-31): ten photos fly into the "Free trial · No card · No contract" drop zone, counter to 10 / 10, then the edited ten come back underneath ("10 / 10 edited, free · Back by morning"). Stack still fans on card hover |
| Contact | Figma chat inside a chat window: studio header (editor online / typing), read ticks on the studio's reply, WhatsApp · Email · Call strip underneath |

| How it works step cards (`StepArt.tsx`, owner 2026-11-02) | One per step card, 168px tall: brackets drop into the zone / style guide fills in + Saved / raw → edited wipe + QC shield / gallery lands + Revision · free. Plays once per card in the row sequence or on mouse hover; rests on the finished frame |

Layout note (2026-11-02): all five answer illustrations sit in a three-over-two bento at 292px canvases (Answers.tsx).

Rules: transform and opacity only; pause off-screen; reduced motion shows the final frame.
