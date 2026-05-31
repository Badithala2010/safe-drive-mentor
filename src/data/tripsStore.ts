import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listTrips, insertTrip, signTrip } from "./trips.functions";
import type { Trip } from "./mockData";

export const tripsQueryOptions = queryOptions({
  queryKey: ["trips"],
  queryFn: () => listTrips(),
});

export function useTripsQuery() {
  return useQuery(tripsQueryOptions);
}

export function useTrips(): Trip[] {
  const { data } = useTripsQuery();
  return data ?? [];
}

export interface NewTripInput {
  date: string;
  duration: string;
  durationMin: number;
  distance: string;
  distanceMi: number;
  score: number;
  isNight: boolean;
  route: [number, number][];
  events: { type: "brake" | "accel" | "speed"; lat: number; lng: number; label: string; time: string }[];
  summary: string;
  points: number;
}

export function useAddTrip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: NewTripInput) => insertTrip({ data: input }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["trips"] }),
  });
}

export function useSignTrip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => signTrip({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["trips"] }),
  });
}
