import type { ComponentProps } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "./utils";

/* shadcn/ui Input, Textarea, Label, native Select (admin only). 16px text on phones so iOS doesn't zoom; 14px from md. */
export const fieldClass = "w-full min-w-0 rounded-md border border-input bg-transparent px-3 text-base shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm";

export const Input = ({ className, type, ...p }: ComponentProps<"input">) => <input type={type} data-slot="input" className={cn(fieldClass, "h-9 py-1", className)} {...p} />;
export const Textarea = ({ className, ...p }: ComponentProps<"textarea">) => <textarea data-slot="textarea" className={cn(fieldClass, "field-sizing-content min-h-16 py-2", className)} {...p} />;
// native select with a drawn chevron (the old background-image arrow never rendered, so selects looked like text boxes)
export const NativeSelect = ({ className, ...p }: ComponentProps<"select">) => (
  <span className="relative block w-full min-w-0">
    <select data-slot="select" className={cn(fieldClass, "h-9 cursor-pointer appearance-none pr-9", className)} {...p} />
    <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
  </span>
);
export const Label = ({ className, ...p }: ComponentProps<"span">) => <span data-slot="label" className={cn("flex items-center gap-2 text-sm leading-none font-medium select-none", className)} {...p} />;
