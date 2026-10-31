import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Every page is static until forms arrive; Cache Components keeps it that way by default.
  cacheComponents: true,
  partialPrefetching: true,
  transpilePackages: ["@techx/ui", "@techx/brand"],
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"] },
  // Basic security headers on every response (Vercel adds HSTS). CSP once third-party scripts are known.
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
      ],
    }];
  },
  turbopack: {
    rules: { "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" } },
  },
};

export default nextConfig;
