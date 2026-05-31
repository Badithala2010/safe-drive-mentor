import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline, CircleMarker, Tooltip, useMap } from "react-leaflet";
import type { Trip } from "@/data/mockData";
import { eventMeta } from "@/data/mockData";
import { useDarkMode } from "@/hooks/useDarkMode";

function FitBounds({ route }: { route: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (route.length) map.fitBounds(route as any, { padding: [30, 30] });
  }, [map, route]);
  return null;
}

export function TripMap({ trip }: { trip: Trip }) {
  const [mounted, setMounted] = useState(false);
  const dark = useDarkMode();
  useEffect(() => setMounted(true), []);
  const center = trip.route[Math.floor(trip.route.length / 2)];
  if (!mounted) {
    return <div className="h-72 w-full rounded-2xl border border-border bg-muted animate-pulse" />;
  }
  const tileUrl = dark
    ? "https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
  return (
    <div className="h-72 w-full overflow-hidden rounded-2xl border border-border">
      <MapContainer
        center={center}
        zoom={14}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%", background: "var(--muted)" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap &copy; CARTO"
          url={tileUrl}
        />
        <Polyline positions={trip.route} pathOptions={{ color: "#ffffff", weight: 9, opacity: 0.9 }} />
        <Polyline positions={trip.route} pathOptions={{ color: "#1d72ff", weight: 6, opacity: 0.85 }} />
        {trip.events.map((e, i) => (
          <CircleMarker
            key={i}
            center={[e.lat, e.lng]}
            radius={9}
            pathOptions={{
              color: "#ffffff",
              weight: 2,
              fillColor:
                e.type === "brake"
                  ? "#ef4444"
                  : e.type === "accel"
                  ? "#f59e0b"
                  : "#eab308",
              fillOpacity: 1,
            }}
          >
            <Tooltip>{eventMeta[e.type].label}</Tooltip>
          </CircleMarker>
        ))}
        <FitBounds route={trip.route} />
      </MapContainer>
    </div>
  );
}