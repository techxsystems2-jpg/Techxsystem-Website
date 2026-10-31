# Feature: Motion system

Read this file and `DESIGN.md` §6. Nothing else is needed.

| File | Use |
|---|---|
| `MotionRoot.tsx` | In `app/layout.tsx`. `MotionConfig reducedMotion="user"` + Lenis smooth scroll (off under reduced motion) |
| `Reveal.tsx` | `Reveal` (one block), `RevealGroup` + `RevealItem` (staggered 80ms). Materialise: rise 28px, blur 10→0, fade; spring `bounce: 0, duration: 0.9`. Below the fold only |
| `useLoop.ts` | For looping art: `{ ref, play }`, true only while on screen and motion is allowed |

Rules (apple-design skill): critically damped springs by default; bounce only after a gesture with momentum (slider release);
everything interruptible (start from the live value); transform, opacity and filter only; the hero animates with CSS so it
never waits for JavaScript; reduced motion shows the finished state.
