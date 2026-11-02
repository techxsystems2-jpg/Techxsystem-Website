"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";

/* Form field pieces shared by every form on the site (free trial, contact, admin), so errors look and behave the same:
   label (+ optional hint), the control, help text, and an inline error that slides in under the field, linked to the
   control with aria-describedby (the control sets aria-invalid). Inputs are 16px so phones don't zoom in. */
export const inputClass = "mt-2 block w-full rounded-input bg-surface px-3.5 py-3 text-[16px] font-normal text-ink outline-none ring-1 ring-line-2 transition-shadow duration-150 placeholder:text-ink-3 hover:ring-ink-3 focus:ring-2 focus:ring-blue aria-[invalid=true]:ring-error aria-[invalid=true]:focus:ring-error";

export function Field({ id, label, hint, help, error, children }: { id: string; label: string; hint?: string; help?: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="text-small font-medium">{label}{hint && <span className="font-normal text-ink-2"> {hint}</span>}</label>
      {children}
      {help && !error && <p id={`${id}-help`} className="mt-1.5 text-small text-ink-2">{help}</p>}
      <Err id={`${id}-error`} msg={error} />
    </div>
  );
}

export function Err({ id, msg }: { id: string; msg?: string }) {
  return (
    <AnimatePresence initial={false}>
      {msg && (
        <motion.p id={id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
          <span className="mt-1.5 flex items-start gap-1.5 text-small text-error">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="mt-[3px] shrink-0"><circle cx="12" cy="12" r="9" /><path d="M12 7.5v5M12 16h.01" /></svg>
            {msg}
          </span>
        </motion.p>
      )}
    </AnimatePresence>
  );
}
