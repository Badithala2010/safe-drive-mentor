import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Gauge, Map, Users } from "lucide-react";
import { Dashboard } from "@/components/Dashboard";
import { TripHistory } from "@/components/TripHistory";
import { ParentPortal } from "@/components/ParentPortal";
import { ActiveDrive } from "@/components/ActiveDrive";
import { DriveSuccess } from "@/components/DriveSuccess";
import { Loader2 } from "lucide-react";
import { addTrip } from "@/data/tripsStore";
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

type Tab = "dashboard" | "trips" | "parent";
type Flow = "idle" | "active" | "processing" | "success";

const tabs: { id: Tab; label: string; icon: any }[] = [
  { id: "dashboard", label: "Drive", icon: Gauge },
  { id: "trips", label: "Trips", icon: Map },
  { id: "parent", label: "Parent", icon: Users },
];

function Index() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [flow, setFlow] = useState<Flow>("idle");
  const [savedTrip, setSavedTrip] = useState<Trip | null>(null);
  const [pendingSelectedId, setPendingSelectedId] = useState<string | null>(null);

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
      setSavedTrip(newTrip);
      setFlow("success");
    }, 2000);
  }

  function viewReport() {
    if (savedTrip) setPendingSelectedId(savedTrip.id);
    setFlow("idle");
    setTab("trips");
  }

  if (flow === "active") {
    return (
      <div className="mx-auto min-h-screen w-full max-w-md bg-background">
        <ActiveDrive onEnd={endDrive} />
        <Toaster position="top-center" />
      </div>
    );
  }

  if (flow === "success" && savedTrip) {
    return (
      <div className="mx-auto min-h-screen w-full max-w-md bg-background">
        <DriveSuccess
          duration={`${SUMMARY.durationMin} min`}
          avgSpeed={SUMMARY.avgSpeed}
          score={SUMMARY.score}
          onViewReport={viewReport}
        />
        <Toaster position="top-center" />
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-md bg-background pb-24">
      {tab === "dashboard" && <Dashboard onStartDrive={startDrive} />}
      {tab === "trips" && (
        <TripHistory
          initialSelectedId={pendingSelectedId}
          onConsumeSelected={() => setPendingSelectedId(null)}
        />
      )}
      {tab === "parent" && <ParentPortal />}

      <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="grid grid-cols-3">
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
  );
}
