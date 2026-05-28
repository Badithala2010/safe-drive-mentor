import { useSyncExternalStore } from "react";
import { trips as initialTrips, type Trip } from "./mockData";

let trips: Trip[] = [...initialTrips];
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function getTrips(): Trip[] {
  return trips;
}

export function addTrip(trip: Trip) {
  trips = [trip, ...trips];
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useTrips(): Trip[] {
  return useSyncExternalStore(subscribe, getTrips, getTrips);
}