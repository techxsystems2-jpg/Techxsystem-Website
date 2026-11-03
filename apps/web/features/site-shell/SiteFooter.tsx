import Link from "next/link";
import { Logo } from "./Logo";
import { getContent } from "@/lib/content";
import { footer } from "@/lib/site";

/** Lists every service, so it doubles as a sitemap. */
export async function SiteFooter() {
  // service names follow the content store; the other columns are fixed
  const services = await getContent("services");
  const groups = footer.map((g) => (g.title === "Services" ? { ...g, links: services.map((s) => ({ href: `/services/${s.slug}`, label: s.short })) } : g));
  return (
    <footer className="mt-24 border-t border-line pb-28 pt-14 md:mt-30 md:pb-12">
      <div className="wrap">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-[1.6fr_repeat(4,1fr)]">
          <div className="col-span-2 md:col-span-1">
            <Logo />
            <p className="mt-3 max-w-[280px] text-small text-ink-2">Real estate photo editing, by people, since 2016. Studio in India.</p>
          </div>
          {groups.map((g) => (
            <div key={g.title}>
              <h2 className="mb-3.5 font-mono text-label uppercase text-ink-2">{g.title}</h2>
              <ul>
                {g.links.map((l) => (
                  <li key={l.label}>
                    {l.href ? (
                      <Link href={l.href} className="block py-1.5 text-small text-ink-2 hover:text-ink">{l.label}</Link>
                    ) : (
                      <span className="block py-1.5 text-small text-ink-2">{l.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-wrap justify-between gap-3 font-mono text-label text-ink-2">
          <span>© 2026 TechX Systems</span>
          {/* studio credit (owner, 2026-11-02) */}
          <span>
            Designed &amp; developed by{" "}
            <a href="https://www.pixelcaption.com/" target="_blank" rel="noopener" className="text-ink-2 underline-offset-4 transition-colors duration-150 hover:text-ink hover:underline">
              Pixel Caption<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </span>
          <span>Privacy · Terms · Refunds</span>
        </div>
      </div>
    </footer>
  );
}
