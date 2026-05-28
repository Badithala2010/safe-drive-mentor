import { useEffect, useState } from "react";
import { Gauge, Square } from "lucide-react";
import { ActiveDriveMap } from "./ActiveDriveMap";

function fmt(sec: number) {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function ActiveDrive({ onEnd }: { onEnd: () => void }) {
  const [seconds, setSeconds] = useState(0);
  const [speed, setSpeed] = useState(35);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      const next = 35 + Math.round((Math.random() - 0.5) * 10);
      setSpeed(Math.max(25, Math.min(48, next)));
    }, 1500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="px-5 pb-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-primary">● Drive in Progress</p>
          <h1 className="text-2xl font-bold text-foreground">Tracking your drive</h1>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">LIVE</span>
      </div>

      <div
        className="mt-6 flex flex-col items-center rounded-3xl border border-border p-6"
        style={{ background: "var(--gradient-card)", boxShadow: "var(--shadow-glow)" }}
      >
        <span className="text-xs uppercase tracking-widest text-muted-foreground">Stopwatch</span>
        <div className="mt-2 font-mono text-6xl font-bold tabular-nums text-foreground tracking-wider">
          {fmt(seconds)}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-border p-4" style={{ background: "var(--gradient-card)" }}>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Gauge className="h-4 w-4" />
            <span className="text-xs uppercase tracking-wider">Speed</span>
          </div>
          <div className="mt-2 font-mono text-4xl font-bold tabular-nums text-foreground">{speed}</div>
          <div className="text-xs text-muted-foreground">mph</div>
        </div>
        <div className="rounded-2xl border border-border p-4" style={{ background: "var(--gradient-card)" }}>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Status</div>
          <div className="mt-2 text-base font-semibold text-foreground">Cruising</div>
          <div className="mt-1 text-xs text-muted-foreground">GPS lock · clean signal</div>
          <div className="mt-3 flex gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className="h-1.5 flex-1 rounded-full"
                style={{
                  background:
                    i < Math.round((speed - 25) / 5)
                      ? "var(--gradient-primary)"
                      : "var(--muted)",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <ActiveDriveMap />
      </div>

      <button
        onClick={onEnd}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-destructive px-6 py-4 text-base font-semibold text-destructive-foreground transition-transform active:scale-[0.98]"
      >
        <Square className="h-5 w-5" fill="currentColor" />
        End & Save Drive
      </button>
    </div>
  );
}