import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter, Inter_Tight } from "next/font/google";
import { SiteHeader } from "@/features/site-shell/SiteHeader";
import { SiteFooter } from "@/features/site-shell/SiteFooter";
import { StickyTrialBar } from "@/features/site-shell/StickyTrialBar";
import { MotionRoot } from "@/features/motion/MotionRoot";
import { site } from "@/lib/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], weight: "500", variable: "--font-geist-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} · Real estate photo editing, overnight`, template: `%s · ${site.name}` },
  description: site.description,
  applicationName: site.name,
  formatDetection: { telephone: false },
  openGraph: { type: "website", siteName: site.name, locale: "en_US" },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={site.lang} className={`${inter.variable} ${interTight.variable} ${geistMono.variable}`}>
      <body className="bg-page font-sans text-body text-ink antialiased">
        <a href="#main" className="fixed left-3 top-3 z-50 -translate-y-[120px] rounded-full bg-ink px-4 py-3 text-small text-white focus:translate-y-0">
          Skip to content
        </a>
        <MotionRoot>
          <SiteHeader />
          <div aria-hidden="true" className="h-10" /> {/* room for the announcement bar in SiteHeader */}
          <div className="sky-flow">
            <main id="main">{children}</main>
            <SiteFooter />
          </div>
          <StickyTrialBar />
        </MotionRoot>
      </body>
    </html>
  );
}
