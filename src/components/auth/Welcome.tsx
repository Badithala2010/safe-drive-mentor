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