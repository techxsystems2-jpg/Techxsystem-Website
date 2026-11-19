import Image from "next/image";
import Link from "next/link";

/** The full TechX logo (owner's file, 2026-11-19: public/brand/logo.png), mark, wordmark and tagline. Footer only;
    the header keeps the mark with the name in text, since the tagline would be unreadable at 48px. */
export function Logo() {
  return (
    <Link href="/" className="inline-block" aria-label="TechX Systems, home">
      <Image src="/brand/logo.png" alt="TechX Systems, the post-production company" width={400} height={392} className="h-auto w-[120px]" />
    </Link>
  );
}
