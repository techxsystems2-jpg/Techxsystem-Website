import type { CSSProperties } from "react";
import Link from "next/link";
import { TrustBadge } from "./TrustBadge";
import { HeroStage } from "./HeroStage";

// The three steps under the upload card (owner, 2026-11-04)
const steps = [{ text: "Upload after the shoot" }, { text: "Edited by hand, checked twice" }, { text: "Back in 10–16 hours" }];

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
            {/* first screen (owner, 2026-11-04: "clearly state what we do and how"): the category first, in ink */}
            <b className="font-medium text-ink">Real estate photo editing</b> by people, not presets. HDR, twilight, virtual staging and drone, from $0.50 an image.
          </p>
        </div>
      </div>
      <div className="rise relative mt-9">
        <div className="[--i:3]">
          <div className="wrap relative z-20">
            <PromptBox />
            {/* How it works in three steps (owner, 2026-11-04; copy via marketing-skills:copywriting). Replaces the four
                pointers: free revisions and paying only for delivered photos stay on Pricing and in the questions. */}
            <ol aria-label="How it works" className="mx-auto mt-6 grid max-w-[640px] grid-cols-3 gap-2 sm:flex sm:max-w-none sm:justify-center sm:gap-x-8">
              {steps.map((p, i) => (
                <li key={p.text} className="flex flex-col items-center gap-1.5 text-center text-[13.5px] leading-snug text-ink-2 sm:flex-row sm:justify-center sm:gap-2 sm:whitespace-nowrap sm:text-left sm:text-[14.5px]">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-maroon-tint font-mono text-[11.5px] font-medium text-maroon" aria-hidden="true">{i + 1}</span>
                  <span><span className="sr-only">Step {i + 1}: </span>{p.text}</span>
                </li>
              ))}
            </ol>
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
