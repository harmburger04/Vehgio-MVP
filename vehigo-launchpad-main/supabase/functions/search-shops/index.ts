import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Geocode using Nominatim
async function geocodeAddress(
  address: string
): Promise<{ lat: number; lng: number } | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address
      )}&countrycodes=ph&limit=1`,
      { headers: { "User-Agent": "Vehigo-MVP/1.0" } }
    );
    const data = await res.json();
    if (data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
    return null;
  } catch {
    return null;
  }
}

// Get driving distance via OSRM
async function getOSRMDistance(
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number
): Promise<number | null> {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${fromLng},${fromLat};${toLng},${toLat}?overview=false`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.code === "Ok" && data.routes?.length > 0) {
      // Return distance in km
      return data.routes[0].distance / 1000;
    }
    return null;
  } catch {
    return null;
  }
}

// Haversine fallback
function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { service, location, car } = await req.json();

    if (!service || !location) {
      return new Response(
        JSON.stringify({ error: "service and location are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Geocode user location
    const userCoords = await geocodeAddress(location);
    if (!userCoords) {
      return new Response(
        JSON.stringify({ error: "Could not geocode the provided location" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Query shops from DB
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all shops and filter case-insensitively
    const { data: allShops, error } = await supabase
      .from("shops")
      .select("*");

    const serviceLower = service.toLowerCase();
    const shops = allShops?.filter((s) =>
      s.services?.some((sv: string) => sv.toLowerCase() === serviceLower)
    ) || [];

    if (error) {
      throw new Error(error.message);
    }

    if (!shops || shops.length === 0) {
      return new Response(
        JSON.stringify({ results: [], message: "No shops found for this service" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Calculate distances using OSRM, fall back to Haversine
    const shopsWithDistance = await Promise.all(
      shops
        .filter((s) => s.lat && s.lng)
        .map(async (shop) => {
          let distance = await getOSRMDistance(
            userCoords.lat,
            userCoords.lng,
            shop.lat!,
            shop.lng!
          );

          if (distance === null) {
            distance = haversineDistance(
              userCoords.lat,
              userCoords.lng,
              shop.lat!,
              shop.lng!
            );
          }

          return { ...shop, distance };
        })
    );

    // Sort by distance and return top 3
    shopsWithDistance.sort((a, b) => a.distance - b.distance);
    const top3 = shopsWithDistance.slice(0, 3);

    return new Response(
      JSON.stringify({ results: top3, userCoords }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
