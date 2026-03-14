import React, { useState } from "react";
import NavBar from "../../Components/NavBar/NavBar";
import Footer from "../../Components/Footer/Footer";
import { Link } from "react-router-dom";

const Sparkle = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C12.3 7.8 16.2 11.7 22 12C16.2 12.3 12.3 16.2 12 22C11.7 16.2 7.8 12.3 2 12C7.8 11.7 11.7 7.8 12 2Z" />
  </svg>
);

const FAQs = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    { question: "What is Farmisto?", answer: "Farmisto connects consumers directly with farmers, ensuring access to fresh produce while promoting fair trade and sustainability within 5km." },
    { question: "How does it work?", answer: "Consumers browse farmers within a 30km radius, negotiate prices, and purchase produce directly. Farmers and retailers have dashboards to track items and profits." },
    { question: "What are the benefits for farmers?", answer: "Farmers get better recognition, fair prices for their produce, and direct connections with consumers and retailers, reducing middlemen costs." },
    { question: "How can I register as a farmer?", answer: "Sign up through our platform and select your role as farmer. You'll instantly access all dashboard features including item tracking and analytics." },
    { question: "Is there a mobile app?", answer: "Currently we're focused on the web platform, but we're actively developing a mobile app for easier on-the-go access." },
    { question: "How is delivery handled?", answer: "Delivery is coordinated between buyers and local farmers. Our platform supports hyperlocal delivery within 5km for the freshest same-day produce." },
  ];

  return (
    <div className="min-h-screen bg-cream">
      <NavBar />

      {/* Hero */}
      <div className="bg-cream-dark border-b border-cream-dark/50 py-16 text-center px-6">
        <Sparkle size={20} className="text-orange mx-auto mb-4 animate-sparkle" />
        <h1 className="font-serif text-5xl sm:text-6xl font-bold text-dark">
          Frequently Asked <span className="italic font-normal">Questions</span>
        </h1>
        <p className="text-muted text-lg mt-4">Your queries answered, all in one place.</p>
      </div>

      {/* FAQ Accordions */}
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-20 space-y-4">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-cream-dark/50 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <button
              className="w-full flex justify-between items-center px-7 py-5 text-left group"
              onClick={() => setActiveIndex(activeIndex === i ? null : i)}
            >
              <span className="font-serif text-lg font-semibold text-dark group-hover:text-orange transition-colors pr-4">{faq.question}</span>
              <span className={`text-orange text-xl font-bold shrink-0 transition-transform duration-300 ${activeIndex === i ? "rotate-45" : ""}`}>+</span>
            </button>
            {activeIndex === i && (
              <div className="px-7 pb-6 text-muted text-base leading-relaxed border-t border-cream-dark/50 pt-4">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="bg-dark text-white py-20 text-center px-6">
        <h2 className="font-serif text-4xl sm:text-5xl font-bold mb-5">Still have questions?</h2>
        <p className="text-white/70 text-lg max-w-md mx-auto mb-10">Feel free to reach out to our team for any additional information or concerns.</p>
        <Link to="/contact" className="inline-block px-10 py-4 bg-orange text-white font-semibold rounded-full text-lg hover:bg-orange-hover transition-colors shadow-lg">
          Contact Us
        </Link>
      </div>

      <Footer />
    </div>
  );
};

export default FAQs;
