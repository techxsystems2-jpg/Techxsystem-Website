import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/* Web app manifest (seo pass 2026-11-03): the site's name, colours and icons for "Add to Home Screen" and for the
   browsers and search surfaces that read it. A website, not an app, so it opens in the browser. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: "TechX",
    description: "Real estate photo editing by hand, back by morning. From $0.50 an image.",
    start_url: "/",
    display: "browser",
    background_color: "#FFFFFF",
    theme_color: "#FFFFFF",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
