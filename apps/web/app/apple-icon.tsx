import { ImageResponse } from "next/og";

/* The home-screen icon for iPhone and iPad (180×180 PNG; seo pass 2026-11-03). The same mark as app/icon.svg, on white
   with room around it, because iOS rounds the corners itself. */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#FFFFFF" }}>
        <svg width="120" height="110" viewBox="0 0 26 24">
          <path d="M2 10L13 2L24 10" fill="none" stroke="#8E1F3F" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
          <rect x="5" y="10" width="16" height="12" rx="2.5" fill="none" stroke="#2F5BEA" strokeWidth="1.9" />
          <circle cx="13" cy="16" r="3.2" fill="none" stroke="#2F5BEA" strokeWidth="1.9" />
        </svg>
      </div>
    ),
    size,
  );
}
