import React from "react";
import { Link } from "react-router-dom";

/* Sparkle SVG decoration */
const Sparkle = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C12.3 7.8 16.2 11.7 22 12C16.2 12.3 12.3 16.2 12 22C11.7 16.2 7.8 12.3 2 12C7.8 11.7 11.7 7.8 12 2Z" />
  </svg>
);

/* Single stacked card */
const ProductCard = ({ bg, image, label, rotate, zIndex, translateX = 0, translateY = 0 }) => (
  <div
    className="absolute w-[160px] sm:w-[190px] h-[220px] sm:h-[255px] rounded-3xl overflow-hidden shadow-xl"
    style={{
      backgroundColor: bg,
      transform: `rotate(${rotate}deg) translateX(${translateX}px) translateY(${translateY}px)`,
      zIndex,
      transition: "transform 0.4s ease",
    }}
  >
    <img
      src={image}
      alt={label}
      className="w-full h-[75%] object-cover"
    />
    <div className="px-3 pb-3 pt-2 flex items-center justify-between">
      <span className="text-dark font-semibold text-xs">{label}</span>
      <span className="w-6 h-6 rounded-full bg-dark/10 flex items-center justify-center text-dark text-xs">→</span>
    </div>
  </div>
);

const HomeHeader = () => {
  const cards = [
    {
      bg: "#E8C547",
      image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=300&fit=crop",
      label: "Avocado Mix",
      rotate: -10,
      zIndex: 10,
      translateX: -30,
      translateY: 60,
    },
    {
      bg: "#5B8EE6",
      image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&h=300&fit=crop",
      label: "Greens Bundle",
      rotate: 4,
      zIndex: 20,
      translateX: 20,
      translateY: -10,
    },
    {
      bg: "#6CC24A",
      image: "https://images.unsplash.com/photo-1558818498-28c1e002b655?w=400&h=300&fit=crop",
      label: "Kiwi Fresh",
      rotate: -3,
      zIndex: 30,
      translateX: 70,
      translateY: 55,
    },
  ];

  return (
    <section className="w-full bg-cream overflow-hidden">
      <div className="max-w-[1300px] mx-auto px-6 md:px-10 lg:px-16 py-16 lg:py-24 flex flex-col lg:flex-row items-center gap-12 lg:gap-0">

        {/* ===== LEFT: Text content ===== */}
        <div className="w-full lg:w-1/2 flex flex-col items-start gap-6 relative">

          {/* Sparkle top-left */}
          <Sparkle size={22} className="text-orange animate-sparkle mb-[-16px]" />

          {/* Main headline */}
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] font-bold leading-[1.0] text-dark fade-up">
            Fresh<br />
            <span className="italic font-normal text-dark/80">When You're</span><br />
            Ready.
          </h1>

          {/* Sub-copy */}
          <p className="text-muted text-base sm:text-lg leading-relaxed max-w-sm fade-up fade-up-delay-1">
            Excellence Tests in Every Bite. Adorn your Food Service with the freshest local produce.
          </p>

          {/* CTA */}
          <Link
            to="/market"
            className="fade-up fade-up-delay-2 inline-flex items-center gap-2 bg-orange text-white font-semibold px-7 py-3.5 rounded-full text-base hover:bg-orange-hover transition-all duration-300 shadow-md hover:shadow-orange/30 hover:shadow-xl hover:-translate-y-0.5"
          >
            Find Foods
          </Link>

          {/* Testimonial card */}
          <div className="fade-up fade-up-delay-3 mt-4 bg-white rounded-2xl px-5 py-4 shadow-sm border border-cream-dark max-w-xs">
            <p className="text-sm text-dark leading-relaxed">
              "Is there a way to order lab-specific fruits in bulk? I found great produce on a scheme that has fresh-picked veggies and these products are just three weeks, and better than anticipated."
            </p>
            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-cream-dark">
              <img
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face"
                alt="Jane Cooper"
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-semibold text-dark">Jane Cooper</p>
                <p className="text-xs text-muted">Verified Buyer</p>
                <p className="text-orange text-xs mt-0.5">★★★★★</p>
              </div>
            </div>
          </div>

          {/* Bottom sparkle */}
          <Sparkle size={18} className="text-orange animate-sparkle absolute -bottom-4 left-40 opacity-70" />
        </div>

        {/* ===== RIGHT: Stacked product cards ===== */}
        <div className="w-full lg:w-1/2 relative flex justify-center lg:justify-end">
          {/* Card stack wrapper */}
          <div className="relative w-[300px] sm:w-[360px] h-[380px] sm:h-[440px]">
            {cards.map((card, i) => (
              <ProductCard key={i} {...card} />
            ))}

            {/* Floating kiwi slice decoration */}
            <img
              src="https://images.unsplash.com/photo-1585059895524-72359e06133a?w=200&h=200&fit=crop"
              alt="kiwi"
              className="absolute -left-16 top-12 w-24 h-24 rounded-full object-cover shadow-2xl animate-float border-4 border-white"
            />
            {/* Sparkle decorations */}
            <Sparkle size={26} className="absolute top-0 right-0 text-orange animate-sparkle" />
            <Sparkle size={16} className="absolute bottom-12 right-4 text-card-yellow animate-sparkle opacity-70" />

            {/* Counter pill */}
            <div className="absolute bottom-4 -right-4 bg-white rounded-full px-5 py-2 shadow-lg flex items-center gap-3 border border-cream-dark z-40">
              <span className="w-7 h-7 rounded-full bg-orange flex items-center justify-center text-white text-xs font-bold">01</span>
              <div className="w-px h-5 bg-cream-dark" />
              <span className="text-sm font-semibold text-dark tracking-wide">of 14</span>
              <button className="w-7 h-7 rounded-full bg-cream-dark flex items-center justify-center text-dark hover:bg-orange hover:text-white transition-colors">
                →
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HomeHeader;
