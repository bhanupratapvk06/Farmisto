import React from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRightLong,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

const Footer = () => {
  const topLinks = [
    { name: "Company", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "FAQs", path: "/faq" },
    { name: "Shipping & Returns", path: "/contact" },
    { name: "Contact Us", path: "/contact" },
  ];

  const bottomLinks = [
    { name: "Terms & Conditions", path: "/terms-conditions" },
    { name: "Legal Notice", path: "/" },
  ];

  return (
    <div className="h-auto bg-[#123827] flex flex-col">
      <div className="w-full h-2 flex">
        <div className="w-1/2 h-full bg-teal-400"></div>
        <div className="w-1/2 h-full bg-green-400"></div>
      </div>

      <div className="w-[90%] mx-auto py-5">
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-6 mt-5">
          <div className="w-full lg:w-1/2">
            <p className="text-xl lg:text-2xl font-bold text-white tracking-wide leading-snug">
              Sign up to receive the latest deals and fresh produce directly
              from farmers in your area.
            </p>
          </div>

          <div className="w-full sm:w-1/2">
            <div className="h-14 w-full px-2 flex items-center bg-[#114f35] rounded-lg">
              <MdEmail className="text-white text-4xl sm:text-5xl" />

              <input
                type="text"
                placeholder="Email Address"
                className="flex-1 text-sm font-semibold outline-none px-4 bg-transparent text-white placeholder-white"
              />

              <button className="w-1/3 lg:w-44 h-11 sm:h-12 rounded-md bg-white flex items-center justify-center hover:shadow-lg hover:bg-[#7a9f35] transition-all">
                <p className="text-sm lg:text-xl font-medium">Subscribe</p>
                <FaArrowRightLong className="text-sm ml-2" />
              </button>
            </div>
          </div>
        </div>

        <hr className="border border-white w-full mt-10 opacity-10" />

        <div className="flex flex-wrap items-center justify-between gap-10 mt-10">
          <div className="w-full lg:w-1/2 flex flex-col items-center text-center lg:text-left">
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 lg:gap-6">
              {topLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className="text-zinc-300 text-sm lg:text-md font-medium hover:text-[#7a9f35] transition-colors whitespace-nowrap"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <h1 className="text-white font-black text-5xl lg:text-8xl opacity-50 mt-5">
              Farmisto.
            </h1>
          </div>

          <div className="w-full flex justify-center gap-6">
            {[FaFacebook, FaInstagram, FaTwitter, FaLinkedin].map(
              (Icon, index) => (
                <Icon
                  key={index}
                  className="text-3xl lg:text-4xl text-zinc-200 hover:text-[#7a9f35] cursor-pointer transition-transform transform hover:scale-110"
                />
              )
            )}
          </div>
        </div>
      </div>

      <div className="bg-[#114f35] text-white py-4 flex flex-wrap justify-center gap-4 items-center">
        <p className="text-sm text-center">
          © {new Date().getFullYear()} Farmisto. All Rights Reserved.
        </p>

        {bottomLinks.map((link, index) => (
          <Link
            key={index}
            to={link.path}
            className="text-sm hover:text-[#7a9f35] transition-colors whitespace-nowrap"
          >
            {link.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Footer;
