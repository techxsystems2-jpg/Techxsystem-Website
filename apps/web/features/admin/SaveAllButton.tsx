"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { DatabaseZap, Loader2 } from "lucide-react";
import { saveAllToStore } from "@/app/admin/content-actions";
import { Button } from "./ui/button";

/** Admin overview: copies every section that isn't saved yet from the built-in content into the database
    (owner, 2026-11-03). Never overwrites saved content, so it's safe to press again. */
export function SaveAllButton({ missing }: { missing: number }) {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const router = useRouter();
  const run = () => start(async () => {
    const r = await saveAllToStore();
    setMsg(r.ok ? { ok: true, text: r.written?.length ? `Saved ${r.written.length} section${r.written.length === 1 ? "" : "s"} to the database.` : "Everything was already in the database." } : { ok: false, text: r.error });
    if (r.ok) router.refresh();
  });
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-card p-4 shadow-xs">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{missing} section{missing === 1 ? "" : "s"} still use the built-in content</p>
        <p className="text-sm text-muted-foreground">Save them to the database so every record (services, prices, questions…) lives there. Saved sections are never overwritten.</p>
      </div>
      <Button size="sm" onClick={run} disabled={pending}>{pending ? <Loader2 className="animate-spin" /> : <DatabaseZap />}Save everything to the database</Button>
      {msg && <p role="status" className={`w-full text-sm ${msg.ok ? "text-emerald-700" : "text-destructive"}`}>{msg.text}</p>}
    </div>
  );
}
