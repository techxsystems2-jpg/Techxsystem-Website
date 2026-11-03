"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { rateLimitAll } from "@/lib/server/rate-limit";
import { isAdmin, signIn, signOut } from "@/lib/server/admin";
import { cleanName, getSettings, saveSettings, type Destination } from "@/lib/server/upload-settings";

/* Admin actions. Every one re-checks the session: a Server Action is a public POST endpoint. */

/** Admin sign-in, with a limit on tries (Upstash Redis when set, so it holds on every server; 2026-11-03). Returns a
    message for the form to show; on success it goes to the overview. */
export async function login(_prev: { error: string; email?: string } | null, form: FormData): Promise<{ error: string; email?: string } | null> {
  const h = await headers();
  const ip = h.get("x-real-ip") || h.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const email = String(form.get("email") ?? "").trim().toLowerCase().slice(0, 200);
  const limited = await rateLimitAll([["admin-login", ip, 10, 900], ["admin-login-day", ip, 40, 86400], ["admin-login-email", email || ip, 10, 900]]);
  if (limited) {
    const mins = Math.ceil(limited.retryAfter / 60);
    return { error: `Too many tries. Wait ${mins <= 1 ? "a minute" : `${mins} minutes`} and try again.`, email };
  }
  const ok = await signIn(email, String(form.get("password") ?? ""));
  if (!ok) return { error: "That email or password isn't right.", email }; // the form keeps the email typed
  redirect("/admin");
}

export async function logout() {
  await signOut();
  redirect("/admin");
}

export async function save(form: FormData) {
  if (!(await isAdmin())) redirect("/admin");
  const s = await getSettings();
  const pick = String(form.get("destination") ?? "") as Destination;
  const allowed: Destination[] = ["dropbox", "gdrive", ...(process.env.NODE_ENV === "production" ? [] : ["local" as const])];
  if (!allowed.includes(pick)) redirect("/admin/uploads?status=pick-one");
  if ((pick === "dropbox" && !s.dropbox) || (pick === "gdrive" && !s.gdrive)) redirect("/admin/uploads?status=connect-first");
  await saveSettings({ ...s, destination: pick, folder: cleanName(String(form.get("folder") ?? "") || "TechX free trials") });
  redirect("/admin/uploads?status=saved");
}

export async function disconnect(form: FormData) {
  if (!(await isAdmin())) redirect("/admin");
  const which = String(form.get("provider"));
  const s = await getSettings();
  const next = { ...s };
  if (which === "dropbox") delete next.dropbox;
  if (which === "gdrive") delete next.gdrive;
  if (next.destination === which) next.destination = null;
  await saveSettings(next);
  redirect("/admin/uploads?status=disconnected");
}
