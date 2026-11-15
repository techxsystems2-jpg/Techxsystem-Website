import type { NextConfig } from "next";

// The site's own Vercel Blob store, read from its token (BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN = vercel_blob_rw_<storeId>_…), so the image optimiser only
// serves our photos and can't be used for anyone else's Blob images (security audit, 2026-11-03). Without a token
// there are no Blob photos to show.
const blobStore = /^vercel_blob_rw_([a-z0-9]+)_/i.exec(process.env.BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN ?? "")?.[1]?.toLowerCase();

// Content-Security-Policy (security audit, 2026-11-03). Every source the browser may load from, and nothing else:
// - scripts: this site only. 'unsafe-inline' stays because the pages are prerendered and cached; Next.js writes its page
//   data as small inline scripts, and the only alternative (a fresh nonce per request) would make every page render on
//   every visit. 'unsafe-eval' in development only (React's dev tools need it).
// - styles: this site; inline style attributes are needed by React and Motion.
// - images: this site, data:/blob: (local previews) and our own Blob store.
// - connections: this site plus the two places a free-trial upload goes straight from the browser (Dropbox's upload
//   host, Google Drive's resumable upload host; lib/server/destinations.ts).
// - Vercel preview deployments add the Vercel toolbar (vercel.live); production never does.
const dev = process.env.NODE_ENV === "development";
const preview = process.env.VERCEL_ENV === "preview";
const blobHost = blobStore ? ` https://${blobStore}.public.blob.vercel-storage.com` : "";
const live = preview ? " https://vercel.live" : "";
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""}${live}`,
  `style-src 'self' 'unsafe-inline'${live}`,
  `img-src 'self' data: blob:${blobHost}${live} ${preview ? "https://vercel.com" : ""}`.trim(),
  `font-src 'self'${live} ${preview ? "https://assets.vercel.com" : ""}`.trim(),
  `connect-src 'self' https://content.dropboxapi.com https://www.googleapis.com${live}${preview ? " wss://ws-us3.pusher.com" : ""}`,
  "media-src 'self' blob:",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  `frame-src ${preview ? "https://vercel.live" : "'none'"}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  // on Vercel every request is HTTPS already; left off locally so http://localhost previews keep working
  ...(process.env.VERCEL ? ["upgrade-insecure-requests"] : []),
].join("; ");

// The old IIS site's pages (SEO audit, 2026-11-14: techxsystems.com-audit/findings/sitemap.md). Each goes straight
// to its new page with a 301 so rankings carry over. IIS ignored case, so "About-Us.ASPX" must match too: every letter
// becomes [aA]. Keep these for at least 12 months after launch. Old blog-post URLs aren't listed yet (blog.aspx).
// /web-designing.aspx is left to 404: no matching service, and a 301 to an unrelated page counts as a soft 404.
const OLD_PAGES: [string, string][] = [
  ["index", "/"], ["default", "/"], ["about-us", "/about"], ["contact-us", "/contact"], ["pricing", "/pricing"], ["blog", "/blog"],
  ["interior", "/services/photo-editing"], ["exterior", "/services/photo-editing"],
  ["real-estate-photo-enhancement", "/services/photo-editing"],
  ["twillight-and-day-to-dusk", "/services/virtual-twilight"], ["virtual-twilight", "/services/virtual-twilight"],
  ["drone", "/services/drone-editing"],
  ["floor-plan", "/services/floor-plans"], ["floor-plan-conversion-in-2d-and-3d", "/services/floor-plans"],
  ["video-editing", "/services/video-editing"], ["yacht", "/work?cat=yacht"],
];
const anyCase = (s: string) => s.replace(/[a-z]/g, (c) => `[${c}${c.toUpperCase()}]`);

const nextConfig: NextConfig = {
  async redirects() {
    return OLD_PAGES.map(([old, to]) => ({ source: `/:old(${anyCase(old)}\\.${anyCase("aspx")})`, destination: to, statusCode: 301 }));
  },
  // Every page is static until forms arrive; Cache Components keeps it that way by default.
  cacheComponents: true,
  partialPrefetching: true,
  transpilePackages: ["@techx/ui", "@techx/brand"],
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // optimised images keep for 31 days (default 4 h): a changed photo always gets a new file name (admin uploads are
    // named by a random id), so a long cache never serves a stale picture (speed pass, 2026-11-03)
    minimumCacheTTL: 2678400,
    qualities: [50, 75], // 50 for the blurred hero collage tiles, 75 everywhere else
    // photos uploaded from the admin panel live in Vercel Blob (lib/server/media.ts)
    remotePatterns: blobStore ? [{ protocol: "https", hostname: `${blobStore}.public.blob.vercel-storage.com` }] : [],
  },
  // admin photo uploads arrive already shrunk in the browser (≤ 4 MB, features/admin/ImageField.tsx)
  experimental: {
    serverActions: { bodySizeLimit: "4mb" },
    // inlineCss was tried and measured (2026-11-03): it copies the 123 KB stylesheet into the page three times (style tag
    // + twice in the RSC payload), doubling the HTML, and Lighthouse LCP got worse (Home 3.7 → 4.0 s, Services 4.1 →
    // 4.8 s). Left off; the stylesheets are long-cached files instead.
  },
  // Security headers on every response (CSP above).
  async headers() {
    // site photos in public/ were served with max-age=0, so returning visitors re-checked every one
    const photos = { key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" };
    return [{ source: "/photos/:path*", headers: [photos] }, {
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
        // HTTPS only, for two years (Vercel adds HSTS too; stated here so it doesn't depend on the host)
        { key: "Strict-Transport-Security", value: "max-age=63072000" },
        { key: "Content-Security-Policy", value: csp },
      ],
    }];
  },
  turbopack: {
    rules: { "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" } },
  },
};

export default nextConfig;
