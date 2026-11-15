import type { Metadata } from "next";
import { TextPage } from "@/features/site-shell/TextPage";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";

/* Refunds (owner, 2026-11-04). Built from what the site already promises: billed only for delivered photos, free
   revisions, a free trial. No money-back promise is made that TechX hasn't stated. Have it reviewed. */
export const metadata: Metadata = {
  title: "Refunds",
  description: "You pay at month end, only for delivered photos, and revisions are free. Here's what happens if an edit isn't right.",
  alternates: { canonical: "/refunds" },
};

const body = `## You pay only for what we deliver
There's nothing to pay up front. You're billed at the end of the month, only for the photos we delivered.

## Not happy with an edit?
Ask for a revision on any image. Revisions are free, and usually back the same day.

## Still not right?
Email support@techxsystems.com with the order and the images, and tell us what's wrong. We'll look at it and work it out with you before you pay.

## Try us first
Your first 10 photos are edited free, with no card, so you can judge our work before you send a paid order.`;

export default function Refunds() {
  return <><JsonLd data={breadcrumbSchema("/refunds")} /><TextPage badge="Updated 4 November 2026" lead="Refunds." rest="You pay for what we deliver." lede="Billing at month end, free revisions, and a free trial before any paid order." body={body} /></>;
}
