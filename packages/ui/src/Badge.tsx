import type { ReactNode } from "react";

type Tone = "neutral" | "blue" | "maroon" | "dark" | "glass";

const tones: Record<Tone, string> = {
  neutral: "bg-sunk text-ink-2",
  blue: "bg-blue-tint text-blue-2",
  maroon: "bg-maroon-tint text-maroon",
  dark: "bg-ink text-white",
  glass: "bg-surface/90 text-ink-2 backdrop-blur", // on photos
};

/** Mono uppercase badge, 6px radius. */
export function Badge({ tone = "neutral", children, className = "" }: { tone?: Tone; children: ReactNode; className?: string }) {
  return <span className={`rounded-md px-2 py-[3px] font-mono text-[11px] uppercase tracking-[0.04em] ${tones[tone]} ${className}`}>{children}</span>;
}
