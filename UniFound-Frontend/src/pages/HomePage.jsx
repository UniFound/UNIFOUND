import Navbar from "../components/Navbar";

import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import Stats from "../components/Stats";
import CTA from "../components/CTA";
import Footer from "../components/Footer";
import SystemPreview from "../components/SystemPreview";
import Hero from "../components/HeroSection";

export default function Home() {
  return (
    <div className="bg-white text-neutral-text">
      <Navbar />
      <Hero />
      <Features />
      <SystemPreview/>
      <HowItWorks />
      <Stats />
      <CTA />
      <Footer />
      
    </div>
  );
}