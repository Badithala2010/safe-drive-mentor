import { Car, Clock, Moon, TrendingUp, AlertTriangle } from "lucide-react";
import { ScoreRing } from "./ScoreRing";
import { useTrips } from "@/data/tripsStore";
import { computeDriverStats, HOURS_GOAL, NIGHT_GOAL } from "@/data/mockData";
import { useAuth } from "@/data/authStore";

function MetricCard({
  icon: Icon,
  label,
  value,
  sub,
  progress,
}: {
  icon: any;
  label: string;
  value: string;
  sub?: string;
  progress?: number;
}) {
  return (
    <div
      className="rounded-2xl border border-border p-4"
      style={{ background: "var(--gradient-card)" }}
    >
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span className="text-xs uppercase tracking-wider">{label}</span>
      </div>
      <div className="mt-2 text-2xl font-semibold text-foreground">{value}</div>
      {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
      {progress !== undefined && (
        <div className="mt-3 h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{ width: `${progress}%`, background: "var(--gradient-primary)" }}
          />
        </div>
      )}
    </div>
  );
}

export function Dashboard({ onStartDrive }: { onStartDrive: () => void }) {
  const trips = useTrips();
  const { user } = useAuth();
  const driverStats = computeDriverStats(trips, user?.name ?? "Driver");
  const hasTrips = trips.length > 0;
  void HOURS_GOAL; void NIGHT_GOAL;
  return (
    <div className="px-5 pb-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Welcome back,</p>
          <h1 className="text-2xl font-bold text-foreground">{driverStats.name}</h1>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5 text-xs text-primary">
          <TrendingUp className="h-3 w-3" />
          {driverStats.weeklyTrend}
        </div>
      </div>

      <div
        className="mt-6 flex flex-col items-center rounded-3xl border border-border p-6"
        style={{ background: "var(--gradient-card)", boxShadow: "var(--shadow-glow)" }}
      >
        <span className="text-xs uppercase tracking-widest text-muted-foreground">
          Safe Driving Score
        </span>
        {hasTrips ? (
          <>
            <div className="mt-4">
              <ScoreRing score={driverStats.score} />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Based on {trips.length} logged {trips.length === 1 ? "trip" : "trips"}
            </p>
          </>
        ) : (
          <>
            <div className="mt-4 flex h-32 w-32 items-center justify-center rounded-full border-2 border-dashed border-border">
              <Car className="h-10 w-10 text-muted-foreground" />
            </div>
            <p className="mt-4 text-sm font-medium text-foreground">Ready for your first drive</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Your Safe Driving Score will appear after your first logged trip.
            </p>
          </>
        )}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <MetricCard
          icon={Clock}
          label="Total Hours"
          value={`${driverStats.totalHours}/${driverStats.hoursGoal}`}
          sub="hours logged"
          progress={(driverStats.totalHours / driverStats.hoursGoal) * 100}
        />
        <MetricCard
          icon={Moon}
          label="Night Hours"
          value={`${driverStats.nightHours}/${driverStats.nightGoal}`}
          sub="after sunset"
          progress={(driverStats.nightHours / driverStats.nightGoal) * 100}
        />
      </div>

      <div
        className="mt-3 rounded-2xl border border-border p-4"
        style={{ background: "var(--gradient-card)" }}
      >
        <div className="flex items-center gap-2 text-muted-foreground">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <span className="text-xs uppercase tracking-wider">
            {hasTrips ? "Top Area to Improve" : "AI Coach"}
          </span>
        </div>
        <p className="mt-2 text-base font-medium text-foreground">
          {driverStats.topImprovement}
        </p>
        {hasTrips && (
          <p className="mt-1 text-xs text-muted-foreground">
            Tips are generated from your real telemetry after each trip.
          </p>
        )}
      </div>

      <button
        onClick={onStartDrive}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-semibold text-primary-foreground transition-transform active:scale-[0.98]"
        style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
      >
        <Car className="h-5 w-5" />
        Start New Drive
      </button>
    </div>
  );
}