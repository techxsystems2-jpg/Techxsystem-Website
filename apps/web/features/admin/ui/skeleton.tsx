import type { ComponentProps } from "react";
import { cn } from "./utils";

/* shadcn/ui Skeleton (admin only), with a soft shimmer (globals.css, `.admin-shimmer`): shown the moment a screen is
   opened, so the admin never looks frozen while the database answers. Still under reduced motion. */
export const Skeleton = ({ className, ...p }: ComponentProps<"div">) => (
  <div data-slot="skeleton" aria-hidden="true" className={cn("admin-shimmer rounded-md", className)} {...p} />
);
