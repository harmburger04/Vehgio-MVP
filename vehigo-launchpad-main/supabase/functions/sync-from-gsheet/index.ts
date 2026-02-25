import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SHEET_ID = "1mRDH9zpQ2iXwTK8hfaj3VmSXIjDln6RbuWGe3dJMR5I";
const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

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

function parseCSV(csv: string): Record<string, string>[] {
  const lines = csv.split("\n").filter((l) => l.trim());
  if (lines.length < 2) return [];

  // Parse header
  const headers = parseCSVLine(lines[0]);
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h.trim().toLowerCase().replace(/\s+/g, "_")] = (values[idx] || "").trim();
    });
    rows.push(row);
  }
  return rows;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Fetch CSV from Google Sheets
    const csvRes = await fetch(SHEET_CSV_URL);
    if (!csvRes.ok) {
      throw new Error(`Failed to fetch sheet: ${csvRes.status}`);
    }
    const csvText = await csvRes.text();
    const rows = parseCSV(csvText);

    if (rows.length === 0) {
      return new Response(
        JSON.stringify({ error: "No data found in sheet" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const results: { shop_name: string; status: string }[] = [];

    for (const row of rows) {
      const shopName = row["shop_name"] || row["name"] || "";
      const location = row["location"] || row["address"] || "";
      const city = row["city"] || "";
      const barangay = row["barangay"] || "";
      const servicesRaw = row["services"] || "";
      const workingHours = row["working_hours"] || row["hours"] || "";
      const priceRange = row["price_range"] || row["prices"] || "";
      const contactNumber = row["contact_number"] || row["contact"] || row["phone"] || "";

      if (!shopName || !location) {
        results.push({ shop_name: shopName || "Unknown", status: "skipped - missing name/location" });
        continue;
      }

      const services = servicesRaw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      // Geocode the location
      const geocodeQuery = `${location}, ${barangay}, ${city}, Metro Manila, Philippines`;
      const coords = await geocodeAddress(geocodeQuery);

      // Brief delay between geocode requests
      await new Promise((r) => setTimeout(r, 300));

      // Upsert into database
      const { error } = await supabase.from("shops").upsert(
        {
          shop_name: shopName,
          location,
          city,
          barangay,
          services,
          working_hours: workingHours,
          price_range: priceRange,
          contact_number: contactNumber,
          lat: coords?.lat || null,
          lng: coords?.lng || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "shop_name" }
      );

      if (error) {
        results.push({ shop_name: shopName, status: `error: ${error.message}` });
      } else {
        results.push({
          shop_name: shopName,
          status: coords ? "synced with coordinates" : "synced without coordinates",
        });
      }
    }

    return new Response(
      JSON.stringify({ synced: results.length, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
