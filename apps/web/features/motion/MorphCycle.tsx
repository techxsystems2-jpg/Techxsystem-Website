"use client";

import { useEffect, useState } from "react";
import { TextMorph } from "torph/react";

/** Text that morphs from one phrase to the next, letter by letter (torph). The first phrase renders on the server, so
    nothing jumps on load; the cycle starts after a pause, pauses in background tabs, and doesn't run under reduced
    motion (the first phrase stays). */
export function MorphCycle({ items, every = 2800, className = "" }: { items: string[]; every?: number; className?: string }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (items.length < 2 || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => { if (!document.hidden) setI((v) => (v + 1) % items.length); }, every);
    return () => window.clearInterval(t);
  }, [items.length, every]);
  return (
    <TextMorph as="span" className={className} duration={560} ease="cubic-bezier(0.22, 1, 0.36, 1)">
      {items[i] ?? ""}
    </TextMorph>
  );
}
