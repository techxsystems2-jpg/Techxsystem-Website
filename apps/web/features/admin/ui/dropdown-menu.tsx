"use client";

import type { ComponentProps } from "react";
import { DropdownMenu as D } from "radix-ui";
import { cn } from "./utils";

/* shadcn/ui DropdownMenu (admin only). */
export const DropdownMenu = D.Root;
export const DropdownMenuTrigger = D.Trigger;
export function DropdownMenuContent({ className, sideOffset = 4, ...p }: ComponentProps<typeof D.Content>) {
  return (
    <D.Portal>
      <D.Content data-slot="dropdown-menu-content" sideOffset={sideOffset}
        className={cn("z-50 min-w-[12rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", className)} {...p} />
    </D.Portal>
  );
}
export const DropdownMenuItem = ({ className, ...p }: ComponentProps<typeof D.Item>) => (
  <D.Item data-slot="dropdown-menu-item" className={cn("relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:size-4 [&_svg]:text-muted-foreground", className)} {...p} />
);
export const DropdownMenuLabel = ({ className, ...p }: ComponentProps<typeof D.Label>) => <D.Label data-slot="dropdown-menu-label" className={cn("px-2 py-1.5 text-sm font-medium", className)} {...p} />;
export const DropdownMenuSeparator = ({ className, ...p }: ComponentProps<typeof D.Separator>) => <D.Separator data-slot="dropdown-menu-separator" className={cn("-mx-1 my-1 h-px bg-border", className)} {...p} />;
