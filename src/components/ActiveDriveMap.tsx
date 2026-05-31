import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline, useMap, Marker } from "react-leaflet";
import L from "leaflet";
import { useDarkMode } from "@/hooks/useDarkMode";

function Recenter({ pos }: { pos: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (pos) map.panTo(pos, { animate: true, duration: 0.8 });
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

export function ActiveDriveMap({
  className,
  position,
  route = [],
}: {
  className?: string;
  position: [number, number] | null;
  route?: [number, number][];
} = { position: null }) {
  const [mounted, setMounted] = useState(false);
  const dark = useDarkMode();
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return <div className={`${className ?? "h-72"} w-full rounded-2xl border border-border bg-muted animate-pulse`} />;
  }
  const tileUrl = dark
    ? "https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
  // Default center until first GPS fix arrives — neutral world view, NOT a hardcoded city
  const center: [number, number] = position ?? route[0] ?? [39.5, -98.35];
  return (
    <div className={`${className ?? "h-72"} w-full overflow-hidden rounded-2xl border border-border`}>
      <MapContainer
        center={center}
        zoom={position ? 16 : 4}
        scrollWheelZoom={false}
        zoomControl={false}
        style={{ height: "100%", width: "100%", background: "var(--muted)" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap &copy; CARTO"
          url={tileUrl}
        />
        {route.length > 1 && (
          <>
            <Polyline positions={route} pathOptions={{ color: "#ffffff", weight: 9, opacity: 0.9 }} />
            <Polyline positions={route} pathOptions={{ color: "#1d72ff", weight: 6, opacity: 0.85 }} />
          </>
        )}
        {position && <Marker position={position} icon={pulseIcon()} />}
        <Recenter pos={position} />
      </MapContainer>
    </div>
  );
}