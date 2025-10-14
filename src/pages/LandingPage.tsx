import { lazy, Suspense, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

// Sections
import HeroSection from "./Sections/HeroSection.jsx";
const WhySection = lazy(() => import("./Sections/WhySection.jsx"));
import GallerySection from "./Sections/GallerySection.jsx";
import AchievementsSection from "./Sections/AchievementsSection.jsx";
const FeaturedSection = lazy(() => import("./Sections/FeaturedSection.jsx"));
import TestimonialSection from "./Sections/TestimonialSection.jsx";

// Components
import { Orb1, Orb2, Orb3, Orb4 } from "./Sections/Orbs.jsx";
const ShimmerButton = lazy(() => import("../components/UI/ShimmerButton.jsx"));
import Footer from "../components/Layout/Footer.jsx";

// Assets
import bgLogoBoth from "../../logo.png";

// A simple fallback component for Suspense
const SectionLoader = () => (
  <div className="flex justify-center items-center h-full">
    <p>Loading...</p>
  </div>
);

export default function LandingPage() {
  const location = useLocation();
  const galleryRef = useRef(null);

  // State to manage the mobile menu's visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to handle smooth scroll.
  const handleScrollToSection = (ref) => {
    // Close the mobile menu if it's open before scrolling
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
    // Scroll to the section
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const navItems = [{ path: "/aboutus", label: "About Us" }];

  return (
    <div className="relative min-h-screen text-white bg-black overflow-x-hidden">
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
              <button
                onClick={() => handleScrollToSection(galleryRef)}
                className="text-gray-300 hover:text-green-400 transition-colors duration-300"
              >
                Gallery
              </button>
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
            <button
              onClick={() => handleScrollToSection(galleryRef)}
              className="w-full text-left text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Gallery
            </button>
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

      <main>
        {/* Hero Section */}
        <section
          id="hero-section"
          className="relative w-full min-h-screen flex items-center animate-on-scroll fade-in-visible"
        >
          <div className="absolute left-52 top-52 md:inset-0   bg-black">
            <Orb1 />
            <HeroSection />
          </div>
          <div className="relative z-10 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center md:text-left md:w-3/4 lg:w-3/4">
              <h1 className="font-bold text-4xl sm:text-5xl md:text-6xl lg:text-8xl bg-gradient-to-b from-white to-theme-200 bg-clip-text text-transparent leading-tight">
                Explore the World <br /> with Hackbase
              </h1>
              <p className="mt-6 mx-auto md:mx-0 max-w-2xl font-normal text-base md:text-lg text-gray-300">
                Hackbase helps you discover the best opportunities, sharpen your
                skills, and reach new heights 🚀 — designed especially for
                students from tier 2 and 3 colleges.
              </p>
              <div className="mt-8 flex justify-center md:justify-start">
                <Suspense
                  fallback={
                    <div className="px-6 py-3 rounded-full bg-gray-700 animate-pulse w-36"></div>
                  }
                >
                  <ShimmerButton />
                </Suspense>
              </div>
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section
          id="vision-section"
          className="relative pb-40 bg-slate-800/55 animate-on-scroll"
        >
          <Orb2 />
          <Suspense fallback={<SectionLoader />}>
            <WhySection />
          </Suspense>
        </section>

        {/* Achievement Section */}
        <section
          id="achievements-section"
          className="relative py-20 md:py-32 bg-black animate-on-scroll"
        >
          <Orb1 />
          <AchievementsSection />
        </section>

        {/* Featured Section */}
        <section
          id="featured-section"
          className="relative py-20 md:py-32 bg-slate-800/55 animate-on-scroll"
        >
          <Orb4 />
          <Suspense fallback={<SectionLoader />}>
            <FeaturedSection />
          </Suspense>
        </section>

        {/* Gallery/Locations Section */}
        <section
          ref={galleryRef}
          id="sites-section"
          className="relative py-20 md:py-32 bg-black animate-on-scroll"
        >
          <Orb3 />
          <GallerySection />
        </section>

        {/* Testimonial Section */}
        <section
          id="testimonial-section"
          className="relative py-20 md:py-32 bg-black animate-on-scroll"
        >
          <Orb4 />
          <TestimonialSection />
        </section>
      </main>

      <Footer />
    </div>
  );
}
