import { useRef } from "react";
import CardSwap, { Card } from "../../components/Rbits/LaserFlow.jsx";

import HeroCardImg1 from "../../assets/images_hack_agra_chapter_1/image5.jpg";
import HeroCardImg2 from "../../assets/images_hack_agra_chapter_1/image4.jpg";
import HeroCardImg3 from "../../assets/images_hack_agra_chapter_1/image3.jpg";

export default function HeroSection() {
  const CardDetails = [
    { title: "Hackathons", img: HeroCardImg1 },
    { title: "Communities", img: HeroCardImg2 },
    { title: "Events", img: HeroCardImg3 },
  ];

  return (
    <div className="h-[580px] relative">

      {/* ✅ DESKTOP VIEW (unchanged) */}
      <div className="hidden md:block">
        <CardSwap
          cardDistance={60}
          verticalDistance={70}
          delay={3000}
          pauseOnHover={false}
        >
          {CardDetails.map((card, index) => (
            <Card
              key={index}
              className="
                border border-[#0AFF9D]/40 
                shadow-[0_0_20px_#0AFF9D22] 
                rounded-xl 
                backdrop-blur-sm 
                bg-[#0A0A0A]/70
              "
            >
              {/* HEADER */}
              <div
                className="
                absolute top-0 left-0 w-full 
                flex justify-between items-center 
                px-4 py-3 bg-[#0A0A0A]/80
                border-b border-[#0AFF9D]/20 rounded-t-xl
              "
              >
                <div className="flex space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                </div>

                <span className="text-[#0AFF9D] text-xs tracking-widest font-light">
                  {card.title}
                </span>

                <div></div>
              </div>

              <img
                src={card.img}
                alt={card.title}
                className="
                  w-full h-full object-cover rounded-b-xl
                  mt-12 border-t border-[#0AFF9D]/10
                "
              />
            </Card>
          ))}
        </CardSwap>
      </div>

      {/* ================================================== */}
      {/* ✅ MOBILE VIEW — PURE CSS SLIDER (no libraries) */}
      {/* ================================================== */}
      <div className="md:hidden w-full h-full relative overflow-hidden rounded-xl">

        {/* ALL SLIDES STACKED */}
        {CardDetails.map((card, index) => (
          <div
            key={index}
            className={`
              absolute inset-0 w-full h-full
              animate-fadeSlide 
              opacity-0
              [animation-delay:${index * 3}s]
            `}
          >
            {/* IMAGE POSTER */}
            <img
              src={card.img}
              className="w-full h-full object-cover rounded-xl"
            />

            {/* DARK GRADIENT */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-black/80 rounded-xl"></div>

            {/* CENTER TEXT */}
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="text-3xl font-bold text-white drop-shadow-[0_0_18px_#0AFF9D] text-center">
                {card.title}
              </h2>
            </div>
          </div>
        ))}
      </div>

      {/* ⭐ PURE CSS KEYFRAMES (SLIDER) */}
      <style>{`
        @keyframes fadeSlide {
          0% { opacity: 0; transform: scale(1.03); }
          10% { opacity: 1; transform: scale(1); }
          33% { opacity: 1; transform: scale(1); }
          43% { opacity: 0; transform: scale(1.03); }
          100% { opacity: 0; }
        }
        .animate-fadeSlide {
          animation: fadeSlide 9s infinite;
        }
      `}</style>
    </div>
  );
}
