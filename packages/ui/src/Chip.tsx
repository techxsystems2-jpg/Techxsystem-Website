import type { ButtonHTMLAttributes } from "react";

/** Toggle chip. Selected = ink fill, white label (220ms). */
export function Chip({ selected = false, className = "", ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { selected?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={`h-[34px] rounded-full px-3.5 text-[13px] font-medium text-ink-2 shadow-[inset_0_0_0_1px_var(--color-line)] transition-colors duration-[220ms] hover:text-ink aria-pressed:bg-surface aria-pressed:text-ink aria-pressed:shadow-[0_0_0_1px_rgb(10_10_11/0.12),0_4px_10px_-4px_rgb(10_10_11/0.18)] ${className}`}
      {...rest}
    />
  );
}
