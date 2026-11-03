import type { Metadata } from "next";
import { TextPage } from "@/features/site-shell/TextPage";

/* Privacy (owner, 2026-11-04): Google Analytics and Search Console track how the site is used, and that information
   is used for marketing only. Everything else states what the site already does (forms, uploads, email alerts).
   Plain-language draft: have it reviewed before relying on it legally. */
export const metadata: Metadata = {
  title: "Privacy",
  description: "What TechX Systems collects, why, and how we use Google Analytics: for marketing only, never sold.",
  alternates: { canonical: "/privacy" },
};

const body = `## Who we are
TechX Systems edits real estate photos for photographers in the US, UK and Australia, from our studio in India. For anything about this policy, email support@techxsystems.com.

## What we collect
- What you type into our forms: your name, email, studio name, how many photos you send a month, and your message.
- The photos, files and links you send us for a free trial or an order.
- How you use this website, through Google Analytics (see Analytics below).

## How we use it
- To reply to you, edit your photos and send them back.
- To invoice you for the photos we delivered.

We don't sell your details. We share them only with the services that run this website for us: the storage where your uploads arrive (Dropbox or Google Drive) and the email service that tells the studio a message has arrived.

## Analytics
We use Google Analytics and Google Search Console to see how people find and use this website: the pages they visit, how they arrived, their device and browser, and their rough location. Google Analytics uses cookies to do this.

We use this information for marketing only: to see which pages help photographers, improve the site and reach more photographers like you. We don't use it for anything else, and we don't connect it to the photos you send us.

You can block analytics cookies in your browser settings, or with Google's opt-out add-on at tools.google.com/dlpage/gaoptout.

## Your photos
We use the photos you send to do the edits you asked for and send them back to you.

## Your choices
Email support@techxsystems.com to ask what we hold about you, to correct it, or to have it deleted.

## Changes
If this policy changes, we'll update this page and the date at the top.`;

export default function Privacy() {
  return <TextPage badge="Updated 4 November 2026" lead="Privacy." rest="What we collect, and why." lede="Plain answers: what you send us, what our analytics see, and what we do with both." body={body} />;
}
