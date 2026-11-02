import { services } from "@/lib/site";

/* Per-service page content for the Services template (Figma node 28:155; copy in CONTEXT.md).
   Only Photo editing & HDR is designed in Figma; the other five reuse its layout with facts from TechX's current site
   (docs/old-site-content.md) and the Figma price list (turnarounds). Nothing here may go beyond those sources.
   `work` names the portfolio category shown under "Recent work" (public/photos/work); none for staging and video,
   which have no TechX samples yet. */

export type Slug = (typeof services)[number]["slug"];
export type WorkCat = "int" | "ext" | "twi" | "aer" | "yacht" | "plan";

type Detail = {
  lead: string; // H1, ink
  rest: string; // H1, muted
  lede: string;
  turnaround: string;
  fixes: { lead: string; rest: string; items: [string, string][] };
  levels?: boolean; // show the three editing levels
  work?: WorkCat[];
  faqs: [string, string][];
  confirm?: string; // visible placeholder note while details are unconfirmed
};

export const details: Record<Slug, Detail> = {
  "photo-editing": {
    lead: "Bright, straight, true to life.",
    rest: "Photo editing by hand.",
    lede: "Every bracket blended, every window pulled, every vertical straightened. Then a second editor checks the set before it reaches you.",
    turnaround: "12–24 hours",
    fixes: {
      lead: "Eight fixes, done by hand.",
      rest: "Pick the level that covers what your shoot needs.",
      items: [
        ["HDR blending", "Brackets merged with natural highlights and shadows."],
        ["Window pulls", "The view outside shows clearly, without grey haze."],
        ["Lens correction", "Verticals straightened, barrel distortion removed."],
        ["Colour correction", "White balance matched across the whole set."],
        ["Sky replacement", "Grey skies swapped for blue, matched to the light."],
        ["Lawn greening", "Patchy grass made green without looking painted."],
        ["Fire in fireplace", "A warm, realistic fire in every cold hearth."],
        ["TV screen fill", "Black screens replaced with a clean, neutral image."],
      ],
    },
    levels: true,
    work: ["int", "ext", "twi"],
    faqs: [
      ["How many brackets should I send?", "Three to seven exposures per angle. We blend whatever you shoot."],
      ["Can you match my existing style?", "Yes. Send two or three photos you like and your notes. They become a style guide every editor on your account follows."],
      ["Which files do you accept?", "RAW (CR2, CR3, NEF, ARW, RAF), DNG, JPEG and TIFF. Brackets of 3, 5 or 7 are all fine."],
    ],
  },
  "virtual-twilight": {
    lead: "Dusk, without the dusk shoot.",
    rest: "Daytime exteriors turned to twilight.",
    lede: "Send a daytime exterior and get back the look of a twilight session: a dusk sky, every light on, warm windows. One shoot instead of two.",
    turnaround: "12–24 hours",
    fixes: {
      lead: "What goes into a twilight.",
      rest: "Six changes, made by an editor, not a filter.",
      items: [
        ["Dusk sky", "The daytime sky replaced with an evening one."],
        ["Lights on", "Interior and exterior lights switched on."],
        ["Pool and garden lights", "Pools and gardens lit the way they glow at dusk."],
        ["Fire in fireplaces", "A warm fire where the hearth shows."],
        ["Moon and stars", "Added when the sky calls for it."],
        ["Light and shadow", "Brightness and contrast balanced, shadows lifted, features brought forward."],
      ],
    },
    work: ["twi"],
    faqs: [
      ["Why not shoot a real twilight?", "You can, but it means a second visit at a fixed time. A virtual twilight comes from the photos you already took, and costs less."],
      ["Which photos work best?", "A straight-on daytime exterior with the house in clear view. Send brackets if you have them."],
      ["Can I add a twilight to any order?", "Yes. Mix twilights with standard edits in one order and one invoice."],
    ],
  },
  "virtual-staging": {
    lead: "Empty rooms, furnished.",
    rest: "In the style buyers expect.",
    lede: "Send a photo of an empty room. An editor furnishes it, and every staged image is labelled as staged.",
    turnaround: "24 hours",
    fixes: {
      lead: "What you get.",
      rest: "The full staging menu is being confirmed with the studio.",
      items: [
        ["Furniture and decor", "An empty room furnished and styled."],
        ["Labelled as staged", "Staged rooms are clearly marked, so the listing stays honest."],
        ["Your style guide", "Staging follows the notes on your account."],
        ["One order", "Staging, edits and twilights on one invoice."],
      ],
    },
    faqs: [
      ["Is virtual staging allowed on listings?", "Yes, when it's disclosed. Every staged room we deliver is labelled as staged, and we never change the property itself."],
      ["Can I choose the style?", "Yes. Tell us the style in your notes, or send a reference photo."],
    ],
    confirm: "Staging price and styles: to confirm with TechX",
  },
  "drone-editing": {
    lead: "Aerials that match the ground set.",
    rest: "Sky, colour and lot lines.",
    lede: "Your drone shots edited by the same team as the rest of the shoot, so the aerials sit with the ground photos.",
    turnaround: "12–24 hours",
    fixes: {
      lead: "What we fix in an aerial.",
      rest: "The same hands as your ground photos.",
      items: [
        ["Colour matched to the set", "Aerials graded to sit with the ground photos."],
        ["Sky replacement", "Grey skies swapped for blue, matched to the light."],
        ["Lens correction", "Distortion removed, horizons level."],
        ["HDR blending", "Brackets merged so the roof and the yard both hold detail."],
        ["Lawn greening", "Patchy grass made green without looking painted."],
        ["Lot lines", "Property boundaries drawn on the aerial."],
      ],
    },
    levels: true,
    work: ["aer"],
    faqs: [
      ["Do drone photos cost more?", "No. Aerials are priced like any other photo, from $0.50 an image."],
      ["Can you draw the lot lines?", "Yes. Send the boundary with your order and we'll draw it on the aerial."],
    ],
  },
  "floor-plans": {
    lead: "Your sketch, redrawn.",
    rest: "Clean 2D and 3D floor plans.",
    lede: "Send a hand sketch or an old printed plan. We turn it into a clean digital floor plan, in 2D or 3D.",
    turnaround: "24 hours",
    fixes: {
      lead: "What you get.",
      rest: "From a sketch or a printed plan.",
      items: [
        ["2D floor plan", "A clean, measured drawing of every floor."],
        ["3D floor plan", "The same layout shown in three dimensions."],
        ["From any source", "A hand sketch, a photo of a plan or an old print."],
        ["Priced per floor", "Each floor is priced on its own."],
      ],
    },
    work: ["plan"],
    faqs: [
      ["What should I send?", "A sketch with the room sizes, or a photo or scan of an existing plan. Clear measurements make the plan exact."],
      ["How is a floor plan priced?", "Per floor, from $5. Your final rate depends on the size and detail of the plan, and you'll see it before we start."],
    ],
  },
  "video-editing": {
    lead: "Clips in, property tour out.",
    rest: "Two- to three-minute listing videos.",
    lede: "Send your raw clips. We cut them into a property tour with music and titles, ready for the listing.",
    turnaround: "24–48 hours",
    fixes: {
      lead: "What goes into a video.",
      rest: "Edited by the same studio as your photos.",
      items: [
        ["Cut and order", "Your clips cut into a tour that flows through the home."],
        ["Colour", "Clips graded to match each other."],
        ["Music and titles", "A soundtrack and the property details on screen."],
        ["360° stitching", "360-degree footage stitched together."],
      ],
    },
    faqs: [
      ["How long is a video?", "Usually two and a half to three and a half minutes."],
      ["What should I send?", "Your raw clips and any notes on order, music or titles."],
    ],
  },
};
