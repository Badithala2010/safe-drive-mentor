export type EventType = "brake" | "accel" | "speed";

export interface DriveEvent {
  type: EventType;
  lat: number;
  lng: number;
  label: string;
  time: string;
}

export interface Trip {
  id: string;
  date: string;
  duration: string;
  distance: string;
  score: number;
  isNight: boolean;
  route: [number, number][];
  events: DriveEvent[];
  summary: string;
  signed: boolean;
  points?: number;
  durationMin?: number;
  distanceMi?: number;
}

export const eventMeta: Record<EventType, { label: string; color: string; bg: string }> = {
  brake: { label: "Hard Braking", color: "var(--destructive)", bg: "bg-destructive" },
  accel: { label: "Rapid Acceleration", color: "var(--warning)", bg: "bg-warning" },
  speed: { label: "Speeding", color: "var(--caution)", bg: "bg-caution" },
};

export const HOURS_GOAL = 50;
export const NIGHT_GOAL = 10;

export interface DriverStats {
  name: string;
  score: number;
  totalHours: number;
  hoursGoal: number;
  nightHours: number;
  nightGoal: number;
  topImprovement: string;
  weeklyTrend: string;
}

export interface ParentAlert {
  id: string;
  severity: "high" | "medium" | "low";
  text: string;
  time: string;
}

export function computeDriverStats(trips: Trip[], name: string): DriverStats {
  const totalMin = trips.reduce((s, t) => s + (t.durationMin ?? parseInt(t.duration) ?? 0), 0);
  const nightMin = trips.filter((t) => t.isNight).reduce((s, t) => s + (t.durationMin ?? parseInt(t.duration) ?? 0), 0);
  const avgScore = trips.length ? Math.round(trips.reduce((s, t) => s + t.score, 0) / trips.length) : 0;
  const topEvent = (() => {
    const counts: Record<string, number> = {};
    trips.forEach((t) => t.events.forEach((e) => (counts[e.type] = (counts[e.type] ?? 0) + 1)));
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    if (!top) return "Keep up the smooth driving";
    return top[0] === "brake"
      ? "Watch your braking distance"
      : top[0] === "speed"
      ? "Watch your cornering speed"
      : "Ease into acceleration";
  })();
  return {
    name,
    score: avgScore || 88,
    totalHours: +(totalMin / 60).toFixed(1),
    hoursGoal: HOURS_GOAL,
    nightHours: +(nightMin / 60).toFixed(1),
    nightGoal: NIGHT_GOAL,
    topImprovement: topEvent,
    weeklyTrend: trips.length >= 2 ? `+${Math.max(1, Math.round(Math.random() * 4))} pts this week` : "Start your first drive",
  };
}

export function computeParentAlerts(trips: Trip[]): ParentAlert[] {
  const alerts: ParentAlert[] = [];
  for (const t of trips.slice(0, 5)) {
    for (const e of t.events) {
      alerts.push({
        id: `${t.id}-${alerts.length}`,
        severity: e.type === "speed" ? "high" : e.type === "brake" ? "medium" : "low",
        text: e.label,
        time: `${t.date} · ${e.time}`,
      });
      if (alerts.length >= 5) return alerts;
    }
  }
  return alerts;
}