import { createServerFn } from "@tanstack/react-start";

import { publicNearby, publicSchemes } from "@/lib/demo-public.server";

/** Public government-scheme catalog — readable without sign-in for Demo Mode. */
export const demoListSchemes = createServerFn({ method: "GET" }).handler(async () => publicSchemes());

/** Keyless nearby-place search for Demo Mode. */
export const demoNearbyPlaces = createServerFn({ method: "POST" })
  .inputValidator((v: { lat: number; lng: number; includedType: string; radiusMeters?: number }) => v)
  .handler(async ({ data }) => publicNearby(data.lat, data.lng, data.includedType, data.radiusMeters ?? 8000));