import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Car, MapPin, Loader2 } from "lucide-react";
import { SERVICES } from "@/data/mockShops";
import { useCities, useBarangays } from "@/hooks/usePSGC";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

const SearchForm = () => {
  const navigate = useNavigate();
  const [carMakeModel, setCarMakeModel] = useState("");
  const [service, setService] = useState("");
  const [street, setStreet] = useState("");
  const [cityCode, setCityCode] = useState("");
  const [cityName, setCityName] = useState("");
  const [barangayName, setBarangayName] = useState("");
  const [searching, setSearching] = useState(false);
  const [dynamicServices, setDynamicServices] = useState<string[]>([]);

  // Load services from database
  useEffect(() => {
    const loadServices = async () => {
      try {
        const { data } = await supabase.from("shops").select("services");
        if (data) {
          const allServices = new Set<string>();
          data.forEach((shop: any) => {
            shop.services?.forEach((s: string) => {
              // Capitalize each word for display
              allServices.add(s.split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
            });
          });
          if (allServices.size > 0) {
            setDynamicServices(Array.from(allServices).sort());
          }
        }
      } catch {
        // Fall back to static services
      }
    };
    loadServices();
  }, []);

  const { cities, loading: citiesLoading } = useCities();
  const { barangays, loading: barangaysLoading } = useBarangays(cityCode);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service || !cityName) return;
    setSearching(true);

    const locationQuery = [street, barangayName, cityName, "Metro Manila, Philippines"]
      .filter(Boolean)
      .join(", ");

    navigate(`/results?service=${encodeURIComponent(service)}&location=${encodeURIComponent(locationQuery)}&car=${encodeURIComponent(carMakeModel)}`);
  };

  const inputClass = "w-full px-4 py-3 rounded-lg border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm";
  const labelClass = "block text-sm font-semibold text-foreground mb-1.5";
  const selectClass = "w-full px-4 py-3 rounded-lg border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm appearance-none";

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-card rounded-2xl shadow-xl border p-6 md:p-8 w-full max-w-2xl mx-auto"
    >
      <div className="grid gap-5">
        {/* Car Make & Model */}
        <div>
          <label className={labelClass}>
            <Car className="inline w-4 h-4 mr-1 -mt-0.5" />
            Car Make & Model
          </label>
          <input
            type="text"
            placeholder="e.g. Toyota Vios 2022"
            value={carMakeModel}
            onChange={(e) => setCarMakeModel(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Service Needed */}
        <div>
          <label className={labelClass}>
            <Search className="inline w-4 h-4 mr-1 -mt-0.5" />
            Service Needed <span className="text-accent">*</span>
          </label>
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className={selectClass}
            required
          >
            <option value="">Select a service...</option>
            {(dynamicServices.length > 0 ? dynamicServices : SERVICES as unknown as string[]).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div>
          <label className={labelClass}>
            <MapPin className="inline w-4 h-4 mr-1 -mt-0.5" />
            Location <span className="text-accent">*</span>
          </label>
          <div className="grid gap-3">
            <input
              type="text"
              placeholder="Street address (optional)"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className={inputClass}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select
                value={cityCode}
                onChange={(e) => {
                  const code = e.target.value;
                  setCityCode(code);
                  const city = cities.find(c => c.code === code);
                  setCityName(city?.name || "");
                  setBarangayName("");
                }}
                className={selectClass}
                required
              >
                <option value="">
                  {citiesLoading ? "Loading cities..." : "Select City"}
                </option>
                {cities.map((c) => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>
              <select
                value={barangayName}
                onChange={(e) => setBarangayName(e.target.value)}
                className={selectClass}
                disabled={!cityCode}
              >
                <option value="">
                  {barangaysLoading ? "Loading..." : "Select Barangay"}
                </option>
                {barangays.map((b) => (
                  <option key={b.code} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={searching || !service || !cityName}
          className="w-full bg-accent text-accent-foreground py-3.5 rounded-lg font-heading font-bold text-base hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
        >
          {searching ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Search className="w-5 h-5" />
          )}
          Find Nearby Shops
        </button>
      </div>
    </motion.form>
  );
};

export default SearchForm;
