import type { CSSProperties, ReactNode } from "react";

/* Scroll reveals, in CSS (speed pass, 2026-11-03). They used to be Motion components that started every block at
   opacity 0 and faded it in once JavaScript had loaded and seen it on screen, so the largest thing on most pages
   (a card, a photo) waited for all the JavaScript: Lighthouse LCP 3–4 s on a phone while the photo itself was
   downloaded in a tenth of a second. Now each block rides a scroll-driven animation (globals.css, `.reveal`): blocks
   already on screen are drawn finished at first paint, blocks below rise in as they scroll into view, nothing waits
   for JavaScript, and browsers without scroll-driven animations (or with reduced motion) simply show everything.
   Same components and props as before, so no call site changed. */

/** One block that rises in as it scrolls into view. `delay` (seconds, as before) starts it a little later in the scroll. */
export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return <div className={`reveal ${className}`} style={delay ? ({ "--reveal-lag": `${Math.round(delay * 100)}%` } as CSSProperties) : undefined}>{children}</div>;
}

/** A group whose RevealItem children arrive one after another (each starts a little later in the scroll). */
export function RevealGroup({ children, className = "", as = "div" }: { children: ReactNode; className?: string; as?: "div" | "ul" }) {
  const Tag = as;
  return <Tag className={`reveal-group ${className}`}>{children}</Tag>;
}

export function RevealItem({ children, className = "", as = "div" }: { children: ReactNode; className?: string; as?: "div" | "li" }) {
  const Tag = as;
  return <Tag className={`reveal ${className}`}>{children}</Tag>;
}
