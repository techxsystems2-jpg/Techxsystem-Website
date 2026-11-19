import { buttonClass } from "@techx/ui/Button";
import { ArrowIcon } from "@techx/ui/Icons";
import { SectionHead } from "@/features/home/SectionHead";
import { RevealGroup, RevealItem } from "@/features/motion/Reveal";
import { VideoCard } from "./VideoCard";

/* Recent work for Video editing (owner, 2026-11-19: "use that video for that"): the videos on TechX's own YouTube
   channel, laid out like the photo services' Recent work. Titles are the channel's, made readable. */
const CHANNEL = "https://www.youtube.com/@techxsystems7150/videos";
const videos = [
  { id: "a3LU74cNIDY", title: "Property tour", place: "Leland, Michigan" },
  { id: "yfbKtHt36V4", title: "Drone footage", place: "Aerial clip" },
  { id: "t-VOI7cvOiE", title: "Drone footage", place: "Aerial clip" },
];

export function VideoWork() {
  return (
    <section id="videos" className="wrap scroll-mt-16 pt-24 md:pt-32">
      <SectionHead
        label="Recent work"
        lead="From our YouTube channel."
        rest="A property tour and drone footage from the studio."
        side={<a href={CHANNEL} rel="noopener" className={buttonClass("secondary")}>See the channel <ArrowIcon className="transition-transform duration-200 group-hover:translate-x-0.5" /></a>}
      />
      <RevealGroup as="ul" className="grid gap-3 sm:grid-cols-3">
        {videos.map((v) => (
          <RevealItem as="li" key={v.id} className="rounded-card bg-surface p-1.5 shadow-hair">
            <div className="relative aspect-video overflow-hidden rounded-inner bg-sunk outline-1 -outline-offset-1 outline-black/10">
              <VideoCard id={v.id} title={`${v.title}, ${v.place}`} />
            </div>
            <p className="px-1.5 pb-0.5 pt-2.5 font-mono text-[11px] uppercase tracking-[0.04em] text-ink-2">{v.title} · {v.place}</p>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
