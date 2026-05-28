import { useEffect } from "react";
import { MapContainer, TileLayer, Polyline, CircleMarker, Tooltip, useMap } from "react-leaflet";
import type { Trip } from "@/data/mockData";
import { eventMeta } from "@/data/mockData";

function FitBounds({ route }: { route: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (route.length) map.fitBounds(route as any, { padding: [30, 30] });
  }, [map, route]);
  return null;
}

export function TripMap({ trip }: { trip: Trip }) {
  const center = trip.route[Math.floor(trip.route.length / 2)];
  return (
    <div className="h-72 w-full overflow-hidden rounded-2xl border border-border">
      <MapContainer
        center={center}
        zoom={14}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%", background: "var(--muted)" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
        />
        <Polyline positions={trip.route} pathOptions={{ color: "oklch(0.72 0.18 155)", weight: 5, opacity: 0.9 }} />
        {trip.events.map((e, i) => (
          <CircleMarker
            key={i}
            center={[e.lat, e.lng]}
            radius={9}
            pathOptions={{
              color: "#0b0f1a",
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