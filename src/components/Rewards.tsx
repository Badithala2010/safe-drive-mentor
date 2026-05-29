import { Trophy, Sparkles, Lock } from "lucide-react";
import { useTrips } from "@/data/tripsStore";
import { useTotalXp, getLevel, BADGES, getRecentTripPoints } from "@/data/rewardsStore";

export function Rewards({ highlightTripId }: { highlightTripId?: string | null }) {
  const trips = useTrips();
  const xp = useTotalXp();
  const { level, next, progress, xpToNext } = getLevel(xp);
  const recentPts = highlightTripId ? getRecentTripPoints(highlightTripId) : undefined;

  return (
    <div className="px-5 pb-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Rewards & Levels</p>
          <h1 className="text-2xl font-bold text-foreground">Your XP</h1>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15">
          <Trophy className="h-5 w-5 text-primary" />
        </div>
      </div>

      {recentPts !== undefined && (
        <div
          className="mt-4 flex items-center gap-3 rounded-2xl border border-primary/30 p-3"
          style={{ background: "var(--gradient-card)" }}
        >
          <Sparkles className="h-5 w-5 text-primary" />
          <div className="flex-1">
            <div className="text-sm font-semibold text-foreground">+{recentPts} pts earned</div>
            <div className="text-xs text-muted-foreground">From your latest drive</div>
          </div>
        </div>
      )}

      <div
        className="mt-5 rounded-3xl border border-border p-6 text-center"
        style={{ background: "var(--gradient-card)", boxShadow: "var(--shadow-glow)" }}
      >
        <span className="text-xs uppercase tracking-widest text-muted-foreground">Total Driver XP</span>
        <div className="mt-2 text-5xl font-bold text-foreground tabular-nums">
          {xp.toLocaleString()}
          <span className="ml-1 text-lg font-medium text-muted-foreground">pts</span>
        </div>

        <div className="mt-6 flex items-center justify-between text-xs">
          <span className="font-semibold text-primary">Level {level.num}: {level.name}</span>
          <span className="text-muted-foreground">
            {level.num === next.num ? "Max level" : `Level ${next.num}: ${next.name}`}
          </span>
        </div>
        <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${progress}%`, background: "var(--gradient-primary)" }}
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {xpToNext > 0 ? `${xpToNext.toLocaleString()} pts to next level` : "You've reached the top tier!"}
        </p>
      </div>

      <h2 className="mt-7 text-sm font-semibold text-foreground">Milestone Badges</h2>
      <p className="text-xs text-muted-foreground">Unlock badges as you progress.</p>

      <div className="mt-3 grid grid-cols-2 gap-3">
        {BADGES.map((b) => {
          const unlocked = b.unlocked(trips);
          return (
            <div
              key={b.id}
              className={`rounded-2xl border p-4 transition-opacity ${
                unlocked ? "border-primary/30" : "border-border opacity-60"
              }`}
              style={{ background: "var(--gradient-card)" }}
            >
              <div className="flex items-start justify-between">
                <div className="text-3xl">{b.icon}</div>
                {!unlocked && <Lock className="h-3.5 w-3.5 text-muted-foreground" />}
              </div>
              <div className="mt-2 text-sm font-semibold text-foreground">{b.name}</div>
              <div className="mt-1 text-[11px] leading-snug text-muted-foreground">{b.desc}</div>
              {unlocked && (
                <span className="mt-2 inline-block rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium text-primary">
                  Unlocked
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}