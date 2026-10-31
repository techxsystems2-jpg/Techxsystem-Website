# Components

Two sources:
- **Figma** (`WGW3zGaOx1NkmCCPomJTbV`, page 1, section "Components"): reusable components with variants, text properties and colour variables.
- **HTML** (`05-html/direction-b/styles.css` + `pages.css`): the same components as CSS classes for Direction B.

Define each once and reuse it everywhere.

## Actions

| Component | Variants / states | Properties | HTML class |
|---|---|---|---|
| **Button** | Variant: Primary, Secondary, Ghost × State: Default, Hover, Pressed, Focus, Disabled. 44px tall, pill radius | Label (text), Show icon (boolean: arrow →) | `.btn .btn-primary / .btn-secondary / .btn-ghost` |
| **Chip** | Selected false / true | Label | `.chip[aria-pressed]` |
| **Segmented toggle** | 2 options, active one white with hairline | — | `.seg button[aria-pressed]` |
| **Badge** | Tone: Neutral, Blue, Maroon, Dark. Mono, uppercase, 6px radius | Label | `.badge`, `.badge.blue`, `.badge.maroon` |
| **Text link with arrow** | Blue, arrow nudges on card hover | — | `.more` |

Primary is the only blue button, and there should be one per view. Secondary is white with a hairline. Ghost is transparent with a grey hover.

## Forms

| Component | States | Notes |
|---|---|---|
| **Input** | Default, Focus (blue 1.5px + focus ring), Error (red border + fix-it helper text) | Label above, helper below. 46px tall, 12px radius in Direction B. Properties: Label, Value, Helper |
| **Textarea** | Same as Input | 96–140px |
| **Drop zone** | Rest (dashed grey), Hover (dashed blue + blue tint) | "Drop up to 10 photos or brackets · or paste a Dropbox / Drive link" |
| **Volume chips** | Chip group | "Under 200 · 200–1,000 · 1,000+" |
| **Form card** | Raised elevation, 32px radius, 40px padding | Free trial (5 fields), Contact (3 fields) |

Error copy says what went wrong and how to fix it, e.g. "Add the part after the @, like jake@studio.com".

## Navigation

| Component | Notes |
|---|---|
| **Nav / Desktop** | Logo · Services · Work · How it works · Pricing · Contact · Log in (ghost) · Start free trial (primary). Sticky and frosted (`backdrop-filter: blur(14px)`), with a hairline after scroll. Active page gets a grey pill (`.links a.on`) |
| **Nav / Mobile** | Logo · "Free trial" primary · burger. Plus a sticky bottom CTA bar after the hero |
| **Footer** | Brand blurb · Services · Company · Resources · Start · © and legal links. Lists every service, so it doubles as a sitemap |
| **Breadcrumb** | Mono, uppercase: "Services / **Photo editing & HDR**" |
| **Service tabs** | Pill links to switch between the six services |

## Content

| Component | Variants | Notes |
|---|---|---|
| **Photo** | Scene: Exterior, Twilight, Interior, Aerial, Floor plan × Edit: Edited, Raw | Stand-in scenes (SVG) until real photos arrive. Raw = desaturate + underexpose + haze |
| **Before/after slider** | Position: Center, Revealed | Two photo instances (raw clipped left), white divider, round handle with ↔, glass labels "Before · raw bracket" / "After · TechX edit". Sits in an 8px white tray, with scene chips and photographer credit below |
| **Service card** | State: Default, Hover | Nested: image (3:2, 20px radius) + title + one-line description + mono price "From $0.70 / image" + arrow. Hover shows the raw photo and a "Before" badge |
| **Answer card** | 01–05 | Illustration on a dotted canvas + maroon number + mono label + one-sentence answer + blue link. The fifth card is full width (contact) |
| **Plan card** | Featured: false / true | Name, price (48px, tabular), "per image", description, CTA, feature ticks. Featured = blue outline + glow + "Most chosen" badge + primary button |
| **Step card** | 01–04 | Mono number, H3, description, blue mono "who · how long" |
| **How-it-works row** | — | Copy panel (big faded number, H3, text, who/when) + vignette on a dotted canvas (upload list, style guide, QC checklist, download gallery) |
| **Overnight timeline** | — | 24h rail with a blue night band; markers at 7:00 PM (you upload), 5:30 AM IST (we edit and check), 8:00 AM (you download) |
| **Comparison table** | — | TechX column tinted; ● yes / muted text for others; price row last |
| **Price table** | — | Service · price · turnaround · badge |
| **Calculator** | — | Range sliders (listings, photos, level, twilights) + an ink result panel with a large tabular total |
| **Testimonial** | — | Quote, avatar, name, studio and city. **Real quotes only** |
| **FAQ item** | Open false / true | Question 19px Medium, +/− icon, answer in secondary text |
| **Fix grid** | 4 × 2 | Numbered list of the eight included edits, divided by hairlines |
| **Masonry tile** | — | Photo + "After" badge + hover pill + avatar, studio and category |
| **Channel card** | WhatsApp (primary CTA), Email, Call | Icon tile, H3, description, mono value, button |
| **Studio card** | — | Map image, address, hours in IST / New York / Sydney |
| **Final CTA panel** | — | White panel with blue and maroon glow, mono "Free trial", two-tone H2, "No card · No contract · Back by morning", two buttons, contact strip |
| **Toast** | Success | Ink background, green tick, past-tense message: "Trial sent. Your 10 photos are back by 8 AM tomorrow." |
| **Prompt / upload box** | — | Hero element: placeholder "Drop your brackets, or paste a Dropbox link…", + button, level chip, "10 photos free · no card", round ink send button, gradient glow |

## Illustrations

Five components ("Illustration / …", 560 × 380, dotted canvas). Their motion specs are in each component's description in Figma. See `../02-research/design-references.md` for the Aceternity mapping.

| Component | Must-keep information |
|---|---|
| Illustration / How we do it | How we do it |
| Illustration / Our process | Our process |
| Illustration / Prices | Our prices |
| Illustration / Opt in | How to opt in |
| Illustration / Contact | How to contact |

## Icons

One outline style, 1.6–1.8px stroke, round caps and joins, 16–24px: arrow, check, plus/minus, drag handle, upload, camera, WhatsApp bubble, mail, phone. They're stored as SVG symbols (`#arr`, `#chk`, `#mark`) in `_symbols.html`. Never mix in filled icons.
