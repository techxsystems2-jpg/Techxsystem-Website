import Link from "next/link";
import { ArrowUpRight, CheckCircle2, CircleAlert, FileText, HardDrive, Images, Layers, Quote, Upload } from "lucide-react";
import { SECTIONS } from "@/lib/content/fields";
import { getContent } from "@/lib/content";
import { savedSections } from "@/lib/server/content-store";
import { storeKind } from "@/lib/server/kv";
import { isAdmin } from "@/lib/server/admin";
import { mediaStoreKind } from "@/lib/server/media";
import { Badge } from "@/features/admin/ui/badge";
import { SaveAllButton } from "@/features/admin/SaveAllButton";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/features/admin/ui/card";

/* Admin overview (owner, 2026-11-03), a shadcn/ui dashboard: what's on the site at a glance, every section that can
   be edited (with Original / Edited), and where saves and photos are stored. Numbers are counted from the live
   content, never invented. */
export default async function AdminHome() {
  if (!(await isAdmin())) return null; // checked here too: the page must carry no data without a session (security audit)
  const [edited, services, work, quotes, posts] = await Promise.all([
    savedSections(SECTIONS.map((s) => s.key)).then((m) => SECTIONS.map((s) => !!m[s.key])).catch(() => SECTIONS.map(() => false)),
    getContent("services"), getContent("work"), getContent("testimonials"), getContent("blog"),
  ]);
  const published = posts.filter((p) => p.published).length;
  const onVercel = !!process.env.VERCEL;
  const store = storeKind(), media = mediaStoreKind();
  const unsaved = SECTIONS.filter((s, i) => s.key !== "blog" && !edited[i]).length;
  const ready = !onVercel || (store !== "file" && media !== "local");

  const stats = [
    { label: "Services", value: services.length, note: "Each with its own page", href: "/admin/services", Icon: Layers },
    { label: "Work photos", value: work.length, note: "In the gallery", href: "/admin/work", Icon: Images },
    { label: "Testimonials", value: quotes.length, note: "Real client quotes", href: "/admin/testimonials", Icon: Quote },
    { label: "Blog posts", value: posts.length, note: `${published} published · ${posts.length - published} draft${posts.length - published === 1 ? "" : "s"}`, href: "/admin/blog", Icon: FileText },
  ];

  return (
    <div className="mx-auto grid max-w-[1240px] gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">Edit any part of the website. Changes go live a few seconds after you save; no redeploy needed.</p>
      </div>

      {onVercel && !ready && (
        <div role="status" className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <CircleAlert className="mt-0.5 size-4 shrink-0" />
          <p>
            {store === "file" && <>Saves can&rsquo;t be stored on this host yet: add <Code>DATABASE_URL</Code> (your PostgreSQL link) and redeploy. </>}
            {media === "local" && <>Photos can&rsquo;t be uploaded yet: add a Vercel Blob store (<Code>BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN</Code>).</>}
          </p>
        </div>
      )}

      {/* an empty blog is a real state, so it doesn't count as "not saved" */}
      {store === "postgres" && unsaved > 0 && <SaveAllButton missing={unsaved} />}

      {/* at a glance */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, note, href, Icon }) => (
          <Link key={label} href={href} className="group rounded-xl outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50" data-slot="stat">
            <Card className="h-full bg-gradient-to-t from-muted/60 to-card transition-shadow group-hover:shadow-md">
              <CardHeader>
                <CardDescription>{label}</CardDescription>
                <CardTitle className="text-3xl font-semibold tabular-nums">{value}</CardTitle>
                <CardAction><span className="flex size-8 items-center justify-center rounded-md border bg-background text-muted-foreground"><Icon className="size-4" /></span></CardAction>
              </CardHeader>
              <CardFooter className="text-sm text-muted-foreground">{note}</CardFooter>
            </Card>
          </Link>
        ))}
      </div>

      {/* sections */}
      <div className="grid gap-4">
        <h2 className="text-base font-semibold">Sections</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {SECTIONS.map((s, i) => (
            <Link key={s.key} href={`/admin/${s.key}`} className="group rounded-xl outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50" data-slot="section-card">
              <Card className="h-full gap-4 transition-[box-shadow,border-color] group-hover:border-ring/60 group-hover:shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-1.5">{s.title}<ArrowUpRight className="size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" /></CardTitle>
                  <CardAction><Badge variant={edited[i] ? "default" : "secondary"}>{edited[i] ? "Edited" : "Original"}</Badge></CardAction>
                  <CardDescription className="line-clamp-2">{s.blurb}</CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto text-xs text-muted-foreground">{s.pages.join(" · ")}</CardFooter>
              </Card>
            </Link>
          ))}
          <Link href="/admin/uploads" className="group rounded-xl outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50" data-slot="section-card">
            <Card className="h-full gap-4 transition-[box-shadow,border-color] group-hover:border-ring/60 group-hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-1.5">Free-trial uploads<ArrowUpRight className="size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" /></CardTitle>
                <CardAction><span className="flex size-6 items-center justify-center text-muted-foreground"><Upload className="size-4" /></span></CardAction>
                <CardDescription>Where files from the free-trial form land: Dropbox or Google Drive.</CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto text-xs text-muted-foreground">Free trial</CardFooter>
            </Card>
          </Link>
        </div>
      </div>

      {/* storage */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        <span className="flex items-center gap-2"><HardDrive className="size-4" /> Saves: <span className="text-foreground">{store === "postgres" ? "PostgreSQL" : store === "redis" ? "Upstash" : "this computer (.data)"}</span></span>
        <span className="flex items-center gap-2"><Images className="size-4" /> Photos: <span className="text-foreground">{media === "blob" ? "Vercel Blob" : "this computer (public/uploads)"}</span></span>
        {ready && <span className="flex items-center gap-2 text-emerald-700"><CheckCircle2 className="size-4" /> Ready</span>}
      </div>
    </div>
  );
}

const Code = ({ children }: { children: React.ReactNode }) => <code className="rounded bg-white/60 px-1 font-mono text-[12.5px]">{children}</code>;
