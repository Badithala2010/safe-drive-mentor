export type EventType = "brake" | "accel" | "speed";

export interface DriveEvent {
  type: EventType;
  lat: number;
  lng: number;
  label: string;
  time: string;
}

export interface Trip {
  id: string;
  date: string;
  duration: string;
  distance: string;
  score: number;
  isNight: boolean;
  route: [number, number][];
  events: DriveEvent[];
  summary: string;
  signed: boolean;
}

export const eventMeta: Record<EventType, { label: string; color: string; bg: string }> = {
  brake: { label: "Hard Braking", color: "var(--destructive)", bg: "bg-destructive" },
  accel: { label: "Rapid Acceleration", color: "var(--warning)", bg: "bg-warning" },
  speed: { label: "Speeding", color: "var(--caution)", bg: "bg-caution" },
};

// A simulated route around a city block
const baseRoute1: [number, number][] = [
  [37.7749, -122.4194],
  [37.7755, -122.418],
  [37.7762, -122.4165],
  [37.7775, -122.415],
  [37.7788, -122.4138],
  [37.78, -122.412],
  [37.781, -122.41],
  [37.7822, -122.4085],
  [37.7835, -122.407],
];

const baseRoute2: [number, number][] = [
  [37.7849, -122.4094],
  [37.7855, -122.408],
  [37.7862, -122.4065],
  [37.7875, -122.405],
  [37.7888, -122.4038],
  [37.79, -122.402],
];

const baseRoute3: [number, number][] = [
  [37.7649, -122.4294],
  [37.7655, -122.428],
  [37.7662, -122.4265],
  [37.7675, -122.425],
  [37.7688, -122.4238],
  [37.77, -122.422],
  [37.7715, -122.4205],
];

export const trips: Trip[] = [
  {
    id: "t1",
    date: "Today · 4:32 PM",
    duration: "42 min",
    distance: "11.2 mi",
    score: 92,
    isNight: false,
    route: baseRoute1,
    events: [
      { type: "brake", lat: 37.7762, lng: -122.4165, label: "Hard Braking", time: "4:38 PM" },
      { type: "speed", lat: 37.781, lng: -122.41, label: "Speeding · 42 in 30 zone", time: "4:51 PM" },
    ],
    summary:
      "Strong, smooth drive overall. One sharp brake near Market St — try scanning further ahead to anticipate stops. Speed crept up on a residential stretch; cruise control could help on familiar roads.",
    signed: true,
  },
  {
    id: "t2",
    date: "Yesterday · 8:14 PM",
    duration: "28 min",
    distance: "7.8 mi",
    score: 78,
    isNight: true,
    route: baseRoute2,
    events: [
      { type: "accel", lat: 37.7862, lng: -122.4065, label: "Rapid Acceleration", time: "8:18 PM" },
      { type: "brake", lat: 37.7888, lng: -122.4038, label: "Hard Braking", time: "8:27 PM" },
      { type: "speed", lat: 37.79, lng: -122.402, label: "Speeding · 38 in 25 zone", time: "8:35 PM" },
    ],
    summary:
      "Night driving is the right next step. Heavy acceleration off a green light spiked your score — ease into the throttle, especially when visibility is limited. Practice steady following distance to reduce reactive braking.",
    signed: false,
  },
  {
    id: "t3",
    date: "Mon · 3:05 PM",
    duration: "55 min",
    distance: "18.4 mi",
    score: 85,
    isNight: false,
    route: baseRoute3,
    events: [
      { type: "brake", lat: 37.7675, lng: -122.425, label: "Hard Braking", time: "3:21 PM" },
      { type: "speed", lat: 37.7715, lng: -122.4205, label: "Speeding · 70 in 60 zone", time: "3:44 PM" },
    ],
    summary:
      "Highway practice is going well. Lane changes were smooth and signal use was consistent. Watch your speed on downhill grades — gravity adds up quickly.",
    signed: true,
  },
  {
    id: "t4",
    date: "Sun · 11:00 AM",
    duration: "35 min",
    distance: "9.1 mi",
    score: 95,
    isNight: false,
    route: baseRoute1,
    events: [],
    summary:
      "Excellent drive — zero flagged events. Calm acceleration, anticipatory braking, and consistent speed. This is the baseline to aim for every trip.",
    signed: true,
  },
];

export const driverStats = {
  name: "Alex",
  score: 88,
  totalHours: 14,
  hoursGoal: 50,
  nightHours: 3,
  nightGoal: 10,
  topImprovement: "Watch your cornering speed",
  weeklyTrend: "+4 pts this week",
};

export const parentAlerts = [
  { id: "a1", severity: "high" as const, text: "Speeding event 42 in 30 zone", time: "Today 4:51 PM" },
  { id: "a2", severity: "medium" as const, text: "Hard braking on Market St", time: "Yesterday 8:27 PM" },
  { id: "a3", severity: "low" as const, text: "Completed first night drive (45 min)", time: "Yesterday" },
];