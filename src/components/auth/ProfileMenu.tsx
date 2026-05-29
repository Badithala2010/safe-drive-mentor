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