import { useState } from "react";
import { ChevronLeft, Loader2 } from "lucide-react";
import { signUpWithEmail, type AccountType } from "@/data/authStore";
import { toast } from "sonner";

export function SignUp({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState<AccountType>("teen");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !password) return;
    setBusy(true);
    try {
      await signUpWithEmail({ name, email, password, accountType });
      toast.success("Account created");
      onDone();
    } catch (err: any) {
      toast.error(err?.message ?? "Sign up failed");
    } finally {
      setBusy(false);
    }
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
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none focus:border-primary" placeholder="Alex Johnson" />
        </Field>
        <Field label="Email">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none focus:border-primary" placeholder="you@example.com" />
        </Field>
        <Field label="Password">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none focus:border-primary" placeholder="••••••••" />
        </Field>
        <Field label="I am a...">
          <select value={accountType} onChange={(e) => setAccountType(e.target.value as AccountType)}
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none focus:border-primary">
            <option value="teen">Teen Driver</option>
            <option value="parent">Parent</option>
          </select>
        </Field>
        <button type="submit" disabled={busy}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-semibold text-primary-foreground transition-transform active:scale-[0.98] disabled:opacity-60"
          style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}>
          {busy && <Loader2 className="h-4 w-4 animate-spin" />} Create Account
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
