"use server";

import { redirect } from "next/navigation";
import { isAdmin, signIn, signOut } from "@/lib/server/admin";
import { cleanName, getSettings, saveSettings, type Destination } from "@/lib/server/upload-settings";

/* Admin actions. Every one re-checks the session: a Server Action is a public POST endpoint. */

export async function login(form: FormData) {
  const ok = await signIn(String(form.get("password") ?? ""));
  redirect(ok ? "/admin" : "/admin?status=bad-password");
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
  if (!allowed.includes(pick)) redirect("/admin?status=pick-one");
  if ((pick === "dropbox" && !s.dropbox) || (pick === "gdrive" && !s.gdrive)) redirect("/admin?status=connect-first");
  await saveSettings({ ...s, destination: pick, folder: cleanName(String(form.get("folder") ?? "") || "TechX free trials") });
  redirect("/admin?status=saved");
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
  redirect("/admin?status=disconnected");
}
