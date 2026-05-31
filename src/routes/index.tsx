import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Gauge, Map, Users, Trophy, Loader2 } from "lucide-react";
import { Dashboard } from "@/components/Dashboard";
import { TripHistory } from "@/components/TripHistory";
import { ParentPortal } from "@/components/ParentPortal";
import { ActiveDrive } from "@/components/ActiveDrive";
import { DriveSuccess } from "@/components/DriveSuccess";
import { Rewards } from "@/components/Rewards";
import { Welcome } from "@/components/auth/Welcome";
import { SignUp } from "@/components/auth/SignUp";
import { SignIn } from "@/components/auth/SignIn";
import { ProfileMenu } from "@/components/auth/ProfileMenu";
import { ThemeManager } from "@/components/ThemeManager";
import { useAddTrip, type NewTripInput } from "@/data/tripsStore";
import { pointsForTrip } from "@/data/rewardsStore";
import { useAuth } from "@/data/authStore";
import type { TrackerSummary } from "@/hooks/useLocationTracker";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DriveReady AI — Smart Coaching for New Drivers" },
      { name: "description", content: "AI-powered driving coach for teens. Track logged hours, get trip-by-trip feedback, and let parents sign off securely." },
      { property: "og:title", content: "DriveReady AI" },
      { property: "og:description", content: "AI-powered driving coach for teens." },
    ],
  }),
  component: Index,
});

type Tab = "dashboard" | "trips" | "rewards" | "parent";
type Flow = "idle" | "active" | "processing" | "success";
type AuthView = "welcome" | "signup" | "signin" | "loading";

const tabs: { id: Tab; label: string; icon: any }[] = [
  { id: "dashboard", label: "Drive", icon: Gauge },
  { id: "trips", label: "Trips", icon: Map },
  { id: "rewards", label: "Rewards", icon: Trophy },
  { id: "parent", label: "Parent", icon: Users },
];

