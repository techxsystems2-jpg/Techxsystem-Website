import type { Metadata } from "next";
import { ComingSoon } from "@/features/site-shell/TextPage";

/* Client login: planned (owner, 2026-11-04: show it as coming soon). Kept out of search until it exists. */
export const metadata: Metadata = { title: "Client login", robots: { index: false, follow: true }, alternates: { canonical: "/client-login" } };

export default function ClientLogin() {
  return (
    <ComingSoon
      lead="Client login."
      lede="One place to track your orders and download your edits. Until it's ready, your edits arrive as a download link by email."
      meanwhile={[{ href: "/free-trial", label: "Send photos" }, { href: "/contact", label: "Ask about an order" }]}
    />
  );
}
