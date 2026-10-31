# Decisions log

Each step of the 17–18 October 2026 session: what was asked, what was decided, and why. Read this alongside `transcript.md`.

| # | Request | Decision | Why |
|---|---|---|---|
| 1 | Check the Figma connection | Connected the Figma MCP (Pixel Caption team, Starter plan, View seat) | Needed for all design work |
| 2 | Read the TechX research PDF | Summarised company, history, team, services, prices, weak spots | Basis for every later decision |
| 3 | Fetch the "Freight Options" Figma sheet | Found it holds two competitor homepage captures: fotello.co and imagen-ai.com | Became the main competitor reference |
| 4 | Create a sitemap to show the client | FigJam sitemap v1 | Quick visual for the client |
| 5 | Study Fotello and Imagen first, then make an interactive wireframe the client can ask questions on | Sitemap v2 (FigJam), plus an interactive HTML proposal page with comment pins ("Ask") on every section | Client should feel welcome and able to ask anything |
| 6 | Home page with heading, description, CTA and a before/after slider; answer customer questions one by one | Question-led grey wireframe in Figma: each section paired with the customer question it answers | Both competitors lead with a before/after; the question order makes the page read like a conversation |
| 7 | "Feels like an agent made it." Make it designer-first, study transitions.dev and vibrant.design, follow the checklist, design the whole site | New Figma file with a full style sheet, components, 8 desktop pages and mobile Home. Removed all sticky-note annotations from the canvas | The checklist order: strategy → content → type → colour → layout → components → mobile |
| 8 | Add micro-interactions and Aceternity-style illustrations; never lose five pieces of information | Added prototype interactions, 5 illustrations, a "Five answers, up front" section, an information map, and changed the nav to Services · Work · How it works · Pricing · Contact | The information is the one thing that can't be compromised |
| 9 | Don't delete the old file; make a new page with a new design | Started Direction B on page 3 as a dark ("After dark") variant | Starter plan allows 3 pages and 1 variable mode, so it needed its own colour collection |
| 10 | No dark mode; keep it premium and keep the main messaging | **Direction B rebuilt light and premium** as HTML, captured into Figma | The Figma monthly read limit (20 calls) was used up, and HTML capture is exempt |
| 11 | Build the rest of the pages in this design | 7 more pages (Services, Work, How it works, Pricing, Free trial, About, Contact), captured into Figma | Completes Direction B |
| 12 | Save everything to a "TechX System" folder for next year | This folder | Reference for the full build |

## Directions tried and their status

| Direction | Where | Status |
|---|---|---|
| Grey question-led wireframe | Figma file "TechX Systems – Home Wireframe" | Kept, superseded |
| Direction A: light, component-based (Geist, blue/maroon) | Figma "TechX Systems — Website Design", pages 1–2 | Source of the design system and components |
| Direction B, dark "After dark" draft | Figma page 3, frame "B · Home" (top half only) | **Rejected** by Gaurav: no dark mode |
| **Direction B, light premium** | Figma page 3 (captures) and `05-html/direction-b/` | **Current direction** |

## Rules that came out of the conversation

- The heading, description, CTA and before/after slider make up the Home hero.
- Answer customer questions one by one, in the order a photographer asks them.
- Designer-first: no agent-style notes on the canvas. Explanations live in the style sheet and these docs.
- Micro-interactions should be subtle (150–320 ms) and guide attention.
- Illustrations follow the Aceternity approach: small, real UI objects on a dotted canvas.
- Premium, light, and the main messaging stays intact: "You capture the media. We do the rest."
