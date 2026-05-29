import { Car } from "lucide-react";

export function Welcome({ onSignUp, onSignIn }: { onSignUp: () => void; onSignIn: () => void }) {
  return (
    <div className="flex min-h-screen flex-col px-6 pb-10 pt-20">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div
          className="flex h-24 w-24 items-center justify-center rounded-3xl"
          style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
        >
          <Car className="h-12 w-12 text-primary-foreground" />
        </div>
        <h1 className="mt-8 text-4xl font-bold tracking-tight text-foreground">DriveReady AI</h1>
        <p className="mt-3 text-base text-muted-foreground">Your AI Driving Coach</p>
        <p className="mt-2 max-w-xs text-sm text-muted-foreground">
          Smarter practice. Safer drives. Real progress — every mile of the way.
        </p>
      </div>

      <div className="space-y-3">
        <button
          onClick={onSignUp}
          className="flex w-full items-center justify-center rounded-2xl px-6 py-4 text-base font-semibold text-primary-foreground transition-transform active:scale-[0.98]"
          style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
        >
          Sign Up
        </button>
        <button
          onClick={onSignIn}
          className="w-full py-3 text-sm font-medium text-primary hover:underline"
        >
          Already have an account? Log In
        </button>
      </div>
    </div>
  );
}

*** Add File: src/components/auth/SignUp.tsx
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { signIn, type AccountType } from "@/data/authStore";

export function SignUp({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState<AccountType>("teen");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !password) return;
    signIn({ name, email, accountType });
    onDone();
  }

  return (
    <div className="min-h-screen px-6 pb-10 pt-10">
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-muted-foreground">
        <ChevronLeft className="h-4 w-4" /> Back
      </button>
      <h1 className="mt-6 text-3xl font-bold text-foreground">Create your account</h1>
      <p className="mt-1 text-sm text-muted-foreground">Start your driving journey today.</p>

      <form onSubmit={submit} className="mt-8 space-y-4">
        <Field label="Full Name">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
            placeholder="Alex Johnson"
          />
        </Field>
        <Field label="Email">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
            placeholder="you@example.com"
          />
        </Field>
        <Field label="Password">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
            placeholder="••••••••"
          />
        </Field>
        <Field label="I am a...">
          <select
            value={accountType}
            onChange={(e) => setAccountType(e.target.value as AccountType)}
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
          >
            <option value="teen">Teen Driver</option>
            <option value="parent">Parent</option>
          </select>
        </Field>

        <button
          type="submit"
          className="mt-2 flex w-full items-center justify-center rounded-2xl px-6 py-4 text-base font-semibold text-primary-foreground transition-transform active:scale-[0.98]"
          style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
        >
          Create Account
        </button>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

*** Add File: src/components/auth/SignIn.tsx
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { signIn } from "@/data/authStore";

export function SignIn({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    const name = email.split("@")[0].replace(/\W/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "Driver";
    signIn({ name, email, accountType: "teen" });
    onDone();
  }

  return (
    <div className="min-h-screen px-6 pb-10 pt-10">
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-muted-foreground">
        <ChevronLeft className="h-4 w-4" /> Back
      </button>
      <h1 className="mt-6 text-3xl font-bold text-foreground">Welcome back</h1>
      <p className="mt-1 text-sm text-muted-foreground">Log in to continue your progress.</p>

      <form onSubmit={submit} className="mt-8 space-y-4">
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
            placeholder="you@example.com"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
            placeholder="••••••••"
          />
        </label>

        <div className="text-right">
          <button type="button" className="text-xs font-medium text-primary hover:underline">
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          className="mt-2 flex w-full items-center justify-center rounded-2xl px-6 py-4 text-base font-semibold text-primary-foreground transition-transform active:scale-[0.98]"
          style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
        >
          Log In
        </button>
      </form>
    </div>
  );
}

*** Add File: src/components/auth/ProfileMenu.tsx
import { useEffect, useRef, useState } from "react";
import { User as UserIcon, LogOut } from "lucide-react";
import { signOut, type User } from "@/data/authStore";

export function ProfileMenu({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary transition-colors hover:bg-primary/25"
        aria-label="Profile menu"
      >
        <UserIcon className="h-5 w-5" />
      </button>
      {open && (
        <div
          className="absolute right-0 top-12 z-50 w-60 rounded-2xl border border-border p-4 shadow-xl"
          style={{ background: "var(--card)" }}
        >
          <div className="text-sm font-semibold text-foreground">{user.name}</div>
          <div className="mt-0.5 text-xs text-muted-foreground">{user.email}</div>
          <span className="mt-2 inline-block rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary">
            {user.accountType === "teen" ? "Teen Driver" : "Parent"}
          </span>
          <button
            onClick={() => {
              signOut();
              setOpen(false);
              onLogout();
            }}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-muted py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground"
          >
            <LogOut className="h-4 w-4" /> Log Out
          </button>
        </div>
      )}
    </div>
  );
}

*** Add File: src/components/ThemeManager.tsx
import { useEffect } from "react";

/** Syncs the `dark` class on <html> to the OS preference, live. */
export function ThemeManager() {
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = (dark: boolean) => {
      document.documentElement.classList.toggle("dark", dark);
    };
    apply(mq.matches);
    const handler = (e: MediaQueryListEvent) => apply(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return null;
}

*** Add File: src/hooks/useDarkMode.ts
import { useEffect, useState } from "react";

export function useDarkMode(): boolean {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setDark(mq.matches);
    const handler = (e: MediaQueryListEvent) => setDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return dark;
}