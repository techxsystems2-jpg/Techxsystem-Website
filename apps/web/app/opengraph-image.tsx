import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getSite } from "@/lib/content";
import { site as fixed } from "@/lib/site";

/* Default share image for every page (link previews in WhatsApp, iMessage, LinkedIn, X). The Home hero's words on the
   hero sky, the starting price and the free trial. Pages can add their own opengraph-image later. */
export const alt = `${fixed.name}: real estate photo editing for photographers in the US, UK and Australia`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const site = await getSite();
  const mark = `data:image/png;base64,${(await readFile(join(process.cwd(), "public/brand/mark.png"))).toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "linear-gradient(180deg,#D2ECFF 0%,#EAF5FF 45%,#FFFFFF 100%)", color: "#0A0A0B", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 30, fontWeight: 600 }}>
          <img src={mark} width={72} height={48} alt="" />
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
