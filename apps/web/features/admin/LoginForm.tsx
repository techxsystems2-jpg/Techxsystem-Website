"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { login } from "@/app/admin/actions";
import { Button } from "./ui/button";
import { Input, Label } from "./ui/input";

/** The admin sign-in form: email and password; shows "wrong email or password" and "too many tries". */
export function LoginForm() {
  const [state, action, pending] = useActionState(login, null);
  return (
    <form action={action} className="grid gap-6">
      <label className="grid gap-2">
        <Label>Email</Label>
        <Input key={state?.email ?? ""} defaultValue={state?.email ?? ""} name="email" type="email" required autoComplete="username" autoCapitalize="none" autoCorrect="off" spellCheck={false} autoFocus={!state?.email} placeholder="you@techxsystems.com" aria-invalid={!!state?.error} />
      </label>
      <label className="grid gap-2">
        <Label>Password</Label>
        <Input name="password" type="password" required autoComplete="current-password" autoFocus={!!state?.email} aria-invalid={!!state?.error} aria-describedby={state?.error ? "login-error" : undefined} />
        {state?.error && <span id="login-error" role="alert" className="text-sm text-destructive">{state.error}</span>}
      </label>
      <Button type="submit" className="w-full" disabled={pending}>{pending && <Loader2 className="animate-spin" />}Sign in</Button>
    </form>
  );
}
