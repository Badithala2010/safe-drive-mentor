import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline, CircleMarker, useMap } from "react-leaflet";

const ROUTE: [number, number][] = [
  [37.7749, -122.4194],
  [37.7755, -122.418],
  [37.7762, -122.4165],
  [37.7775, -122.415],
  [37.7788, -122.4138],
  [37.78, -122.412],
  [37.781, -122.41],
  [37.7822, -122.4085],
  [37.7835, -122.407],
  [37.7848, -122.4055],
  [37.786, -122.404],
];

function Recenter({ pos }: { pos: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.panTo(pos, { animate: true, duration: 0.8 });
  }, [map, pos]);
  return null;
}

export function ActiveDriveMap() {
  const [mounted, setMounted] = useState(false);
  const [idx, setIdx] = useState(0);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % ROUTE.length), 1800);
    return () => clearInterval(t);
  }, []);
  if (!mounted) {
    return <div className="h-72 w-full rounded-2xl border border-border bg-muted animate-pulse" />;
  }
  const pos = ROUTE[idx];
  const traveled = ROUTE.slice(0, idx + 1);
  return (
    <div className="h-72 w-full overflow-hidden rounded-2xl border border-border">
      <MapContainer
        center={ROUTE[0]}
        zoom={15}
        scrollWheelZoom={false}
        zoomControl={false}
        style={{ height: "100%", width: "100%", background: "var(--muted)" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
        />
        <Polyline positions={traveled} pathOptions={{ color: "#3b82f6", weight: 5, opacity: 0.9 }} />
        <CircleMarker
          center={pos}
          radius={11}
          pathOptions={{ color: "#ffffff", weight: 3, fillColor: "#3b82f6", fillOpacity: 1 }}
        />
        <CircleMarker
          center={pos}
          radius={22}
          pathOptions={{ color: "#3b82f6", weight: 0, fillColor: "#3b82f6", fillOpacity: 0.18 }}
        />
        <Recenter pos={pos} />
      </MapContainer>
    </div>
  );
}