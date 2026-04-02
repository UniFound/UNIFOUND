import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, Search } from "lucide-react";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: "https://ytzzomqohkjpftxnrzjd.supabase.co/storage/v1/object/public/unifound-images/Minuri/909452205a43160f9d3576966802333d.jpg",
      tagline: "Reuniting Campus Belongings",
      heading: "Fast & Reliable Lost & Found Services",
      description: "Misplaced something valuable? Or found an item that isn't yours? UniFound provides a secure and identity-verified platform to help students.",
      btnText: "Learn More",
    },
    {
      image: "https://ytzzomqohkjpftxnrzjd.supabase.co/storage/v1/object/public/unifound-images/Minuri/4b52e5c9e6227880e4dfc399c083a27d.jpg", // Campus Library/Items context
      tagline: "Lost Your Keys or ID?",
      heading: "Find Your Missing Items Instantly",
      description: "Browse our extensive database of found items across the university. Our smart filtering makes it easier than ever to track your belongings.",
      btnText: "Search Items",
    },
    {
      image: "https://ytzzomqohkjpftxnrzjd.supabase.co/storage/v1/object/public/unifound-images/Minuri/3945a9dcf5abad8f95a7abbd47cca85c.jpg", // University students context
      tagline: "Found Something on Campus?",
      heading: "Help Someone Recover Their Item",
      description: "Being a hero is easy. Report found items within minutes and help your fellow students get their valuables back securely.",
      btnText: "Report Now",
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // ස්වයංක්‍රීයව ස්ලයිඩ් මාරු වීමට (Auto-play)
  useEffect(() => {
    const timer = setInterval(nextSlide, 6000); // තත්පර 6කට වරක්
    return () => clearInterval(timer);
  }, [currentSlide]);

  return (
    <div className="relative w-full h-[85vh] md:h-screen overflow-hidden font-sans group">
      
      {/* --- BACKGROUND IMAGES --- */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${slide.image}')` }}
          >
            {/* Dark Blue Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-blue-900/60 to-transparent" />
          </div>
        </div>
      ))}

      {/* --- SLIDER NAVIGATION BUTTONS --- */}
      <button 
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full border border-white/30 bg-white/10 text-white hover:bg-blue-600 hover:border-blue-400 transition-all opacity-0 group-hover:opacity-100 hidden md:block"
      >
        <ChevronLeft size={28} />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full border border-white/30 bg-white/10 text-white hover:bg-blue-600 hover:border-blue-400 transition-all opacity-0 group-hover:opacity-100 hidden md:block"
      >
        <ChevronRight size={28} />
      </button>

      {/* --- CONTENT AREA (Left Aligned) --- */}
      <div className="relative z-20 h-full max-w-7xl mx-auto px-8 md:px-16 flex flex-col justify-center text-left">
        
        {/* Animated Slide Content */}
        <div key={currentSlide} className="animate-in fade-in slide-in-from-left duration-700">
          {/* Small Tagline */}
          <h4 className="text-blue-400 font-bold uppercase tracking-[0.2em] text-sm md:text-base mb-4 drop-shadow-md">
            {slides[currentSlide].tagline}
          </h4>

          {/* Main Heading */}
          <h1 className="text-white text-5xl md:text-7xl font-extrabold leading-tight mb-6 max-w-4xl drop-shadow-lg">
            {slides[currentSlide].heading.split('Lost & Found').map((part, i, arr) => (
               <React.Fragment key={i}>
                 {part}
                 {i !== arr.length - 1 && <span className="text-blue-400">Lost & Found</span>}
               </React.Fragment>
            ))}
          </h1>

          {/* Description Text */}
          <p className="text-white/80 text-base md:text-xl max-w-2xl leading-relaxed mb-10 drop-shadow">
            {slides[currentSlide].description}
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-bold flex items-center gap-3 transition-all active:scale-95 shadow-lg">
              {slides[currentSlide].btnText}
              <ArrowRight size={20} />
            </button>
            
            <button className="bg-white hover:bg-gray-100 text-blue-900 px-8 py-4 rounded-lg font-bold flex items-center gap-3 transition-all active:scale-95 shadow-lg">
              <Search size={20} />
              Browse Items
            </button>
          </div>
        </div>
      </div>

      {/* --- PROGRESS INDICATORS (Dots) --- */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 rounded-full h-2 ${
              index === currentSlide ? "w-12 bg-blue-500" : "w-4 bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>

    </div>
  );
};

export default HeroSection;