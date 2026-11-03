"use client";

import { useCallback, useEffect, useId, useRef, useState, useTransition, type ReactNode } from "react";
import { ArrowDown, ArrowUp, Check, ChevronLeft, ChevronRight, Plus, RotateCcw, Trash2, X } from "lucide-react";
import { resetContent, saveContent } from "@/app/admin/content-actions";
import { sectionOf, type Field } from "@/lib/content/fields";
import { ImageField, MultiUpload } from "./ImageField";
import { PostEditor } from "./PostEditor";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input, Label, NativeSelect, Textarea } from "./ui/input";
import { Switch } from "./ui/switch";
import { cn } from "./ui/utils";

/* The admin panel's form for one content section (owner, 2026-11-03), in the shadcn/ui dashboard style. Rendered
   from the section's field description (lib/content/fields.ts): text, long text, numbers, switches, one-item-per-line
   lists, photos, choices, groups and reorderable lists. Saving sends the whole value; the server shapes it to the same
   description, stores it and refreshes the live pages. Everything autosaves 1.5 s after the last change (⌘S saves at
   once); the bar at the foot says whether it's saving, saved or failed (with Retry). */

type V = unknown;
type Rec = Record<string, unknown>;

export function Editor({ sectionKey, initial }: { sectionKey: string; initial: V }) {
  const section = sectionOf(sectionKey)!;
  const [value, setValue] = useState<V>(initial);
  const [saved, setSaved] = useState<V>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [resetting, startReset] = useTransition();
  const dirty = JSON.stringify(value) !== JSON.stringify(saved);

  // Autosave (owner, 2026-11-03: "everything should autosave in the database"): 1.5 s after the last change the
  // current value is saved; one save at a time, and changes made while a save is running are saved right after it.
  const latest = useRef(value);
  // every edit goes through here: the latest value for the next save, and a fresh try after a failed one
  const edit = useCallback((v: V) => { latest.current = v; setValue(v); setError(null); }, []);
  const running = useRef(false);
  const again = useRef(false);
  const saveNow = useCallback(async () => {
    if (running.current) { again.current = true; return; }
    running.current = true;
    setSaving(true);
    try {
      do {
        again.current = false;
        const snapshot = latest.current;
        const r = await saveContent(sectionKey, snapshot);
        if (r.ok) { setSaved(snapshot); setSavedAt(new Date()); setError(null); }
        else { setError(r.error); break; }
      } while (again.current);
    } finally {
      running.current = false;
      setSaving(false);
    }
  }, [sectionKey]);

  useEffect(() => {
    if (!dirty || error) return; // after an error, wait for Retry (or the next edit clears it below)
    const t = setTimeout(() => { void saveNow(); }, 1500);
    return () => clearTimeout(t);
  }, [value, dirty, error, saveNow]);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") { e.preventDefault(); if (dirty) void saveNow(); }
    };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  }, [dirty, saveNow]);

  useEffect(() => {
    if (!dirty && !saving) return;
    // closing the tab mid-edit still warns; moving around the admin saves first (the save finishes in the background)
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    const leave = (e: MouseEvent) => {
      const a = (e.target as Element).closest?.("a[href]") as HTMLAnchorElement | null;
      if (a && a.target !== "_blank" && dirty) void saveNow();
    };
    addEventListener("beforeunload", warn);
    document.addEventListener("click", leave, true);
    return () => { removeEventListener("beforeunload", warn); document.removeEventListener("click", leave, true); };
  }, [dirty, saving, saveNow]);

  const reset = () => {
    if (!confirm(`Put "${section.title}" back to how the site shipped? Your edits here will be replaced.`)) return;
    startReset(async () => {
      const r = await resetContent(sectionKey);
      if (r.ok) location.reload();
      else setError(r.error);
    });
  };

  const time = savedAt?.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const status = error ? error : saving ? "Saving…" : dirty ? "Unsaved changes" : savedAt ? `Saved at ${time}. The website shows it within a few seconds.` : "All changes saved";
  const dot = error ? "bg-destructive" : saving || dirty ? "animate-pulse bg-amber-500" : "bg-emerald-500";

  return (
    <div className="pb-24 md:pb-0">
      <FieldView field={section.field} value={value} onChange={edit} path={sectionKey} top />
      <div className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-1 border-t pt-5 text-sm text-muted-foreground">
        Want this section as the site first shipped?
        <Button variant="link" size="sm" onClick={reset} disabled={resetting || saving} className="h-auto px-0 text-foreground"><RotateCcw /> Reset to original</Button>
      </div>
      {/* status bar: fixed on phones, sticky to the bottom of the inset panel from md. Saving is automatic. */}
      <div className="fixed inset-x-0 bottom-0 z-30 md:sticky md:-mx-4 md:mt-8 md:-mb-6 lg:-mx-8 lg:-mb-8">
        <div className="flex flex-wrap items-center gap-3 border-t bg-background/90 px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] backdrop-blur md:rounded-b-xl md:px-4 lg:px-8">
          <span role="status" aria-live="polite" className={cn("flex min-w-0 items-center gap-2 text-sm", error ? "text-destructive" : savedAt && !dirty && !saving ? "text-emerald-700" : "text-muted-foreground")}>
            <span aria-hidden="true" className={cn("size-2 shrink-0 rounded-full", dot)} />
            <span className="truncate">{status}</span>
          </span>
          <span className="ml-auto flex items-center gap-2">
            {error ? <Button size="sm" onClick={() => { setError(null); void saveNow(); }}><Check /> Retry</Button>
              : <span className="hidden text-xs text-muted-foreground md:inline">Saves automatically · <kbd className="rounded border px-1 font-mono text-[11px]">⌘S</kbd> to save now</span>}
          </span>
        </div>
      </div>
    </div>
  );
}

