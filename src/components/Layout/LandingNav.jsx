import { lazy, Suspense, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Orb1, Orb2, Orb3, Orb4 } from "../../components/Rbits/Orbs.jsx";
// Lazy-load all expensive components
const FlowHero = lazy(() => import("../../pages/Sections/HeroSection.jsx"));
// const VisionPage = lazy(() => import("../../pages/Landing/VisionPage.jsx"));
// const SitesPage = lazy(() => import("../../pages/Landing/SitesPage.jsx"));
// const TestimonialScrollStack = lazy(() => import("../../pages/Landing/TestimonialScrollStack.jsx"));
const ShimmerButton = lazy(() => import("../UI/ShimmerButton.jsx"));
// const ContactUs = lazy(()=>import("../../pages/Landing/ContactUs.jsx"))

import bgLogoBoth from "../../../logo.png";
import { Contact } from "lucide-react";

export default function HeroSection({ navItems }) {
  const location = useLocation();
  const LocationRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const ContactUsRef = useRef(null);
  // Function to handle the smooth scroll.
  const handleScrollToSection = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className=" h-20">
      {/* Responsive Navbar */}
      <nav className="absolute top-0 left-0 right-0 z-50 bg-transparent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <div className="flex items-end space-x-1">
                <img
                  src={bgLogoBoth}
                  alt="Company Logo"
                  className="h-10 w-auto"
                />
                <span className="text-green-500 font-bold text-xl">ack</span>
                <span className="text-white font-bold text-xl">base</span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-end mt-3 ml-10   w-full space-x-8">
              {navItems.map(({ path, label }) => (
                <Link
                  key={label}
                  to={path}
                  className={`transition-colors duration-300 ${
                    location.pathname === path
                      ? "text-green-400"
                      : "text-gray-300 hover:text-green-400"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login">
                <button className="px-5 py-2 rounded-full text-xs font-bold border backdrop-filter backdrop-blur-md bg-white/5 hover:scale-105 hover:bg-white/10 ring-1 ring-white/10 transition-all duration-300">
                  LOGIN
                </button>
              </Link>
              <Link to="/signup">
                <button className="px-5 py-2 rounded-full text-nowrap text-xs font-bold border backdrop-filter backdrop-blur-md bg-white/5 hover:scale-105 hover:bg-white/10 ring-1 ring-white/10 transition-all duration-300">
                  SIGN UP
                </button>
              </Link>
            </div>

            {/* Mobile Menu Button (Hamburger) */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded={isMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {/* Icon for menu open/close */}
                {isMenuOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`${isMenuOpen ? "block" : "hidden"} md:hidden`}
          id="mobile-menu"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 backdrop-blur-lg bg-black/80">
            {navItems.map(({ path, label }) => (
              <Link
                key={label}
                to={path}
                onClick={() => setIsMenuOpen(false)}
                className={`text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === path ? "bg-gray-900 text-white" : ""
                }`}
              >
                {label}
              </Link>
            ))}
            <div className="pt-4 pb-2 border-t border-gray-700 flex items-center justify-center space-x-4">
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <button className="px-5 py-2 rounded-full text-xs font-bold border bg-white/5 hover:bg-white/10 w-full">
                  LOGIN
                </button>
              </Link>
              <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                <button className="px-5 py-2 rounded-full text-xs font-bold border bg-white/5 hover:bg-white/10 w-full">
                  SIGN UP
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
