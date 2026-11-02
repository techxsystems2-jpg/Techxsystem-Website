import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { isAdmin } from "@/lib/server/admin";
import { randomId, seal } from "@/lib/server/crypto";
import { dropboxAuthUrl } from "@/lib/server/dropbox";
import { gdriveAuthUrl } from "@/lib/server/gdrive";

/* "Connect Dropbox" / "Connect Google Drive" on /admin: sends the admin to the provider's consent screen. The state
   value is signed and also kept in a short cookie, so the callback only accepts the flow this browser started. */
export async function GET(req: NextRequest, ctx: RouteContext<"/api/admin/oauth/[provider]">) {
  const { provider } = await ctx.params;
  if (!(await isAdmin())) redirect("/admin");
  if (provider !== "dropbox" && provider !== "gdrive") return new Response("Unknown provider", { status: 404 });

  const nonce = randomId(16);
  const state = seal({ provider, nonce }, 600);
  (await cookies()).set("techx_oauth", nonce, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/api/admin/oauth", maxAge: 600 });
  const callback = `${req.nextUrl.origin}/api/admin/oauth/${provider}/callback`;
  redirect(provider === "dropbox" ? dropboxAuthUrl(callback, state) : gdriveAuthUrl(callback, state));
}