function FieldView({ field, value, onChange, path, top = false }: { field: Field; value: V; onChange: (v: V) => void; path: string; top?: boolean }) {
  switch (field.type) {
    case "text":
      return <Input value={String(value ?? "")} maxLength={field.max} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} className={field.big ? "h-12 text-xl font-semibold tracking-tight md:text-2xl" : undefined} />;
    case "textarea":
      if (field.rich) return <PostEditor value={String(value ?? "")} onChange={onChange} max={field.max} />;
      return <Textarea value={String(value ?? "")} maxLength={field.max} rows={field.rows ?? 3} onChange={(e) => onChange(e.target.value)} className="leading-relaxed" />;
    case "number":
      return <Input type="number" value={Number(value ?? 0)} min={field.min} max={field.max} step={field.step} onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))} className="tabular-nums" />;
    case "toggle":
      return (
        <span className="flex min-h-9 items-center gap-3 text-sm">
          <Switch checked={!!value} onCheckedChange={(v) => onChange(v)} />
          <span className="text-muted-foreground">{value ? "On" : "Off"}</span>
        </span>
      );
    case "lines": {
      const lines = Array.isArray(value) ? (value as string[]) : [];
      return <Textarea value={lines.join("\n")} rows={Math.min(12, Math.max(3, lines.length + 1))} onChange={(e) => onChange(e.target.value.split("\n"))} className="leading-relaxed" />;
    }
    case "image":
      return <ImageField value={String(value ?? "")} onChange={onChange} folder={path.split(".")[0] ?? "misc"} />;
    case "multi": {
      const on = Array.isArray(value) ? (value as string[]) : [];
      return (
        <div className="flex flex-wrap gap-1.5">
          {field.options.map((o) => {
            const checked = on.includes(o.value);
            return (
              <Button key={o.value} type="button" size="sm" variant={checked ? "default" : "outline"} aria-pressed={checked}
                onClick={() => onChange(checked ? on.filter((v) => v !== o.value) : [...on, o.value])}>
                {checked && <Check />}{o.label}
              </Button>
            );
          })}
        </div>
      );
    }
    case "select":
      return (
        <NativeSelect value={String(value ?? "")} onChange={(e) => onChange(e.target.value)}>
          {field.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </NativeSelect>
      );
    case "object": {
      const obj = (value ?? {}) as Rec;
      const one = (f: (typeof field.fields)[number], cards: boolean) => {
        const child = <FieldView field={f.field} value={obj[f.key]} onChange={(v) => onChange({ ...obj, [f.key]: v })} path={`${path}.${f.key}`} />;
        const group = f.field.type === "object" || f.field.type === "list";
        if (group && field.fold) {
          // many groups (one per page): closed by default, each says whether it's been customised
          const filled = Object.values((obj[f.key] ?? {}) as Rec).filter((v) => v !== "" && v !== false && v != null && !(Array.isArray(v) && !v.length)).length;
          return (
            <details key={f.key} className="group rounded-xl border bg-card shadow-xs">
              <summary className="flex min-h-14 cursor-pointer list-none items-center gap-3 rounded-xl px-5 py-3 transition-colors hover:bg-muted/50 [&::-webkit-details-marker]:hidden">
                <ChevronRight className="size-4 text-muted-foreground transition-transform duration-200 group-open:rotate-90" />
                <span className="flex-1 text-sm font-medium">{f.label}</span>
                <Badge variant={filled ? "default" : "secondary"}>{filled ? "Custom" : "Built-in"}</Badge>
              </summary>
              <div className="border-t px-5 pt-5 pb-6">{child}</div>
            </details>
          );
        }
        if (group && cards) {
          return (
            <Card key={f.key} className="gap-5">
              <CardHeader>
                <CardTitle>{f.label}</CardTitle>
                {f.help && <CardDescription>{f.help}</CardDescription>}
              </CardHeader>
              <CardContent>{child}</CardContent>
            </Card>
          );
        }
        if (group) {
          return (
            <fieldset key={f.key} className="grid gap-4 rounded-lg border bg-muted/40 p-4">
              <legend className="float-left mb-1 w-full text-sm font-medium">{f.label}</legend>
              {f.help && <p className="clear-both -mt-2 text-sm text-muted-foreground">{f.help}</p>}
              <div className="clear-both">{child}</div>
            </fieldset>
          );
        }
        return <Labeled key={f.key} label={f.label} help={f.help} wrap={["text", "textarea", "number", "select", "lines"].includes(f.field.type) && !(f.field.type === "textarea" && f.field.rich)}>{child}</Labeled>;
      };
      // short fields (prices, years, numbers, choices) sit side by side instead of each taking a full row
      const draw = (fields: typeof field.fields, cards: boolean) => {
        const out: ReactNode[] = [];
        let run: typeof field.fields = [];
        const flush = () => {
          if (run.length) {
            const row = <div key={`row-${run[0]!.key}`} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{run.map((f) => one(f, false))}</div>;
            out.push(cards ? <Card key={`card-${run[0]!.key}`}><CardContent>{row}</CardContent></Card> : row);
          }
          run = [];
        };
        for (const f of fields) {
          if (isShort(f.field)) { run.push(f); continue; }
          flush();
          const loose = cards && f.field.type !== "object" && f.field.type !== "list"; // a single field at the top gets a card like its neighbours
          out.push(loose ? <Card key={f.key}><CardContent>{one(f, false)}</CardContent></Card> : one(f, cards));
        }
        flush();
        return out;
      };
      const side = field.fields.filter((f) => f.side);
      if (!side.length) return <div className="grid gap-4">{draw(field.fields, top)}</div>;
      // long items (a post, a service): the content in the main column, its settings in a column beside it
      return (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          <Card className="min-w-0"><CardContent className="grid gap-6">{draw(field.fields.filter((f) => !f.side), false)}</CardContent></Card>
          <Card aria-label="Settings" className="gap-5">
            <CardHeader><CardTitle>Settings</CardTitle><CardDescription>Where and how it shows on the site.</CardDescription></CardHeader>
            <CardContent className="grid gap-5">{side.map((f) => one(f, false))}</CardContent>
          </Card>
        </div>
      );
    }
    case "list":
      return <ListView field={field} value={value} onChange={onChange} path={path} top={top} />;
  }
}

