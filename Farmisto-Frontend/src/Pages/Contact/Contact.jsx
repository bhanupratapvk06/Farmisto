import React from "react";
import NavBar from "../../Components/NavBar/NavBar";
import Footer from "../../Components/Footer/Footer";

const Sparkle = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C12.3 7.8 16.2 11.7 22 12C16.2 12.3 12.3 16.2 12 22C11.7 16.2 7.8 12.3 2 12C7.8 11.7 11.7 7.8 12 2Z" />
  </svg>
);

const ContactUs = () => {
  const details = [
    { label: "Address", value: "123 Green Street, Farmer's City, AG 45678" },
    { label: "Email", value: "support@farmisto.com" },
    { label: "Phone", value: "+1 (123) 456-7890" },
    { label: "Hours", value: "Mon–Fri, 9:00 AM – 5:00 PM" },
  ];

  return (
    <div className="min-h-screen bg-cream">
      <NavBar />

      {/* Hero */}
      <div className="bg-cream-dark border-b border-cream-dark/50 py-16 text-center px-6">
        <Sparkle size={20} className="text-orange mx-auto mb-4 animate-sparkle" />
        <h1 className="font-serif text-5xl sm:text-6xl font-bold text-dark">
          Contact <span className="italic font-normal">Us</span>
        </h1>
        <p className="text-muted text-lg mt-4 max-w-xl mx-auto">Get in touch with us for any inquiries or support.</p>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Contact Form */}
        <div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-dark mb-8">We'd love to hear from you!</h2>
          <form className="space-y-5">
            {["Full Name", "Email Address", "Subject"].map((label, i) => (
              <div key={i}>
                <label className="block text-sm font-semibold text-dark mb-2">{label}</label>
                <input
                  type={label === "Email Address" ? "email" : "text"}
                  className="w-full px-5 py-3.5 rounded-xl border border-cream-dark bg-white focus:outline-none focus:border-orange text-dark placeholder-muted transition-colors"
                  placeholder={`Enter your ${label.toLowerCase()}`}
                />
              </div>
            ))}
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Message</label>
              <textarea
                rows="5"
                className="w-full px-5 py-3.5 rounded-xl border border-cream-dark bg-white focus:outline-none focus:border-orange text-dark placeholder-muted transition-colors resize-none"
                placeholder="Write your message..."
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-orange text-white font-semibold rounded-xl hover:bg-orange-hover transition-colors text-base shadow-md"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Details */}
        <div className="flex flex-col gap-6">
          <div className="bg-dark rounded-3xl p-10 text-white">
            <Sparkle size={20} className="text-orange mb-6 animate-sparkle" />
            <h3 className="font-serif text-3xl font-bold mb-8">Our Contact Details</h3>
            <ul className="space-y-6">
              {details.map((d, i) => (
                <li key={i} className="flex flex-col gap-1 border-b border-white/10 pb-5 last:border-0 last:pb-0">
                  <span className="text-xs font-bold uppercase tracking-widest text-orange">{d.label}</span>
                  <span className="text-white/80 text-base">{d.value}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Map placeholder */}
          <div className="rounded-3xl overflow-hidden h-48 bg-cream-dark flex items-center justify-center text-muted text-sm font-medium border border-cream-dark">
            📍 Map Embed Here
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactUs;
