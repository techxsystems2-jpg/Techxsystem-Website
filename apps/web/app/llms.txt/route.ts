import { services, site } from "@/lib/site";

/* /llms.txt (claude-seo:seo-geo, 2026-11-02): a plain-text map of the site for non-Google AI tools. Google Search
   ignores it; it costs nothing. Built from lib/site.ts so it never drifts from the pages (prerendered: it reads no request data). */

export function GET() {
  const u = (p: string) => new URL(p, site.url).toString();
  const body = `# ${site.name}

> ${site.description}

${site.name} is a real estate photo editing studio in ${site.contact.studio}, working since 2016 for photographers in the US, Australia and the UK. Every photo is edited by hand and checked by a second editor. Prices are starting prices; the final rate depends on the type and volume of work and is confirmed before work starts.

## Services
${services.map((s) => `- [${s.name}](${u(`/services/${s.slug}`)}): ${s.line} ${s.from}.`).join("\n")}

## Pages
- [How it works](${u("/how-it-works")}): Upload brackets, tell us your style once, we edit and check overnight, you download by morning.
- [Pricing](${u("/pricing")}): Three levels from ${site.startingPrice} an image, billed monthly for delivered photos only, no contract, no minimum.
- [Work](${u("/work")}): Finished edits from the studio: interiors, exteriors, drone, yachts, twilights, floor plans.
- [About](${u("/about")}): The studio, its story and the team.
- [Free trial](${u("/free-trial")}): 10 photos edited free. No card, no contract.
- [Contact](${u("/contact")}): WhatsApp, email or phone.

## Contact
- WhatsApp: ${site.contact.whatsapp}
- Email: ${site.contact.email}
- Phone: ${site.contact.phone}
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
