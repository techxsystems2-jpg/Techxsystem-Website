import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

/* Default share image for every page (link previews in WhatsApp, iMessage, LinkedIn, X). The Home hero's words on the
   hero sky, the starting price and the free trial. Pages can add their own opengraph-image later. */
export const alt = `${site.name}: real estate photo editing, from ${site.startingPrice} an image`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "linear-gradient(180deg,#D2ECFF 0%,#EAF5FF 45%,#FFFFFF 100%)", color: "#0A0A0B", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 30, fontWeight: 600 }}>
          <svg width="52" height="48" viewBox="0 0 26 24">
            <path d="M2 10L13 2L24 10" fill="none" stroke="#8E1F3F" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
            <rect x="5" y="10" width="16" height="12" rx="2.5" fill="none" stroke="#2F5BEA" strokeWidth="1.9" />
            <circle cx="13" cy="16" r="3.2" fill="none" stroke="#2F5BEA" strokeWidth="1.9" />
          </svg>
          <span>TechX</span><span style={{ color: "#8A8F98" }}>Systems</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 84, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.04 }}>
          <span>You shoot the listing.</span>
          <span style={{ color: "#8A8F98" }}>We do the rest.</span>
        </div>
        <div style={{ display: "flex", gap: 20, fontSize: 30, color: "#3F434A" }}>
          <span>Real estate photo editing</span><span>·</span><span>From {site.startingPrice} an image</span><span>·</span><span>10 photos free</span>
        </div>
      </div>
    ),
    size,
  );
}
