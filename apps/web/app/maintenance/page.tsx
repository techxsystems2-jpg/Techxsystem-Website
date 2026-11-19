import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Clock, Mail } from "lucide-react";
import { ArrowIcon, Mark, WhatsAppIcon } from "@techx/ui/Icons";
import { MessageForm } from "@/features/contact/MessageForm";
import { Offices } from "@/features/contact/Offices";
import { StudioCard } from "@/features/contact/StudioCard";
import { SectionHead } from "@/features/home/SectionHead";
import { getSite } from "@/lib/content";

/* Maintenance page (owner, 2026-11-15). proxy.ts shows it in place of every page while Site facts → "Under
   maintenance" is on (status 503). The site header, footer and trial bar are hidden (data-maintenance, globals.css)
   because every link would lead back here; what's left is every way to reach the studio. Mobile first (owner,
   2026-11-15: "optimise for mobile, icons on the mails"): one compact list of tap-to-contact rows, each with its icon,
   instead of the Contact page's illustrated cards; then the message form, studio hours (desktop) and the offices.
   Copy via marketing-skills:copywriting. */
// owner, 2026-11-15: this page lists the support email, this email and the WhatsApp only (not the phone).
// owner, 2026-11-19: one WhatsApp number everywhere, so it comes from Site facts with the support email and hours
const OWNER_EMAIL = "mazhar.khan53@yahoo.in";

export const metadata: Metadata = { title: "Back soon", robots: { index: false } };

const icon = "size-[18px] shrink-0";

export default async function Maintenance() {
  const { contact, offices } = await getSite();
  const rows: { icon: ReactNode; label: string; value: string; href?: string }[] = [
    { icon: <WhatsAppIcon className={icon} />, label: "WhatsApp", value: contact.whatsapp, href: contact.whatsappUrl },
    { icon: <Mail strokeWidth={1.75} className={icon} />, label: "Email", value: contact.email, href: `mailto:${contact.email}` },
    { icon: <Mail strokeWidth={1.75} className={icon} />, label: "Email", value: OWNER_EMAIL, href: `mailto:${OWNER_EMAIL}` },
    { icon: <Clock strokeWidth={1.75} className={icon} />, label: "Studio hours", value: contact.hours },
  ];
  return (
    <div data-maintenance className="pb-20 md:pb-40">
      <section className="wrap pt-10 text-center md:pt-24">
        <span className="inline-flex items-center gap-2.5 text-[15px] font-medium"><Mark />TechX <span className="-ml-1 text-ink-3">Systems</span></span>
        <p className="mt-10 font-mono text-label uppercase text-ink-2 md:mt-12"><b className="font-medium text-maroon">Website update</b> · The studio is open</p>
        <h1 className="mx-auto mt-4 max-w-[760px] text-balance text-h2">The website is offline for a short update.</h1>
        <p className="mx-auto mt-4 max-w-[520px] text-pretty text-body leading-[1.6] text-ink-2 md:text-[17px]">
          You can still reach the studio. Message an editor on WhatsApp, send an email, or write to us below.
        </p>
      </section>

      <ul className="wrap mt-8 grid max-w-[880px] gap-2 md:mt-12 md:grid-cols-2 md:gap-3">
        {rows.map((r) => {
          const body = (
            <>
              <span className="grid size-10 shrink-0 place-items-center rounded-inner bg-sunk text-ink">{r.icon}</span>
              <span className="min-w-0 flex-1">
                <span className="block font-mono text-label uppercase text-ink-2">{r.label}</span>
                <span className="block truncate text-body font-medium text-ink">{r.value}</span>
              </span>
              {r.href && <ArrowIcon className="shrink-0 text-ink-2 transition-transform duration-200 group-hover:translate-x-0.5" />}
            </>
          );
          const box = "flex min-h-16 items-center gap-3.5 rounded-card bg-surface px-4 py-3 shadow-raised";
          return (
            <li key={`${r.label}-${r.value}`}>
              {r.href
                ? <a href={r.href} {...(r.href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})} className={`group ${box} transition-[translate] duration-150 active:scale-[0.99] hover:-translate-y-px`}>{body}</a>
                : <div className={box}>{body}</div>}
            </li>
          );
        })}
      </ul>

      <section className="wrap pt-20 md:pt-40">
        <SectionHead label="Write to the studio" lead="Prefer to write it down?" rest="Send a message. An editor replies." />
        <div className="grid items-stretch gap-3 md:grid-cols-[1.15fr_1fr]">
          <MessageForm />
          {/* the hours are in the list above; the illustrated clock card is a desktop extra */}
          <div className="hidden md:block"><StudioCard /></div>
        </div>
      </section>

      <Offices offices={offices} />
    </div>
  );
}
