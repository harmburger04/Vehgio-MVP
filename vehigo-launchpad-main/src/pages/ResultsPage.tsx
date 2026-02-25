import { useSearchParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import ShopCard from "@/components/ShopCard";
import { RepairShop } from "@/data/mockShops";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

interface ShopWithDistance extends RepairShop {
  distance: number;
}

const ResultsPage = () => {
  const [searchParams] = useSearchParams();
  const service = searchParams.get("service") || "";
  const location = searchParams.get("location") || "";
  const car = searchParams.get("car") || "";

  const [results, setResults] = useState<ShopWithDistance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const findShops = async () => {
      setLoading(true);
      setError("");

      try {
        const { data, error: fnError } = await supabase.functions.invoke("search-shops", {
          body: { service, location, car },
        });

        if (fnError) throw fnError;

        if (data?.results && data.results.length > 0) {
          setResults(data.results);
        } else if (data?.message) {
          setError(data.message);
        } else {
          setError("No shops found offering this service.");
        }
      } catch (err: any) {
        console.error("Search error:", err);
        setError("Failed to search for shops. Please try again.");
      }

      setLoading(false);
    };

    findShops();
  }, [service, location, car]);

  return (
    <div className="min-h-screen bg-background bg-hero-pattern">
      <Navbar />
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-2xl">
          <Link
            to="/search"
            className="inline-flex items-center gap-1 text-sm text-primary font-medium hover:underline mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Search
          </Link>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
          >
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-1">
              Top 3 Nearest Shops
            </h1>
            <p className="text-sm text-muted-foreground">
              Service: <span className="font-semibold text-accent">{service}</span>
              {car && <> · Car: <span className="font-semibold text-foreground">{car}</span></>}
            </p>
          </motion.div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Finding the best shops near you...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <AlertCircle className="w-10 h-10 text-destructive mb-4" />
              <p className="text-foreground font-medium">{error}</p>
              <Link to="/search" className="text-primary hover:underline mt-2 text-sm">
                Try a different search
              </Link>
            </div>
          ) : (
            <div className="grid gap-5">
              {results.map((shop, i) => (
                <ShopCard
                  key={shop.id}
                  shop={shop}
                  distance={shop.distance}
                  rank={i + 1}
                  matchedService={service}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ResultsPage;
