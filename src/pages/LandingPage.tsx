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
import mainbg from "../assets/images_hack_agra_chapter_1/mainbg.jpg";
import mainbg2 from "../assets/images_hack_agra_chapter_1/mainbg2.jpg";


// Assets
import bgLogoBoth from "../../logo.png";

const SectionLoader = () => (
  <div className="flex justify-center items-center h-full">
    <p>Loading...</p>
  </div>
);

export default function LandingPage() {
  const location = useLocation();
  const galleryRef = useRef(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleScrollToSection = (ref) => {
    if (isMenuOpen) setIsMenuOpen(false);
    if (ref.current) ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const navItems = [{ path: "/", label: "About Us" }];

  // Helper arrays for grid lines (JSX-friendly)
  const verticalCount = 20;
  const horizontalCount = 14;
  const verticalSpacing = 70; // px spacing approximation (SVG uses preserveAspectRatio=none)
  const horizontalSpacing = 70;

  return (
    <div className="relative min-h-screen text-white overflow-x-hidden">
      {/* NAVBAR */}
      <nav className="absolute top-0 left-0 right-0 z-50  backdrop-blur-xl border-b border-[#0AFF9D]/10 shadow-[0_0_20px_#0AFF9D11]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex-shrink-0">
              <div className="flex items-end space-x-1">
                <img src={bgLogoBoth} alt="Company Logo" className="h-10 w-auto drop-shadow-[0_0_8px_#0AFF9D55]" />
                <span className="text-[#0AFF9D] font-bold text-xl tracking-tight">ack</span>
                <span className="text-white font-bold text-xl tracking-tight">base</span>
              </div>
            </Link>

            <div className="hidden md:flex items-end mt-3 ml-10 w-full space-x-8">
              <button
                onClick={() => handleScrollToSection(galleryRef)}
                className="text-gray-300 hover:text-[#0AFF9D] transition-colors duration-300 tracking-wide"
              >
                Gallery
              </button>
              <a
  href="https://hackbaseadmin.xyz/"
  target="_blank"
  rel="noopener noreferrer"
>
  <button className="px-5 py-2 rounded-full text-xl font-bold border border-[#0AFF9D]/20 bg-green hover:bg-[#0AFF9D]/20  transition-all duration-300 shadow-[0_0_12px_#0AFF9D44] text-[#0AFF9D]">
    Host your Hackathon here
  </button>
</a>


              {navItems.map(({ path, label }) => (
                <Link
                  key={label}
                  to={path}
                  className={`transition-colors duration-300 tracking-wide ${
                    location.pathname === path
                      ? "text-[#0AFF9D] drop-shadow-[0_0_6px_#0AFF9D]"
                      : "text-gray-300 hover:text-[#0AFF9D]"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login">
                <button className="px-5 py-2 rounded-full text-xs font-bold border bg-green-600 border-[#0AFF9D]/20 bg-black/30 hover:bg-[#0AFF9D]/10 backdrop-blur-md transition-all duration-300 shadow-[0_0_12px_#0AFF9D22]">
                  Login
                </button>
              </Link>
              <Link to="/signup">
                <button className="px-5 py-2  rounded-full text-xs font-bold border bg-green-600 border-[#0AFF9D]/20 bg-black/30 hover:bg-[#0AFF9D]/10 backdrop-blur-md transition-all duration-300 shadow-[0_0_12px_#0AFF9D22]">
                  SignUp
                </button>
              </Link>
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-[#0AFF9D] hover:bg-black/40"
              >
                {isMenuOpen ? (
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <div className={`${isMenuOpen ? "block" : "hidden"} md:hidden bg-black/80 backdrop-blur-xl border-t border-[#0AFF9D]/10`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button
              onClick={() => handleScrollToSection(galleryRef)}
              className="w-full text-left text-gray-300 hover:bg-black/40 hover:text-[#0AFF9D] block px-3 py-2 rounded-md"
            >
              Gallery
            </button>
            <a
  href="https://hackbaseadmin.xyz/"
  target="_blank"
  rel="noopener noreferrer"
  onClick={() => setIsMenuOpen(false)}
>
  <button className="w-full mt-3 px-5 py-2 rounded-full text-l font-bold border border-[#0AFF9D]/20 bg-black/30 hover:bg-[#0AFF9D]/20 text-[#0AFF9D]">
    HOST YOUR HACKATHON HERE
  </button>
</a>


            {navItems.map(({ path, label }) => (
              <Link
                key={label}
                to={path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-gray-300 hover:bg-black/40 hover:text-[#0AFF9D] ${
                  location.pathname === path ? "text-[#0AFF9D] bg-black/50" : ""
                }`}
              >
                {label}
              </Link>
            ))}

            <div className="pt-4 pb-2 border-t border-[#0AFF9D]/10 flex items-center justify-center space-x-4">
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <button className="px-5 py-2 rounded-full text-xs font-bold border border-[#0AFF9D]/20 bg-black/30 hover:bg-[#0AFF9D]/10 w-full">
                  LOGIN
                </button>
              </Link>
              <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                <button className="px-5 py-2 rounded-full text-xs font-bold border border-[#0AFF9D]/20 bg-black/30 hover:bg-[#0AFF9D]/10 w-full">
                  SIGN UP
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main>
        <section
  className="relative w-full min-h-screen flex items-center overflow-hidden bg-cover bg-center"
  style={{
    backgroundImage: `url(${mainbg})`,
  }}
>


          {/* Top: Wavy + Tech Graph Lines Background (JSX-correct) */}
          <div className="absolute inset-0 pointer-events-none opacity-30 mix-blend-screen">
            {/* Wavy neon paths */}
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1200 700">
              <path d="M0 220 Q300 120 600 220 T1200 220" stroke="#0AFF9D" strokeOpacity="0.2" strokeWidth="2" fill="none" />
              <path d="M0 300 Q300 200 600 300 T1200 300" stroke="#0AFF9D" strokeOpacity="0.14" strokeWidth="1.8" fill="none" />
              <path d="M0 380 Q300 280 600 380 T1200 380" stroke="#0AFF9D" strokeOpacity="0.1" strokeWidth="1.2" fill="none" />
            </svg>

            {/* Tech grid lines (vertical/horizontal) rendered as JSX elements */}
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox={`0 0 ${verticalCount * verticalSpacing} ${horizontalCount * horizontalSpacing}`}>
              {/* Vertical lines */}
              {Array.from({ length: verticalCount }).map((_, i) => {
                const x = i * verticalSpacing;
                return (
                  <line
                    key={`v-${i}`}
                    x1={x}
                    y1={0}
                    x2={x}
                    y2={horizontalCount * horizontalSpacing}
                    stroke="#0AFF9D"
                    strokeOpacity={0.05}
                    strokeWidth={1}
                  />
                );
              })}

              {/* Horizontal lines */}
              {Array.from({ length: horizontalCount }).map((_, i) => {
                const y = i * horizontalSpacing;
                return (
                  <line
                    key={`h-${i}`}
                    x1={0}
                    y1={y}
                    x2={verticalCount * verticalSpacing}
                    y2={y}
                    stroke="#0AFF9D"
                    strokeOpacity={0.03}
                    strokeWidth={1}
                  />
                );
              })}
            </svg>

            {/* Accent diagonal graph-strokes for 'techy' look */}
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1200 700">
              <polyline points="0,550 120,490 240,520 360,460 480,480 600,420 720,450 840,390 960,420 1080,360 1200,380"
                fill="none"
                stroke="#0AFF9D"
                strokeOpacity="0.08"
                strokeWidth="2"
              />
            </svg>
          </div>

          {/* Decorative orb behind hero (kept subtle) */}
          <div className="absolute inset-0 opacity-[0.12] pointer-events-none">
            <Orb1 />
          </div>

          {/* Hero card / image cluster */}
          <div className="absolute left-52 top-52 md:inset-0 pointer-events-none">
            <HeroSection />
          </div>

          {/* Content */}
          <div className="relative z-10 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center md:text-left md:w-3/4 lg:w-3/4">
              <h1 className="font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-tight text-white drop-shadow-[0_0_12px_#0AFF9D44]">
                Explore the World <br /> with Hackbase
              </h1>

              <p className="mt-6 text-gray-300 max-w-2xl text-base md:text-lg font-light">
                Hackbase helps you discover the best opportunities, sharpen your skills, and reach new heights 🚀 — built especially for passionate students.
              </p>

              <div className="mt-8 flex justify-center md:justify-start">
                <Suspense fallback={<div className="px-6 py-3 rounded-full bg-gray-700 animate-pulse w-36"></div>}>
                  <ShimmerButton />
                </Suspense>
              </div>
            </div>
          </div>
        </section>

        {/* VISION */}
      <section
  className="relative pb-40 border-t border-[#0AFF9D]/10 overflow-hidden"
>
  {/* FIXED BG IMAGE */}
  <div
    className="absolute inset-0 bg-center bg-cover bg-no-repeat bg-fixed opacity-[0.10] pointer-events-none"
    style={{
      backgroundImage: `url(${mainbg2})`,
    }}
  />

  {/* Noise Texture */}
  <div
    className="absolute inset-0 opacity-[0.05] pointer-events-none"
    style={{ backgroundImage: "url('/noise.png')" }}
  />

  {/* Tech Grid */}
  <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {Array.from({ length: 20 }).map((_, i) => (
        <line
          key={i}
          x1={i * 80}
          y1="0"
          x2={i * 80}
          y2="1000"
          stroke="#0AFF9D"
          strokeWidth="1"
          strokeOpacity="0.06"
        />
      ))}
    </svg>
  </div>

  {/* CONTENT */}
  <Suspense fallback={<SectionLoader />}>
    <WhySection />
  </Suspense>
</section>


        {/* ACHIEVEMENTS */}
        <section className="relative border-t border-[#0AFF9D]/5">
          {/* <Orb1 /> */}
          <AchievementsSection />
        </section>
 <section className="relative border-t border-[#0AFF9D]/5">
          {/* <Orb1 /> */}
      
        </section>

        {/* FEATURED */}
        <section className="relative border-t border-[#0AFF9D]/5">
          {/* <Orb4 /> */}
          <Suspense fallback={<SectionLoader />}>
            <FeaturedSection />
          </Suspense>
        </section>

        {/* GALLERY */}
        <section ref={galleryRef} className="relative py-20 md:py-32 bg-black border-t border-[#0AFF9D]/5">
          <Orb3 />
          <GallerySection />
        </section>

        {/* TESTIMONIALS */}
        <section className="relative py-20 md:py-32 bg-black border-t border-[#0AFF9D]/5">
          {/* <Orb4 /> */}
          <TestimonialSection />
        </section>
      </main>

      <Footer />
    </div>
  );
}
