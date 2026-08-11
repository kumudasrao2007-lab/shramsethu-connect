/**
 * Demo Mode — a fully isolated, judge-friendly walkthrough of the worker app.
 *
 * Nothing here touches production: no Supabase user is created, no rows are
 * written to the real database, and the demo worker can never appear in the
 * Admin Dashboard. All demo state lives in this browser only.
 */
import { useEffect, useState } from "react";

const KEY = "ss_demo_mode";
export const DEMO_EVENT = "shramsethu:demo";

/** Reference "today" for Demo Mode — end of the demo July earnings month. */
export const DEMO_REF_DATE = "2026-07-31";
export const demoNow = () => new Date(`${DEMO_REF_DATE}T12:00:00`);

export function isDemo(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

function emit() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(DEMO_EVENT));
}

export function enterDemo() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, "1");
  } catch { /* storage unavailable */ }
  emit();
}

export function exitDemo() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
    // Drop every piece of local demo state so the next demo starts clean.
    for (const k of Object.keys(window.localStorage)) {
      if (k.startsWith("ss_demo_")) window.localStorage.removeItem(k);
    }
  } catch { /* storage unavailable */ }
  emit();
}

/** Reactive view of the demo flag. */
export function useDemo(): boolean {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const sync = () => setOn(isDemo());
    sync();
    window.addEventListener(DEMO_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(DEMO_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return on;
}

/** Small localStorage-backed store for demo-only mutations (never persisted server-side). */
export function readDemoStore<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(`ss_demo_${key}`);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeDemoStore<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(`ss_demo_${key}`, JSON.stringify(value));
  } catch { /* storage unavailable */ }
}
