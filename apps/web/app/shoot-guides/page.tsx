import type { Metadata } from "next";
import { ComingSoon } from "@/features/site-shell/TextPage";

/* Shoot guides: planned, not written yet (owner, 2026-11-04: show it as coming soon). Kept out of search until it exists. */
export const metadata: Metadata = { title: "Shoot guides", robots: { index: false, follow: true }, alternates: { canonical: "/shoot-guides" } };

export default function ShootGuides() {
  return (
    <ComingSoon
      lead="Shoot guides."
      lede="Short guides on shooting brackets, windows and twilights so every edit goes further. Until they're ready, ask an editor on WhatsApp."
      meanwhile={[{ href: "/how-it-works", label: "How it works" }, { href: "/faq", label: "Questions" }, { href: "/contact", label: "Ask an editor" }]}
    />
  );
}
