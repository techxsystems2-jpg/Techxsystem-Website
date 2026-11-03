import { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader, SiteHeaderShell } from "@/features/site-shell/SiteHeader";
import { SiteFooter } from "@/features/site-shell/SiteFooter";
import { StickyTrialBar } from "@/features/site-shell/StickyTrialBar";
import { MotionRoot } from "@/features/motion/MotionRoot";
import { JsonLd, siteSchema } from "@/lib/schema";
import { ContentProvider } from "@/features/content/ContentProvider";
import { toLinks } from "@/lib/content/types";
import { getContent, getSite } from "@/lib/content";
import { site } from "@/lib/site";
import "./globals.css";

// Geist (Vercel, SIL Open Font License) for headings and body, Geist Mono for labels: one family across the whole site
// (owner, 2026-11-02; replaces Satoshi). Variable font, so the 500 / 520 heading weights render exactly.
const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
// the mono face is for small labels, never the largest thing on screen: not preloaded, so it doesn't compete with the
// hero photo for bandwidth (speed pass, 2026-11-03)
const geistMono = Geist_Mono({ subsets: ["latin"], weight: "500", variable: "--font-geist-mono", display: "swap", preload: false });

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
  // Android: the keyboard shrinks the layout, so form fields at the foot of the trial and contact forms stay in view
  interactiveWidget: "resizes-content",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // admin-managed facts and services, cached until the admin saves (lib/content)
  const [live, services] = await Promise.all([getSite(), getContent("services")]);
  return (
    <html lang={site.lang} className={`${geist.variable} ${geistMono.variable}`}>
      <body className="bg-page font-sans text-body text-ink antialiased">
        <JsonLd data={siteSchema(live)} />
        <a href="#main" className="fixed left-3 top-3 z-50 -translate-y-[120px] rounded-[10px] bg-ink px-4 py-3 text-small text-white focus:translate-y-0">
          Skip to content
        </a>
        <ContentProvider site={live} services={toLinks(services)}>
        <MotionRoot>
          {/* The site chrome is in the server HTML on every page (speed + SEO, 2026-11-03). The header reads the URL, so
              its Suspense fallback is the same header with no active link; the footer and spacer don't need the URL at
              all. On /admin, CSS hides everything marked data-site-chrome (globals.css), so nothing flashes there. */}
          <div data-site-chrome><Suspense fallback={<SiteHeaderShell />}><SiteHeader /></Suspense></div>
          <div data-site-chrome aria-hidden="true" className="h-10" /> {/* room for the announcement bar in SiteHeader */}
          <div className="sky-flow">
            <main id="main">{children}</main>
            <div data-site-chrome><SiteFooter /></div>
          </div>
          <Suspense fallback={null}><StickyTrialBar /></Suspense>
        </MotionRoot>
        </ContentProvider>
      </body>
    </html>
  );
}
