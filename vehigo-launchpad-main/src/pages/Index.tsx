import { Link } from "react-router-dom";
import { Search, Shield, MapPin, ArrowRight, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import vehigoLogo from "@/assets/vehigo_logo.png";

const features = [
{
  icon: Search,
  title: "Smart Search",
  desc: "Find the right repair shop based on your car's make, model, and the exact service you need."
},
{
  icon: MapPin,
  title: "Nearest Shops",
  desc: "Get the top 3 closest partner shops to your location — no more driving around."
},
{
  icon: Shield,
  title: "Trusted Partners",
  desc: "Every shop in our network is vetted for quality and reliability."
}];


const steps = [
{ num: "01", title: "Enter Your Car Details", desc: "Tell us your car's make and model." },
{ num: "02", title: "Select a Service", desc: "Pick from oil change, brakes, tires, and more." },
{ num: "03", title: "Get Matched", desc: "See the 3 nearest shops that fit your needs." }];


const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 bg-hero-pattern">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}>

            <div className="flex items-center justify-center mb-6">
              <img src={vehigoLogo} alt="Vehigo" className="h-24 md:h-36" />
            </div>
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-foreground mb-4">Fix With A Click

            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Connect instantly with trusted repair shops. Get real-time assistance and manage your vehicle care — all in one app.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/search"
                className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-heading font-bold text-lg hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg">

                Find a Repair Shop
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#features"
                className="bg-accent text-accent-foreground px-8 py-4 rounded-xl font-heading font-bold text-lg hover:opacity-90 transition-opacity">

                Explore Features
              </a>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="mt-16">

            <a href="#features">
              <ChevronDown className="w-8 h-8 text-muted-foreground mx-auto animate-bounce" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
            Why Vehigo?
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-lg mx-auto">
            We make car maintenance effortless.
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {features.map((f, i) =>
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center p-6 rounded-2xl bg-background border hover:shadow-md transition-shadow">

                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <f.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-heading font-bold text-lg text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((s, i) =>
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center">

                <span className="font-heading text-5xl font-black text-accent/30">{s.num}</span>
                <h3 className="font-heading font-bold text-lg text-foreground mt-2 mb-1">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to find your repair shop?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
            Enter your details and get matched with the best shops near you.
          </p>
          <Link
            to="/search"
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-xl font-heading font-bold text-lg hover:opacity-90 transition-opacity">

            Get Started <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-card border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026 Vehigo. All rights reserved.
        </div>
      </footer>
    </div>);

};

export default Index;