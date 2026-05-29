import { useSyncExternalStore } from "react";

export type AccountType = "teen" | "parent";

export interface User {
  name: string;
  email: string;
  accountType: AccountType;
}

const KEY = "driveready.user";
let user: User | null = null;
const listeners = new Set<() => void>();

function emit() { listeners.forEach((l) => l()); }

if (typeof window !== "undefined") {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) user = JSON.parse(raw);
  } catch {}
}

export function getUser() { return user; }

export function signIn(u: User) {
  user = u;
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(u));
  emit();
}

export function signOut() {
  user = null;
  if (typeof window !== "undefined") localStorage.removeItem(KEY);
  emit();
}

function subscribe(l: () => void) { listeners.add(l); return () => { listeners.delete(l); }; }

export function useUser() {
  return useSyncExternalStore(subscribe, getUser, () => null);
}