function Index() {
  const { user, loading } = useAuth();
  const addTripMutation = useAddTrip();
  const [tab, setTab] = useState<Tab>("dashboard");
  const [flow, setFlow] = useState<Flow>("idle");
  const [savedTripId, setSavedTripId] = useState<string | null>(null);
  const [pendingSelectedId, setPendingSelectedId] = useState<string | null>(null);
  const [highlightRewardTripId, setHighlightRewardTripId] = useState<string | null>(null);
  const [authView, setAuthView] = useState<AuthView>("welcome");
  const [lastSummary, setLastSummary] = useState<{ durationMin: number; avgSpeed: number; score: number } | null>(null);

  function handleAuthSuccess() {
    setAuthView("loading");
    setTimeout(() => {
      setAuthView("welcome");
    }, 1000);
  }

  function startDrive() {
    setFlow("active");
  }

  function endDrive(summary: TrackerSummary) {
    setFlow("processing");
    const isNight = new Date().getHours() >= 19 || new Date().getHours() < 6;
    const durationMin = Math.max(1, Math.round(summary.durationSec / 60));
    const avgSpeed = Math.round(summary.avgSpeedMph);
    // Real telemetry-derived score: penalize hard events and excessive max speed.
    const speedPenalty = Math.max(0, summary.maxSpeedMph - 65) * 0.6;
    const eventPenalty = summary.hardEvents * 4;
    const score = Math.max(40, Math.min(100, Math.round(100 - speedPenalty - eventPenalty)));
    setLastSummary({ durationMin, avgSpeed, score });

    const route = summary.route.length ? summary.route : [];
    const input: NewTripInput = {
      date: new Date().toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      duration: `${durationMin} min`,
      durationMin,
      distance: `${summary.distanceMi.toFixed(1)} mi`,
      distanceMi: summary.distanceMi,
      score,
      isNight,
      route,
      events: [],
      summary:
        summary.hardEvents > 0
          ? `Detected ${summary.hardEvents} hard motion event${summary.hardEvents === 1 ? "" : "s"}. Average ${avgSpeed} mph over ${summary.distanceMi.toFixed(1)} mi — focus on smoother acceleration and braking.`
          : `Smooth drive. Average ${avgSpeed} mph over ${summary.distanceMi.toFixed(1)} mi with no hard motion events detected.`,
      points: 0,
    };
    input.points = pointsForTrip({
      id: "tmp", date: input.date, duration: input.duration, distance: input.distance,
      score: input.score, isNight: input.isNight, route: input.route, events: input.events,
      summary: input.summary, signed: false, durationMin: input.durationMin, distanceMi: input.distanceMi,
    });
    addTripMutation.mutate(input, {
      onSuccess: (trip) => {
        setSavedTripId(trip.id);
        setFlow("success");
      },
      onError: (e: any) => {
        toast.error("Couldn't save drive", { description: e?.message ?? "Try again" });
        setFlow("idle");
      },
    });
  }

  function viewReport() {
    if (savedTripId) {
      setPendingSelectedId(savedTripId);
      setHighlightRewardTripId(savedTripId);
    }
    setFlow("idle");
    setTab("trips");
  }

  // ---------- AUTH GATE ----------
  if (loading) {
    return (
      <>
        <ThemeManager />
        <div className="mx-auto flex min-h-screen w-full max-w-md items-center justify-center bg-background">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </>
    );
  }

  if (!user) {
    if (authView === "loading") {
      return (
        <>
          <ThemeManager />
          <div className="mx-auto flex min-h-screen w-full max-w-md items-center justify-center bg-background">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        </>
      );
    }
    return (
      <>
        <ThemeManager />
        <div className="mx-auto min-h-screen w-full max-w-md bg-background">
          {authView === "welcome" && (
            <Welcome
              onSignUp={() => setAuthView("signup")}
              onSignIn={() => setAuthView("signin")}
            />
          )}
          {authView === "signup" && (
            <SignUp onBack={() => setAuthView("welcome")} onDone={handleAuthSuccess} />
          )}
          {authView === "signin" && (
            <SignIn onBack={() => setAuthView("welcome")} onDone={handleAuthSuccess} />
          )}
        </div>
        <Toaster position="top-center" />
      </>
    );
  }

  if (flow === "active") {
    return (
      <>
        <ThemeManager />
        <div className="mx-auto min-h-screen w-full max-w-md bg-background">
          <ActiveDrive onEnd={endDrive} />
          <Toaster position="top-center" />
        </div>
      </>
    );
  }

  if (flow === "success" && savedTripId) {
    const s = lastSummary ?? { durationMin: 0, avgSpeed: 0, score: 0 };
    return (
      <>
        <ThemeManager />
        <div className="mx-auto min-h-screen w-full max-w-md bg-background">
          <DriveSuccess
            duration={`${s.durationMin} min`}
            avgSpeed={s.avgSpeed}
            score={s.score}
            onViewReport={viewReport}
          />
          <Toaster position="top-center" />
        </div>
      </>
    );
  }

  return (
    <>
    <ThemeManager />
    <div className="mx-auto min-h-screen w-full max-w-md bg-background pb-24">
      <div className="absolute right-4 top-4 z-40">
        <ProfileMenu user={user} onLogout={() => setTab("dashboard")} />
      </div>
      {tab === "dashboard" && <Dashboard onStartDrive={startDrive} />}
      {tab === "trips" && (
        <TripHistory
          initialSelectedId={pendingSelectedId}
          onConsumeSelected={() => setPendingSelectedId(null)}
        />
      )}
      {tab === "rewards" && (
        <Rewards highlightTripId={highlightRewardTripId} />
      )}
      {tab === "parent" && <ParentPortal />}

      <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="grid grid-cols-4">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="flex flex-col items-center gap-1 py-3 transition-colors"
              >
                <Icon
                  className={`h-5 w-5 ${active ? "text-primary" : "text-muted-foreground"}`}
                />
                <span className={`text-[11px] font-medium ${active ? "text-primary" : "text-muted-foreground"}`}>
                  {t.label}
                </span>
                {active && (
                  <span className="h-0.5 w-8 rounded-full" style={{ background: "var(--gradient-primary)" }} />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      <Toaster position="top-center" />

      {flow === "processing" && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-6 text-base font-semibold text-foreground">
            Saving Telemetry to Cloud
          </p>
          <p className="mt-1 text-sm text-muted-foreground">Analyzing Drive...</p>
        </div>
      )}
    </div>
    </>
  );
}
