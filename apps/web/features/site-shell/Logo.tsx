import Link from "next/link";
import { Mark } from "@techx/ui/Icons";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 text-[15px] font-medium" aria-label="TechX Systems, home">
      <Mark />
      TechX <span className="-ml-1 text-ink-3">Systems</span>
    </Link>
  );
}
