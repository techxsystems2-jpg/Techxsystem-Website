/* Illustrated stand-in scenes (600 × 400, cover) until TechX sends real before/after pairs.
   `uid` keeps gradient ids unique when a scene appears more than once on a page. */

import type { ReactNode } from "react";

export type SceneName = "ext" | "twi" | "int" | "aer" | "plan";

export function Scene({ name, uid, className = "" }: { name: SceneName; uid: string; className?: string }) {
  const g = (k: string) => `${uid}-${k}`;
  const u = (k: string) => `url(#${g(k)})`;
  return (
    <svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true" className={`size-full ${className}`}>
      <defs>
        <linearGradient id={g("a")} x1="0" y1="0" x2="0" y2="1">{stops[name][0]}</linearGradient>
        <linearGradient id={g("b")} x1="0" y1="0" x2="0" y2="1">{stops[name][1]}</linearGradient>
      </defs>
      {name === "ext" && (
        <>
          <rect width="600" height="400" fill={u("a")} /><ellipse cx="140" cy="70" rx="70" ry="12" fill="#fff" opacity=".7" />
          <circle cx="70" cy="250" r="58" fill="#3E6E39" /><circle cx="545" cy="236" r="70" fill="#3E6E39" /><circle cx="500" cy="262" r="40" fill="#3E6E39" />
          <rect y="292" width="600" height="108" fill={u("b")} /><path d="M330 400L382 300H446L478 400Z" fill="#CFC9BE" />
          <rect x="140" y="190" width="230" height="110" fill="#F3EFE7" /><rect x="370" y="226" width="92" height="74" fill="#ECE7DE" />
          <path d="M118 196L262 112L392 196Z" fill="#3B414A" /><path d="M356 232L416 192L476 232Z" fill="#3B414A" />
          <rect x="168" y="216" width="46" height="40" rx="2" fill="#5B7895" /><rect x="232" y="216" width="46" height="40" rx="2" fill="#5B7895" />
          <rect x="300" y="232" width="36" height="68" rx="2" fill="#6B4A33" /><rect x="382" y="246" width="70" height="54" rx="2" fill="#D6CFC2" />
          <ellipse cx="200" cy="300" rx="54" ry="14" fill="#3E6E39" /><ellipse cx="300" cy="302" rx="26" ry="9" fill="#3E6E39" />
        </>
      )}
      {name === "twi" && (
        <>
          <rect width="600" height="400" fill={u("a")} />
          <circle cx="70" cy="250" r="58" fill="#1E3325" /><circle cx="545" cy="236" r="70" fill="#1E3325" /><circle cx="500" cy="262" r="40" fill="#1E3325" />
          <rect y="292" width="600" height="108" fill={u("b")} /><path d="M330 400L382 300H446L478 400Z" fill="#5C5852" />
          <rect x="140" y="190" width="230" height="110" fill="#CBC1B3" /><rect x="370" y="226" width="92" height="74" fill="#C2B8AA" />
          <path d="M118 196L262 112L392 196Z" fill="#252830" /><path d="M356 232L416 192L476 232Z" fill="#252830" />
          <ellipse cx="260" cy="250" rx="140" ry="60" fill="#FFB547" opacity=".22" />
          <rect x="168" y="216" width="46" height="40" rx="2" fill="#FFC864" /><rect x="232" y="216" width="46" height="40" rx="2" fill="#FFC864" />
          <rect x="300" y="232" width="36" height="68" rx="2" fill="#8A5A2E" /><rect x="382" y="246" width="70" height="54" rx="2" fill="#F6C66E" />
          <ellipse cx="200" cy="300" rx="54" ry="14" fill="#1E3325" />
        </>
      )}
      {name === "int" && (
        <>
          <rect width="600" height="400" fill={u("a")} /><rect x="330" y="64" width="224" height="190" fill="#C9DDF3" />
          <circle cx="380" cy="230" r="40" fill="#8DBB76" /><circle cx="500" cy="240" r="46" fill="#7BAE66" />
          <path d="M330 64h224v190H330z M442 64v190 M330 158h224" stroke="#fff" strokeWidth="7" fill="none" />
          <rect y="280" width="600" height="120" fill={u("b")} /><ellipse cx="200" cy="334" rx="176" ry="36" fill="#E5DDD1" />
          <rect x="60" y="188" width="222" height="44" rx="12" fill="#9BA7B4" /><rect x="56" y="222" width="230" height="64" rx="12" fill="#8693A2" />
          <rect x="112" y="304" width="140" height="16" rx="4" fill="#4E3E31" /><path d="M200 0V68" stroke="#2B2B2B" strokeWidth="2" />
          <path d="M176 68H224L214 94H186Z" fill="#2E3237" /><rect x="498" y="256" width="44" height="40" rx="4" fill="#CBBDA8" />
          <circle cx="520" cy="230" r="34" fill="#4C7D45" />
        </>
      )}
      {name === "aer" && (
        <>
          <rect width="600" height="400" fill="#6FA45C" /><path d="M0 168H600M246 0V400" stroke="#D9D3C6" strokeWidth="30" />
          <rect x="40" y="28" width="150" height="100" fill="#A5523F" /><rect x="300" y="30" width="130" height="96" fill="#717A86" />
          <rect x="300" y="210" width="190" height="150" fill="none" stroke="#fff" strokeWidth="3" strokeDasharray="12 8" />
          <rect x="316" y="226" width="110" height="74" fill="#B65A43" /><rect x="380" y="312" width="90" height="38" rx="8" fill="#49B5E2" />
          <circle cx="90" cy="250" r="34" fill="#3E7639" /><circle cx="150" cy="300" r="26" fill="#3E7639" />
          <circle cx="540" cy="80" r="30" fill="#3E7639" /><circle cx="560" cy="300" r="36" fill="#3E7639" />
        </>
      )}
      {name === "plan" && (
        <>
          <rect width="600" height="400" fill="#FAFAF8" />
          <path d="M80 60H520V340H80Z M300 60V220 M80 220H240 M300 160H520 M400 160V340 M240 220V340" stroke="#23262D" strokeWidth="6" fill="none" />
          <rect x="110" y="90" width="120" height="70" rx="6" fill="none" stroke="#9AA1AD" strokeWidth="2" />
          <circle cx="460" cy="250" r="34" fill="none" stroke="#9AA1AD" strokeWidth="2" />
          <rect x="110" y="250" width="100" height="60" rx="6" fill="none" stroke="#9AA1AD" strokeWidth="2" />
        </>
      )}
    </svg>
  );
}

const s = (a: string, b: string, mid?: string) => (
  <>
    <stop offset="0" stopColor={a} />
    {mid && <stop offset=".55" stopColor={mid} />}
    <stop offset="1" stopColor={b} />
  </>
);

// [sky or wall, ground or floor] gradients per scene
const stops: Record<SceneName, [ReactNode, ReactNode]> = {
  ext: [s("#7FAEE8", "#DCE9F8"), s("#7DB062", "#4C8640")],
  twi: [s("#1B2356", "#F0905E", "#5A3E86"), s("#2B4631", "#172A1D")],
  int: [s("#F4EFE7", "#E7E0D4"), s("#C99D6E", "#A47750")],
  aer: [s("#6FA45C", "#6FA45C"), s("#6FA45C", "#6FA45C")],
  plan: [s("#FAFAF8", "#FAFAF8"), s("#FAFAF8", "#FAFAF8")],
};
