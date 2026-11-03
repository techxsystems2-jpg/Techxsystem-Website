import { Suspense } from "react";
import type { Metadata } from "next";
import { Badge } from "@/features/admin/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/features/admin/ui/card";
import { Skeleton } from "@/features/admin/ui/skeleton";
import { isAdmin } from "@/lib/server/admin";
import { listContacts } from "@/lib/server/contacts";

/* Contact list (owner, 2026-11-04): everyone who sent a contact message or a free-trial request, newest first.
   Read-only. Rows come from lib/server/contacts.ts; times are shown in India time, the studio's clock. */
export const metadata: Metadata = { title: "Contact list" };

const when = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" });

export default function Contacts() {
  return (
    <section className="mx-auto max-w-[1240px]">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Contact list</h1>
        <p className="max-w-[680px] text-sm text-muted-foreground">Everyone who sent a contact message or a free-trial request, newest first. Times are India time.</p>
      </div>
      <Suspense fallback={<div className="mt-6 grid gap-3 rounded-xl border bg-card p-6 shadow-xs">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-full" />)}</div>}>
        <Body />
      </Suspense>
    </section>
  );
}

async function Body() {
  if (!(await isAdmin())) return null; // no visitor details in the page without a session
  const rows = await listContacts();
  if (rows === null) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>The contact list isn&rsquo;t set up yet</CardTitle>
          <CardDescription>In <code>apps/web</code>, run <code>npm run db:setup</code> once. It adds the contacts table to your database; new form submissions appear here from then on.</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  if (!rows.length) {
    return <Card className="mt-6"><CardContent className="py-10 text-center text-sm text-muted-foreground">No one has filled in a form yet. Contact messages and free-trial requests appear here.</CardContent></Card>;
  }
  const people = new Set(rows.map((r) => r.email.toLowerCase())).size;
  return (
    <div className="mt-6 grid gap-3">
      <p className="text-sm text-muted-foreground tabular-nums">{rows.length} {rows.length === 1 ? "submission" : "submissions"} from {people} {people === 1 ? "person" : "people"}</p>
      <Card className="gap-0 overflow-hidden py-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b bg-muted/40 text-xs text-muted-foreground">
              <tr>
                <th scope="col" className="px-4 py-2.5 font-medium">Received</th>
                <th scope="col" className="px-4 py-2.5 font-medium">From</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Email</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.map((r) => (
                <tr key={r.id} className="align-top">
                  <td className="whitespace-nowrap px-4 py-3">
                    <Badge variant={r.kind === "trial" ? "default" : "secondary"}>{r.kind === "trial" ? "Free trial" : "Message"}</Badge>
                    <span className="mt-1.5 block text-xs text-muted-foreground tabular-nums">{when.format(new Date(r.at))}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="block font-medium">{r.name}</span>
                    {r.studio && <span className="block text-xs text-muted-foreground">{r.studio}</span>}
                  </td>
                  <td className="px-4 py-3"><a href={`mailto:${r.email}`} className="break-all text-primary underline-offset-4 hover:underline">{r.email}</a></td>
                  <td className="max-w-[420px] px-4 py-3 text-muted-foreground">
                    {r.kind === "trial" && (
                      <span className="mb-1 block text-xs text-foreground tabular-nums">
                        {r.files} {r.files === 1 ? "file" : "files"}{r.volume && ` · ${r.volume} photos a month`}
                        {r.link.startsWith("https://") && <> · <a href={r.link} target="_blank" rel="noopener noreferrer" className="text-primary underline-offset-4 hover:underline">shared link</a></>}
                      </span>
                    )}
                    {r.message && <span className="line-clamp-3 whitespace-pre-line">{r.message}</span>}
                    {r.folder && <span className="mt-1 block text-xs">Folder: {r.folder}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
