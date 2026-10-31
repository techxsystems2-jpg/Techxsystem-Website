import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost";

const base =
  "group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-[filter,box-shadow,transform] duration-150 active:translate-y-px disabled:pointer-events-none disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  // The only blue on the page. One per view.
  primary:
    "bg-[linear-gradient(180deg,#5B92FF_0%,#3074FE_55%,#1E4FD6_100%)] text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.35),inset_0_-2px_4px_rgb(14_30_110/0.25),0_0_0_1px_rgb(30_79_214/0.9),0_6px_16px_-6px_rgb(48_116_254/0.6)] hover:brightness-[1.06] hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.4),inset_0_-2px_4px_rgb(14_30_110/0.25),0_0_0_1px_rgb(30_79_214/0.9),0_10px_22px_-8px_rgb(48_116_254/0.7)] active:brightness-95",
  secondary:
    "bg-[linear-gradient(180deg,#FFFFFF_0%,#F4F4F6_100%)] text-ink shadow-[inset_0_1px_0_#fff,inset_0_-2px_3px_rgb(10_10_11/0.05),0_0_0_1px_rgb(10_10_11/0.1),0_4px_10px_-6px_rgb(10_10_11/0.2)] hover:shadow-[inset_0_1px_0_#fff,inset_0_-2px_3px_rgb(10_10_11/0.05),0_0_0_1px_rgb(10_10_11/0.16),0_8px_16px_-8px_rgb(10_10_11/0.25)]",
  ghost: "text-ink hover:bg-sunk",
};

export type ButtonSize = "sm" | "md" | "lg";
const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-[13.5px]",
  md: "h-11 px-5 text-[15px]",
  lg: "h-12 px-6 text-[16px]",
};

/** Class string for anything styled as a button (next/link in the app, <button> here). */
export function buttonClass(variant: ButtonVariant = "primary", className = "", size: ButtonSize = "md") {
  return `${base} ${sizes[size]} ${variants[variant]} ${className}`;
}

export function Button({ variant = "primary", className = "", type = "button", ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return <button type={type} className={buttonClass(variant, className)} {...rest} />;
}
