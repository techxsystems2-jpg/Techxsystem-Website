import type { Metadata } from "next";
import { Mark } from "@techx/ui/Icons";
import { Channels } from "@/features/contact/Channels";
import { MessageForm } from "@/features/contact/MessageForm";
import { Offices } from "@/features/contact/Offices";
import { StudioCard } from "@/features/contact/StudioCard";
import { SectionHead } from "@/features/home/SectionHead";
import { getSite } from "@/lib/content";

/* Maintenance page (owner, 2026-11-15). proxy.ts shows it in place of every page while Site facts → "Under
   maintenance" is on (status 503). The site header, footer and trial bar are hidden (data-maintenance, globals.css)
   because every link would lead back here; what's left is every way to reach the studio: WhatsApp, email and phone,
   the message form (/api/contact keeps working) and the offices. Copy via marketing-skills:copywriting. */
// the owner's second address, shown here only (owner, 2026-11-15); the studio address comes from Site facts
const OWNER_EMAIL = "mazhar.khan53@yahoo.in";
// and a second WhatsApp number (owner, 2026-11-15); India, so +91
const OWNER_WHATSAPP = { label: "WhatsApp +91 96530 59304", href: "https://wa.me/919653059304" };

export const metadata: Metadata = { title: "Back soon", robots: { index: false } };

export default async function Maintenance() {
  const site = await getSite();
  return (
    <div data-maintenance className="pb-28 md:pb-40">
      <section className="wrap pt-16 text-center md:pt-24">
        <span className="inline-flex items-center gap-2.5 text-[15px] font-medium"><Mark />TechX <span className="-ml-1 text-ink-3">Systems</span></span>
        <p className="mt-12 font-mono text-label uppercase text-ink-2"><b className="font-medium text-maroon">Website update</b> · The studio is open</p>
        <h1 className="mx-auto mt-4 max-w-[760px] text-h2">The website is offline for a short update.</h1>
        <p className="mx-auto mt-4 max-w-[560px] text-[17px] leading-[1.6] text-ink-2">
          You can still reach the studio. Message an editor on WhatsApp, send an email, call, or write to us below.
        </p>
        <p className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-body">
          {[...[site.contact.email, OWNER_EMAIL].map((e) => ({ label: e, href: `mailto:${e}` })), OWNER_WHATSAPP].map((l) => (
            <a key={l.href} href={l.href} className="inline-flex min-h-11 items-center font-medium text-blue-2 underline decoration-blue-2/40 underline-offset-4 hover:decoration-blue-2">{l.label}</a>
          ))}
        </p>
      </section>

      <Channels />

      <section className="wrap pt-28 md:pt-40">
        <SectionHead label="Write to the studio" lead="Prefer to write it down?" rest="Send a message, or plan around our hours." />
        <div className="grid items-stretch gap-3 md:grid-cols-[1.15fr_1fr]">
          <MessageForm />
          <StudioCard />
        </div>
      </section>

      <Offices offices={site.offices} />
    </div>
  );
}
