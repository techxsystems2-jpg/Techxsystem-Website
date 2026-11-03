import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { isAdmin } from "@/lib/server/admin";
import { encrypt, unseal } from "@/lib/server/crypto";
import { dropboxConnect } from "@/lib/server/dropbox";
import { gdriveConnect } from "@/lib/server/gdrive";
import { getSettings, saveSettings } from "@/lib/server/upload-settings";

/* The provider sends the admin back here with a code: swap it for a refresh token, store it encrypted, and make that
   provider the destination if none was chosen yet. Back to /admin with a short status message either way. */
export async function GET(req: NextRequest, ctx: RouteContext<"/api/admin/oauth/[provider]/callback">) {
  const { provider } = await ctx.params;
  if (!(await isAdmin())) redirect("/admin");
  const jar = await cookies();
  const state = unseal<{ provider: string; nonce: string }>(req.nextUrl.searchParams.get("state"), "oauth-state");
  const nonce = jar.get("techx_oauth")?.value;
  jar.delete({ name: "techx_oauth", path: "/api/admin/oauth" });
  const code = req.nextUrl.searchParams.get("code");
  if (!state || state.provider !== provider || !nonce || state.nonce !== nonce || !code) redirect("/admin/uploads?status=connect-failed");

  const callback = `${req.nextUrl.origin}/api/admin/oauth/${provider}/callback`;
  let ok = false;
  try {
    const s = await getSettings();
    if (provider === "dropbox") {
      const r = await dropboxConnect(code, callback);
      await saveSettings({ ...s, dropbox: { token: encrypt(r.refreshToken), account: r.account }, destination: s.destination && s.destination !== "local" ? s.destination : "dropbox" });
    } else {
      const r = await gdriveConnect(code, callback);
      await saveSettings({ ...s, gdrive: { token: encrypt(r.refreshToken), account: r.account }, destination: s.destination && s.destination !== "local" ? s.destination : "gdrive" });
    }
    ok = true;
  } catch (e) {
    console.error("[admin/oauth]", e);
  }
  redirect(ok ? `/admin/uploads?status=${provider}-connected` : "/admin/uploads?status=connect-failed");
}
