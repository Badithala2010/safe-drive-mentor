import { useState } from "react";
import { Shield, AlertTriangle, CheckCircle2, Bell, TrendingUp } from "lucide-react";
import { parentAlerts, driverStats } from "@/data/mockData";
import { useTrips } from "@/data/tripsStore";
import { toast } from "sonner";

const severityStyles = {
  high: "border-destructive/40 bg-destructive/10 text-destructive",
  medium: "border-warning/40 bg-warning/10 text-warning",
  low: "border-primary/40 bg-primary/10 text-primary",
} as const;

export function ParentPortal() {
  const trips = useTrips();
  const [signed, setSigned] = useState<Record<string, boolean>>(
    Object.fromEntries(trips.map((t) => [t.id, t.signed])),
  );

  const totalHours = driverStats.totalHours;
  const signedTrips = Object.values(signed).filter(Boolean).length;

  return (
    <div className="px-5 pb-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Parent Portal</p>
          <h1 className="text-2xl font-bold text-foreground">Alex's Progress</h1>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15">
          <Shield className="h-5 w-5 text-accent" />
        </div>
      </div>

      <div
        className="mt-5 rounded-2xl border border-border p-5"
        style={{ background: "var(--gradient-card)" }}
      >
        <div className="flex items-baseline justify-between">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">Toward License</span>
          <span className="flex items-center gap-1 text-xs text-primary">
            <TrendingUp className="h-3 w-3" /> on track
          </span>
        </div>
        <div className="mt-2 text-3xl font-bold text-foreground">
          {totalHours} <span className="text-base font-normal text-muted-foreground">/ {driverStats.hoursGoal} hrs</span>
        </div>
        <div className="mt-3 h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{ width: `${(totalHours / driverStats.hoursGoal) * 100}%`, background: "var(--gradient-primary)" }}
          />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-lg font-bold text-foreground">{driverStats.score}</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Score</div>
          </div>
          <div>
            <div className="text-lg font-bold text-foreground">{driverStats.nightHours}h</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Night</div>
          </div>
          <div>
            <div className="text-lg font-bold text-foreground">{signedTrips}</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Signed</div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2">
        <Bell className="h-4 w-4 text-warning" />
        <h2 className="text-sm font-semibold text-foreground">Recent Alerts</h2>
      </div>
      <div className="mt-3 space-y-2">
        {parentAlerts.map((a) => (
          <div key={a.id} className={`flex items-start gap-3 rounded-xl border p-3 ${severityStyles[a.severity]}`}>
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <div className="flex-1">
              <div className="text-sm font-medium text-foreground">{a.text}</div>
              <div className="text-xs text-muted-foreground">{a.time}</div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-6 text-sm font-semibold text-foreground">Sign Off Logged Hours</h2>
      <p className="text-xs text-muted-foreground">Verify each drive for the DMV log.</p>
      <div className="mt-3 space-y-2">
        {trips.map((t) => (
          <div key={t.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-3">
            <div className="flex-1">
              <div className="text-sm text-foreground">{t.date}</div>
              <div className="text-xs text-muted-foreground">{t.duration} · {t.distance} · score {t.score}</div>
            </div>
            {signed[t.id] ? (
              <span className="flex items-center gap-1 rounded-full bg-primary/15 px-3 py-1.5 text-xs font-medium text-primary">
                <CheckCircle2 className="h-3.5 w-3.5" /> Signed
              </span>
            ) : (
              <button
                onClick={() => {
                  setSigned((s) => ({ ...s, [t.id]: true }));
                  toast.success("Drive signed off", { description: `${t.duration} added to official log.` });
                }}
                className="rounded-full px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                style={{ background: "var(--gradient-primary)" }}
              >
                Sign
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}