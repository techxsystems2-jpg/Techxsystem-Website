"use client";

import { useState } from "react";
import Image from "next/image";

/** One YouTube video as a still until it's clicked (AGENTS §3 rule 5: nothing from YouTube loads with the page);
    then the privacy-enhanced player (youtube-nocookie.com) takes its place and starts. */
export function VideoCard({ id, title }: { id: string; title: string }) {
  const [on, setOn] = useState(false);
  return on ? (
    <iframe src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`} title={title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen className="absolute inset-0 size-full" />
  ) : (
    <button type="button" onClick={() => setOn(true)} aria-label={`Play: ${title}`} className="group absolute inset-0 grid place-items-center">
      <Image src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" fill sizes="(min-width: 640px) 390px, 100vw" className="object-cover transition-transform duration-300 ease-[var(--ease-brand)] group-hover:scale-[1.03]" />
      <span className="relative grid size-14 place-items-center rounded-full bg-white/90 shadow-raised backdrop-blur transition-transform duration-200 group-hover:scale-105 group-active:scale-95">
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M6.5 4.2v11.6a.6.6 0 0 0 .92.5l9-5.8a.6.6 0 0 0 0-1l-9-5.8a.6.6 0 0 0-.92.5Z" fill="#111318" /></svg>
      </span>
    </button>
  );
}