function ListView({ field, value, onChange, path, top }: { field: Extract<Field, { type: "list" }>; value: V; onChange: (v: V) => void; path: string; top: boolean }) {
  const rows = Array.isArray(value) ? (value as Rec[]) : [];
  const small = field.item.type === "object" && field.item.fields.length <= 3;
  const [open, setOpen] = useState<number | null>(field.detail ? null : small && rows.length <= 3 ? -1 : null); // -1 = all open
  const [gone, setGone] = useState<{ i: number; row: Rec; title: string } | null>(null);
  const item = field.item;
  // photo-led lists (team, gallery: a photo plus a couple of fields) get a grid of cards; longer forms stay a list
  const hasImage = item.type === "object" && item.fields.length <= 4 && item.fields.some((f) => f.field.type === "image");
  const titleOf = (r: Rec, i: number) => (field.title ? field.title(r, i) : `Item ${i + 1}`);
  const set = (i: number, v: V) => onChange(rows.map((r, j) => (j === i ? (v as Rec) : r)));
  const move = (i: number, d: number) => { const j = i + d; if (j < 0 || j >= rows.length) return; const next = [...rows]; [next[i], next[j]] = [next[j]!, next[i]!]; onChange(next); };
  // no "are you sure?" box: removing shows an Undo, and nothing changes on the site until Save
  const remove = (i: number) => { setGone({ i, row: rows[i]!, title: titleOf(rows[i]!, i) }); onChange(rows.filter((_, j) => j !== i)); if (field.detail) setOpen(null); };
  const undo = () => { if (!gone) return; const next = [...rows]; next.splice(gone.i, 0, gone.row); onChange(next); setGone(null); };
  const empty = (f: Field): V => f.type === "toggle" ? false : f.type === "lines" || f.type === "multi" || f.type === "list" ? [] : f.type === "number" ? 0 : f.type === "select" ? f.options[0]?.value ?? "" : f.type === "object" ? Object.fromEntries(f.fields.map((x) => [x.key, empty(x.field)])) : "";
  const blank = (): Rec => (empty(item) ?? {}) as Rec;
  const full = field.max !== undefined && rows.length >= field.max;
  const go = (i: number | null) => { setOpen(i); setGone(null); scrollTo({ top: 0 }); };
  const addLabel = field.add ?? "Add";

  const removed = gone && (
    <div role="status" className="flex items-center gap-3 rounded-lg border bg-foreground px-4 py-2 text-sm text-background shadow-md">
      <Trash2 className="size-4 shrink-0 opacity-70" />
      <span className="min-w-0 flex-1 truncate">Removed “{gone.title}”. It leaves the site when you save.</span>
      <Button size="sm" variant="secondary" onClick={undo} className="shrink-0">Undo</Button>
    </div>
  );

  // photo lists (team, gallery): a grid of compact cards with the photo on top
  if (hasImage) {
    return (
      <div className="grid gap-4">
        {removed}
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {rows.map((r, i) => (
            <li key={i} className="flex flex-col gap-3 rounded-xl border bg-card p-3 shadow-xs">
              <FieldView field={item} value={r} onChange={(v) => set(i, v)} path={path} />
              {!field.fixed && <RowTools i={i} n={rows.length} move={move} remove={remove} />}
            </li>
          ))}
        </ul>
        {!field.fixed && !full && (
          path.startsWith("work")
            ? <MultiUpload folder="work" onUploaded={(urls) => onChange([...rows, ...urls.map((src) => ({ ...blank(), src }))])} />
            : <Button variant="outline" size="sm" className="justify-self-start" onClick={() => onChange([...rows, blank()])}><Plus /> {addLabel}</Button>
        )}
      </div>
    );
  }

  // long items (posts, services): one screen for the list, one for the item being edited
  if (field.detail) {
    const r = open !== null && open >= 0 ? rows[open] : undefined;
    if (r && open !== null) {
      return (
        <div className="grid gap-5">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="ghost" size="sm" className="-ml-2.5" onClick={() => go(null)}><ChevronLeft /> All {field.detail}s</Button>
            <span className="truncate text-sm text-muted-foreground max-sm:hidden">/ {titleOf(r, open)}</span>
            <span className="ml-auto flex items-center gap-1">
              <Button variant="outline" size="icon-sm" aria-label={`Previous ${field.detail}`} disabled={open === 0} onClick={() => go(open - 1)}><ChevronLeft /></Button>
              <Button variant="outline" size="icon-sm" aria-label={`Next ${field.detail}`} disabled={open === rows.length - 1} onClick={() => go(open + 1)}><ChevronRight /></Button>
              {!field.fixed && <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={() => remove(open)}><Trash2 /> Remove</Button>}
            </span>
          </div>
          <FieldView field={item} value={r} onChange={(v) => set(open, v)} path={path} />
        </div>
      );
    }
    return (
      <div className="grid gap-4">
        {removed}
        <Card className="gap-0 overflow-hidden py-0">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3">
            <p className="text-sm text-muted-foreground tabular-nums">{rows.length} {rows.length === 1 ? field.detail : `${field.detail}s`}</p>
            {!field.fixed && !full && <Button size="sm" onClick={() => { onChange([...rows, blank()]); go(rows.length); }}><Plus /> {addLabel}</Button>}
          </div>
          {rows.length ? (
            <ul className="divide-y">
              {rows.map((row, i) => {
                const meta = field.meta?.(row);
                const draft = field.detail === "post" && !row.published;
                return (
                  <li key={i} className="group flex items-center gap-2 pr-3 transition-colors hover:bg-muted/50">
                    <button type="button" onClick={() => go(i)} className="flex min-h-14 min-w-0 flex-1 items-center gap-3 px-5 py-2.5 text-left outline-none focus-visible:bg-muted">
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{titleOf(row, i)}</span>
                        {meta && <span className="block truncate text-xs text-muted-foreground">{meta}</span>}
                      </span>
                      {field.detail === "post" && <Badge variant={draft ? "secondary" : "success"}>{draft ? "Draft" : "Published"}</Badge>}
                      <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </button>
                    {!field.fixed && <RowTools i={i} n={rows.length} move={move} remove={remove} />}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="grid place-items-center gap-2 px-6 py-16 text-center">
              <p className="font-medium">No {field.detail}s yet</p>
              <p className="max-w-[360px] text-sm text-muted-foreground">Start one with “{addLabel}”. Nothing shows on the website until you save.</p>
            </div>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-2">
      {removed}
      {rows.map((r, i) => {
        const isOpen = open === -1 || open === i;
        return (
          <div key={i} className={cn("rounded-lg border bg-card", top && "shadow-xs")}>
            <div className="flex items-center gap-2 pr-2 pl-1">
              <button type="button" onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen} className="flex min-h-11 min-w-0 flex-1 items-center gap-2 rounded-md px-2 text-left text-sm font-medium outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
                <ChevronRight className={cn("size-4 shrink-0 text-muted-foreground transition-transform duration-200", isOpen && "rotate-90")} />
                <span className="font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                <span className="truncate">{titleOf(r, i)}</span>
                {!isOpen && field.meta?.(r) && <span className="hidden truncate text-xs font-normal text-muted-foreground sm:inline">· {field.meta(r)}</span>}
              </button>
              {!field.fixed && <RowTools i={i} n={rows.length} move={move} remove={remove} />}
            </div>
            {isOpen && <div className="border-t px-4 pt-4 pb-5"><FieldView field={item} value={r} onChange={(v) => set(i, v)} path={path} /></div>}
          </div>
        );
      })}
      {!field.fixed && !full && (
        <Button variant="outline" size="sm" className="mt-1 justify-self-start" onClick={() => { onChange([...rows, blank()]); setOpen(rows.length); }}><Plus /> {addLabel}</Button>
      )}
    </div>
  );
}

function RowTools({ i, n, move, remove }: { i: number; n: number; move: (i: number, d: number) => void; remove: (i: number) => void }) {
  return (
    <span className="flex shrink-0 items-center justify-end gap-0.5">
      <Button variant="ghost" size="icon-sm" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)}><ArrowUp /></Button>
      <Button variant="ghost" size="icon-sm" aria-label="Move down" disabled={i === n - 1} onClick={() => move(i, 1)}><ArrowDown /></Button>
      <Button variant="ghost" size="icon-sm" aria-label="Remove" className="hover:text-destructive" onClick={() => remove(i)}><X /></Button>
    </span>
  );
}

/** A field with its label. Single controls sit inside a <label>; composite ones (photo, switch) get a group name. */
function Labeled({ label, help, wrap, children }: { label: string; help?: string; wrap: boolean; children: ReactNode }) {
  const id = useId();
  const inner = (<><Label id={id}>{label}</Label>{children}{help && <span className="text-xs text-muted-foreground">{help}</span>}</>);
  return wrap ? <label className="grid gap-2">{inner}</label> : <div role="group" aria-labelledby={id} className="grid gap-2">{inner}</div>;
}

/** Fields that fit beside each other: short text, numbers, choices. */
const isShort = (f: Field) => (f.type === "text" && !f.big && (f.max ?? 160) <= 40) || f.type === "number" || f.type === "select";
