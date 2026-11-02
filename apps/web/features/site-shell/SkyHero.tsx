import type { ReactNode } from "react";
import { Words } from "@/features/home/Hero";

/* The hero every inner page uses, so they all match Home (owner, 2026-11-02: "follow the design we use across all the
   pages"): the Home sky and drifting clouds (`hero-sky`, hidden on the White background, masked so it melts into the
   page), a pill badge where Home has the trust badge, a two-line display headline rising word by word (second line
   muted), the lede, then the page's actions and blue-icon pointers. Centred, like Home. */
export function SkyHero({ badge, lead, rest, lede, children }: { badge: ReactNode; lead: string; rest: string; lede: ReactNode; children?: ReactNode }) {
  const leadWords = lead.split(" ").length;
  return (
    <section className="relative overflow-hidden pb-6 pt-24 text-center md:pt-32">
      <div aria-hidden="true" className="hero-sky pointer-events-none absolute inset-0 overflow-hidden [mask-image:linear-gradient(to_bottom,#000_60%,transparent)]">
        <div className="absolute inset-0 bg-[radial-gradient(55%_50%_at_18%_10%,#D2ECFF,transparent_70%),radial-gradient(50%_50%_at_82%_14%,#D8EFFF,transparent_70%),radial-gradient(70%_45%_at_50%_0%,#E3F3FF,transparent_75%),linear-gradient(to_bottom,#EAF5FF,#F3F9FF_55%,transparent)]" />
        <div className="cloud absolute left-[4%] top-[6%] h-[240px] w-[520px] rounded-full bg-white/70 blur-[60px]" />
        <div className="cloud absolute right-[3%] top-[18%] h-[200px] w-[460px] rounded-full bg-white/60 blur-[60px] [animation-delay:-12s]" />
      </div>
      <div className="wrap relative">
        <div className="rise"><div className="[--i:0]">{badge}</div></div>
        <h1 className="mx-auto mb-5 mt-7 max-w-[900px] text-display">
          <Words text={lead} from={1} />
          <br />
          <Words text={rest} from={1 + leadWords} className="text-ink-3" />
        </h1>
        <div className="rise">
          <p className="mx-auto max-w-[560px] text-[17px] leading-[1.6] tracking-[-0.01em] text-ink-2 md:text-[18px] [--i:2]">{lede}</p>
          {children}
        </div>
      </div>
    </section>
  );
}

/** The blue-icon pointer row under a hero (same as Home's). Icons are 24×24 outline paths, stroke 1.75. */
export function Pointers({ items, className = "" }: { items: { text: string; icon: ReactNode }[]; className?: string }) {
  return (
    <ul className={`mt-7 flex flex-wrap justify-center gap-x-7 gap-y-2.5 ${className}`}>
      {items.map((p) => (
        <li key={p.text} className="flex items-center gap-2 text-[14.5px] text-ink-2">
          <PointIcon icon={p.icon} />
          {p.text}
        </li>
      ))}
    </ul>
  );
}

/** The white pill badge at the top of a hero (Home's trust-badge style). */
export function HeroBadge({ children }: { children: ReactNode }) {
  return (
    <p className="relative inline-flex max-w-full items-center gap-2.5 rounded-full bg-white py-1.5 pl-3 pr-4 text-[13px] font-medium text-ink shadow-[0_0_0_1px_rgb(10_10_11/0.12),0_6px_18px_-8px_rgb(10_10_11/0.25)] sm:text-[14px]">
      {children}
    </p>
  );
}

/** Shared point icons (owner, 2026-11-02: icons, not plain check marks, wherever we list reassurances). 24×24 outline. */
export const POINT_ICONS = {
  card: <><rect x="2.5" y="5" width="19" height="14" rx="3" /><path d="M2.5 10h19M6 15h4" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7.5V12l3 2" /></>,
  shield: <path d="M9 12.2l2 2 4-4.4M11.6 3.2 6.2 5.1A3 3 0 0 0 4.2 8l-.1 3.2a10 10 0 0 0 5.4 9.2l1.5.9a3 3 0 0 0 2.9 0l1.5-.8a10 10 0 0 0 5.6-9.6L20.8 8a3 3 0 0 0-2-2.6l-5.4-2a3 3 0 0 0-1.8-.2Z" />,
  lock: <><rect x="5" y="10.5" width="14" height="10" rx="2.5" /><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" /></>,
};

export function PointIcon({ icon, size = 17, className = "" }: { icon: ReactNode; size?: number; className?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`shrink-0 text-blue ${className}`}>{icon}</svg>;
}
