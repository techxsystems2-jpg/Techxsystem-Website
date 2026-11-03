import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { TrustBadge } from "./TrustBadge";
import { HeroStage } from "./HeroStage";

// Key pointers, each with a Pikaicons free icon (pikaicons.com, free pack: commercial use allowed, credit optional).
// Paths as published; stroke weight set on the <svg> to match the site's 1.75 line.
const pointers: { text: string; icon: ReactNode }[] = [
  { text: "Back in 10–16 hours", icon: <g transform="translate(2.85 2.85)"><path d="M9.15 18.3C14.2 18.3 18.3 14.2 18.3 9.15C18.3 4.1 14.2 0 9.15 0C4.1 0 0 4.1 0 9.15C0 14.2 4.1 18.3 9.15 18.3Z" /><path d="M9.15 5.15L9.15 9.97C9.15 10.14 9.24 10.3 9.38 10.39L12.15 12.15" /></g> },
  { text: "Every photo checked twice", icon: <path transform="translate(3.38 2.19)" d="M5.75 9.83L7.76 11.83C8.74 10.11 10.12 8.66 11.75 7.54M7.5 0.18L2.11 2.12C0.97 2.54 0.18 3.61 0.14 4.83L0.01 8.14C-0.15 12.24 1.99 16.09 5.55 18.12L7.07 18.98C7.97 19.5 9.08 19.51 9.99 19.02L11.48 18.21C15.29 16.14 17.54 12.02 17.2 7.69L16.98 4.74C16.89 3.57 16.11 2.55 15 2.15L9.54 0.18C8.88 -0.06 8.16 -0.06 7.5 0.18Z" /> },
  { text: "Free revisions", icon: <path transform="translate(4 2.47)" d="M13.5 0C14.01 1.19 14.36 2.44 14.55 3.73C14.58 3.95 14.46 4.16 14.25 4.24C14.19 4.27 14.13 4.29 14.07 4.31M2.5 19.05C1.99 17.86 1.64 16.61 1.45 15.33C1.42 15.11 1.54 14.89 1.75 14.81C1.81 14.79 1.87 14.76 1.93 14.74M10.5 5.2C11.72 5.05 12.92 4.75 14.07 4.31M14.07 4.31C13.5 3.65 12.81 3.06 12 2.6C8.17 0.39 3.28 1.7 1.07 5.53C0.06 7.28 -0.21 9.27 0.16 11.11M15.91 8.32C16.18 10.05 15.88 11.89 14.93 13.53C12.72 17.35 7.83 18.66 4 16.45C3.2 15.99 2.5 15.41 1.93 14.74M5.5 13.86C4.28 14 3.08 14.3 1.93 14.74" /> },
  { text: "Pay only for delivered photos", icon: <g transform="translate(2 3)"><path d="M0 11.5C0 9.17 0 8.01 0.38 7.09C0.89 5.86 1.86 4.89 3.09 4.38C4.01 4 5.17 4 7.5 4L12.5 4C14.13 4 15.19 4 16 4.13C16.34 4.19 16.64 4.27 16.91 4.38C18.14 4.89 19.11 5.86 19.62 7.09C20 8.01 20 9.17 20 11.5C20 12.83 20 13.99 19.62 14.91C19.11 16.14 18.14 17.11 16.91 17.62C15.99 18 14.83 18 12.5 18L7.5 18C5.17 18 4.01 18 3.09 17.62C1.86 17.11 0.89 16.14 0.38 14.91C0 13.99 0 12.83 0 11.5Z" /><path d="M0 11.5L0 8C0 5.2 0 3.8 0.54 2.73C1.02 1.79 1.79 1.02 2.73 0.54C3.8 0 5.2 0 8 0L11.5 0C12.9 0 13.6 0 14.15 0.23C14.88 0.53 15.47 1.12 15.77 1.85C15.98 2.35 16 2.97 16 4.13M12 9L15 9" /></g> },
];

/** Hero (owner's reference: glideapps.com): trust badge → black two-line headline → lede → the upload card, sitting on
    top of a wide property scene (HeroStage) with scene tabs and a studio window rising out of it.
    Text animates with CSS, so it never waits for JavaScript. */
