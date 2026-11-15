import type { Metadata } from "next";
import { TextPage } from "@/features/site-shell/TextPage";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";

/* Terms (owner, 2026-11-04). Only what the site already promises: starting prices confirmed before work, free
   revisions, billing at month end for delivered photos, the free trial. Plain-language draft: have it reviewed. */
export const metadata: Metadata = {
  title: "Terms",
  description: "How ordering works at TechX Systems: starting prices, free revisions, billing at month end for delivered photos.",
  alternates: { canonical: "/terms" },
};

const body = `## About these terms
These terms cover using this website and ordering edits from TechX Systems. Sending us photos to edit means you accept them.

## Prices
Every price on this site is a starting price. The final rate depends on the type and volume of work, and we confirm it before we start.

## Orders and delivery
You send your photos and your instructions; we edit them and send them back. Photo edits are usually back in 10–16 hours. Other services take longer, as shown on each service page.

## Revisions
Revisions are free. Ask for a change on any image and we'll redo it.

## Billing
You're billed at the end of the month, only for the photos we delivered. There's no contract and no minimum.

## Free trial
Your first 10 photos are edited free. No card, no contract.

## Your photos
You confirm you have the right to send us the photos for editing. We use them only to do your edits. See our privacy page for the rest.

## Changes
If these terms change, we'll update this page and the date at the top.`;

export default function Terms() {
  return <><JsonLd data={breadcrumbSchema("/terms")} /><TextPage badge="Updated 4 November 2026" lead="Terms." rest="How ordering works." lede="Starting prices, free revisions, and a bill at month end for the photos we delivered." body={body} /></>;
}
