import { Book, Code, Users } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import image3 from "../../assets/images_hack_agra_chapter_1/mainbg3.jpg";

/* ------------------------------------------------------ */
/* PREMIUM SPOTLIGHT CARD (FINAL VERSION) */
/* ------------------------------------------------------ */

export const SpotlightCard = ({
  children,
  className = "",
  spotlightColor = "rgba(10, 255, 157, 0.18)",
}) => {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(0.6)}
      onMouseLeave={() => setOpacity(0)}
      className={`
        relative rounded-2xl p-10 bg-black/50 backdrop-blur-xl
        border border-green-400/10
        shadow-[0_0_30px_rgba(0,255,180,0.05)]
        transition-all duration-500
        hover:shadow-[0_0_55px_rgba(0,255,180,0.18)]
        hover:-translate-y-2 hover:border-green-300/40
        ${className}
      `}
    >
      {/* Spotlight effect */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500 rounded-2xl"
        style={{
          opacity,
          background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 65%)`,
        }}
      />

      {children}
    </div>
  );
};

/* ------------------------------------------------------ */
/* ACHIEVEMENTS + FEATURES PAGE */
/* ------------------------------------------------------ */

function AchievementsSection() {
  const navigate = useNavigate();

  return (
    <section className="relative bg-black py-40 overflow-hidden">

      {/* FIXED BACKGROUND IMAGE */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed opacity-45 -z-20"
        style={{ backgroundImage: `url(${image3})` }}
      />

      {/* SOFT DARK GRADIENT */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/40 via-black/80 to-black" />

      {/* NOISE TEXTURE */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.07] pointer-events-none -z-10"></div>

      {/* TECH GRID */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] -z-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {Array.from({ length: 30 }).map((_, i) => (
            <line
              key={i}
              x1={i * 80}
              x2={i * 80}
              y1="0"
              y2="2000"
              stroke="#0AFF9D"
              strokeOpacity="0.05"
              strokeWidth="1"
            />
          ))}
        </svg>
      </div>

      {/* FLOATING PARTICLES */}
      <div className="absolute inset-0 -z-10 opacity-40">
        <div className="absolute w-1 h-1 bg-green-300 rounded-full animate-ping left-12 top-28"></div>
        <div className="absolute w-1 h-1 bg-green-300 rounded-full animate-ping left-1/3 top-1/2"></div>
        <div className="absolute w-1 h-1 bg-green-300 rounded-full animate-ping right-20 bottom-24"></div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* TITLE */}
        <div className="text-center mb-28">
          <h1 className="text-6xl md:text-7xl font-extrabold text-white tracking-tight drop-shadow-xl">
            What We’ve Achieved
          </h1>
          <p className="text-xl text-gray-300 mt-6 max-w-3xl mx-auto leading-relaxed">
            We are building India’s strongest tech ecosystem — starting with
            tier 2 & 3 cities, empowering students with real exposure, industry skills,
            and high-growth opportunities.
          </p>
        </div>

        {/* ACHIEVEMENT CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">

          <SpotlightCard>
            <div className="text-center">
              <p className="text-5xl font-bold text-green-400 mb-2">1+</p>
              <p className="text-lg text-white opacity-90">Hackathons Organised</p>
            </div>
          </SpotlightCard>

          <SpotlightCard>
            <div className="text-center">
              <p className="text-5xl font-bold text-green-400 mb-2">1+</p>
              <p className="text-lg text-white opacity-90">Communities Built</p>
            </div>
          </SpotlightCard>

          <SpotlightCard>
            <div className="text-center">
              <p className="text-5xl font-bold text-green-400 mb-2">4+</p>
              <p className="text-lg text-white opacity-90">Workshops & Events</p>
            </div>
          </SpotlightCard>

          <SpotlightCard>
            <div className="text-center">
              <p className="text-5xl font-bold text-green-400 mb-2">1500+</p>
              <p className="text-lg text-white opacity-90">Active Members</p>
            </div>
          </SpotlightCard>

        </div>

        {/* FEATURES SECTION TITLE */}
        <div className="text-center mt-32 mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-white drop-shadow-xl">
            Hackbase Features
          </h2>

          <div className="w-full sm:w-1/2 mx-auto mt-6 bg-green-500/10 border border-green-500/20 rounded-xl">
            <p className="text-center p-4 text-gray-300 text-lg">
              🎉 All resources are <span className="text-green-400 font-bold">FREE</span> for our community!
            </p>
          </div>
        </div>

        {/* FEATURE CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">

          {/* Feature 1 */}
          <SpotlightCard>
            <div className="text-center">
              <Book size={64} className="mx-auto mb-4 text-green-400" />
              <p className="text-2xl font-semibold text-white">Start freelancing today</p>
              <p className="text-gray-400 mt-2">Daily curated coding challenges to boost core logic.</p>

              <button
                onClick={() => navigate("/login")}
                className="w-[90%] mt-6 px-4 py-3 rounded-xl bg-green-500 text-black font-semibold hover:bg-green-400 transition"
              >
                Start Solving
              </button>
            </div>
          </SpotlightCard>

          {/* Feature 2 */}
          <SpotlightCard>
            <div className="text-center">
              <Users size={64} className="mx-auto mb-4 text-green-400" />
              <p className="text-2xl font-semibold text-white">Mock Interviews</p>
              <p className="text-gray-400 mt-2">Get real interview feedback from industry mentors.</p>

              <button
                onClick={() => navigate("/login")}
                className="w-[90%] mt-6 px-4 py-3 rounded-xl bg-green-500 text-black font-semibold hover:bg-green-400 transition"
              >
                Explore Now
              </button>
            </div>
          </SpotlightCard>

          {/* Feature 3 */}
          <SpotlightCard>
            <div className="text-center">
              <Code size={64} className="mx-auto mb-4 text-green-400" />
              <p className="text-2xl font-semibold text-white">Development Projects</p>
              <p className="text-gray-400 mt-2">Work on real-world, startup-grade projects.</p>

              <button
                disabled
                className="w-[90%] mt-6 px-4 py-3 rounded-xl bg-gray-800 text-gray-500 cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>
          </SpotlightCard>

        </div>
      </div>
    </section>
  );
}

export default AchievementsSection;
