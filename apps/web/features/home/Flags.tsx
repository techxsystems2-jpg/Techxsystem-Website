/* Round country flags for the hero trust badge, drawn inline (emoji flags show as letters on Windows). 24 × 24. */

import type { ReactNode } from "react";

const Union = ({ id }: { id: string }) => (
  <g clipPath={`url(#${id})`}>
    <path d="M0 0h24v24H0z" fill="#012169" />
    <path d="M0 0l24 24M24 0L0 24" stroke="#fff" strokeWidth="4.8" />
    <path d="M0 0l24 24M24 0L0 24" stroke="#C8102E" strokeWidth="1.6" />
    <path d="M12 0v24M0 12h24" stroke="#fff" strokeWidth="6.4" />
    <path d="M12 0v24M0 12h24" stroke="#C8102E" strokeWidth="3.6" />
  </g>
);

function Round({ label, children }: { label: string; children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" role="img" aria-label={label} className="rounded-full ring-2 ring-white">
      <defs><clipPath id={`c-${label}`}><circle cx="12" cy="12" r="12" /></clipPath></defs>
      <g clipPath={`url(#c-${label})`}>{children}</g>
    </svg>
  );
}

export function FlagUS() {
  return (
    <Round label="United States">
      <path d="M0 0h24v24H0z" fill="#fff" />
      {[0, 2, 4, 6, 8, 10, 12].map((i) => <path key={i} d={`M0 ${i * 1.846}h24v1.846H0z`} fill="#B22234" />)}
      <path d="M0 0h11v12.9H0z" fill="#3C3B6E" />
      {[[2.5, 2.5], [6, 2.5], [9, 2.5], [4.2, 5.5], [7.6, 5.5], [2.5, 8.5], [6, 8.5], [9, 8.5]].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r=".75" fill="#fff" />)}
    </Round>
  );
}

export function FlagUK() {
  return (
    <Round label="United Kingdom">
      <defs><clipPath id="uk-u"><path d="M0 0h24v24H0z" /></clipPath></defs>
      <Union id="uk-u" />
    </Round>
  );
}

export function FlagAU() {
  const star = (x: number, y: number, r: number) =>
    Array.from({ length: 14 }, (_, i) => {
      const a = (Math.PI / 7) * i - Math.PI / 2;
      const d = i % 2 ? r * 0.45 : r;
      return `${i ? "L" : "M"}${(x + d * Math.cos(a)).toFixed(2)} ${(y + d * Math.sin(a)).toFixed(2)}`;
    }).join(" ") + "Z";
  return (
    <Round label="Australia">
      <path d="M0 0h24v24H0z" fill="#012169" />
      <svg x="0" y="0" width="12" height="12" viewBox="0 0 24 24" overflow="hidden">
        <defs><clipPath id="au-u"><path d="M0 0h24v24H0z" /></clipPath></defs>
        <Union id="au-u" />
      </svg>
      <path d={star(6, 17.5, 2.6)} fill="#fff" />
      <path d={star(18, 6, 1.4)} fill="#fff" />
      <path d={star(15, 11, 1.4)} fill="#fff" />
      <path d={star(20.5, 10, 1.4)} fill="#fff" />
      <path d={star(18, 19, 1.5)} fill="#fff" />
    </Round>
  );
}
