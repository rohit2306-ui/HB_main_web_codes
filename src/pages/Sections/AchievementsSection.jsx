import { Book, Code, Users } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export const SpotlightCard = ({
  children,
  className = "",
  themed,
  spotlightColor = "rgba(255, 255, 255, 0.25)",
}) => {
  const divRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current || isFocused) return;

    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(0.6);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(0.6);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-3xl border ${
        themed
          ? "border-neutral-500 bg-white/50 shadow-xl text-black dark:text-white dark:border-neutral-700 dark:bg-slate-900/50"
          : "text-white border-neutral-700 bg-slate-900/50"
      } overflow-hidden transition-colors p-8 ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out"
        style={{
          opacity,
          background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`,
        }}
      />
      {children}
    </div>
  );
};

function AchievementsSection() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto mt-20 px-4 sm:px-6 lg:px-8 py-12">
      {/* Achievements Title */}
      <div className="flex justify-center items-center flex-col">
        <p className="font-bold text-7xl text-white block ml-20 mb-20">
          What We've Achieved
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
        <SpotlightCard spotlightColor="rgba(59, 130, 246, 0.25)">
          <div className="text-center">
            <div className="text-5xl font-bold text-blue-500 mb-4">1+</div>
            <div className="text-lg font-medium text-white">
              Hackathon Organised
            </div>
          </div>
        </SpotlightCard>
        <SpotlightCard spotlightColor="rgba(16, 185, 129, 0.25)">
          <div className="text-center">
            <div className="text-5xl font-bold text-green-500 mb-4">1+</div>
            <div className="text-lg font-medium text-white">
              Community Built
            </div>
          </div>
        </SpotlightCard>
        <SpotlightCard spotlightColor="rgba(236, 72, 153, 0.25)">
          <div className="text-center">
            <div className="text-5xl font-bold text-pink-500 mb-4">4+</div>
            <div className="text-lg font-medium text-white">
              Events & Workshops
            </div>
          </div>
        </SpotlightCard>
        <SpotlightCard spotlightColor="rgba(234, 179, 8, 0.25)">
          <div className="text-center">
            <div className="text-5xl font-bold text-yellow-500 mb-4">150+</div>
            <div className="text-lg font-medium text-white">Active Members</div>
          </div>
        </SpotlightCard>
      </div>
      {/* Features Title */}
      <div className="flex justify-center items-center flex-col">
        <p className="font-bold text-7xl text-white block ml-20 mt-20 mb-10 z-10">
          Hackbase Features
        </p>
        <div className="w-1/2 items-center bg-green-300/15 border mb-20 border-opacity-30 rounded-lg border-green-400">
          <p className="text-center p-3">
            {" "}
            🎉 All these resources are{" "}
            <span className="font-bold text-green-400">FREE</span> for our
            community members!
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 ">
        <SpotlightCard
          spotlightColor="rgba(59, 130, 246, 0.25)"
          className="hover:-translate-y-1 transition-all hover:border-green-800"
        >
          <div className="text-center">
            <div className="text-5xl font-bold text-blue-500 mb-4 flex justify-center">
              <Book size={60} className="text-green-500" />
            </div>
            <div className="text-xl font-medium text-white mb-2">
              Standard DSA Problems
            </div>
            <div className="text-base font-base font-semibold text-slate-500">
              Sharpen your problem-solving skills with curated DSA practice
              sets.
            </div>
            <button
              onClick={() => navigate("/login")}
              className="text-black font-semibold w-[90%] bg-gradient-to-r from-green-400 to-blue-400 rounded-lg px-4 py-2 mt-8 hover:scale-105 transition-all"
            >
              Start Solving
            </button>
          </div>
        </SpotlightCard>
        <SpotlightCard
          spotlightColor="rgba(16, 185, 129, 0.25)"
          className="hover:-translate-y-1 transition-all hover:border-green-800"
        >
          <div className="text-center">
            <div className="text-5xl font-bold text-green-500 mb-4 flex justify-center">
              <Users size={60} className="text-green-500" />
            </div>
            <div className="text-lg font-medium text-white">
              Mock Interviews
            </div>
            <div className="text-base font-base font-semibold text-slate-500">
              Get real interview experience with mock sessions led by experts.
            </div>
            <button
              onClick={() => navigate("/login")}
              className="text-black font-semibold w-[90%] bg-gradient-to-r from-green-400 to-blue-400 rounded-lg px-4 py-2 mt-8 hover:scale-105 transition-all"
            >
              Explore Now
            </button>
          </div>
        </SpotlightCard>
        <SpotlightCard
          spotlightColor="rgba(16, 185, 129, 0.25)"
          className="hover:-translate-y-1 transition-all hover:border-green-800"
        >
          <div className="text-center">
            <div className="text-5xl font-bold text-green-500 mb-4 flex justify-center">
              <Code size={60} className="text-green-500" />
            </div>
            <div className="text-lg font-medium text-white">
              Development Projects
            </div>
            <div className="text-base font-base font-semibold text-slate-500">
              Sharpen your problem-solving skills with curated DSA practice
              sets.
            </div>
            <button className="text-black font-semibold w-[90%] bg-gradient-to-r from-green-400 to-blue-400 rounded-lg px-4 py-2 mt-8 hover:scale-105 transition-all">
              Coming Soon
            </button>
          </div>
        </SpotlightCard>
      </div>
    </div>
  );
}

export default AchievementsSection;
