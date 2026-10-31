/* One outline style: 1.6–1.8 stroke, round caps and joins, inherits colour (DESIGN.md §7). */

type P = { size?: number; className?: string };

export function ArrowIcon({ size = 16, className = "" }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden="true" className={className}>
      <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CheckIcon({ size = 16, className = "" }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden="true" className={className}>
      <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** The TechX mark: maroon roof over a blue camera. A logo refresh is still to be agreed with the client. */
export function Mark({ className = "" }: { className?: string }) {
  return (
    <svg width="26" height="24" viewBox="0 0 26 24" aria-hidden="true" className={className}>
      <path d="M2 10L13 2L24 10" fill="none" stroke="#8E1F3F" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
      <rect x="5" y="10" width="16" height="12" rx="2.5" fill="none" stroke="#2F5BEA" strokeWidth="1.9" />
      <circle cx="13" cy="16" r="3.2" fill="none" stroke="#2F5BEA" strokeWidth="1.9" />
    </svg>
  );
}
