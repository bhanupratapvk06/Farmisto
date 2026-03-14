import React from "react";
import NavBar from "../../Components/NavBar/NavBar";
import Footer from "../../Components/Footer/Footer";
import { Link } from "react-router-dom";

const Sparkle = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C12.3 7.8 16.2 11.7 22 12C16.2 12.3 12.3 16.2 12 22C11.7 16.2 7.8 12.3 2 12C7.8 11.7 11.7 7.8 12 2Z" />
  </svg>
);

const About = () => {
  const sections = [
    {
      title: "Our Mission",
      text: "To connect consumers with farmers directly, ensuring the freshest produce while empowering local agriculture through fair trade and sustainable practices.",
      img: "https://images.pexels.com/photos/65174/pexels-photo-65174.jpeg",
      reverse: false,
    },
    {
      title: "Our Vision",
      text: "A future where communities thrive on locally sourced, organic food while farmers gain the recognition and compensation they deserve for their hard work.",
      img: "https://images.pexels.com/photos/11691740/pexels-photo-11691740.jpeg",
      reverse: true,
    },
  ];

  const values = [
    { icon: "🌱", title: "Sustainability", desc: "Protecting our planet through eco-friendly farming practices." },
    { icon: "🤝", title: "Fair Trade", desc: "Ensuring farmers receive the full value they deserve." },
    { icon: "🔍", title: "Transparency", desc: "Building trust through honest communication." },
    { icon: "🏘️", title: "Community", desc: "Strengthening local economies by supporting local farmers." },
    { icon: "🥦", title: "Health", desc: "Promoting nutritious and fresh food choices for all." },
    { icon: "📍", title: "Hyperlocal", desc: "Connecting you to farms within 5km of where you live." },
  ];

  return (
    <div className="min-h-screen bg-cream">
      <NavBar />

      {/* Page header */}
      <div className="bg-cream-dark border-b border-cream-dark/50 py-16 text-center px-6">
        <Sparkle size={20} className="text-orange mx-auto mb-4 animate-sparkle" />
        <h1 className="font-serif text-5xl sm:text-6xl font-bold text-dark">About <span className="italic font-normal">Farmisto</span></h1>
        <p className="text-muted text-lg mt-4 max-w-xl mx-auto">Revolutionizing how fresh produce reaches your table, directly from local farmers.</p>
      </div>

      {/* Mission / Vision Sections */}
      <div className="max-w-[1300px] mx-auto px-6 md:px-10 lg:px-16 py-20 space-y-24">
        {sections.map((s, i) => (
          <div key={i} className={`flex flex-col ${s.reverse ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-12 lg:gap-20`}>
            <div className="w-full lg:w-1/2">
              <img src={s.img} alt={s.title} className="w-full h-[380px] object-cover rounded-[2rem]" />
            </div>
            <div className="w-full lg:w-1/2">
              <p className="text-orange font-bold tracking-widest uppercase text-sm mb-3">Farmisto</p>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-dark mb-6">{s.title}</h2>
              <p className="text-muted text-lg leading-relaxed">{s.text}</p>
            </div>
          </div>
        ))}

        {/* Values Grid */}
        <div>
          <div className="text-center mb-12">
            <Sparkle size={20} className="text-orange mx-auto mb-4 animate-sparkle" />
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-dark">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <div key={i} className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-md border border-cream-dark/50 transition-shadow">
                <span className="text-4xl mb-4 block">{v.icon}</span>
                <h3 className="font-serif text-xl font-bold text-dark mb-2">{v.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Banner */}
      <div className="bg-dark text-white py-20 text-center px-6">
        <Sparkle size={22} className="text-orange mx-auto mb-5 animate-sparkle" />
        <h2 className="font-serif text-4xl sm:text-5xl font-bold mb-5">Join the Revolution</h2>
        <p className="text-white/70 text-lg max-w-xl mx-auto mb-10">Be part of a community that values fresh, organic produce and fair trade. Together, we can make a difference.</p>
        <Link to="/market" className="inline-block px-10 py-4 bg-orange text-white font-semibold rounded-full text-lg hover:bg-orange-hover transition-colors shadow-lg">
          Get Started Today
        </Link>
      </div>

      <Footer />
    </div>
  );
};

export default About;
