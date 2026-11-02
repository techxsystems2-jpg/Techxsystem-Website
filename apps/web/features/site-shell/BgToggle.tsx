"use client";

import { useSyncExternalStore } from "react";

/* Background switch (owner, 2026-11-02): "Blue" is the sky look (hero sky + the page-wide sky-flow wash), "White" is a
   plain white page. Sets data-bg on <html>; globals.css does the rest. Remembered in localStorage (`techx-bg`), and an
   inline script in layout.tsx applies it before first paint so there's no flash. Owner review control, like the
   Collage switch: keep or remove before launch. */
export const BG_KEY = "techx-bg";
type Bg = "white" | "blue";

const subscribe = (cb: () => void) => {
  addEventListener(BG_KEY, cb);
  addEventListener("storage", cb);
  return () => { removeEventListener(BG_KEY, cb); removeEventListener("storage", cb); };
};
const read = (): Bg => (localStorage.getItem(BG_KEY) === "white" ? "white" : "blue");

export function BgToggle({ className = "" }: { className?: string }) {
  const bg = useSyncExternalStore(subscribe, read, () => "blue" as Bg);
  const set = (v: Bg) => {
    localStorage.setItem(BG_KEY, v);
    document.documentElement.setAttribute("data-bg", v);
    dispatchEvent(new Event(BG_KEY));
  };
  return (
    <div role="radiogroup" aria-label="Page background" className={`flex items-center rounded-[8px] bg-ink/[0.05] p-0.5 ${className}`}>
      {(["white", "blue"] as const).map((v) => (
        <button key={v} type="button" role="radio" aria-checked={bg === v} onClick={() => set(v)}
          className={`flex h-7 items-center gap-1.5 rounded-[6px] px-2 text-[12px] font-medium transition-[background-color,color,box-shadow] duration-200 ${bg === v ? "bg-surface text-ink shadow-hair" : "text-ink-2 hover:text-ink"}`}>
          <span aria-hidden="true" className={`size-2.5 rounded-full ring-1 ring-ink/15 ${v === "white" ? "bg-white" : "bg-[#CFE6FF]"}`} />
          {v === "white" ? "White" : "Blue"}
        </button>
      ))}
    </div>
  );
}
