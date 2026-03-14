import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../utils/Auth";
import { FiSearch, FiUser, FiShoppingCart, FiMenu, FiX } from "react-icons/fi";

const NavBar = () => {
  const { authToken, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: "About", path: "/about" },
    { label: "Nearby Farmers", path: "/farmers" },
    { label: "FAQ", path: "/faq" },
    { label: "Contact", path: "/contact" },
    { label: "Market", path: "/market" },
  ];

  return (
    <nav className="w-full bg-cream px-6 md:px-10 lg:px-16 py-4 flex items-center justify-between relative z-50 border-b border-cream-dark">
      {/* Logo */}
      <Link to="/" className="flex-shrink-0">
        <span className="font-serif text-2xl font-bold text-dark tracking-tight">
          farm<span className="italic text-orange">isto</span>
        </span>
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-7 lg:gap-10">
        {navLinks.map((link, i) => (
          <Link
            key={i}
            to={link.path}
            className={`text-sm font-medium transition-colors duration-200 ${
              location.pathname === link.path
                ? "text-dark font-semibold"
                : "text-muted hover:text-dark"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-3">
        <button className="hidden md:flex items-center justify-center w-9 h-9 rounded-full hover:bg-cream-dark transition-colors text-dark">
          <FiSearch size={18} />
        </button>
        <button className="hidden md:flex items-center justify-center w-9 h-9 rounded-full hover:bg-cream-dark transition-colors text-dark">
          <FiUser size={18} />
        </button>
        <Link to="/cart" className="hidden md:flex items-center justify-center w-9 h-9 rounded-full hover:bg-cream-dark transition-colors text-dark">
          <FiShoppingCart size={18} />
        </Link>
        {authToken ? (
          <button
            onClick={logout}
            className="hidden md:inline-flex items-center px-5 py-2 rounded-full bg-dark text-cream text-sm font-semibold hover:bg-dark/90 transition-colors"
          >
            Log Out
          </button>
        ) : (
          <Link
            to="/form"
            className="hidden md:inline-flex items-center px-5 py-2 rounded-full bg-dark text-cream text-sm font-semibold hover:bg-dark/90 transition-colors"
          >
            Get Started
          </Link>
        )}

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-dark" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-cream shadow-lg py-6 flex flex-col gap-4 px-8 md:hidden z-50 border-t border-cream-dark">
          {navLinks.map((link, i) => (
            <Link
              key={i}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className="text-base font-medium text-dark hover:text-orange transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-3 pt-4 border-t border-cream-dark">
            <Link to="/cart" className="text-muted hover:text-dark"><FiShoppingCart size={20} /></Link>
            {authToken
              ? <button onClick={logout} className="text-orange font-semibold">Log Out</button>
              : <Link to="/form" className="text-orange font-semibold">Sign Up</Link>
            }
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;