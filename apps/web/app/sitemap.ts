import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Add each route here as its feature ships.
const routes = ["/"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((r) => ({ url: new URL(r, site.url).toString() }));
}
