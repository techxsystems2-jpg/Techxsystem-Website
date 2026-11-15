import Image from "next/image";
import { ServiceArt } from "./ServiceArt";

// the six original services, each with its own before/after film in ServiceArt
const FILMS = ["photo-editing", "virtual-twilight", "virtual-staging", "drone-editing", "floor-plans", "video-editing"] as const;
type Film = (typeof FILMS)[number];
const hasArt = (slug: string): slug is Film => (FILMS as readonly string[]).includes(slug);

/** A service's picture: its before/after film for the six original services, otherwise the photo set in the admin. */
export function ServiceVisual({ slug, image, name, eager = false, sizes }: { slug: string; image: string; name: string; eager?: boolean; sizes?: string }) {
  if (hasArt(slug)) return <ServiceArt slug={slug} eager={eager} sizes={sizes ?? "(min-width: 1024px) 480px, 100vw"} />;
  return (
    <div className="relative aspect-[3/2] overflow-hidden rounded-inner bg-sunk outline-1 -outline-offset-1 outline-black/10">
      {image ? <Image src={image} alt={`${name} by TechX`} fill sizes={sizes ?? "(min-width: 1024px) 480px, 100vw"} className="object-cover" {...(eager ? { loading: "eager" as const, fetchPriority: "high" as const } : {})} />
        : <span className="grid size-full place-items-center text-small text-ink-2">{name}</span>}
    </div>
  );
}
