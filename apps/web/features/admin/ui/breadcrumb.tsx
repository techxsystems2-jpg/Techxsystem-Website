import type { ComponentProps } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "./utils";

/* shadcn/ui Breadcrumb (admin only). */
export const Breadcrumb = (p: ComponentProps<"nav">) => <nav aria-label="Breadcrumb" data-slot="breadcrumb" {...p} />;
export const BreadcrumbList = ({ className, ...p }: ComponentProps<"ol">) => <ol data-slot="breadcrumb-list" className={cn("flex flex-wrap items-center gap-1.5 text-sm break-words text-muted-foreground sm:gap-2.5", className)} {...p} />;
export const BreadcrumbItem = ({ className, ...p }: ComponentProps<"li">) => <li data-slot="breadcrumb-item" className={cn("inline-flex items-center gap-1.5", className)} {...p} />;
export const BreadcrumbPage = ({ className, ...p }: ComponentProps<"span">) => <span data-slot="breadcrumb-page" aria-current="page" className={cn("font-normal text-foreground", className)} {...p} />;
export const BreadcrumbSeparator = ({ className, ...p }: ComponentProps<"li">) => <li data-slot="breadcrumb-separator" role="presentation" aria-hidden="true" className={cn("[&>svg]:size-3.5", className)} {...p}><ChevronRight /></li>;
