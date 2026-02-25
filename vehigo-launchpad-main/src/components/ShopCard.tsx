import { MapPin, Clock, Wrench, DollarSign } from "lucide-react";
import { RepairShop } from "@/data/mockShops";
import { motion } from "framer-motion";

interface ShopCardProps {
  shop: RepairShop;
  distance: number;
  rank: number;
  matchedService: string;
}

const ShopCard = ({ shop, distance, rank, matchedService }: ShopCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: rank * 0.15 }}
      className="bg-card rounded-xl border shadow-md hover:shadow-lg transition-shadow overflow-hidden"
    >
      <div className="flex items-center gap-3 bg-primary px-5 py-3">
        <span className="bg-accent text-accent-foreground w-8 h-8 rounded-full flex items-center justify-center font-heading font-bold text-sm">
          {rank}
        </span>
        <h3 className="font-heading font-bold text-lg text-primary-foreground">{shop.shop_name}</h3>
      </div>
      <div className="p-5 grid gap-3">
        <div className="flex items-start gap-2 text-sm">
          <MapPin className="w-4 h-4 mt-0.5 text-accent shrink-0" />
          <div>
            <p className="text-foreground">{shop.location}</p>
            <p className="text-accent font-semibold mt-0.5">{distance.toFixed(1)} km away</p>
          </div>
        </div>
        <div className="flex items-start gap-2 text-sm">
          <Wrench className="w-4 h-4 mt-0.5 text-primary shrink-0" />
          <div className="flex flex-wrap gap-1.5">
            {shop.services.map((s) => (
              <span
                key={s}
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  s === matchedService
                    ? "bg-accent/20 text-accent border border-accent/30"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="w-4 h-4 text-primary shrink-0" />
          <span className="text-foreground">{shop.price_range}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-primary shrink-0" />
          <span className="text-muted-foreground">{shop.working_hours}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ShopCard;
