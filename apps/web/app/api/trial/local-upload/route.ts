import { createWriteStream } from "node:fs";
import { rm } from "node:fs/promises";
import path from "node:path";
import { Readable, Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import type { ReadableStream as WebReadableStream } from "node:stream/web";
import type { NextRequest } from "next/server";
import { unseal } from "@/lib/server/crypto";
import { LOCAL_ROOT } from "@/lib/server/destinations";

/* Development only: the "This computer" destination. Streams one file into apps/web/.uploads/<folder>/<submission>/,
   so the whole free-trial flow can be tried without Dropbox or Google keys. Needs a signed ticket from the start route
   naming the folder, file and exact size; stops (and removes the part file) if more bytes arrive than declared.
   Disabled in production. */
export async function PUT(req: NextRequest) {
  if (process.env.NODE_ENV === "production") return new Response("Not found", { status: 404 });
  const t = unseal<{ dir: string; name: string; size: number }>(req.nextUrl.searchParams.get("t"), "local-upload");
  if (!t || !req.body) return Response.json({ error: "Upload link expired" }, { status: 403 });
  const file = path.join(LOCAL_ROOT, t.dir, t.name);
  if (!file.startsWith(LOCAL_ROOT + path.sep)) return Response.json({ error: "Bad path" }, { status: 400 });
  if (Number(req.headers.get("content-length") ?? 0) > t.size) return Response.json({ error: "Too large" }, { status: 413 });

  let seen = 0;
  const cap = new Transform({
    transform(chunk: Buffer, _e, cb) {
      seen += chunk.length;
      cb(seen > t.size ? new Error("too large") : null, chunk);
    },
  });
  try {
    await pipeline(Readable.fromWeb(req.body as unknown as WebReadableStream), cap, createWriteStream(file));
  } catch {
    await rm(file, { force: true });
    return Response.json({ error: seen > t.size ? "Too large" : "Upload interrupted" }, { status: seen > t.size ? 413 : 400 });
  }
  if (seen !== t.size) {
    await rm(file, { force: true });
    return Response.json({ error: "Upload incomplete" }, { status: 400 });
  }
  return Response.json({ ok: true });
}
