import type { ComponentProps } from "react";
import { cn } from "./utils";

/* shadcn/ui Card (admin only). */
export const Card = ({ className, ...p }: ComponentProps<"div">) => <div data-slot="card" className={cn("flex flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground shadow-xs", className)} {...p} />;
export const CardHeader = ({ className, ...p }: ComponentProps<"div">) => <div data-slot="card-header" className={cn("grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6", className)} {...p} />;
export const CardTitle = ({ className, ...p }: ComponentProps<"div">) => <div data-slot="card-title" className={cn("leading-none font-semibold", className)} {...p} />;
export const CardDescription = ({ className, ...p }: ComponentProps<"div">) => <div data-slot="card-description" className={cn("text-sm text-muted-foreground", className)} {...p} />;
export const CardAction = ({ className, ...p }: ComponentProps<"div">) => <div data-slot="card-action" className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)} {...p} />;
export const CardContent = ({ className, ...p }: ComponentProps<"div">) => <div data-slot="card-content" className={cn("px-6", className)} {...p} />;
export const CardFooter = ({ className, ...p }: ComponentProps<"div">) => <div data-slot="card-footer" className={cn("flex items-center px-6 [.border-t]:pt-6", className)} {...p} />;
