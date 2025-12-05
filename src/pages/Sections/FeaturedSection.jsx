import LogoLoop from "../../components/Rbits/LogoLoop.jsx";
import { SpotlightCard } from "./AchievementsSection.jsx";

import Col1 from "../../assets/Colleges/Col1.png";
import Col2 from "../../assets/Colleges/Col2.png";
import Col3 from "../../assets/Colleges/Col3.png";
import Col4 from "../../assets/Colleges/Col4.png";
import Col5 from "../../assets/Colleges/Col5.png";

import bgImage from "../../assets/images_hack_agra_chapter_1/mainbg3.jpg";

/* Colleges in auto-loop */
const imageLogos = [
  { src: Col2, alt: "Company 2", href: "https://dbrau.ac.in/" },
  { src: "https://upload.wikimedia.org/wikipedia/en/4/42/GLA_University_logo.png", alt: "Company 2", href: "https://www.gla.ac.in/" },
  { src: "https://www.salesforce.com/news/wp-content/uploads/sites/3/2020/08/SFDO-Logo-2020-RGB-Vert-FullColor.png?w=1218", alt: "Company 2", href: "/" },
  { src: "https://media.licdn.com/dms/image/v2/D560BAQHbPm8ipEBcog/company-logo_200_200/B56ZgYJ6uqHQAM-/0/1752751910222/trikaya_tech_logo?e=1765411200&v=beta&t=3oVkroy_OTXqmM3xuSRfvrYMhPifLC9LV7oz574a2jY", alt: "Company 2", href: "/https://builder.trikaya.io/" },

];

/* Sponsor logos */
const sponsorLogos = [
  {
    src: "https://www.notion.so/image/attachment%3A0bb65c60-c432-4e79-8ee5-628a39f78b78%3AIMG-20250606-WA0015(1).jpg?table=block&id=227e8ea9-f889-805b-a841-eb38535d2698&spaceId=286e8ea9-f889-8108-ac33-00039764aad8&width=2000&userId=&cache=v2",
    alt: "Brand 1",
    href: "https://instagram.com/zk_genesis/",
  },
  {
    src: "https://guisedup.com/favicon.ico",
    alt: "Brand 2",
    href: "https://guisedup.com/",
  },
  // {
  //   src: "https://tutemate.in/assets/tutemate-logo-A8ZGTVBt.png",
  //   alt: "Brand 3",
  //   href: "https://tutemate.in/",
  // },
  {
    src: "https://media.licdn.com/dms/image/v2/D560BAQHbPm8ipEBcog/company-logo_200_200/B56ZgYJ6uqHQAM-/0/1752751910222/trikaya_tech_logo?e=1765411200&v=beta&t=3oVkroy_OTXqmM3xuSRfvrYMhPifLC9LV7oz574a2jY",
    alt: "Brand 4",
    href: "https://www.linkedin.com/company/trikaya-tech/",
  },
  {
    src: "https://www.salesforce.com/news/wp-content/uploads/sites/3/2021/05/Salesforce-logo.jpg?w=1536&h=864",
    alt: "Brand 5",
    href: "/",
  },
  {
    src: "https://media.licdn.com/dms/image/v2/D4D0BAQFzFQTcWZHqEg/company-logo_200_200/company-logo_200_200/0/1686141487123?e=1765411200&v=beta&t=stNxzfRovSa4D5XunIiOw66r7EdscoXixRgtwCc383Y",
    alt: "Brand 6",
    href: "https://www.linkedin.com/company/id8nxt/posts/?feedView=all",
  },
];

function FeaturedSection() {
  return (
    <section className="relative py-40 overflow-hidden">

      {/* ========================= BG IMAGE ========================= */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed  opacity-20"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Soft gradient for readability */}
      <div className="absolute inset-0 bg-gradient-to-b -z-10" />

      {/* Noise texture */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.10] pointer-events-none -z-10"></div>

      {/* Subtle grid lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.06] -z-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {Array.from({ length: 30 }).map((_, i) => (
            <line
              key={i}
              x1={i * 80}
              x2={i * 80}
              y1="0"
              y2="3000"
              stroke="#0AFF9D"
              strokeOpacity="0.04"
              strokeWidth="1"
            />
          ))}
        </svg>
      </div>

      {/* CONTENT WRAPPER */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        
        {/* ======================= TITLE ======================= */}
        <div className="text-center mb-20">
          <h2 className="text-6xl lg:text-7xl font-extrabold text-white drop-shadow-xl">
            Our Network
          </h2>
          <p className="text-gray-300 text-lg mt-5 max-w-4xl mx-auto leading-relaxed">
            Hackbase is building bridges between students, colleges, and major companies.
            This network empowers Tier 2 & 3 talent with exposure, opportunities, and growth.
          </p>
        </div>

        {/* ======================= STATS ======================= */}
        <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-10 mx-auto w-full max-w-4xl">

          <SpotlightCard
            spotlightColor="rgba(10, 255, 157, 0.25)"
            className="bg-black/40 border border-green-500/20"
          >
            <div className="text-center">
              <div className="text-6xl font-bold text-green-400 mb-2">10+</div>
              <div className="text-xl text-white/90">College Connections</div>
            </div>
          </SpotlightCard>

          <SpotlightCard
            spotlightColor="rgba(59, 130, 246, 0.25)"
            className="bg-black/40 border border-blue-400/20"
          >
            <div className="text-center">
              <div className="text-6xl font-bold text-blue-400 mb-2">6+</div>
              <div className="text-xl text-white/90">Company Partnerships</div>
            </div>
          </SpotlightCard>
        </div>

        {/* ======================= MOVING COLLEGE LOGOS ======================= */}
        <div className="relative h-[220px] mt-24 mb-32">
          <LogoLoop
            logos={imageLogos}
            speed={120}
            direction="left"
            logoHeight={150}
            gap={40}
            pauseOnHover={false}
            scaleOnHover
            fadeOut
            fadeOutColor="#00000088"
          />
        </div>

        {/* ======================= SPONSORS ======================= */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white drop-shadow-md">
            Partnered Brands & Sponsors
          </h2>

          <p className="text-gray-300 max-w-3xl mx-auto mt-4 text-lg">
            These amazing brands support our mission of growing India’s next
            generation of developers and innovators.
          </p>
        </div>

        {/* Sponsor Logos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-10 justify-items-center">
          {sponsorLogos.map((logo, idx) => (
            <a
              key={idx}
              href={logo.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <div
                className="
                  bg-white/5 backdrop-blur-md border border-white/10 
                  rounded-xl p-4 w-40 h-40 flex justify-center items-center
                  transition-all duration-300 
                  hover:border-green-400/30 hover:shadow-[0_0_30px_rgba(10,255,157,0.4)] hover:scale-110
                "
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="object-contain h-24 w-24"
                />
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}

export default FeaturedSection;
