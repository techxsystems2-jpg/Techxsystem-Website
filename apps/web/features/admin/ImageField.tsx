"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { uploadImage } from "@/app/admin/content-actions";

/* Photo fields for the admin panel (owner, 2026-11-03). The browser shrinks every photo before it's sent: WebP, at
   most 2400 px on the long side, quality 0.85. That keeps uploads small (well under the 4 MB action limit and
   Vercel's request limit), and the site loads them faster. The server checks the bytes again (lib/server/media.ts). */

const MAX_SIDE = 2400;

async function shrink(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) throw new Error("That file isn't a photo.");
  const bmp = await createImageBitmap(file);
  const k = Math.min(1, MAX_SIDE / Math.max(bmp.width, bmp.height));
  const w = Math.round(bmp.width * k), h = Math.round(bmp.height * k);
  const canvas = new OffscreenCanvas(w, h);
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, w, h);
  bmp.close();
  const blob = await canvas.convertToBlob({ type: "image/webp", quality: 0.85 });
  return new File([blob], file.name.replace(/\.\w+$/, "") + ".webp", { type: "image/webp" });
}

export async function send(file: File, folder: string) {
  const form = new FormData();
  form.set("file", await shrink(file));
  form.set("folder", folder);
  const r = await uploadImage(form);
  if (!r.ok) throw new Error(r.error);
  return r.url!;
}

/** One photo: preview, replace, remove. */
export function ImageField({ value, onChange, folder }: { value: string; onChange: (url: string) => void; folder: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const pick = async (file?: File) => {
    if (!file) return;
    setBusy(true); setErr("");
    try { onChange(await send(file, folder)); } catch (e) { setErr(e instanceof Error ? e.message : "Upload failed."); }
    setBusy(false);
  };
  return (
    <div className="grid max-w-[360px] gap-2">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg border bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element -- admin preview of an arbitrary uploaded URL */}
        {value ? <img src={value} alt="" className="size-full object-cover" /> : <button type="button" onClick={() => ref.current?.click()} className="grid size-full place-items-center content-center gap-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"><ImagePlus className="size-5" />Upload a photo</button>}
        {busy && <span className="absolute inset-0 flex items-center justify-center gap-2 bg-background/80 text-sm font-medium"><Loader2 className="size-4 animate-spin" />Uploading…</span>}
      </div>
      <div className="flex flex-wrap gap-1.5">
        <Button variant="outline" size="sm" onClick={() => ref.current?.click()} disabled={busy}>{value ? "Replace" : "Upload photo"}</Button>
        {value && <Button variant="ghost" size="sm" onClick={() => onChange("")} disabled={busy}>Remove</Button>}
      </div>
      {err && <p role="alert" className="text-xs text-destructive">{err}</p>}
      <input ref={ref} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => { pick(e.target.files?.[0]); e.target.value = ""; }} />
    </div>
  );
}

/** Several photos at once (the Work gallery): uploads them one after another, then adds them in the order picked. */
export function MultiUpload({ folder, onUploaded }: { folder: string; onUploaded: (urls: string[]) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<{ done: number; total: number } | null>(null);
  const [err, setErr] = useState("");
  const run = async (files: File[]) => {
    if (!files.length) return;
    setErr(""); setState({ done: 0, total: files.length });
    const urls: string[] = [];
    for (const f of files) {
      try { urls.push(await send(f, folder)); } catch (e) { setErr(`${f.name}: ${e instanceof Error ? e.message : "upload failed"}`); }
      setState((s) => (s ? { ...s, done: s.done + 1 } : s));
    }
    setState(null);
    if (urls.length) onUploaded(urls);
  };
  return (
    <div className="grid justify-items-start gap-2">
      <Button variant="outline" size="sm" onClick={() => ref.current?.click()} disabled={!!state}>
        {state ? <><Loader2 className="animate-spin" />Uploading {state.done + 1} of {state.total}…</> : <><ImagePlus />Add photos</>}
      </Button>
      <p className="text-xs text-muted-foreground">New photos go to the end. Pick a category for each, then Save.</p>
      {err && <p role="alert" className="text-xs text-destructive">{err}</p>}
      <input ref={ref} type="file" multiple accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => { run([...(e.target.files ?? [])]); e.target.value = ""; }} />
    </div>
  );
}
