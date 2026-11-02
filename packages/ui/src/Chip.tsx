import type { ButtonHTMLAttributes } from "react";

/** Toggle chip. Selected = raised white (220ms). Presses in on pointer-down (apple-design: feedback on the press). */
export function Chip({ selected = false, className = "", ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { selected?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={`h-[34px] rounded-[8px] px-3.5 text-[13px] font-medium text-ink-2 shadow-[inset_0_0_0_1px_var(--color-line)] transition-[color,background-color,box-shadow,scale] duration-[220ms] hover:text-ink active:scale-[0.96] active:duration-100 aria-pressed:bg-surface aria-pressed:text-ink aria-pressed:shadow-[0_0_0_1px_rgb(10_10_11/0.12),0_4px_10px_-4px_rgb(10_10_11/0.18)] ${className}`}
      {...rest}
    />
  );
}