export function Hero() {
  return (
    <section className="relative overflow-hidden pb-20 pt-24 text-center md:pb-24 md:pt-32">
      {/* Sky gradient (owner's reference: Billow on curated.design), from the top: soft sky blue under the header,
          two slow cloud shapes drifting, fading to white by the time the slider starts. */}
      <div aria-hidden="true" className="hero-sky pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[78%] bg-[radial-gradient(55%_50%_at_18%_10%,#D2ECFF,transparent_70%),radial-gradient(50%_50%_at_82%_14%,#D8EFFF,transparent_70%),radial-gradient(70%_45%_at_50%_0%,#E3F3FF,transparent_75%),linear-gradient(to_bottom,#EAF5FF,#F3F9FF_40%,#FFFFFF)]" />
        <div className="cloud absolute left-[4%] top-[6%] h-[240px] w-[520px] rounded-full bg-white/70 blur-[60px]" />
        <div className="cloud absolute right-[3%] top-[18%] h-[200px] w-[460px] rounded-full bg-white/60 blur-[60px] [animation-delay:-12s]" />
      </div>
      <div className="wrap relative">
        <div className="rise">
          <div className="[--i:0]"><TrustBadge /></div>
        </div>
        <h1 className="mx-auto mb-5 mt-7 max-w-[900px] text-display">
          <Words text="You shoot the listing." from={1} />
          <br />
          <Words text="We do the rest." from={5} />
        </h1>
        <div className="rise">
          <p className="mx-auto max-w-[560px] text-[17px] leading-[1.6] tracking-[-0.01em] text-ink-2 md:text-[18px] [--i:2]">
            HDR, twilight, staging and drone edits, done by hand, checked twice and back by morning, US time. From $0.50 an image.
          </p>
        </div>
      </div>
      <div className="rise relative mt-9">
        <div className="[--i:3]">
          <div className="wrap relative z-20">
            <PromptBox />
            {/* Key pointers (copy via marketing-skills:copywriting): the four reasons to try it, in the reader's terms */}
            <ul className="mt-6 flex flex-wrap justify-center gap-x-7 gap-y-2.5">
              {pointers.map((p) => (
                <li key={p.text} className="flex items-center gap-2 text-[14.5px] text-ink-2">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 text-blue-2">{p.icon}</svg>
                  {p.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* the photo tray is the page's LCP: it rises in without the delayed fade and blur, so it's drawn from the first
            frame (speed pass, 2026-11-03; the fade held its paint back ~0.9 s on a phone) */}
        <div className="rise-in-place mt-12 md:mt-16"><HeroStage /></div>
      </div>
    </section>
  );
}

export function Words({ text, from, className = "" }: { text: string; from: number; className?: string }) {
  const words = text.split(" ");
  return words.map((w, i) => (
    <span key={i} className={`word ${className}`} style={{ "--i": from + i } as CSSProperties}>{w}{i < words.length - 1 ? " " : ""}</span>
  ));
}

/** The upload card (Glide's prompt pattern): placeholder on top, "Upload brackets" bottom left, a round send button
    bottom right. Until uploads exist the whole card opens the free-trial form.
    Border (owner, 2026-10-31): a light gradient that travels round the edge (`edge-flow`, globals.css). */
function PromptBox() {
  return (
    <Link href="/free-trial" className="edge-flow group relative mx-auto block max-w-[560px] rounded-[13.5px] p-[1.5px] text-left shadow-[0_12px_32px_-12px_rgb(10_10_11/0.22)] transition-shadow duration-300 hover:shadow-[0_16px_40px_-12px_rgb(48_116_254/0.3)]">
      <span className="block rounded-[12px] bg-white px-4 pb-3 pt-4">
        <span className="block h-11 truncate text-[16px] text-ink-2/85">Paste a Dropbox link<span className="max-sm:hidden"> or drop your brackets</span>…</span>
        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[14px] font-medium text-ink">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12.5l-8.6 8.6a5.5 5.5 0 01-7.8-7.8l9.2-9.2a3.7 3.7 0 015.2 5.2l-9.2 9.2a1.8 1.8 0 01-2.6-2.6l8.5-8.5" /></svg>
            Upload brackets
          </span>
          <span className="ml-auto font-mono text-[11px] uppercase tracking-[0.04em] text-ink-2 max-sm:hidden">10 photos free · no card</span>
          <span className="grid size-9 place-items-center rounded-full max-sm:ml-auto bg-[linear-gradient(180deg,#5B92FF,#3074FE_55%,#1E4FD6)] text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.35),0_4px_10px_-4px_rgb(48_116_254/0.6)] transition-transform duration-200 group-hover:-translate-y-0.5">
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 13V3M4 7l4-4 4 4" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
        </span>
      </span>
    </Link>
  );
}
