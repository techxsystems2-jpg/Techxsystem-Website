import type { Service } from "@/lib/content/types";

/* Page content for Photo editing's two options (owner, 2026-11-19: "one page for the flambient and one for the HDR").
   Each page is the Photo editing service (price, turnaround, levels, work from the admin) with this hero, fixes and
   questions on top. Copy keeps to the facts the site already states (brackets, files, the second check, the
   photo-editing fixes); written to marketing-skills:copywriting. */

type Option = Pick<Service, "hero" | "fixes" | "faqs" | "work">; // work: the Work filter shown under Recent work

const files = { q: "Which files do you accept?", a: "RAW (CR2, CR3, NEF, ARW, RAF), DNG, JPEG and TIFF." };
const which = { q: "HDR or flambient: which should I send?", a: "Whichever you shot. HDR needs brackets from a tripod; flambient adds a flash frame for truer colour indoors. Tell us in your notes and we edit to match." };

export const optionContent: Record<string, Option> = {
  hdr: {
    work: ["hdr"],
    hero: {
      lead: "Every bracket, one clean frame.",
      rest: "HDR editing by hand.",
      lede: "Send your brackets. An editor blends them so the windows and the room both hold detail, then a second editor checks the set before it reaches you.",
    },
    fixes: {
      lead: "What goes into an HDR edit.",
      rest: "Done by an editor, not a preset.",
      items: [
        { title: "HDR blending", text: "Brackets merged with natural highlights and shadows." },
        { title: "Window pulls", text: "The view outside shows clearly, without grey haze." },
        { title: "Lens correction", text: "Verticals straightened, barrel distortion removed." },
        { title: "Colour correction", text: "White balance matched across the whole set." },
        { title: "Noise reduction", text: "Clean shadows from the darkest bracket." },
        { title: "Flash and reflections", text: "Camera flashes and small reflections removed." },
      ],
    },
    faqs: [
      { q: "How many brackets should I send?", a: "Three to seven exposures per angle. We blend whatever you shoot." },
      which,
      files,
    ],
  },
  flambient: {
    work: ["flam"],
    hero: {
      lead: "True colour, even light.",
      rest: "Flambient editing by hand.",
      lede: "Send an ambient frame and a flash frame for each angle. An editor blends them for true colour and clean light, then a second editor checks the set before it reaches you.",
    },
    fixes: {
      lead: "What goes into a flambient edit.",
      rest: "Done by an editor, not a preset.",
      items: [
        { title: "Flambient blending", text: "Flash and ambient frames blended for true colour and clean, even light." },
        { title: "Colour casts", text: "Mixed-light tints taken out of walls and ceilings." },
        { title: "Window pulls", text: "The view outside shows clearly, without grey haze." },
        { title: "Lens correction", text: "Verticals straightened, barrel distortion removed." },
        { title: "Colour correction", text: "White balance matched across the whole set." },
        { title: "Flash and reflections", text: "Flash hot spots and small reflections removed." },
      ],
    },
    faqs: [
      { q: "What should I send for flambient?", a: "An ambient frame and a flash frame for each angle. Extra flash frames for big rooms are fine; we blend whatever you shoot." },
      which,
      files,
    ],
  },
};
