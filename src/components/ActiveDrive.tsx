import { useEffect, useMemo, useRef, useState } from "react";
import { Square, AlertCircle } from "lucide-react";
import { ActiveDriveMap } from "./ActiveDriveMap";
import { useLocationTracker, type TrackerSummary } from "@/hooks/useLocationTracker";

function fmt(sec: number) {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function ActiveDrive({ onEnd }: { onEnd: (summary: TrackerSummary) => void }) {
  const [seconds, setSeconds] = useState(0);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [routePoints, setRoutePoints] = useState<[number, number][]>([]);
  const { startTracking, stopTracking, latest } = useLocationTracker();
  const startedRef = useRef(false);

  // Kick off real geolocation tracking immediately — this triggers the browser permission prompt.
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setPermissionError("Geolocation is not supported on this device.");
      return;
    }
    // Probe permission via a one-shot getCurrentPosition so the prompt is explicit, then start watching.
    navigator.geolocation.getCurrentPosition(
      () => startTracking(),
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setPermissionError("Location permission denied. Enable it in your browser to track drives.");
        } else {
          setPermissionError("Unable to acquire GPS signal. Move to an area with better reception.");
        }
      },
      { enableHighAccuracy: true, timeout: 10_000 },
    );
  }, [startTracking]);

  // Wall-clock stopwatch
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // Append live GPS samples to the rendered route
  useEffect(() => {
    if (!latest) return;
    setRoutePoints((prev) => {
      const last = prev[prev.length - 1];
      if (last && last[0] === latest.lat && last[1] === latest.lng) return prev;
      return [...prev, [latest.lat, latest.lng]];
    });
  }, [latest]);

  const speed = useMemo(() => Math.round(latest?.speedMph ?? 0), [latest]);
  const position: [number, number] | null = latest ? [latest.lat, latest.lng] : null;

  function handleEnd() {
    const summary = stopTracking();
    onEnd(summary);
  }

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
        <ActiveDriveMap className="h-full" position={position} route={routePoints} />
        {permissionError && (
          <div className="absolute inset-x-4 top-4 flex items-start gap-2 rounded-xl border border-destructive/30 bg-card/95 px-3 py-2 text-xs text-foreground shadow-md backdrop-blur">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-none text-destructive" />
            <span>{permissionError}</span>
          </div>
        )}
        {!permissionError && !latest && (
          <div className="absolute inset-x-4 top-4 rounded-xl border border-border bg-card/95 px-3 py-2 text-center text-xs text-muted-foreground shadow-md backdrop-blur">
            Acquiring GPS signal…
          </div>
        )}
      </div>

      {/* Sleek bottom action bar */}
      <div className="border-t border-border bg-card/95 px-5 py-3 backdrop-blur">
        <button
          onClick={handleEnd}
          className="mx-auto flex h-11 w-full max-w-xs items-center justify-center gap-2 rounded-full bg-destructive px-6 text-sm font-semibold text-destructive-foreground shadow-md transition-transform active:scale-[0.98]"
        >
          <Square className="h-3.5 w-3.5" fill="currentColor" />
          End & Save Drive
        </button>
      </div>
    </div>
  );
}