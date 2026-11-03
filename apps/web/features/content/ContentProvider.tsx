"use client";

import { createContext, useContext, type ReactNode } from "react";
import { DEFAULTS, siteFrom, toLinks, type ServiceLink, type SiteData } from "@/lib/content/types";

/* Site facts and services for client components (header, contact cards, forms…), read once by the root layout from
   the content store (lib/content) and handed down here, so the browser never fetches them. Server components read
   lib/content directly. Defaults keep components working outside the provider (tests, isolated renders). */
const Ctx = createContext<{ site: SiteData; services: ServiceLink[] }>({ site: siteFrom(DEFAULTS.facts), services: toLinks(DEFAULTS.services) });

export function ContentProvider({ site, services, children }: { site: SiteData; services: ServiceLink[]; children: ReactNode }) {
  return <Ctx.Provider value={{ site, services }}>{children}</Ctx.Provider>;
}

export const useSite = () => useContext(Ctx).site;
export const useServices = () => useContext(Ctx).services;
