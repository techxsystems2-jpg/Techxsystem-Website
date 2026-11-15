import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, sessionEmail } from "@/lib/server/admin";
import { readItem, readSection } from "@/lib/server/content-store";

/* Runs before every public page (API routes, the admin, Next's files and anything with a file extension are skipped).

   1. Maintenance (owner, 2026-11-15): with Site facts → "Under maintenance" on, every page shows /maintenance with a
      503 status and Retry-After, so search engines keep the old pages instead of indexing the notice. The contact form
      (/api/contact) and the admin keep working, and a signed-in admin still sees the real site. The switch is read at
      most every 10 seconds per server instance.
   2. Blog (SEO audit, 2026-11-14: soft 404): a blog address with no published post gets a real 404 status. The page
      can't set it: the root layout's header Suspense starts the stream (status 200) before the page runs. Each answer is
      kept for a minute per instance; the map is cleared at 500 entries so junk URLs can't grow it.
   A database error lets the request through: the site stays up and the page shows its own not-found. */
let maintenance = { on: false, at: 0 };
let notice = { html: "", at: 0 };
const seen = new Map<string, { ok: boolean; at: number }>();

async function underMaintenance() {
  if (Date.now() - maintenance.at > 10_000) maintenance = { on: Boolean((await readSection("facts"))?.maintenance), at: Date.now() };
  return maintenance.on;
}

async function postExists(slug: string) {
  const hit = seen.get(slug);
  if (hit && Date.now() - hit.at < 60_000) return hit.ok;
  const ok = Boolean((await readItem("blog", slug))?.published);
  if (seen.size >= 500) seen.clear();
  seen.set(slug, { ok, at: Date.now() });
  return ok;
}

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  try {
    if (path !== "/maintenance" && (await underMaintenance()) && !sessionEmail(req.cookies.get(ADMIN_COOKIE)?.value)) {
      // a rewrite can't change the status (Next sends 200), so the page's HTML is fetched once per 10 s and sent as a 503
      if (Date.now() - notice.at > 10_000) notice = { html: await (await fetch(new URL("/maintenance", req.url))).text(), at: Date.now() };
      return new NextResponse(notice.html, { status: 503, headers: { "Content-Type": "text/html; charset=utf-8", "Retry-After": "3600", "Cache-Control": "no-store" } });
    }
    const slug = path.startsWith("/blog/") ? decodeURIComponent(path.slice("/blog/".length)) : "";
    if (slug && !slug.includes("/") && !(await postExists(slug))) return NextResponse.rewrite(new URL("/404", req.url));
  } catch {
    // database down or a malformed address: let the request through
  }
  return NextResponse.next();
}

export const config = { matcher: "/((?!api/|admin|_next/|.*\\..*).*)" };
