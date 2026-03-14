import React from "react";
import { Link } from "react-router-dom";
import { RiLeafFill } from "react-icons/ri";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  const footerLinks = {
    "How It Works": [
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
      { name: "Read", path: "/faq" },
    ],
    "Produce": [
      { name: "Vegetables", path: "/market" },
      { name: "Fruits", path: "/market" },
      { name: "Herbs", path: "/market" },
    ],
    "Join Our Newsletter": null,
  };

  return (
    <footer className="bg-cream border-t border-cream-dark pt-16 pb-8">
      <div className="max-w-[1300px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <RiLeafFill size={22} className="text-orange" />
              <span className="font-serif text-2xl font-bold text-dark tracking-tight">
                farm<span className="italic">isto</span>
              </span>
            </div>
            <p className="text-muted text-sm leading-relaxed max-w-xs">
              Delivering the freshest farm produce directly from local farmers to your table. Sustainable. Fresh. Local.
            </p>
            <div className="flex items-center gap-3 mt-2">
              {[FaFacebookF, FaInstagram, FaTwitter].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full bg-cream-dark flex items-center justify-center text-dark hover:bg-orange hover:text-white transition-all duration-300">
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div>
            <h4 className="font-semibold text-dark text-sm uppercase tracking-wider mb-5">How It Works</h4>
            <ul className="flex flex-col gap-3">
              {footerLinks["How It Works"].map((l, i) => (
                <li key={i}><Link to={l.path} className="text-muted text-sm hover:text-dark transition-colors">{l.name}</Link></li>
              ))}
            </ul>
          </div>

          {/* Produce */}
          <div>
            <h4 className="font-semibold text-dark text-sm uppercase tracking-wider mb-5">Produce</h4>
            <ul className="flex flex-col gap-3">
              {footerLinks["Produce"].map((l, i) => (
                <li key={i}><Link to={l.path} className="text-muted text-sm hover:text-dark transition-colors">{l.name}</Link></li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-dark text-sm uppercase tracking-wider mb-5">Join Our Newsletter</h4>
            <div className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Email address"
                className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream focus:outline-none focus:border-orange transition-colors text-sm text-dark placeholder-muted"
              />
              <button className="w-10 h-10 rounded-full bg-orange flex items-center justify-center text-white hover:bg-orange-hover transition-colors self-end shadow-md">
                →
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-cream-dark pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted text-xs">© {new Date().getFullYear()} Farmisto Trading Corp.</p>
          <div className="flex gap-6">
            <Link to="/terms-conditions" className="text-xs text-muted hover:text-dark transition-colors">Terms</Link>
            <Link to="/" className="text-xs text-muted hover:text-dark transition-colors">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
