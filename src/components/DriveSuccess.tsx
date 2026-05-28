import { CheckCircle2, Clock, Gauge, Sparkles } from "lucide-react";

export function DriveSuccess({
  duration,
  avgSpeed,
  score,
  onViewReport,
}: {
  duration: string;
  avgSpeed: number;
  score: number;
  onViewReport: () => void;
}) {
  return (
    <div className="px-5 pb-8 pt-10">
      <div className="flex flex-col items-center text-center">
        <div
          className="flex h-20 w-20 items-center justify-center rounded-full"
          style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
        >
          <CheckCircle2 className="h-10 w-10 text-primary-foreground" />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-foreground">
          Drive Successfully Saved to Log!
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your telemetry has been analyzed and added to your record.
        </p>
      </div>

      <div
        className="mt-8 rounded-3xl border border-border p-6"
        style={{ background: "var(--gradient-card)" }}
      >
        <div className="text-xs uppercase tracking-widest text-muted-foreground">
          Trip Summary
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div className="mt-2 text-2xl font-bold text-foreground">{duration}</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Duration
            </div>
          </div>
          <div className="flex flex-col items-center">
            <Gauge className="h-5 w-5 text-muted-foreground" />
            <div className="mt-2 text-2xl font-bold text-foreground">{avgSpeed}</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Avg mph
            </div>
          </div>
          <div className="flex flex-col items-center">
            <Sparkles className="h-5 w-5 text-primary" />
            <div className="mt-2 text-2xl font-bold text-primary">{score}</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Score
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onViewReport}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-semibold text-primary-foreground transition-transform active:scale-[0.98]"
        style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
      >
        View Full Report
      </button>
    </div>
  );
}