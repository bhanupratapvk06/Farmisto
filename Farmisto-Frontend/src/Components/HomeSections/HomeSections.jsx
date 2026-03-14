import React from "react";
import { Link } from "react-router-dom";

/* Sparkle decoration */
const Sparkle = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C12.3 7.8 16.2 11.7 22 12C16.2 12.3 12.3 16.2 12 22C11.7 16.2 7.8 12.3 2 12C7.8 11.7 11.7 7.8 12 2Z" />
  </svg>
);

/* ============================================================
   Section 1 – Marquee ticker strip
   ============================================================ */
const MarqueeStrip = () => {
  const items = [
    "Organic Produce", "Farm to Table", "Local Farmers",
    "Zero Preservatives", "Fresh Daily", "Sustainable",
    "Hyperlocal Delivery", "100% Natural",
  ];
  return (
    <div className="w-full bg-orange py-3 overflow-hidden">
      <div className="flex w-max animate-marquee whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="inline-flex items-center gap-4 mx-6 text-white font-semibold text-sm tracking-wide uppercase">
            {item}
            <Sparkle size={12} className="text-white/70" />
          </span>
        ))}
      </div>
    </div>
  );
};

/* ============================================================
   Section 2 – "Fruits & Veggies" showcase  (like ref row 2)
   ============================================================ */
const ProduceShowcase = () => (
  <section className="bg-cream py-20 lg:py-28">
    <div className="max-w-[1300px] mx-auto px-6 md:px-10 lg:px-16 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
      {/* Left: Big image with yellow card bg */}
      <div className="w-full lg:w-1/2 relative flex justify-center">
        <div className="w-[300px] sm:w-[380px] h-[380px] sm:h-[460px] bg-[#E8C547] rounded-[2.5rem] overflow-hidden shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=700&h=800&fit=crop"
            alt="Fresh vegetables"
            className="w-full h-full object-cover mix-blend-multiply opacity-90"
          />
        </div>
        {/* Floating kiwi */}
        <img
          src="https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=200&h=200&fit=crop"
          alt="kiwi"
          className="absolute -left-6 top-20 w-20 h-20 rounded-full object-cover shadow-2xl animate-float border-4 border-white"
        />
        <Sparkle size={22} className="absolute top-6 right-0 text-orange animate-sparkle" />
      </div>

      {/* Right: Text */}
      <div className="w-full lg:w-1/2">
        <p className="text-orange font-semibold text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
          <Sparkle size={14} /> Farm Fresh
        </p>
        <h2 className="font-serif text-4xl sm:text-5xl font-bold text-dark leading-tight mb-6">
          Fruits &amp; Veggies With<br />Appeal Stay Fresh<br />For Longer.
          <span className="text-orange">🌿</span>
        </h2>
        <p className="text-muted text-base leading-relaxed mb-8 max-w-md">
          Every plant on Earth has a goal that products it. The top layer of the peel is called the cuticle layer, which keeps moisture in while allowing the place to breathe without drying out. Farmisto protects fresh produce by forming a breathable "seal" on the fruit's surface, similar to the plant's cuticle layer.
        </p>
        <Link to="/market" className="inline-flex items-center gap-3 text-dark font-semibold text-sm border-b-2 border-dark pb-1 hover:text-orange hover:border-orange transition-colors duration-300 group">
          See More Products
          <span className="w-7 h-7 rounded-full border-2 border-dark flex items-center justify-center group-hover:border-orange transition-colors">→</span>
        </Link>
      </div>
    </div>
  </section>
);

/* ============================================================
   Section 3 – "Avocados at Peak" full-width feature (ref row 3)
   ============================================================ */
const AvocadoFeature = () => (
  <section className="bg-cream py-10 lg:py-16">
    <div className="max-w-[1300px] mx-auto px-6 md:px-10 lg:px-16">
      <div className="relative bg-[#E8C547] rounded-[2rem] overflow-hidden p-10 sm:p-14 flex flex-col lg:flex-row items-center gap-10">
        {/* Left text */}
        <div className="w-full lg:w-1/2 relative z-10">
          <Sparkle size={20} className="text-dark/30 mb-3 animate-sparkle" />
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-dark leading-tight mb-6">
            Avocados At Peak<br />Ripeness 2–3<br />Days Longer!
          </h2>
          <p className="text-dark/70 text-base leading-relaxed mb-4 max-w-sm">
            Avocados protected by Farmisto last longer and stay ripe, maintaining the perfect firmness and creaminess that you need. Enjoy more of the avocados you love.
          </p>
          <p className="text-dark/70 text-base leading-relaxed mb-8 max-w-sm">
            Our plant-based protection keeps avocados at that perfect ripeness for 2-3 days longer, so they're still fresh when you're ready to eat them.
          </p>
          <Link to="/market" className="inline-flex items-center gap-3 text-dark font-semibold text-sm border-b-2 border-dark pb-1 hover:text-dark/60 hover:border-dark/60 transition-colors duration-300 group">
            See More Products
            <span className="w-7 h-7 rounded-full border-2 border-dark flex items-center justify-center">→</span>
          </Link>
        </div>

        {/* Center: Avocado image */}
        <div className="absolute left-1/2 -translate-x-1/2 z-0 opacity-90 hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=500&h=500&fit=crop"
            alt="Avocado"
            className="w-60 h-60 object-cover rounded-full shadow-2xl border-8 border-white/50"
          />
        </div>

        {/* Right text */}
        <div className="w-full lg:w-1/2 relative z-10 lg:pl-20 xl:pl-32">
          <p className="text-dark/70 text-base leading-relaxed mb-4 max-w-sm">
            Protected Avocados have something within a longer window of moments. That means you can take a little more time to enjoy your avocados.
          </p>
          <p className="text-dark/70 text-base leading-relaxed max-w-sm">
            Our plant-based protection keeps avocados at that perfect ripeness for 2-3 days longer, so they're still fresh when you're ready to eat them.
          </p>
        </div>

        {/* Sparkle decorations */}
        <Sparkle size={30} className="absolute top-8 right-8 text-dark/20 animate-sparkle" />
        <Sparkle size={18} className="absolute bottom-8 left-8 text-dark/20 animate-sparkle" />
      </div>
    </div>
  </section>
);

