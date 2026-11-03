/** Splits a body into blocks at blank lines. A heading line is always its own block, and a list starts its own block,
    so "## Heading" or "- item" right under a line of text needs no blank line between them (2026-11-04: headings used
    to swallow the paragraph under them). */
export function toBlocks(body: string) {
  const out: string[] = [];
  let cur: string[] = [];
  const flush = () => { if (cur.length) out.push(cur.join("\n").trim()); cur = []; };
  for (const line of body.replace(/\r\n?/g, "\n").split("\n")) {
    if (!line.trim()) { flush(); continue; }
    if (/^#{2,3} /.test(line)) { flush(); out.push(line.trim()); continue; }
    const isItem = line.startsWith("- ") || line.trim() === "-";
    const prevItem = cur.length > 0 && (cur[cur.length - 1]!.startsWith("- ") || cur[cur.length - 1]!.trim() === "-");
    if (cur.length && isItem !== prevItem) flush();
    cur.push(line);
  }
  flush();
  return out.filter(Boolean);
}
