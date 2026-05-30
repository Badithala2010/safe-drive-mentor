import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Trip, DriveEvent } from "./mockData";

function rowToTrip(r: any): Trip {
  return {
    id: r.id,
    date: r.date,
    duration: r.duration,
    distance: r.distance,
    score: r.score,
    isNight: r.is_night,
    route: (r.route ?? []) as [number, number][],
    events: (r.events ?? []) as DriveEvent[],
    summary: r.summary ?? "",
    signed: r.signed,
    points: r.points ?? 0,
    durationMin: r.duration_min ?? 0,
    distanceMi: Number(r.distance_mi ?? 0),
  };
}

export const listTrips = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("trips")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(rowToTrip);
  });

const tripInput = z.object({
  date: z.string(),
  duration: z.string(),
  durationMin: z.number().int().min(0),
  distance: z.string(),
  distanceMi: z.number().min(0),
  score: z.number().int().min(0).max(100),
  isNight: z.boolean(),
  route: z.array(z.tuple([z.number(), z.number()])),
  events: z.array(z.object({
    type: z.enum(["brake", "accel", "speed"]),
    lat: z.number(),
    lng: z.number(),
    label: z.string(),
    time: z.string(),
  })),
  summary: z.string(),
  points: z.number().int().min(0),
});

export const insertTrip = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => tripInput.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: row, error } = await supabase
      .from("trips")
      .insert({
        user_id: userId,
        date: data.date,
        duration: data.duration,
        duration_min: data.durationMin,
        distance: data.distance,
        distance_mi: data.distanceMi,
        score: data.score,
        is_night: data.isNight,
        route: data.route as any,
        events: data.events as any,
        summary: data.summary,
        points: data.points,
        signed: false,
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return rowToTrip(row);
  });

export const signTrip = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("trips")
      .update({ signed: true })
      .eq("id", data.id)
      .eq("user_id", userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
