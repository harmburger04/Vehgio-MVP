import { Link } from "react-router-dom";
import vehigoLogo from "@/assets/vehigo_logo.png";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src={vehigoLogo} alt="Vehigo" className="h-10" />
        </Link>
        <div className="flex items-center gap-6">
          <a href="#features" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors hidden sm:block">
            Features
          </a>
          <a href="#how-it-works" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors hidden sm:block">
            How It Works
          </a>
          <Link
            to="/search"
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Find a Shop
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
