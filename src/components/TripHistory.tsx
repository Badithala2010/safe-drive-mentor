import { useEffect, useState } from "react";
import { ChevronRight, ChevronLeft, Moon, Sun, Sparkles, Clock, MapPin } from "lucide-react";
import { eventMeta, type Trip } from "@/data/mockData";
import { useTrips } from "@/data/tripsStore";
import { TripMap } from "./TripMap";

function scoreColor(score: number) {
  if (score >= 90) return "text-primary";
  if (score >= 80) return "text-accent";
  if (score >= 70) return "text-warning";
  return "text-destructive";
}

export function TripHistory({ initialSelectedId, onConsumeSelected }: { initialSelectedId?: string | null; onConsumeSelected?: () => void } = {}) {
  const trips = useTrips();
  const [selected, setSelected] = useState<Trip | null>(null);

  useEffect(() => {
    if (initialSelectedId) {
      const t = trips.find((x) => x.id === initialSelectedId);
      if (t) {
        setSelected(t);
        onConsumeSelected?.();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSelectedId]);

  if (selected) return <TripDetail trip={selected} onBack={() => setSelected(null)} />;

  return (
    <div className="px-5 pb-8 pt-6">
      <h1 className="text-2xl font-bold text-foreground">Trip History</h1>
      <p className="text-sm text-muted-foreground">{trips.length} drives · {trips.reduce((a, t) => a + parseFloat(t.distance), 0).toFixed(1)} mi total</p>

      <div className="mt-5 space-y-3">
        {trips.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelected(t)}
            className="w-full rounded-2xl border border-border p-4 text-left transition-colors hover:border-primary/40"
            style={{ background: "var(--gradient-card)" }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {t.isNight ? <Moon className="h-3 w-3" /> : <Sun className="h-3 w-3" />}
                  {t.date}
                </div>
                <div className="mt-2 flex items-center gap-3 text-sm text-foreground">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-muted-foreground" />{t.duration}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-muted-foreground" />{t.distance}</span>
                </div>
                <div className="mt-3 flex gap-1.5">
                  {t.events.length === 0 ? (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">Perfect drive</span>
                  ) : (
                    t.events.map((e, i) => (
                      <span key={i} className={`h-2 w-2 rounded-full ${eventMeta[e.type].bg}`} />
                    ))
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className={`text-2xl font-bold ${scoreColor(t.score)}`}>{t.score}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Score</div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function TripDetail({ trip, onBack }: { trip: Trip; onBack: () => void }) {
  return (
    <div className="px-5 pb-8 pt-6">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" /> Back to trips
      </button>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{trip.date}</h1>
          <p className="text-sm text-muted-foreground">{trip.duration} · {trip.distance}</p>
        </div>
        <div className={`text-4xl font-bold ${scoreColor(trip.score)}`}>{trip.score}</div>
      </div>

      <div className="mt-5">
        <TripMap trip={trip} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {(["brake", "accel", "speed"] as const).map((k) => (
          <div key={k} className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-foreground">
            <span className={`h-2.5 w-2.5 rounded-full ${eventMeta[k].bg}`} />
            {eventMeta[k].label}
            <span className="text-muted-foreground">· {trip.events.filter((e) => e.type === k).length}</span>
          </div>
        ))}
      </div>

      <div
        className="mt-5 rounded-2xl border border-primary/30 p-4"
        style={{ background: "var(--gradient-card)" }}
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">AI Coach Summary</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Personalized feedback</div>
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-foreground/90">{trip.summary}</p>
      </div>

      {trip.events.length > 0 && (
        <div className="mt-5">
          <h2 className="text-sm font-semibold text-foreground">Flagged Events</h2>
          <div className="mt-2 space-y-2">
            {trip.events.map((e, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
                <span className={`h-3 w-3 rounded-full ${eventMeta[e.type].bg}`} />
                <div className="flex-1">
                  <div className="text-sm text-foreground">{e.label}</div>
                  <div className="text-xs text-muted-foreground">{e.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}