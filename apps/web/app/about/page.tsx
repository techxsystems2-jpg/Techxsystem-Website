import type { Metadata } from "next";
import Image from "next/image";
import { SectionHead } from "@/features/home/SectionHead";
import { Testimonials } from "@/features/home/Testimonials";
import { Reveal, RevealGroup, RevealItem } from "@/features/motion/Reveal";
import { FinalCta } from "@/features/site-shell/FinalCta";
import { HeroBadge, SkyHero } from "@/features/site-shell/SkyHero";

/* About (Figma node 33:155; copy in features/about/CONTEXT.md), in the shared page design. Facts follow TechX's own
   site and the company brief: two founders' start in Delhi in 2016 (Figma's "2013" and "Founded in Aligarh" disagree
   with the brief), the studio shown as "India" (owner), the founder's property-marketing background (old site).
   Team names and roles are Figma's and unconfirmed, so portraits stay visible placeholders (AGENTS.md rule 2), and the
   studio photo is a placeholder until TechX sends one. */
export const metadata: Metadata = {
  title: "About the studio",
  description: "A real estate photo editing studio in India, started by two people in 2016. We edit through your night so you wake up to finished photos.",
  alternates: { canonical: "/about" },
};

const timeline = [
  ["2016", "Founded in Delhi", "Two people, one client list, real estate first."],
  ["2017", "Our own studio", "A dedicated team and a second-check process."],
  ["2019", "Video and floor plans", "One studio for everything a listing needs."],
  ["2026", "A new site", "And a free trial for every photographer."],
] as const;

// Figma roles; confirm names, roles and portraits with TechX (docs/OPEN_ITEMS.md).
const team = [
  ["Adnan Khan", "Founder"],
  ["Faraz Ahmad", "Operations & technology"],
  ["Akash Kumar", "Editing team lead"],
  ["SM Swaleh", "Client relationships"],
] as const;

const values = [
  ["A person checks every photo", "Software helps us work fast. People decide when a photo is finished."],
  ["Your style, every time", "One style guide per client, followed by every editor on every job."],
  ["Honest about the edit", "We never change the property itself, and staged rooms are labelled."],
] as const;

export default function About() {
  return (
    <>
      <SkyHero
        badge={<HeroBadge><span className="size-2 rounded-full bg-maroon" aria-hidden="true" />About TechX · since 2016</HeroBadge>}
        lead="Started by two people."
        rest="Now a studio of editors in India."
        lede="We edit real estate photos for photographers in the US, Australia and the UK, through their night, so they wake up to finished galleries."
      />

      {/* Studio photo: TechX's own drone edit stands in until a team photo arrives; the label says so. */}
      <section className="wrap mt-14">
        <Reveal className="rounded-tray bg-surface p-1.5 shadow-raised">
          <div className="relative aspect-[16/9] overflow-hidden rounded-[14px] bg-sunk md:aspect-[21/9]">
            <Image src="/photos/work/aer-2.webp" alt="A drone photo edited by TechX" fill priority sizes="(min-width: 1200px) 1180px, 100vw" className="object-cover" />
            <span className="absolute bottom-3 left-3 rounded-lg bg-ink/55 px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.04em] text-white backdrop-blur-md">Studio photo to come · our drone edit for now</span>
          </div>
        </Reveal>
      </section>

      <section className="wrap grid gap-8 pt-24 md:grid-cols-[1fr_1.7fr] md:pt-32">
        <Reveal><h2 className="font-mono text-label uppercase text-ink-2">Our story</h2></Reveal>
        <Reveal delay={0.08}>
          <p className="text-[22px] font-medium leading-[1.4] tracking-[-0.015em] md:text-[26px]">
            Our founder spent years marketing property for developers like DLF, Jaypee and Ansals, and saw how much a good photograph sells a home. TechX began in 2016 with our founder and one other person in Delhi.
          </p>
          <p className="mt-6 max-w-[640px] text-ink-2">
            The studio grew one trained editor at a time, working through the American and Australian night so photographers wake up to finished galleries. Ten years on, the job is the same: make every room look the way it felt to stand in it.
          </p>
        </Reveal>
      </section>

      <RevealGroup as="ul" className="wrap mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {timeline.map(([y, t, d]) => (
          <RevealItem as="li" key={y} className="border-t border-line-2 pt-5">
            <p className="text-[28px] font-medium tracking-[-0.02em] tabular-nums">{y}</p>
            <h3 className="mt-3 text-[16px] font-medium">{t}</h3>
            <p className="mt-1 text-small text-ink-2">{d}</p>
          </RevealItem>
        ))}
      </RevealGroup>

      <section className="wrap pt-24 md:pt-32">
        <SectionHead label="The team" lead="The people editing your photos." rest="Real names, real desks." />
        <RevealGroup as="ul" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {team.map(([n, r]) => (
            <RevealItem as="li" key={n}>
              {/* portrait placeholder, visibly marked until TechX sends photos */}
              <div className="grid aspect-square place-items-center rounded-card bg-sunk shadow-hair">
                <span className="text-center">
                  <span className="block text-[40px] font-medium tracking-[-0.03em] text-ink-2">{n.split(" ").map((w) => w[0]).join("")}</span>
                  <span className="mt-1 block font-mono text-[10.5px] uppercase tracking-[0.04em] text-ink-2">Portrait to come</span>
                </span>
              </div>
              <h3 className="mt-3.5 text-[16px] font-medium">{n}</h3>
              <p className="text-small text-ink-2">{r}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <section className="wrap pt-20 md:pt-28">
        <h2 className="sr-only">How we work</h2>
        <RevealGroup as="ul" className="grid gap-3 md:grid-cols-3">
          {values.map(([t, d]) => (
            <RevealItem as="li" key={t} className="rounded-card bg-surface p-6 shadow-hair md:p-7">
              <h3 className="text-h4">{t}</h3>
              <p className="mt-2 text-small text-ink-2">{d}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <Testimonials />
      <FinalCta lead="Meet the team on your next shoot." rest="Ten photos, free." />
    </>
  );
}
