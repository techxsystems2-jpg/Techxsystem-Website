import { Skeleton } from "./ui/skeleton";

/* Placeholders shaped like the screen that's loading (owner, 2026-11-03: "a shimmer while it loads, so the admin
   never seems frozen"). Used by the admin's loading.tsx files and the sign-in check. */

const Head = () => (
  <div className="flex flex-col gap-2">
    <Skeleton className="h-7 w-48" />
    <Skeleton className="h-4 w-full max-w-[520px]" />
    <div className="mt-1 flex gap-1.5"><Skeleton className="h-5 w-16" /><Skeleton className="h-5 w-20" /><Skeleton className="h-5 w-14" /></div>
  </div>
);

/** The overview: stat cards and section cards. */
export function OverviewSkeleton() {
  return (
    <div role="status" aria-label="Loading" className="mx-auto grid max-w-[1240px] gap-8">
      <Head />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="grid gap-3 rounded-xl border bg-card p-6 shadow-xs"><Skeleton className="h-4 w-24" /><Skeleton className="h-8 w-14" /><Skeleton className="h-4 w-32" /></div>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="grid gap-3 rounded-xl border bg-card p-6 shadow-xs"><Skeleton className="h-5 w-32" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-3/4" /></div>
        ))}
      </div>
    </div>
  );
}

/** A section's editor: header, then form cards with label + field rows. */
export function SectionSkeleton() {
  return (
    <div role="status" aria-label="Loading" className="mx-auto grid max-w-[1240px] gap-6">
      <Head />
      {[3, 2, 4].map((rows, i) => (
        <div key={i} className="grid gap-5 rounded-xl border bg-card p-6 shadow-xs">
          <Skeleton className="h-5 w-40" />
          {Array.from({ length: rows }, (_, j) => (
            <div key={j} className="grid gap-2"><Skeleton className="h-4 w-28" /><Skeleton className="h-9 w-full" /></div>
          ))}
        </div>
      ))}
    </div>
  );
}

/** The whole admin while the sign-in is checked: sidebar + panel. */
export function ShellSkeleton() {
  return (
    <div role="status" aria-label="Loading" className="flex min-h-svh w-full bg-sidebar">
      <div className="hidden w-64 shrink-0 flex-col gap-2 p-4 md:flex">
        <div className="flex items-center gap-2 pb-3"><Skeleton className="size-8 rounded-lg" /><div className="grid flex-1 gap-1.5"><Skeleton className="h-3.5 w-24" /><Skeleton className="h-3 w-16" /></div></div>
        {Array.from({ length: 12 }, (_, i) => <Skeleton key={i} className="h-7 w-full" />)}
      </div>
      <div className="m-2 flex-1 rounded-xl bg-background p-8 shadow-sm ring-1 ring-sidebar-border md:ml-0"><OverviewSkeleton /></div>
    </div>
  );
}
