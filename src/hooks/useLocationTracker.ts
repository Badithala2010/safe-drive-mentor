import { useCallback, useRef, useState } from "react";

export interface TrackerSample {
  lat: number;
  lng: number;
  speedMph: number;
  ts: number;
}

export interface TrackerSummary {
  route: [number, number][];
  durationSec: number;
  distanceMi: number;
  avgSpeedMph: number;
  maxSpeedMph: number;
  hardEvents: number;
}

function haversineMi(a: [number, number], b: [number, number]) {
  const R = 3958.8;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
}

/**
 * Web-API location/motion tracker. Designed so the implementation can be
 * swapped for native Capacitor plugins later without touching the UI.
 */
export function useLocationTracker() {
  const watchIdRef = useRef<number | null>(null);
  const motionHandlerRef = useRef<((e: DeviceMotionEvent) => void) | null>(null);
  const samplesRef = useRef<TrackerSample[]>([]);
  const startRef = useRef<number>(0);
  const hardRef = useRef<number>(0);
  const [isTracking, setIsTracking] = useState(false);
  const [latest, setLatest] = useState<TrackerSample | null>(null);

  const startTracking = useCallback(() => {
    samplesRef.current = [];
    hardRef.current = 0;
    startRef.current = Date.now();
    setIsTracking(true);

    if (typeof navigator !== "undefined" && navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const sample: TrackerSample = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            speedMph: pos.coords.speed != null ? pos.coords.speed * 2.23694 : 0,
            ts: pos.timestamp,
          };
          samplesRef.current.push(sample);
          setLatest(sample);
        },
        () => {},
        { enableHighAccuracy: true, maximumAge: 1000, timeout: 10_000 },
      );
    }

    if (typeof window !== "undefined" && "DeviceMotionEvent" in window) {
      const handler = (e: DeviceMotionEvent) => {
        const a = e.acceleration ?? e.accelerationIncludingGravity;
        if (!a) return;
        const mag = Math.sqrt((a.x ?? 0) ** 2 + (a.y ?? 0) ** 2 + (a.z ?? 0) ** 2);
        if (mag > 18) hardRef.current += 1;
      };
      motionHandlerRef.current = handler;
      window.addEventListener("devicemotion", handler);
    }
  }, []);

  const stopTracking = useCallback((): TrackerSummary => {
    if (watchIdRef.current != null && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (motionHandlerRef.current) {
      window.removeEventListener("devicemotion", motionHandlerRef.current);
      motionHandlerRef.current = null;
    }
    setIsTracking(false);

    const samples = samplesRef.current;
    const route: [number, number][] = samples.map((s) => [s.lat, s.lng]);
    let distanceMi = 0;
    for (let i = 1; i < route.length; i++) distanceMi += haversineMi(route[i - 1], route[i]);
    const durationSec = Math.max(1, Math.round((Date.now() - startRef.current) / 1000));
    const avgSpeedMph = samples.length
      ? samples.reduce((s, x) => s + x.speedMph, 0) / samples.length
      : 0;
    const maxSpeedMph = samples.reduce((m, x) => Math.max(m, x.speedMph), 0);

    return {
      route,
      durationSec,
      distanceMi: +distanceMi.toFixed(2),
      avgSpeedMph: +avgSpeedMph.toFixed(1),
      maxSpeedMph: +maxSpeedMph.toFixed(1),
      hardEvents: hardRef.current,
    };
  }, []);

  return { startTracking, stopTracking, isTracking, latest };
}