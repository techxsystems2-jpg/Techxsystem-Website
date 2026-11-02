import { TRIAL, extOf, formatBytes, isPhotoName } from "./trial";

/* Checks each file in the browser before anything is uploaded (owner, 2026-11-02: handle files and ZIPs fully).
   - The name must be a photo type we accept, and the first bytes must match it (a renamed .docx or a damaged
     download is caught here, not after a 5-minute upload).
   - ZIPs are opened without unpacking: we read the central directory at the end of the file and count the photos
     inside, refusing ZIPs that are encrypted, empty, hold no photos, or would unpack to something enormous (zip bombs).
     ZIP64 archives are supported. Only small slices of the file are read, so it's instant even for 150 MB files. */

export type Inspection =
  | { ok: true; kind: "photo" | "zip"; photos: number; note?: string }
  | { ok: false; reason: string };

const bytes = async (file: Blob, start: number, end: number) => new Uint8Array(await file.slice(start, end).arrayBuffer());
const ascii = (b: Uint8Array, from: number, len: number) => String.fromCharCode(...b.subarray(from, from + len));
const starts = (b: Uint8Array, sig: number[], at = 0) => sig.every((v, i) => b[at + i] === v);

const TIFF = (b: Uint8Array) => starts(b, [0x49, 0x49, 0x2a, 0x00]) || starts(b, [0x4d, 0x4d, 0x00, 0x2a]);
const SNIFF: Record<string, (b: Uint8Array) => boolean> = {
  jpg: (b) => starts(b, [0xff, 0xd8, 0xff]),
  png: (b) => starts(b, [0x89, 0x50, 0x4e, 0x47]),
  tif: TIFF, dng: TIFF, cr2: TIFF, nef: TIFF, arw: TIFF,
  orf: (b) => TIFF(b) || ["IIRO", "IIRS", "MMOR"].includes(ascii(b, 0, 4)),
  rw2: (b) => starts(b, [0x49, 0x49, 0x55, 0x00]) || TIFF(b),
  raf: (b) => ascii(b, 0, 8) === "FUJIFILM",
  cr3: (b) => ascii(b, 4, 4) === "ftyp",
  heic: (b) => ascii(b, 4, 4) === "ftyp",
  zip: (b) => starts(b, [0x50, 0x4b, 0x03, 0x04]),
};
SNIFF.jpeg = SNIFF.jpg!; SNIFF.tiff = SNIFF.tif!; SNIFF.heif = SNIFF.heic!;

export async function inspectFile(file: File): Promise<Inspection> {
  const ext = extOf(file.name);
  if (!SNIFF[ext]) return { ok: false, reason: `${file.name}: we take JPEG, RAW (CR2, CR3, NEF, ARW, RAF, ORF, RW2), DNG, TIFF, HEIC or a ZIP of those.` };
  if (file.size === 0) return { ok: false, reason: `${file.name} is empty (0 bytes). Please choose it again.` };
  if (file.size > TRIAL.maxFileBytes) return { ok: false, reason: `${file.name} is ${formatBytes(file.size)}, over the 150 MB limit. Paste a Dropbox or Drive link for big files.` };
  let head: Uint8Array;
  try {
    head = await bytes(file, 0, 16);
  } catch {
    return { ok: false, reason: `We couldn't read ${file.name}. It may have been moved or is still syncing. Try choosing it again.` };
  }
  if (ext === "zip" && starts(head, [0x50, 0x4b, 0x05, 0x06])) return { ok: false, reason: `${file.name} is an empty ZIP.` };
  if (!SNIFF[ext]!(head)) return { ok: false, reason: `${file.name} doesn't look like a real ${ext.toUpperCase()} file. It may be damaged, or renamed from another type.` };
  if (ext !== "zip") return { ok: true, kind: "photo", photos: 1 };
  try {
    return await inspectZip(file);
  } catch {
    return { ok: false, reason: `${file.name} looks damaged: we couldn't read what's inside. Try zipping the photos again.` };
  }
}

const u16 = (v: DataView, o: number) => v.getUint16(o, true);
const u32 = (v: DataView, o: number) => v.getUint32(o, true);
const u64 = (v: DataView, o: number) => Number(v.getBigUint64(o, true));
const JUNK = /(^|\/)(__MACOSX\/|\._|\.DS_Store$|Thumbs\.db$|desktop\.ini$)/i;

