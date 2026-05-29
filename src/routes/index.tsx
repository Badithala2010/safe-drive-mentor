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
import { addTrip } from "@/data/tripsStore";
import { recordTripPoints } from "@/data/rewardsStore";
import { useUser } from "@/data/authStore";
import type { Trip } from "@/data/mockData";
import { Toaster } from "@/components/ui/sonner";

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
  const user = useUser();
  const [tab, setTab] = useState<Tab>("dashboard");
  const [flow, setFlow] = useState<Flow>("idle");
  const [savedTrip, setSavedTrip] = useState<Trip | null>(null);
  const [pendingSelectedId, setPendingSelectedId] = useState<string | null>(null);
  const [highlightRewardTripId, setHighlightRewardTripId] = useState<string | null>(null);
  const [authView, setAuthView] = useState<AuthView>("welcome");

  function handleAuthSuccess() {
    setAuthView("loading");
    setTimeout(() => {
      setAuthView("welcome"); // reset for future logouts
    }, 1000);
  }

  const SUMMARY = { durationMin: 14, avgSpeed: 38, score: 94 };

  function startDrive() {
    setFlow("active");
  }

  function endDrive() {
    setFlow("processing");
    setTimeout(() => {
      const id = `t-${Date.now()}`;
      const newTrip: Trip = {
        id,
        date: "Just now",
        duration: `${SUMMARY.durationMin} min`,
        distance: "8.9 mi",
        score: SUMMARY.score,
        isNight: new Date().getHours() >= 19 || new Date().getHours() < 6,
        route: [
          [37.7749, -122.4194],
          [37.7762, -122.4165],
          [37.7788, -122.4138],
          [37.781, -122.41],
          [37.7835, -122.407],
          [37.786, -122.404],
        ],
        events: [
          { type: "accel", lat: 37.7788, lng: -122.4138, label: "Mild acceleration", time: "Mid-drive" },
        ],
        summary:
          "Smooth drive overall. Speed and braking were well-controlled. One brief acceleration spike on a clear stretch — keep it gradual to stay above 90.",
        signed: false,
      };
      addTrip(newTrip);
      recordTripPoints(newTrip);
      setSavedTrip(newTrip);
      setFlow("success");
    }, 2000);
  }

  function viewReport() {
    if (savedTrip) {
      setPendingSelectedId(savedTrip.id);
      setHighlightRewardTripId(savedTrip.id);
    }
    setFlow("idle");
    setTab("trips");
  }

  // ---------- AUTH GATE ----------
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

  if (flow === "success" && savedTrip) {
    return (
      <>
        <ThemeManager />
        <div className="mx-auto min-h-screen w-full max-w-md bg-background">
          <DriveSuccess
            duration={`${SUMMARY.durationMin} min`}
            avgSpeed={SUMMARY.avgSpeed}
            score={SUMMARY.score}
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
            Processing Telemetry Data
          </p>
          <p className="mt-1 text-sm text-muted-foreground">Analyzing Drive...</p>
        </div>
      )}
    </div>
    </>
  );
}
