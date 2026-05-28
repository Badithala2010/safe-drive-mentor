import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Gauge, Map, Users } from "lucide-react";
import { Dashboard } from "@/components/Dashboard";
import { TripHistory } from "@/components/TripHistory";
import { ParentPortal } from "@/components/ParentPortal";
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

const tabs: { id: Tab; label: string; icon: any }[] = [
  { id: "dashboard", label: "Drive", icon: Gauge },
  { id: "trips", label: "Trips", icon: Map },
  { id: "parent", label: "Parent", icon: Users },
];

function Index() {
  const [tab, setTab] = useState<Tab>("dashboard");

  return (
    <div className="mx-auto min-h-screen w-full max-w-md bg-background pb-24">
      {tab === "dashboard" && <Dashboard />}
      {tab === "trips" && <TripHistory />}
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
    </div>
  );
}
