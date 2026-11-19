"use client";

import { useSyncExternalStore } from "react";

/* The studio's clock, shared by the hero badge and the studio card. Studio day: Monday to Saturday, 9 AM – 10 PM IST
   (owner, 2026-11-19). Needs the visitor's clock, so it is null on the server and during hydration;
   after that it ticks once a minute. */
const subscribe = (cb: () => void) => { const id = setInterval(cb, 60_000); return () => clearInterval(id); };
const minute = () => Math.floor(Date.now() / 60_000);
const none = () => 0;

export const STUDIO_OPEN_UTC = { h: 3, m: 30 }; // 9:00 IST
export const STUDIO_CLOSE_UTC = { h: 16, m: 30 }; // 22:00 IST

export function useStudioClock() {
  const tick = useSyncExternalStore(subscribe, minute, none);
  if (!tick) return null;
  const now = new Date(tick * 60_000);
  const ist = new Date(now.getTime() + 5.5 * 3_600_000); // read with getUTC* for India time
  const mins = ist.getUTCHours() * 60 + ist.getUTCMinutes();
  const open = ist.getUTCDay() !== 0 && mins >= 9 * 60 && mins < 22 * 60; // closed Sundays
  return { now, open, indiaTime: fmt(now, "Asia/Kolkata") };
}

/** Today's instance of a UTC wall time, so a city's local time comes out right through daylight saving. */
export function todayAt(now: Date, { h, m }: { h: number; m: number }) {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), h, m));
}

export const fmt = (d: Date, tz: string) => d.toLocaleTimeString("en-US", { timeZone: tz, hour: "numeric", minute: "2-digit" });
