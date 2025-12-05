import { useEffect, useRef } from "react";
import MagicBento from "../../components/Rbits/MagicBento";
import { Orb2 } from "./Orbs.jsx";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function WhySection() {
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const bentoRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // SECTION FADE-IN
      gsap.from(containerRef.current, {
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      });

      // HEADER + PARAGRAPH STAGGER
      gsap.from(headerRef.current.children, {
        opacity: 0,
        y: 30,
        duration: 1.1,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 85%",
        },
      });

      // BENTO MAGICAL SCALE + SLIDE EFFECT
      gsap.from(bentoRef.current, {
        opacity: 0,
        y: 50,
        scale: 0.96,
        duration: 1.4,
        ease: "power3.out",
        scrollTrigger: {
          trigger: bentoRef.current,
          start: "top 88%",
        },
      });

      // BG ORB PARALLAX
      gsap.to(".orb-move", {
        y: 60,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      // GRID PARALLAX
      gsap.to(".grid-move", {
        y: 40,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative w-full px-4 sm:px-6 lg:px-8 py-20 md:py-32 overflow-hidden">

      {/* ORB BG (PARALLAX) */}
      <div className="absolute inset-0 opacity-[0.18] orb-move pointer-events-none">
        <Orb2 />
      </div>

      {/* GRID BG (PARALLAX) */}
      <div className="absolute inset-0 opacity-[0.06] mix-blend-screen grid-move pointer-events-none">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1200 700"
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <line
              key={`v-${i}`}
              x1={i * 60}
              y1="0"
              x2={i * 60}
              y2="700"
              stroke="#0AFF9D"
              strokeOpacity="0.05"
              strokeWidth="1"
            />
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
            <line
              key={`h-${i}`}
              x1="0"
              y1={i * 60}
              x2="1200"
              y2={i * 60}
              stroke="#0AFF9D"
              strokeOpacity="0.04"
              strokeWidth="1"
            />
          ))}
        </svg>
      </div>

      {/* MAIN CONTENT */}
      <div ref={containerRef} className="relative z-10 max-w-7xl mx-auto">

        {/* HEADER */}
        <div ref={headerRef} className="text-center md:text-left">
          <h2 className="font-black text-4xl sm:text-5xl lg:text-7xl tracking-tight text-white drop-shadow-[0_0_10px_#0AFF9D44]">
            Why Hackbase?
          </h2>

          <p className="font-light text-base md:text-lg text-slate-300 mt-5 max-w-3xl  md:mx-0 leading-relaxed">
            Our vision is to build the largest student-driven tech community in India — empowering talent where tech exposure is limited.
          </p>
        </div>

        {/* BENTO (ANIMATED) */}
        <div ref={bentoRef} className=" group">
          <MagicBento
            textAutoHide={true}
            enableStars={true}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableTilt={true}
            enableMagnetism={true}
            clickEffect={true}
            spotlightRadius={350}
            particleCount={14}
            glowColor="rgb(10, 255, 157)"
          />
        </div>
      </div>
    </div>
  );
}
