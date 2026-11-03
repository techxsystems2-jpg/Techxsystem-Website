"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { PostBody } from "@/features/blog/render";
import { send } from "./ImageField";

/* The blog post editor in the admin (owner, 2026-11-03). It writes the same plain-text format the site renders
   (features/blog/render.tsx), so nothing new is stored: the toolbar only types the marks for you.
   - Text style (paragraph / heading / subheading), bold, italic, link, list, quote, photo.
   - Shortcuts: ⌘/Ctrl+B bold, +I italic, +K link. Enter inside a list continues it.
   - Photos: the toolbar button, or paste / drop a photo into the text; it's shrunk and uploaded like every admin photo.
   - Write, Preview (exactly as the site shows it) or Side by side. Text size A−/A+ and a full-screen mode.
   Edits go through execCommand("insertText") where the browser has it, so ⌘Z undoes a toolbar action too. */

type Style = "p" | "h2" | "h3" | "ul" | "quote";
const PREFIX: Record<Style, string> = { p: "", h2: "## ", h3: "### ", ul: "- ", quote: "> " };
const STRIP = /^(#{2,3} |- |> )/;
const SIZES = [15, 16, 17, 18, 20, 22];

export function PostEditor({ value, onChange, max }: { value: string; onChange: (v: string) => void; max?: number }) {
  const ta = useRef<HTMLTextAreaElement>(null);
  const file = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<"write" | "preview" | "split">("write");
  const [size, setSize] = useState(2);
  const [full, setFull] = useState(false);
  const [style, setStyle] = useState<Style>("p");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!full) return;
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setFull(false); };
    document.documentElement.style.overflow = "hidden";
    addEventListener("keydown", esc);
    return () => { document.documentElement.style.overflow = ""; removeEventListener("keydown", esc); };
  }, [full]);

  /** Replace [start, end) with text, keeping the browser's undo history, then select [a, b]. */
  const put = (start: number, end: number, text: string, a: number, b = a) => {
    const el = ta.current!;
    el.focus();
    el.setSelectionRange(start, end);
    const ok = text ? document.execCommand("insertText", false, text) : start === end || document.execCommand("delete");
    if (!ok) { el.setRangeText(text, start, end, "end"); onChange(el.value); }
    el.setSelectionRange(a, b);
    readStyle();
  };

  const lineRange = () => {
    const el = ta.current!, v = el.value;
    const s = v.lastIndexOf("\n", el.selectionStart - 1) + 1;
    let e = v.indexOf("\n", el.selectionEnd);
    if (e === -1) e = v.length;
    return { s, e, v };
  };

  const readStyle = () => {
    if (!ta.current) return;
    const { s, v } = lineRange();
    const line = v.slice(s, v.indexOf("\n", s) === -1 ? v.length : v.indexOf("\n", s));
    setStyle(line.startsWith("### ") ? "h3" : line.startsWith("## ") ? "h2" : line.startsWith("- ") ? "ul" : line.startsWith("> ") ? "quote" : "p");
  };

  /** Bold / italic: wrap the selection, or unwrap it if it's already wrapped. Empty selection gets a placeholder. */
  const wrap = (mark: string, placeholder: string) => {
    const el = ta.current!, v = el.value, a = el.selectionStart, b = el.selectionEnd;
    const n = mark.length;
    if (v.slice(a - n, a) === mark && v.slice(b, b + n) === mark && (mark !== "*" || (v[a - n - 1] !== "*" && v[b + n] !== "*"))) {
      put(a - n, b + n, v.slice(a, b), a - n, b - n);
      return;
    }
    const sel = v.slice(a, b) || placeholder;
    put(a, b, mark + sel + mark, a + n, a + n + sel.length);
  };

  /** Heading, list, quote: applied to every line the selection touches, as its own block (blank line around). */
  const setLines = (to: Style) => {
    const { s, e, v } = lineRange();
    const lines = v.slice(s, e).split("\n");
    const same = to !== "p" && lines.every((l) => l.startsWith(PREFIX[to]) && (to !== "h2" || !l.startsWith("### ")));
    const pre = same ? "" : PREFIX[to];
    let body = lines.map((l) => pre + l.replace(STRIP, "")).join("\n");
    let before = "", after = "";
    if (pre && to !== "p") {
      if (s > 0 && v.slice(Math.max(0, s - 2), s) !== "\n\n") before = s > 0 && v[s - 1] === "\n" ? "\n" : "\n\n";
      if (e < v.length && v.slice(e, e + 2) !== "\n\n") after = v[e] === "\n" ? "\n" : "\n\n";
    }
    if (to === "ul" && !same && body.trim() === PREFIX.ul.trim()) body = PREFIX.ul;
    const text = before + body + after;
    put(s, e, text, s + before.length + body.length);
  };

  const link = () => {
    const el = ta.current!, v = el.value, a = el.selectionStart, b = el.selectionEnd;
    const sel = v.slice(a, b);
    if (/^(https?:\/\/|\/)\S+$/.test(sel)) { put(a, b, `[link text](${sel})`, a + 1, a + 10); return; }
    const label = sel || "link text";
    const text = `[${label}](https://)`;
    put(a, b, text, a + label.length + 3, a + label.length + 11); // selects https://
  };

  /** A photo sits on its own line, as its own block; the description is selected so it can be typed over. */
  const insertPhoto = async (f?: File | null) => {
    if (!f) return;
    setNote("Uploading photo…");
    try {
      const url = await send(f, "blog");
      const el = ta.current!, v = el.value, a = el.selectionEnd;
      const before = a === 0 ? "" : v.slice(Math.max(0, a - 2), a) === "\n\n" ? "" : v[a - 1] === "\n" ? "\n" : "\n\n";
      const after = a >= v.length ? "\n\n" : v.slice(a, a + 2) === "\n\n" ? "" : v[a] === "\n" ? "\n" : "\n\n";
      const desc = "Describe the photo";
      const text = `${before}![${desc}](${url})${after}`;
      put(a, a, text, a + before.length + 2, a + before.length + 2 + desc.length);
      setNote("Photo added. Type a short description in place of the highlighted words.");
    } catch (e) {
      setNote(e instanceof Error ? e.message : "Upload failed. Try again.");
    }
  };

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const mod = e.metaKey || e.ctrlKey;
    if (mod && !e.shiftKey && !e.altKey) {
      const k = e.key.toLowerCase();
      if (k === "b") { e.preventDefault(); wrap("**", "bold text"); return; }
      if (k === "i") { e.preventDefault(); wrap("*", "italic text"); return; }
      if (k === "k") { e.preventDefault(); link(); return; }
    }
    if (e.key === "Enter" && !e.shiftKey && !mod) {
      const el = e.currentTarget, a = el.selectionStart;
      if (a !== el.selectionEnd) return;
      const s = el.value.lastIndexOf("\n", a - 1) + 1;
      const line = el.value.slice(s, a);
      const m = line.match(/^(- |> )/);
      if (!m) return;
      e.preventDefault();
      if (line === m[1]) put(s, a, "", s); // an empty item ends the list
      else put(a, a, "\n" + m[1], a + 1 + m[1].length);
    }
  };

  const words = value.split(/\s+/).filter(Boolean).length;
  const showWrite = mode !== "preview", showPreview = mode !== "write";

  return (
    <div className={full ? "fixed inset-0 z-50 flex flex-col bg-muted p-3 md:p-6" : "grid"}>
      <div className={`flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-input bg-background shadow-xs transition-[box-shadow,border-color] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 ${full ? "shadow-lg" : ""}`}>
        {/* toolbar */}
        <div role="toolbar" aria-label="Formatting" className="flex items-center gap-1 overflow-x-auto border-b bg-muted/40 px-2 py-1.5 [scrollbar-width:none]">
          <label className="sr-only" htmlFor="post-style">Text style</label>
          <select id="post-style" disabled={!showWrite} value={style === "ul" || style === "quote" ? "p" : style} onChange={(e) => setLines(e.target.value as Style)}
            className="h-8 shrink-0 rounded-md bg-transparent px-2 text-sm outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50">
            <option value="p">Paragraph</option>
            <option value="h2">Heading</option>
            <option value="h3">Subheading</option>
          </select>
          <Sep />
          <Tool label="Bold (⌘B)" disabled={!showWrite} onClick={() => wrap("**", "bold text")}><b className="text-[15px]">B</b></Tool>
          <Tool label="Italic (⌘I)" disabled={!showWrite} onClick={() => wrap("*", "italic text")}><i className="font-serif text-[16px]">I</i></Tool>
          <Tool label="Link (⌘K)" disabled={!showWrite} onClick={link}><Ico d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1" /></Tool>
          <Sep />
          <Tool label="Bulleted list" disabled={!showWrite} pressed={style === "ul"} onClick={() => setLines("ul")}><Ico d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01" /></Tool>
          <Tool label="Quote" disabled={!showWrite} pressed={style === "quote"} onClick={() => setLines("quote")}><Ico d="M7 7h4v4c0 3-1.5 5-4 6M14 7h4v4c0 3-1.5 5-4 6" /></Tool>
          <Tool label="Add a photo" disabled={!showWrite} onClick={() => file.current?.click()}><Ico d="M4 6h16v12H4zM4 15l4.5-4.5 4 4 2.5-2.5L20 17M15.5 9.5h.01" /></Tool>
          <input ref={file} type="file" accept="image/*" hidden onChange={(e) => { void insertPhoto(e.target.files?.[0]); e.target.value = ""; }} />

          <span className="ml-auto flex shrink-0 items-center gap-1 pl-2">
            <span className="flex rounded-lg bg-muted p-[3px]">
              {(["write", "split", "preview"] as const).map((m) => (
                <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)}
                  className={`h-7 rounded-md px-2.5 text-sm font-medium transition-[background-color,color,box-shadow] duration-150 ${mode === m ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"} ${m === "split" ? "max-md:hidden" : ""}`}>
                  {m === "write" ? "Write" : m === "split" ? "Side by side" : "Preview"}
                </button>
              ))}
            </span>
            <Sep />
            <Tool label="Smaller text" disabled={size === 0} onClick={() => setSize((s) => Math.max(0, s - 1))}><span className="text-[13px] font-medium">A−</span></Tool>
            <Tool label="Larger text" disabled={size === SIZES.length - 1} onClick={() => setSize((s) => Math.min(SIZES.length - 1, s + 1))}><span className="text-[16px] font-medium">A+</span></Tool>
            <Tool label={full ? "Exit full screen (Esc)" : "Full screen"} onClick={() => setFull((f) => !f)}>
              <Ico d={full ? "M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" : "M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"} />
            </Tool>
          </span>
        </div>

        {/* write / preview */}
        <div className={`grid min-h-0 flex-1 ${mode === "split" ? "md:grid-cols-2" : ""}`}>
          {showWrite && (
            <textarea
              ref={ta} aria-label="Post" value={value} maxLength={max} spellCheck
              placeholder={"Start writing…\n\nUse the toolbar for headings, lists, links and photos, or paste a photo straight in."}
              onChange={(e) => onChange(e.target.value)} onKeyDown={onKey} onSelect={readStyle}
              onPaste={(e) => { const f = [...e.clipboardData.files].find((x) => x.type.startsWith("image/")); if (f) { e.preventDefault(); void insertPhoto(f); } }}
              onDrop={(e) => { const f = [...e.dataTransfer.files].find((x) => x.type.startsWith("image/")); if (f) { e.preventDefault(); void insertPhoto(f); } }}
              style={{ fontSize: SIZES[size], outline: "none" /* the box shows focus, not the text area inside it */ }}
              className={`block w-full resize-none bg-transparent px-4 py-4 leading-[1.7] text-foreground outline-none focus-visible:outline-none placeholder:text-muted-foreground md:px-6 ${full ? "h-full overflow-auto" : "min-h-[480px] [field-sizing:content]"}`}
            />
          )}
          {showPreview && (
            <div className={`min-w-0 overflow-auto px-4 py-5 md:px-8 ${mode === "split" ? "max-md:border-t md:border-l" : ""} ${full ? "h-full" : "min-h-[480px]"}`}>
              <div className="mx-auto max-w-[720px]">
                {value.trim() ? <PostBody body={value} /> : <p className="text-sm text-muted-foreground">Nothing to preview yet.</p>}
              </div>
            </div>
          )}
        </div>

        {/* status */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t bg-muted/40 px-4 py-2 text-xs text-muted-foreground tabular-nums">
          <span>{words.toLocaleString()} {words === 1 ? "word" : "words"} · {Math.max(1, Math.round(words / 220))} min read</span>
          {max && value.length > max * 0.9 && <span>{(max - value.length).toLocaleString()} characters left</span>}
          {note && <span role="status" className="text-foreground">{note}</span>}
          <span className="ml-auto max-md:hidden">⌘B bold · ⌘I italic · ⌘K link · paste or drop a photo</span>
        </div>
      </div>
    </div>
  );
}

function Tool({ label, onClick, pressed, disabled, children }: { label: string; onClick: () => void; pressed?: boolean; disabled?: boolean; children: ReactNode }) {
  return (
    <button type="button" title={label} aria-label={label} aria-pressed={pressed} disabled={disabled}
      onMouseDown={(e) => e.preventDefault() /* keep the text selection */} onClick={onClick}
      data-slot="toggle" className={`grid size-8 shrink-0 place-items-center rounded-md outline-none transition-[background-color,color,scale] duration-150 active:scale-[0.96] disabled:opacity-40 focus-visible:ring-[3px] focus-visible:ring-ring/50 ${pressed ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`}>
      {children}
    </button>
  );
}

const Sep = () => <span aria-hidden="true" className="mx-1 h-4 w-px shrink-0 bg-border" />;
const Ico = ({ d }: { d: string }) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>;
