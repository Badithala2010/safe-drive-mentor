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