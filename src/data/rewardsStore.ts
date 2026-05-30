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

const BASE_XP = 0;

export function pointsForTrip(trip: Trip): number {
  const mins = trip.durationMin ?? parseInt(trip.duration) ?? 10;
  const base = mins * 10;
  const scoreBonus = Math.round(trip.score * 1.5);
  const penalty = trip.events.length * 25;
  const night = trip.isNight ? 50 : 0;
  return Math.max(50, base + scoreBonus + night - penalty);
}

export function totalXp(trips: Trip[]): number {
  return BASE_XP + trips.reduce((s, t) => s + (t.points ?? pointsForTrip(t)), 0);
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
    id: "first-drive",
    name: "First Mile",
    desc: "Complete your first drive",
    icon: "🚗",
    unlocked: (trips) => trips.length >= 1,
  },
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
      const mins = trips.filter((t) => t.isNight).reduce((s, t) => s + (t.durationMin ?? parseInt(t.duration) ?? 0), 0);
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
    unlocked: (trips) => trips.some((t) => (t.distanceMi ?? parseFloat(t.distance)) >= 15),
  },
];
