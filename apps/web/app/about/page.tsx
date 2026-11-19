import type { Metadata } from "next";
import { pageMetadata } from "@/lib/content/seo";
import Image from "next/image";
import { SectionHead } from "@/features/home/SectionHead";
import { Testimonials } from "@/features/home/Testimonials";
import { getContent } from "@/lib/content";
import { Reveal, RevealGroup, RevealItem } from "@/features/motion/Reveal";
import { FinalCta } from "@/features/site-shell/FinalCta";
import { HeroBadge, SkyHero } from "@/features/site-shell/SkyHero";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";

/* About (Figma node 33:155; copy in features/about/CONTEXT.md), in the shared page design. The timeline is Figma's:
   founded in Aligarh in 2012, studio in Delhi in 2017 (owner, 2026-11-03: TechX started in Aligarh, not Delhi). The
   headline says 2012 (owner, 2026-11-19), not Figma's 2013. The founder's property-marketing background is from the old site.
   The team grid and studio photo are off until TechX sends real portraits and a studio photo (owner, 2026-11-03,
   after the impeccable critique: placeholders undercut trust here). Names and roles are in features/about/CONTEXT.md. */
export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("about", {
  title: "About the studio",
  description: "A real estate photo editing studio in India, started by two people in 2012. We edit through your night so you wake up to finished photos.",
  alternates: { canonical: "/about" },
});
}

export default async function About() {
  const [timeline, values, team, quotes] = await Promise.all([getContent("timeline"), getContent("values"), getContent("team"), getContent("testimonials")]);
  // the team shows only once every member has a portrait (owner, 2026-11-03: no placeholders here)
  const showTeam = team.length > 0 && team.every((m) => m.photo);
  return (
    <>
      <JsonLd data={breadcrumbSchema("/about")} />
      <SkyHero
        badge={<HeroBadge><span className="size-2 rounded-full bg-maroon" aria-hidden="true" />About TechX · since 2012</HeroBadge>}
        lead="Started by two people."
        rest="Now a studio of editors in India."
        lede="We edit real estate photos for photographers in the US, Australia and the UK, through their night, so they wake up to finished galleries."
      />

      <section className="wrap grid gap-8 pt-24 md:grid-cols-[1fr_1.7fr] md:pt-32">
        <Reveal><h2 className="font-mono text-label uppercase text-ink-2">Our story</h2></Reveal>
        <Reveal delay={0.08}>
          <p className="text-[22px] font-medium leading-[1.4] tracking-[-0.015em] md:text-[26px]">
            Our founder spent years marketing property for developers like DLF, Jaypee and Ansals, and saw how much a good photograph sells a home. TechX began in 2012 with our founder and one other person in Aligarh.
          </p>
          <p className="mt-6 max-w-[640px] text-ink-2">
            The studio grew one trained editor at a time, working through the American and Australian night so photographers wake up to finished galleries. Ten years on, the job is the same: make every room look the way it felt to stand in it.
          </p>
        </Reveal>
      </section>

      <RevealGroup as="ul" className="wrap mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {timeline.map(({ year, title, text }) => (
          <RevealItem as="li" key={year + title} className="border-t border-line-2 pt-5">
            <p className="text-[28px] font-medium tracking-[-0.02em] tabular-nums">{year}</p>
            <h3 className="mt-3 text-[16px] font-medium">{title}</h3>
            <p className="mt-1 text-small text-ink-2">{text}</p>
          </RevealItem>
        ))}
      </RevealGroup>

      {showTeam && (
        <section className="wrap pt-24 md:pt-32">
          <SectionHead label="The team" lead="The people editing your photos." rest="Real names, real desks." />
          <RevealGroup as="ul" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {team.map((m) => (
              <RevealItem as="li" key={m.name}>
                <div className="relative aspect-square overflow-hidden rounded-card bg-sunk shadow-hair outline-1 -outline-offset-1 outline-black/10">
                  <Image src={m.photo} alt={`${m.name}, ${m.role}`} fill sizes="(min-width: 1024px) 280px, 50vw" className="object-cover" />
                </div>
                <h3 className="mt-3.5 text-[16px] font-medium">{m.name}</h3>
                <p className="text-small text-ink-2">{m.role}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </section>
      )}

      <section className="wrap pt-20 md:pt-28">
        <h2 className="sr-only">How we work</h2>
        <RevealGroup as="ul" className="grid gap-3 md:grid-cols-3">
          {values.map(({ title: t, text: d }) => (
            <RevealItem as="li" key={t} className="rounded-card bg-surface p-6 shadow-hair md:p-7">
              <h3 className="text-h4">{t}</h3>
              <p className="mt-2 text-small text-ink-2">{d}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <Testimonials quotes={quotes} />
      <FinalCta lead="Meet the team on your next shoot." rest="Ten photos, free." />
    </>
  );
}