/* ============================================================
   Section 4 – Product grid (Produce you love, ref row 4)
   ============================================================ */
const ProduceGrid = () => {
  const items = [
    { name: "English Cucumbers", img: "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=400&h=400&fit=crop", bg: "#6CC24A" },
    { name: "Mango", img: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=400&fit=crop", bg: "#E8621A" },
    { name: "Avocados", img: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&h=400&fit=crop", bg: "#E8C547" },
    { name: "Limes", img: "https://images.unsplash.com/photo-1558818498-28c1e002b655?w=400&h=400&fit=crop", bg: "#6CC24A" },
    { name: "Oranges", img: "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=400&h=400&fit=crop", bg: "#E8621A" },
  ];

  return (
    <section className="bg-cream py-20 lg:py-28">
      <div className="max-w-[1300px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="flex items-center gap-3 mb-12">
          <Sparkle size={20} className="text-orange animate-sparkle" />
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-dark">
            Produce You Love,<br />Protected By Farmisto
          </h2>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory">
          {items.map((item, i) => (
            <div
              key={i}
              className="snap-start flex-shrink-0 w-44 sm:w-52 rounded-3xl overflow-hidden cursor-pointer group"
              style={{ backgroundColor: item.bg }}
            >
              <img
                src={item.img}
                alt={item.name}
                className="w-full h-44 sm:h-52 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="p-3">
                <p className="text-sm font-semibold text-white/90">{item.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ============================================================
   Section 5 – Customer Testimonials (ref row 5)
   ============================================================ */
const Testimonials = () => {
  const reviews = [
    {
      name: "Leslie Alexander",
      role: "Verified Buyer",
      img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face",
      text: "I'm so thankful and everyone enjoyed the products. We definitely will be ordering for the second time now, easy delivery.",
    },
    {
      name: "Jerome Bell",
      role: "Verified Buyer",
      img: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=200&h=200&fit=crop&crop=face",
      text: "Everything was all delivered and all sort of things provided & best it has never let from beginning. It has never let me down.",
    },
    {
      name: "Annette Black",
      role: "Verified Buyer",
      img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
      text: "Only quality produce! I received the freshest organic vegetables. My family has never been happier with the quality.",
    },
  ];

  return (
    <section className="bg-cream-dark py-20 lg:py-28">
      <div className="max-w-[1300px] mx-auto px-6 md:px-10 lg:px-16">
        {/* Section header */}
        <div className="flex flex-col items-center text-center mb-14">
          <div className="flex items-center gap-3 mb-4">
            <Sparkle size={18} className="text-orange animate-sparkle" />
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-dark">
              Our Existing<br />Customer Feedback
            </h2>
            <Sparkle size={18} className="text-orange animate-sparkle" />
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div key={i} className="bg-white rounded-3xl p-7 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-5">
                <img
                  src={r.img}
                  alt={r.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-cream-dark"
                />
                <div>
                  <p className="font-semibold text-dark">{r.name}</p>
                  <p className="text-xs text-muted">{r.role}</p>
                  <p className="text-orange text-xs mt-0.5">★★★★★</p>
                </div>
              </div>
              <p className="text-muted text-sm leading-relaxed">{r.text}</p>
            </div>
          ))}
        </div>

        {/* Scroll controls */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <button className="w-10 h-10 rounded-full border-2 border-muted text-muted flex items-center justify-center hover:border-dark hover:text-dark transition-colors">←</button>
          <button className="w-10 h-10 rounded-full bg-dark text-white flex items-center justify-center hover:bg-dark/80 transition-colors">→</button>
        </div>
      </div>
    </section>
  );
};

export { MarqueeStrip, ProduceShowcase, AvocadoFeature, ProduceGrid, Testimonials };