async function inspectZip(file: File): Promise<Inspection> {
  const name = file.name;
  // End of central directory: in the last 22 bytes + up to 64 KB of comment
  const tailStart = Math.max(0, file.size - 65_557);
  const tail = await bytes(file, tailStart, file.size);
  const tv = new DataView(tail.buffer, tail.byteOffset, tail.byteLength);
  let eocd = -1;
  for (let i = tail.length - 22; i >= 0; i--) if (u32(tv, i) === 0x06054b50) { eocd = i; break; }
  if (eocd < 0) throw new Error("no EOCD");

  let entries = u16(tv, eocd + 10);
  let cdSize = u32(tv, eocd + 12);
  let cdOffset = u32(tv, eocd + 16);
  if (entries === 0xffff || cdSize === 0xffffffff || cdOffset === 0xffffffff) {
    // ZIP64: the locator sits just before the EOCD and points at the ZIP64 EOCD record
    const loc = eocd - 20;
    if (loc < 0 || u32(tv, loc) !== 0x07064b50) throw new Error("no zip64 locator");
    const at = u64(tv, loc + 8);
    const rec = await bytes(file, at, at + 56);
    const rv = new DataView(rec.buffer, rec.byteOffset, rec.byteLength);
    if (u32(rv, 0) !== 0x06064b50) throw new Error("bad zip64 record");
    entries = u64(rv, 32); cdSize = u64(rv, 40); cdOffset = u64(rv, 48);
  }
  if (!entries) return { ok: false, reason: `${name} is an empty ZIP.` };
  if (cdSize > 16 * 1024 * 1024 || entries > 20_000) return { ok: false, reason: `${name} holds too many files. Zip up to ${TRIAL.maxFiles} photos, or send a link.` };

  const cd = await bytes(file, cdOffset, cdOffset + cdSize);
  const v = new DataView(cd.buffer, cd.byteOffset, cd.byteLength);
  const dec = new TextDecoder();
  let p = 0, photos = 0, unpacked = 0, packed = 0, encrypted = false, nested = 0;
  const others: string[] = [];
  for (let n = 0; n < entries; n++) {
    if (p + 46 > cd.length || u32(v, p) !== 0x02014b50) throw new Error("bad central directory");
    const flags = u16(v, p + 8);
    let csize = u32(v, p + 20), usize = u32(v, p + 24);
    const nlen = u16(v, p + 28), xlen = u16(v, p + 30), clen = u16(v, p + 32);
    const entry = dec.decode(cd.subarray(p + 46, p + 46 + nlen));
    if (usize === 0xffffffff || csize === 0xffffffff) {
      // ZIP64 extra field (id 0x0001): uncompressed then compressed size, each only if its 32-bit slot is maxed
      for (let x = p + 46 + nlen; x + 4 <= p + 46 + nlen + xlen;) {
        const id = u16(v, x), len = u16(v, x + 2);
        if (id === 0x0001) {
          let o = x + 4;
          if (usize === 0xffffffff) { usize = u64(v, o); o += 8; }
          if (csize === 0xffffffff) csize = u64(v, o);
        }
        x += 4 + len;
      }
    }
    p += 46 + nlen + xlen + clen;
    if (entry.endsWith("/") || JUNK.test(entry)) continue;
    if (flags & 1) encrypted = true;
    unpacked += usize; packed += csize;
    if (isPhotoName(entry)) photos++;
    else if (extOf(entry) === "zip") nested++;
    else if (others.length < 3) others.push(entry.split("/").pop()!);
  }

  if (encrypted) return { ok: false, reason: `${name} is password-protected. Zip it again without a password, or send a link.` };
  if (!photos) return { ok: false, reason: nested ? `${name} only holds other ZIPs. Put the photos in one ZIP, not ZIPs inside a ZIP.` : `${name} has no photos inside${others.length ? ` (found ${others.join(", ")})` : ""}.` };
  if (photos > TRIAL.maxFiles) return { ok: false, reason: `${name} holds ${photos} photos. The trial takes up to ${TRIAL.maxFiles}. Send the rest as a link.` };
  if (unpacked > TRIAL.maxZipUnpackedBytes || (packed > 0 && unpacked / packed > 200)) return { ok: false, reason: `${name} would unpack to something far too large. Please zip just the photos.` };
  return { ok: true, kind: "zip", photos, note: `${photos} photo${photos === 1 ? "" : "s"} inside${nested || others.length ? " · other files will be ignored" : ""}` };
}
