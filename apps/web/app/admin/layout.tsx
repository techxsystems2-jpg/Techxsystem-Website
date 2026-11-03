import { Suspense, type ReactNode } from "react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AdminShell } from "@/features/admin/AdminShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/features/admin/ui/card";
import { LoginForm } from "@/features/admin/LoginForm";
import { ShellSkeleton } from "@/features/admin/Skeletons";
import { Mark } from "@techx/ui/Icons";
import { adminConfigured, adminEmail } from "@/lib/server/admin";

/* The admin panel (owner, 2026-11-03: "the whole website can be managed from there"). Its own chrome: the site's
   header, footer and trial bar are hidden on these pages (data-admin + globals.css). One shared password
   (ADMIN_PASSWORD) signs in for 12 hours; every save re-checks it on the server. Not linked, noindex, robots-disallowed. */
export const metadata: Metadata = { title: { default: "Admin", template: "%s · Admin" }, robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div data-admin className="min-h-svh bg-sidebar font-sans text-foreground">
      <Suspense fallback={<ShellSkeleton />}>
        <Gate>{children}</Gate>
      </Suspense>
    </div>
  );
}

async function Gate({ children }: { children: ReactNode }) {
  if (!adminConfigured()) {
    return (
      <Center>
        <CardHeader>
          <CardTitle className="text-xl">Admin is switched off</CardTitle>
          <CardDescription>Set <code className="font-mono text-[13px]">ADMIN_EMAIL</code>, <code className="font-mono text-[13px]">ADMIN_PASSWORD</code> and <code className="font-mono text-[13px]">APP_SECRET</code> in the environment (see <code className="font-mono text-[13px]">.env.example</code>), then reload.</CardDescription>
        </CardHeader>
      </Center>
    );
  }
  const email = await adminEmail();
  if (!email) {
    return (
      <Center>
        <CardHeader className="text-center">
          <span className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl bg-white shadow-[0_0_0_1px_rgb(10_10_11/0.06),0_8px_20px_-10px_rgb(48_116_254/0.45)]"><Mark className="scale-[1.35]" /></span>
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Sign in to edit the TechX Systems website</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Center>
    );
  }
  const open = (await cookies()).get("admin_sidebar")?.value !== "0";
  return <AdminShell defaultOpen={open} email={email}>{children}</AdminShell>;
}

/* The sign-in page wears the site's hero sky (features/home/Hero.tsx): soft blue at the top, two slow clouds, white
   below; the card floats on it with the brand-blue glow (owner, 2026-11-03: "follow the theme colour"). */
const Center = ({ children }: { children: ReactNode }) => (
  <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 overflow-hidden bg-white p-6 md:p-10">
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(55%_50%_at_18%_10%,#D2ECFF,transparent_70%),radial-gradient(50%_50%_at_82%_14%,#D8EFFF,transparent_70%),radial-gradient(70%_45%_at_50%_0%,#E3F3FF,transparent_75%),linear-gradient(to_bottom,#EAF5FF,#F3F9FF_45%,#FFFFFF)]" />
      <div className="cloud absolute left-[4%] top-[6%] h-[240px] w-[520px] rounded-full bg-white/70 blur-[60px]" />
      <div className="cloud absolute right-[3%] top-[22%] h-[200px] w-[460px] rounded-full bg-white/60 blur-[60px] [animation-delay:-12s]" />
    </div>
    <Card className="relative w-full max-w-sm border-white/70 shadow-[0_0_0_1px_rgb(10_10_11/0.04),0_24px_60px_-24px_rgb(48_116_254/0.35)]">{children}</Card>
    <p className="relative text-center text-xs text-muted-foreground">Only for the TechX team. Not linked from the website.</p>
  </div>
);
