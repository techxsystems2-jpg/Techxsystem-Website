import type { ComponentProps } from "react";
import { cn } from "./utils";

/* shadcn/ui Separator (admin only; decorative). */
export const Separator = ({ className, orientation = "horizontal", ...p }: ComponentProps<"div"> & { orientation?: "horizontal" | "vertical" }) => (
  <div role="none" data-slot="separator" data-orientation={orientation} className={cn("shrink-0 bg-border", orientation === "horizontal" ? "h-px w-full" : "h-full w-px", className)} {...p} />
);
