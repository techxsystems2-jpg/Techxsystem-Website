import type { ReactNode } from "react";
import { buttonClass } from "@techx/ui/Button";
import { WhatsAppIcon } from "@techx/ui/Icons";
import { Pointers, SkyHero } from "@/features/site-shell/SkyHero";
import { getSite } from "@/lib/content";
import { StudioBadge } from "./StudioBadge";

/* Contact hero on the shared SkyHero (the Home hero design): live studio badge, headline, lede, one main action and
   the pointers. Copy: Figma 34:155 (headline, lede, "An editor replies"); "within the hour" is Figma's FAQ answer (to confirm). */
const pointersFor = (hours: string): { text: string; icon: ReactNode }[] => [
  { text: "An editor replies, not a bot", icon: <path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.4-4A8 8 0 1 1 20 11.5Z" /> },
  { text: "Usually within the hour on WhatsApp", icon: <><circle cx="12" cy="12" r="9" /><path d="M12 7.5V12l3 2" /></> },
  { text: "Quotes and invoices by email", icon: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m4 7.5 6.3 4.4a3 3 0 0 0 3.4 0L20 7.5" /></> },
  { text: `Calls ${hours}`, icon: <path d="M5 4h3.5l1.8 4.5-2.3 1.4a11 11 0 0 0 6.1 6.1l1.4-2.3L20 15.5V19a1.5 1.5 0 0 1-1.5 1.5C10.5 20.5 3.5 13.5 3.5 5.5A1.5 1.5 0 0 1 5 4Z" /> },
];

export async function ContactHero() {
  const { contact } = await getSite();
  const pointers = pointersFor(contact.hours);
  return (
    <SkyHero badge={<StudioBadge />} lead="Talk to a person." rest="An editor, not a ticket queue." lede="WhatsApp, email or a call. Ask about a shoot, a price or a style, any time of day.">
      <div className="mt-8 flex flex-wrap justify-center gap-2.5 [--i:3]">
        <a href={contact.whatsappUrl} rel="noopener" className={buttonClass("whatsapp")}><WhatsAppIcon />Chat on WhatsApp</a>
        <a href="#message" className={buttonClass("secondary")}>Send a message</a>
      </div>
      <Pointers items={pointers} className="[--i:4]" />
    </SkyHero>
  );
}
