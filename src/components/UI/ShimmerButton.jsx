import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ShimmerButton = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    // Get the position of the button relative to the viewport
    const rect = e.currentTarget.getBoundingClientRect();

    // Calculate the mouse position relative to the button
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div>
      {/* The button container */}
      <button
        className="relative bg-white p-2 w-72 hover: rounded-full text-black font-semibold bg-gradient-to-b from-white to-theme-200 px-10 py-2  text-lg overflow-hidden
                 shadow-2xl transition-all duration-300
                   hover:shadow-lg hover:shadow-theme-500/50
                   before:content-[''] before:absolute before:inset-0 before:rounded-full 
                   "
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => navigate("/login")}
      >
        {/* The glowing overlay */}
        <div
          className={`absolute rounded-full -inset-px transition-opacity duration-500 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background: `radial-gradient(50px circle at ${mousePosition.x}px ${mousePosition.y}px,rgb(var(--color-accent-rgb)), transparent 100%)`,
          }}
        ></div>

        {/* The button text */}
        <span className="relative z-10 text-black tracking-wide">
          START FROM NOW →
        </span>
      </button>

      {/* Tailwind CSS keyframes for the animation */}
      <style>{`
        @keyframes pulse-subtle {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
          }
        }

        .animate-pulse-subtle {
          animation: pulse-subtle 3s ease-in-out infinite;
        }

        /* Gradient for border effect */
        button::before {
          background-size: 200% 100%;
          background-position: left bottom;
          transition: background-position 0.5s ease-out;
        }

        button:hover::before {
          background-position: right bottom;
        }
      `}</style>
    </div>
  );
};

export default ShimmerButton;
