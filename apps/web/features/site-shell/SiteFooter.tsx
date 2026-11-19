import Link from "next/link";
import { Logo } from "./Logo";
import { getContent, getSite } from "@/lib/content";
import { footer, legal } from "@/lib/site";

/** Lists every service, so it doubles as a sitemap. */
export async function SiteFooter() {
  // service names follow the content store; the other columns are fixed
  const [services, { social }] = await Promise.all([getContent("services"), getSite()]);
  const groups = footer.map((g) => (g.title === "Services" ? { ...g, links: services.map((s) => ({ href: `/services/${s.slug}`, label: s.short })) } : g));
  return (
    <footer className="mt-24 border-t border-line pb-28 pt-14 md:mt-30 md:pb-12">
      <div className="wrap">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-[1.6fr_repeat(4,1fr)]">
          <div className="col-span-2 md:col-span-1">
            <Logo />
            <p className="mt-3 max-w-[280px] text-small text-ink-2">Real estate photo editing, by people, since 2012. Studio in India.</p>
            {/* social profiles from the admin (Site facts → Social media); none show until a link is added */}
            {social.length > 0 && (
              <ul aria-label="TechX on social media" className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
                {social.map((s) => (
                  <li key={s.name}>
                    <a href={s.href} target="_blank" rel="noopener" className="tap text-small text-ink-2 underline-offset-4 transition-colors duration-150 hover:text-ink hover:underline">
                      {s.name}<span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
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
            <a href="https://www.pixelcaption.com/" target="_blank" rel="noopener" className="tap text-ink-2 underline-offset-4 transition-colors duration-150 hover:text-ink hover:underline">
              Pixel Caption<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </span>
          <nav aria-label="Legal" className="flex gap-4">
            {legal.map(({ href, label }) => (
              <Link key={href} href={href} className="tap text-ink-2 underline-offset-4 transition-colors duration-150 hover:text-ink hover:underline">{label}</Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
