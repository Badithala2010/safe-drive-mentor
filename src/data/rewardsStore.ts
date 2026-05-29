import { useSyncExternalStore } from "react";
import { useTrips } from "./tripsStore";
import type { Trip } from "./mockData";

export interface Level {
  num: number;
  name: string;
  min: number;
  max: number;
}

export const LEVELS: Level[] = [
  { num: 1, name: "Permit Rookie", min: 0, max: 500 },
  { num: 2, name: "Cautious Cruiser", min: 500, max: 1500 },
  { num: 3, name: "Advanced Novice", min: 1500, max: 3000 },
  { num: 4, name: "Confident Commuter", min: 3000, max: 5000 },
  { num: 5, name: "Road Veteran", min: 5000, max: 8000 },
];

// Base XP credited to brand-new accounts so the page feels alive.
const BASE_XP = 2450;

let bonusXp = 0;
const tripPoints = new Map<string, number>();
const listeners = new Set<() => void>();
function emit() { listeners.forEach((l) => l()); }

export function pointsForTrip(trip: Trip): number {
  // 10 pts per minute base + score bonus - event penalty
  const mins = parseInt(trip.duration) || 10;
  const base = mins * 10;
  const scoreBonus = Math.round(trip.score * 1.5);
  const penalty = trip.events.length * 25;
  const night = trip.isNight ? 50 : 0;
  return Math.max(50, base + scoreBonus + night - penalty);
}

export function recordTripPoints(trip: Trip) {
  if (tripPoints.has(trip.id)) return tripPoints.get(trip.id)!;
  const pts = pointsForTrip(trip);
  tripPoints.set(trip.id, pts);
  bonusXp += pts;
  emit();
  return pts;
}

function subscribe(l: () => void) { listeners.add(l); return () => { listeners.delete(l); }; }

function snapshot() { return bonusXp; }

export function useTotalXp(): number {
  const bonus = useSyncExternalStore(subscribe, snapshot, snapshot);
  const trips = useTrips();
  // Credit XP from seed trips automatically (not double counted via tripPoints)
  const seedXp = trips
    .filter((t) => !tripPoints.has(t.id))
    .reduce((sum, t) => sum + pointsForTrip(t), 0);
  return BASE_XP + seedXp + bonus;
}

export function getLevel(xp: number) {
  const lvl = LEVELS.find((l) => xp >= l.min && xp < l.max) ?? LEVELS[LEVELS.length - 1];
  const next = LEVELS.find((l) => l.num === lvl.num + 1) ?? lvl;
  const progress = Math.min(100, ((xp - lvl.min) / (lvl.max - lvl.min)) * 100);
  return { level: lvl, next, progress, xpToNext: Math.max(0, lvl.max - xp) };
}

export interface Badge {
  id: string;
  name: string;
  desc: string;
  icon: string;
  unlocked: (trips: Trip[]) => boolean;
}

export const BADGES: Badge[] = [
  {
    id: "smooth",
    name: "Smooth Operator",
    desc: "3 trips with 0 hard braking",
    icon: "🛞",
    unlocked: (trips) => trips.filter((t) => !t.events.some((e) => e.type === "brake")).length >= 3,
  },
  {
    id: "night-owl",
    name: "Night Owl",
    desc: "5+ night hours logged",
    icon: "🌙",
    unlocked: (trips) => {
      const mins = trips.filter((t) => t.isNight).reduce((s, t) => s + (parseInt(t.duration) || 0), 0);
      return mins >= 5 * 60;
    },
  },
  {
    id: "perfect-100",
    name: "Perfect 100",
    desc: "Score a perfect 100 on a drive",
    icon: "💯",
    unlocked: (trips) => trips.some((t) => t.score >= 100),
  },
  {
    id: "first-drive",
    name: "First Mile",
    desc: "Complete your first drive",
    icon: "🚗",
    unlocked: (trips) => trips.length >= 1,
  },
  {
    id: "streak-5",
    name: "On a Roll",
    desc: "Log 5 total drives",
    icon: "🔥",
    unlocked: (trips) => trips.length >= 5,
  },
  {
    id: "highway",
    name: "Highway Hero",
    desc: "Drive 15+ miles in one trip",
    icon: "🛣️",
    unlocked: (trips) => trips.some((t) => parseFloat(t.distance) >= 15),
  },
];

export function getRecentTripPoints(tripId: string): number | undefined {
  return tripPoints.get(tripId);
}