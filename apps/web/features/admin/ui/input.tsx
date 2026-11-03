import type { ComponentProps } from "react";
import { cn } from "./utils";

/* shadcn/ui Input, Textarea, Label, native Select (admin only). 16px text on phones so iOS doesn't zoom; 14px from md. */
export const fieldClass = "w-full min-w-0 rounded-md border border-input bg-transparent px-3 text-base shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm";

export const Input = ({ className, type, ...p }: ComponentProps<"input">) => <input type={type} data-slot="input" className={cn(fieldClass, "h-9 py-1", className)} {...p} />;
export const Textarea = ({ className, ...p }: ComponentProps<"textarea">) => <textarea data-slot="textarea" className={cn(fieldClass, "field-sizing-content min-h-16 py-2", className)} {...p} />;
export const NativeSelect = ({ className, ...p }: ComponentProps<"select">) => <select data-slot="select" className={cn(fieldClass, "h-9 appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23737373%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[right_0.6rem_center] bg-no-repeat pr-8", className)} {...p} />;
export const Label = ({ className, ...p }: ComponentProps<"span">) => <span data-slot="label" className={cn("flex items-center gap-2 text-sm leading-none font-medium select-none", className)} {...p} />;
