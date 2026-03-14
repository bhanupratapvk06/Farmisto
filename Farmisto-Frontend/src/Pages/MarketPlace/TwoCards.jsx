import React from "react";
import { Link } from "react-router-dom";

const TwoCards = () => {
  const cards = [
    {
      label: "Vegetables",
      title: "Green World",
      offer: "Get 50% off on selected Veggies.",
      bg: "#6CC24A",
      img: "https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=700&h=500&fit=crop",
    },
    {
      label: "Fresh Fruits",
      title: "Healthy Food",
      offer: "Get 40% off on selected Fruits.",
      bg: "#E8621A",
      img: "https://images.unsplash.com/photo-1621955975083-b66b44853e5c?w=700&h=500&fit=crop",
    },
  ];

  return (
    <div id="products" className="w-full bg-cream py-16 lg:py-20">
      <div className="max-w-[1300px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card, i) => (
            <div
              key={i}
              className="relative rounded-3xl overflow-hidden h-64 sm:h-80 shadow-xl group cursor-pointer"
              style={{ backgroundImage: `url(${card.img})`, backgroundSize: "cover", backgroundPosition: "center" }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark/75 via-dark/30 to-transparent group-hover:from-dark/85 transition-all duration-300" />
              
              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-7">
                <span className="text-sm font-bold uppercase tracking-widest mb-1" style={{ color: card.bg === "#6CC24A" ? "#86efac" : "#fca5a5" }}>{card.label}</span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-2">{card.title}</h2>
                <p className="text-white/80 text-base mb-5">{card.offer}</p>
                <Link
                  to="/market"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-dark text-sm transition-all duration-300 w-fit hover:-translate-y-0.5"
                  style={{ backgroundColor: card.bg === "#6CC24A" ? "#E8C547" : "#f5f5f5" }}
                >
                  Discover Now →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TwoCards;