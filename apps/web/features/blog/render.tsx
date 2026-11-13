import { toBlocks } from "./blocks";
import type { ReactNode } from "react";
import Image from "next/image";
import { allowedImage } from "@/lib/content/fields";

/* Blog post formatting (owner, 2026-11-03), written in the admin as plain text:
   blank line = new paragraph · "## " / "### " headings · "- " list items · "> " quote ·
   **bold** · *italic* · [link text](https://…) · ![photo description](/uploads/… or Blob URL) on its own line.
   Built as React elements, never HTML strings, so a post can't inject markup or scripts. Links: http(s), /paths and
   mailto only; outside links open in a new tab with rel="noopener nofollow". */

const safeHref = (u: string) => (/^(https?:\/\/|\/(?!\/)|mailto:)/i.test(u) ? u : null);

function inline(text: string, key = 0): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(\[([^\]]+)\]\(([^)\s]+)\))/g;
  let last = 0, m: RegExpExecArray | null, k = key;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[2]) out.push(<strong key={k++} className="font-medium text-ink">{m[2]}</strong>);
    else if (m[4]) out.push(<em key={k++}>{m[4]}</em>);
    else if (m[6]) {
      const href = safeHref(m[7]!);
      const outside = href?.startsWith("http");
      out.push(href ? <a key={k++} href={href} {...(outside ? { target: "_blank", rel: "noopener nofollow" } : {})} className="text-blue-2 underline decoration-blue-2/40 underline-offset-4 hover:decoration-blue-2">{m[6]}</a> : m[6]);
    }
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function PostBody({ body }: { body: string }) {
  const blocks = toBlocks(body);
  return (
    <div className="grid gap-5 text-[16px] leading-[1.7] text-ink">
      {blocks.map((b, i) => {
        const img = b.match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/);
        if (img && allowedImage(img[2]!)) {
          return (
            <figure key={i} className="my-2">
              <span className="relative block aspect-[16/10] overflow-hidden rounded-card bg-sunk outline-1 -outline-offset-1 outline-black/10">
                <Image src={img[2]!} alt={img[1] ?? ""} fill sizes="(min-width: 768px) 720px, 100vw" className="object-cover" />
              </span>
              {img[1] && <figcaption className="mt-2 text-small text-ink-2">{img[1]}</figcaption>}
            </figure>
          );
        }
        if (b.startsWith("### ")) return <h3 key={i} className="mt-3 text-[18px] font-medium text-ink">{inline(b.slice(4))}</h3>;
        if (b.startsWith("## ")) return <h2 key={i} className="mt-5 text-h4 text-ink">{inline(b.slice(3))}</h2>;
        if (b.split("\n").every((l) => l.startsWith("- ") || l.trim() === "-")) {
          const items = b.split("\n").map((l) => l.slice(2).trim()).filter(Boolean); // an empty "- " (still typing) is skipped
          return <ul key={i} className="grid list-disc gap-2 pl-6 marker:text-ink-3">{items.map((l, j) => <li key={j}>{inline(l)}</li>)}</ul>;
        }
        if (b.startsWith("> ")) return <blockquote key={i} className="border-l-2 border-line-2 pl-5 text-ink">{inline(b.replace(/^> ?/gm, ""))}</blockquote>;
        return <p key={i}>{b.split("\n").flatMap((l, j) => (j ? [<br key={`br${j}`} />, ...inline(l, j * 100)] : inline(l)))}</p>;
      })}
    </div>
  );
}
