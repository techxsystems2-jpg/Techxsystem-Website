import type { ReactNode } from "react";

/** Geist Mono label above a heading, and for photographic metadata (times, files, credits). */
export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`font-mono text-label uppercase text-ink-2 ${className}`}>{children}</span>;
}
