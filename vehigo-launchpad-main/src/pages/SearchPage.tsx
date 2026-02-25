import Navbar from "@/components/Navbar";
import SearchForm from "@/components/SearchForm";
import { motion } from "framer-motion";

const SearchPage = () => {
  return (
    <div className="min-h-screen bg-background bg-hero-pattern">
      <Navbar />
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
              Find a Repair Shop
            </h1>
            <p className="text-muted-foreground">
              Enter your car details and location to get matched with nearby partner shops.
            </p>
          </motion.div>
          <SearchForm />
        </div>
      </main>
    </div>
  );
};

export default SearchPage;
