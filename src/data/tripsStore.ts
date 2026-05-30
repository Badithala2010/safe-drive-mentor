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

export function useAddTrip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Parameters<typeof insertTrip>[0]["data"]) => insertTrip({ data: input }),
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
