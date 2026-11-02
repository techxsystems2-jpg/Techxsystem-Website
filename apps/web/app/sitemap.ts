import type { MetadataRoute } from "next";
import { services, site } from "@/lib/site";

// Add each route here as its feature ships.
const routes = ["/", "/services", ...services.map((s) => `/services/${s.slug}`), "/work", "/how-it-works", "/pricing", "/about", "/contact", "/free-trial"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((r) => ({ url: new URL(r, site.url).toString() }));
}
