import {
  Building,
  Github,
  Home,
  Instagram,
  Linkedin,
  Phone,
  Twitter,
  User,
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import qrInsta from "../../assets/Landing/instaqr.jpg";

const Footer = () => {
  const mobileNumber = "+919368646810";

  return (
    <footer className="relative w-full bg-black text-gray-400 px-8 md:px-20 pt-28 pb-16 overflow-hidden">
      {/* Glow Gradients */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#0AFF9D33] blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#0AFF9D22] blur-[120px] rounded-full"></div>

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-16">
        {/* BRAND + TAGLINE */}
        <div className="space-y-5">
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Hack
            <span className="text-[#0AFF9D] drop-shadow-[0_0_12px_#0AFF9D99]">
              Base
            </span>
          </h1>

          <p className="text-base text-gray-400 leading-relaxed">
            Empowering India’s next-generation developers with exposure,
            community and world-class learning.
          </p>

          {/* QR SECTION */}
          <div className="flex flex-col items-start mt-6">
            <img
              src={qrInsta}
              alt="Instagram QR"
              className="w-40 h-40 rounded-xl border border-white/10 shadow-[0_0_25px_rgba(255,255,255,0.06)] hover:scale-[1.03] transition-all"
            />
            <p className="text-xs text-gray-500 mt-3">
              Scan to connect on Instagram
            </p>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-6 tracking-wide">
            Quick Links
          </h3>

          <ul className="space-y-4 text-base">
            <li>
              <Link
                to="/"
                className="flex items-center gap-3 hover:text-[#0AFF9D] transition-all"
              >
                <Home size={18} /> Home
              </Link>
            </li>

            <li>
              <Link
                to="/aboutus"
                className="flex items-center gap-3 hover:text-[#0AFF9D] transition-all"
              >
                <User size={18} /> About Us
              </Link>
            </li>

            <li>
              <Link
                to="/community"
                className="flex items-center gap-3 hover:text-[#0AFF9D] transition-all"
              >
                <Building size={18} /> Community
              </Link>
            </li>

            <li>
              <a
                href={`tel:${mobileNumber}`}
                className="flex items-center gap-3 hover:text-[#0AFF9D] transition-all"
              >
                <Phone size={18} /> Contact ({mobileNumber})
              </a>
            </li>
          </ul>
        </div>

        {/* SOCIALS */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-6 tracking-wide">
            Connect
          </h3>

          <div className="flex gap-6">
            <a
              href="#"
              target="_blank"
              className="p-2 bg-white/5 rounded-full hover:bg-[#0AFF9D]/20 hover:text-[#0AFF9D] transition-all"
            >
              <Github size={22} />
            </a>

            <a
              href="https://www.linkedin.com/in/hack-base-2146ab384/"
              target="_blank"
              className="p-2 bg-white/5 rounded-full hover:bg-[#0AFF9D]/20 hover:text-[#0AFF9D] transition-all"
            >
              <Linkedin size={22} />
            </a>

            <a
              href="#"
              target="_blank"
              className="p-2 bg-white/5 rounded-full hover:bg-[#0AFF9D]/20 hover:text-[#0AFF9D] transition-all"
            >
              <Twitter size={22} />
            </a>

            <a
              href="https://www.instagram.com/hackbase_india/"
              target="_blank"
              className="p-2 bg-white/5 rounded-full hover:bg-[#0AFF9D]/20 hover:text-[#0AFF9D] transition-all"
            >
              <Instagram size={22} />
            </a>
          </div>
        </div>

        {/* ABOUT COMPANY */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-6 tracking-wide">
            Company
          </h3>

          <ul className="space-y-4 text-base">
            <li className="hover:text-[#0AFF9D] transition-all">
              Terms & Conditions
            </li>
            <li className="hover:text-[#0AFF9D] transition-all">
              Privacy Policy
            </li>
            <li className="hover:text-[#0AFF9D] transition-all">
              Refund Policy
            </li>
            <li className="hover:text-[#0AFF9D] transition-all">
              Community Guidelines
            </li>
          </ul>
        </div>
      </div>

      {/* COPYRIGHT */}
      <p className="text-center text-sm text-gray-500 mt-20">
        © {new Date().getFullYear()} HackBase — All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
