import { notFound } from "next/navigation";
import { isAdmin } from "@/lib/server/admin";
import { Editor } from "@/features/admin/Editor";
import { Badge } from "@/features/admin/ui/badge";
import { sectionOf } from "@/lib/content/fields";
import { getContent } from "@/lib/content";
import { versionOf } from "@/lib/server/content-store";

/* One editable section of the website (owner, 2026-11-03). The form is drawn from lib/content/fields.ts.
   Security (pre-launch audit, 2026-11-03): the page checks the session itself before it reads anything. It used to be
   prerendered at build time, and the prebuilt page (with drafts and settings in it) was served to anyone; the layout's
   sign-in screen only hid it in the browser. Now it renders per request and carries no data without a session. */
export default async function AdminSection({ params }: PageProps<"/admin/[section]">) {
  if (!(await isAdmin())) return null; // the layout shows the sign-in card
  const section = sectionOf((await params).section);
  if (!section) notFound();
  const value = await getContent(section.key);
  // photo and service forms pick from the categories saved in the admin (Work categories), not a fixed list
  const sources = section.key === "work" || section.key === "services"
    ? { categories: (await getContent("categories")).map((c) => ({ value: c.key, label: c.label })) } : undefined;
  return (
    <div className="mx-auto max-w-[1240px]">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">{section.title}</h1>
        <p className="max-w-[680px] text-sm text-muted-foreground">{section.blurb}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">{section.pages.map((p) => <Badge key={p} variant="outline" className="font-normal text-muted-foreground">{p}</Badge>)}</div>
      </div>
      <div className="mt-6"><Editor sectionKey={section.key} initial={value} version={versionOf(value)} sources={sources} /></div>
    </div>
  );
}
