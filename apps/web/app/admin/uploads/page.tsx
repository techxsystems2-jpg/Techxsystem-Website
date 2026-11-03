import { Suspense, type ReactNode } from "react";
import type { Metadata } from "next";
import { buttonVariants } from "@/features/admin/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/features/admin/ui/card";
import { Input, Label } from "@/features/admin/ui/input";
import { Skeleton } from "@/features/admin/ui/skeleton";
import { isAdmin } from "@/lib/server/admin";
import { dropboxConfigured } from "@/lib/server/dropbox";
import { gdriveConfigured } from "@/lib/server/gdrive";
import { getSettings, settingsStoreKind, type Destination } from "@/lib/server/upload-settings";
import { disconnect, save } from "../actions";

/* /admin/uploads: where free-trial uploads land (owner, 2026-11-02). The admin signs in, connects Dropbox and/or Google Drive,
   picks one as the destination and names the top folder. Not linked from the site, not indexed. Setup: docs/uploads.md. */
export const metadata: Metadata = { title: "Free-trial uploads", robots: { index: false, follow: false } };

const messages: Record<string, string> = {
  saved: "Saved. New uploads go to the destination below.",
  "dropbox-connected": "Dropbox connected.",
  "gdrive-connected": "Google Drive connected.",
  disconnected: "Disconnected.",
  "connect-failed": "Couldn't connect. Check the app keys and the redirect URL (docs/uploads.md), then try again.",
  "connect-first": "Connect that account before choosing it.",
  "pick-one": "Choose a destination.",
};

export default function Admin({ searchParams }: PageProps<"/admin/uploads">) {
  return (
    <section className="mx-auto max-w-[1240px]"><div className="max-w-[760px]">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Free-trial uploads</h1>
        <p className="text-sm text-muted-foreground">Where files from the free-trial form land.</p>
      </div>
      <Suspense fallback={<div className="mt-6 grid gap-4 rounded-xl border bg-card p-6 shadow-xs"><Skeleton className="h-5 w-40" /><Skeleton className="h-20 w-full" /><Skeleton className="h-20 w-full" /><Skeleton className="h-9 w-full" /></div>}>
        <Body searchParams={searchParams} />
      </Suspense>
    </div></section>
  );
}

async function Body({ searchParams }: { searchParams: PageProps<"/admin/uploads">["searchParams"] }) {
  if (!(await isAdmin())) return null; // no settings in the page without a session (security audit, 2026-11-03)
  const status = (await searchParams).status;
  const note = typeof status === "string" ? messages[status] : undefined;

  const s = await getSettings();
  const dev = process.env.NODE_ENV !== "production";
  const options: { id: Destination; name: string; line: string; ready: boolean; account?: string; configured: boolean; env?: string }[] = [
    { id: "dropbox", name: "Dropbox", line: "Files land in Apps / <your app name> / <folder> in the connected Dropbox.", ready: !!s.dropbox, account: s.dropbox?.account, configured: dropboxConfigured(), env: "DROPBOX_APP_KEY, DROPBOX_APP_SECRET" },
    { id: "gdrive", name: "Google Drive", line: "Files land in My Drive / <folder> of the connected Google account.", ready: !!s.gdrive, account: s.gdrive?.account, configured: gdriveConfigured(), env: "GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET" },
    ...(dev ? [{ id: "local" as const, name: "This computer (development only)", line: "Files land in apps/web/.uploads. For trying the form without any keys.", ready: true, configured: true }] : []),
  ];

  return (
    <>
      {note && <Note>{note}</Note>}
      {process.env.VERCEL && settingsStoreKind() === "file" && (
        <Note warn>Settings can&rsquo;t be saved on this host. Add <Code>DATABASE_URL</Code> (your PostgreSQL link) to the environment (docs/admin.md).</Note>
      )}
      {!s.destination && <Note warn>No destination yet: the free-trial form can&rsquo;t take uploads until one is chosen.</Note>}

      <form action={save}>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Where uploads land</CardTitle>
            <CardDescription>Connect an account, choose it, and name the folder.</CardDescription>
          </CardHeader>
          <CardContent>
          <div className="grid gap-3">
            {options.map((o) => (
              <label key={o.id} className="flex cursor-pointer items-start gap-3.5 rounded-lg border p-4 transition-colors hover:bg-muted/40 has-[:checked]:border-primary has-[:checked]:bg-muted/60">
                <input type="radio" name="destination" value={o.id} defaultChecked={s.destination === o.id} disabled={!o.ready} className="mt-1 accent-[var(--primary)]" />
                <span className="grid flex-1 gap-1">
                  <span className="text-sm font-medium">{o.name}</span>
                  <span className="text-sm text-muted-foreground">{o.line}</span>
                  <span className="text-xs">
                    {o.id === "local" ? null : o.ready ? <span className="text-emerald-700">Connected as {o.account}</span>
                      : o.configured ? <span className="text-muted-foreground">Not connected</span>
                      : <span className="text-amber-700">Add {o.env} to the environment first</span>}
                  </span>
                </span>
                {o.id !== "local" && o.configured && (o.ready
                  ? <button type="submit" formAction={disconnect} name="provider" value={o.id} className={buttonVariants({ variant: "ghost", size: "sm" })}>Disconnect</button>
                  : <a href={`/api/admin/oauth/${o.id}`} className={buttonVariants({ variant: "outline", size: "sm" })}>Connect</a>)}
              </label>
            ))}
          </div>
          <label className="mt-6 grid gap-2">
            <Label>Top folder name</Label>
            <Input name="folder" defaultValue={s.folder} maxLength={80} />
            <span className="text-xs text-muted-foreground">Each trial gets its own folder inside it: date, name, studio. With &ldquo;Trial details.txt&rdquo; and an upload report.</span>
          </label>
          <button type="submit" className={buttonVariants({ className: "mt-6" })}>Save</button>
          </CardContent>
        </Card>
      </form>
    </>
  );
}

const Code = ({ children }: { children: ReactNode }) => <code className="rounded bg-muted px-1 py-0.5 font-mono text-[13px]">{children}</code>;
const Note = ({ children, warn = false }: { children: ReactNode; warn?: boolean }) => (
  <p role="status" className={`mt-6 rounded-lg border px-4 py-3 text-sm ${warn ? "border-amber-200 bg-amber-50 text-amber-900" : "bg-muted/60 text-foreground"}`}>{children}</p>
);
