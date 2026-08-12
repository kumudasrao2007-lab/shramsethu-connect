/**
 * Server-only helpers backing Demo Mode's unauthenticated reads.
 * Only public, non-sensitive catalog data is exposed here.
 */
import { createClient } from "@supabase/supabase-js";

import { serverEnvAny } from "@/lib/env.server";

export async function publicSchemes() {
  const supabase = createClient(
    serverEnvAny("SUPABASE_URL", "VITE_SUPABASE_URL") ?? "",
    serverEnvAny(
      "SUPABASE_PUBLISHABLE_KEY",
      "VITE_SUPABASE_PUBLISHABLE_KEY",
      "SUPABASE_ANON_KEY",
      "VITE_SUPABASE_ANON_KEY",
    ) ?? "",
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
  const { data, error } = await supabase
    .from("schemes")
    .select("id, code, name, authority, category, summary, benefits, eligibility, url")
    .order("name");
  if (error) throw new Error(error.message);
  return data ?? [];
}

const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
];

const FILTERS: Record<string, string> = {
  gas_station: 'node["amenity"="fuel"]',
  hospital: 'node["amenity"~"hospital|clinic|doctors"]',
  electric_vehicle_charging_station: 'node["amenity"="charging_station"]',
  police: 'node["amenity"="police"]',
  pharmacy: 'node["amenity"="pharmacy"]',
  restaurant: 'node["amenity"="restaurant"]',
};

/** Keyless OpenStreetMap nearby search so Demo Mode never needs a Maps key. */
export async function publicNearby(lat: number, lng: number, includedType: string, radius: number) {
  const filter = FILTERS[includedType] ?? `node["amenity"="${includedType}"]`;
  const query = `[out:json][timeout:20];${filter}(around:${radius},${lat},${lng});out 15;`;
  let json: { elements?: Array<{ id: number; lat: number; lon: number; tags?: Record<string, string> }> } | null = null;
  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `data=${encodeURIComponent(query)}`,
        signal: AbortSignal.timeout(20000),
      });
      if (!res.ok) continue;
      json = await res.json();
      break;
    } catch { /* try next mirror */ }
  }
  if (!json) throw new Error("Nearby search is temporarily unavailable. Please try again in a moment.");
  return (json.elements ?? []).map((e) => ({
    id: String(e.id),
    displayName: { text: e.tags?.name ?? e.tags?.operator ?? "Unnamed place" },
    formattedAddress: [e.tags?.["addr:street"], e.tags?.["addr:city"]].filter(Boolean).join(", ") || undefined,
    location: { latitude: e.lat, longitude: e.lon },
  }));
}