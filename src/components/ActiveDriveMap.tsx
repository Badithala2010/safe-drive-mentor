import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline, useMap, Marker } from "react-leaflet";
import L from "leaflet";
import { useDarkMode } from "@/hooks/useDarkMode";

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

function pulseIcon() {
  return L.divIcon({
    className: "",
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    html: `
      <div style="position:relative;width:22px;height:22px;">
        <span class="radar-pulse" style="position:absolute;inset:0;border-radius:9999px;background:#1d72ff;opacity:.4;"></span>
        <span class="radar-pulse" style="position:absolute;inset:0;border-radius:9999px;background:#1d72ff;opacity:.4;animation-delay:.9s;"></span>
        <span style="position:absolute;inset:5px;border-radius:9999px;background:#1d72ff;border:2px solid #fff;box-shadow:0 1px 6px rgba(0,0,0,.35);"></span>
      </div>`,
  });
}

export function ActiveDriveMap({ className }: { className?: string } = {}) {
  const [mounted, setMounted] = useState(false);
  const [idx, setIdx] = useState(0);
  const dark = useDarkMode();
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % ROUTE.length), 1800);
    return () => clearInterval(t);
  }, []);
  if (!mounted) {
    return <div className={`${className ?? "h-72"} w-full rounded-2xl border border-border bg-muted animate-pulse`} />;
  }
  const pos = ROUTE[idx];
  const traveled = ROUTE.slice(0, idx + 1);
  const tileUrl = dark
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/voyager/{z}/{x}/{y}{r}.png";
  return (
    <div className={`${className ?? "h-72"} w-full overflow-hidden rounded-2xl border border-border`}>
      <MapContainer
        center={ROUTE[0]}
        zoom={15}
        scrollWheelZoom={false}
        zoomControl={false}
        style={{ height: "100%", width: "100%", background: "var(--muted)" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap &copy; CARTO"
          url={tileUrl}
        />
        {/* Crisp blue route line with sleek white border */}
        <Polyline positions={traveled} pathOptions={{ color: "#ffffff", weight: 9, opacity: 0.9 }} />
        <Polyline positions={traveled} pathOptions={{ color: "#1d72ff", weight: 6, opacity: 0.85 }} />
        <Marker position={pos} icon={pulseIcon()} />
        <Recenter pos={pos} />
      </MapContainer>
    </div>
  );
}