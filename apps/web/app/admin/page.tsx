import { Suspense, type ReactNode } from "react";
import type { Metadata } from "next";
import { buttonClass } from "@techx/ui/Button";
import { Eyebrow } from "@techx/ui/Eyebrow";
import { adminConfigured, isAdmin } from "@/lib/server/admin";
import { dropboxConfigured } from "@/lib/server/dropbox";
import { gdriveConfigured } from "@/lib/server/gdrive";
import { getSettings, settingsStoreKind, type Destination } from "@/lib/server/upload-settings";
import { disconnect, login, logout, save } from "./actions";

/* /admin: where free-trial uploads land (owner, 2026-11-02). The admin signs in, connects Dropbox and/or Google Drive,
   picks one as the destination and names the top folder. Not linked from the site, not indexed. Setup: docs/uploads.md. */
export const metadata: Metadata = { title: "Admin · Uploads", robots: { index: false, follow: false } };

const messages: Record<string, string> = {
  saved: "Saved. New uploads go to the destination below.",
  "dropbox-connected": "Dropbox connected.",
  "gdrive-connected": "Google Drive connected.",
  disconnected: "Disconnected.",
  "connect-failed": "Couldn't connect. Check the app keys and the redirect URL (docs/uploads.md), then try again.",
  "connect-first": "Connect that account before choosing it.",
  "pick-one": "Choose a destination.",
  "bad-password": "That password isn't right.",
};

export default function Admin({ searchParams }: PageProps<"/admin">) {
  return (
    <section className="wrap max-w-[760px] pb-10 pt-28 md:pt-36">
      <Eyebrow>Admin</Eyebrow>
      <h1 className="mt-4 text-h2">Free-trial uploads</h1>
      <Suspense fallback={<div className="mt-8 h-64 animate-pulse rounded-card bg-sunk" />}>
        <Body searchParams={searchParams} />
      </Suspense>
    </section>
  );
}

async function Body({ searchParams }: { searchParams: PageProps<"/admin">["searchParams"] }) {
  const status = (await searchParams).status;
  const note = typeof status === "string" ? messages[status] : undefined;

  if (!adminConfigured()) {
    return <Panel><p className="text-ink-2">Set <Code>ADMIN_PASSWORD</Code> and <Code>APP_SECRET</Code> in the environment to turn this page on (see <Code>.env.example</Code> and <Code>docs/uploads.md</Code>).</p></Panel>;
  }
  if (!(await isAdmin())) {
    return (
      <Panel>
        {note && <Note>{note}</Note>}
        <form action={login} className="grid gap-4 sm:max-w-[360px]">
          <label className="text-small font-medium">Password
            <input name="password" type="password" required autoComplete="current-password" className={input} />
          </label>
          <button type="submit" className={buttonClass("primary", "justify-self-start")}>Sign in</button>
        </form>
      </Panel>
    );
  }

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
      {!dev && settingsStoreKind() === "file" && (
        <Note warn>Settings can&rsquo;t be saved on this host. Add <Code>UPSTASH_REDIS_REST_URL</Code> and <Code>UPSTASH_REDIS_REST_TOKEN</Code> (docs/uploads.md).</Note>
      )}
      {!s.destination && <Note warn>No destination yet: the free-trial form can&rsquo;t take uploads until one is chosen.</Note>}

      <form action={save}>
        <Panel>
          <p className="mb-2.5 font-mono text-label uppercase text-ink-2">Where uploads land</p>
          <div className="grid gap-3">
            {options.map((o) => (
              <label key={o.id} className="flex cursor-pointer items-start gap-3.5 rounded-inner p-4 ring-1 ring-line has-[:checked]:bg-blue-tint/50 has-[:checked]:ring-2 has-[:checked]:ring-blue">
                <input type="radio" name="destination" value={o.id} defaultChecked={s.destination === o.id} disabled={!o.ready} className="mt-1 accent-[var(--color-blue)]" />
                <span className="grid flex-1 gap-1">
                  <span className="font-medium">{o.name}</span>
                  <span className="text-small text-ink-2">{o.line}</span>
                  <span className="text-small">
                    {o.id === "local" ? null : o.ready ? <span className="text-green">Connected as {o.account}</span>
                      : o.configured ? <span className="text-ink-2">Not connected</span>
                      : <span className="text-warning">Add {o.env} to the environment first</span>}
                  </span>
                </span>
                {o.id !== "local" && o.configured && (o.ready
                  ? <button type="submit" formAction={disconnect} name="provider" value={o.id} className={buttonClass("ghost", "", "sm")}>Disconnect</button>
                  : <a href={`/api/admin/oauth/${o.id}`} className={buttonClass("secondary", "", "sm")}>Connect</a>)}
              </label>
            ))}
          </div>
          <label className="mt-6 block text-small font-medium">Top folder name
            <input name="folder" defaultValue={s.folder} maxLength={80} className={input} />
            <span className="mt-1.5 block font-normal text-ink-2">Each trial gets its own folder inside it: date, name, studio. With &ldquo;Trial details.txt&rdquo; and an upload report.</span>
          </label>
          <button type="submit" className={buttonClass("primary", "mt-6")}>Save</button>
        </Panel>
      </form>
      <form action={logout} className="mt-4"><button type="submit" className={buttonClass("ghost", "-ml-3", "sm")}>Sign out</button></form>
    </>
  );
}

const input = "mt-2 block w-full rounded-input bg-surface px-3.5 py-3 text-[16px] font-normal text-ink outline-none ring-1 ring-line-2 focus:ring-2 focus:ring-blue";
const Panel = ({ children }: { children: ReactNode }) => <div className="mt-8 rounded-card bg-surface p-5 shadow-hair md:p-7">{children}</div>;
const Code = ({ children }: { children: ReactNode }) => <code className="rounded bg-sunk px-1 py-0.5 font-mono text-[13px]">{children}</code>;
const Note = ({ children, warn = false }: { children: ReactNode; warn?: boolean }) => (
  <p role="status" className={`mt-6 rounded-inner px-4 py-3 text-small ${warn ? "bg-[#FFF6E5] text-[#7A4B00]" : "bg-blue-tint text-ink"}`}>{children}</p>
);
