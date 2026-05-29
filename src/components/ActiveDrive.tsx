import { useEffect, useState } from "react";
import { Square } from "lucide-react";
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
    <div className="flex h-screen flex-col bg-background">
      {/* Compact top status bar */}
      <div className="flex items-center justify-between gap-3 border-b border-border bg-card/80 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-destructive" />
          <span className="text-xs font-semibold uppercase tracking-wider text-foreground">Live</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="font-mono text-base font-bold tabular-nums text-foreground">{fmt(seconds)}</div>
            <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Time</div>
          </div>
          <div className="h-7 w-px bg-border" />
          <div className="text-center">
            <div className="font-mono text-base font-bold tabular-nums text-primary">{speed}</div>
            <div className="text-[9px] uppercase tracking-wider text-muted-foreground">mph</div>
          </div>
          <div className="h-7 w-px bg-border" />
          <div className="flex flex-col items-center">
            <div className="flex h-7 w-7 items-center justify-center rounded-md border-2 border-destructive bg-card text-xs font-bold text-destructive">
              35
            </div>
            <div className="mt-0.5 text-[9px] uppercase tracking-wider text-muted-foreground">Limit</div>
          </div>
        </div>
      </div>

      {/* Large map — dominates the view */}
      <div className="relative flex-1">
        <ActiveDriveMap className="h-full" />
      </div>

      {/* Sleek bottom action bar */}
      <div className="border-t border-border bg-card/95 px-5 py-3 backdrop-blur">
        <button
          onClick={onEnd}
          className="mx-auto flex h-11 w-full max-w-xs items-center justify-center gap-2 rounded-full bg-destructive px-6 text-sm font-semibold text-destructive-foreground shadow-md transition-transform active:scale-[0.98]"
        >
          <Square className="h-3.5 w-3.5" fill="currentColor" />
          End & Save Drive
        </button>
      </div>
    </div>
  );
}