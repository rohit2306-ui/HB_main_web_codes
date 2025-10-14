import MagicBento from "../../components/Rbits/MagicBento";

export default function WhySection() {
  return (
    // Main container with responsive vertical and horizontal padding. Removed h-screen for flexible height.
    <div className="w-full px-4 sm:px-6 lg:px-8 py-20 md:py-32">
      {/* Centered container for all content */}
      <div className="max-w-7xl mx-auto">
        {/* Vision & Benefits section header */}
        {/* Text is centered on mobile and left-aligned on medium screens and up */}
        <div className="text-center md:text-left">
          <h2 className="font-bold text-4xl sm:text-5xl lg:text-7xl text-white">
            Why Hackbase?
          </h2>
          <p className="font-medium text-base md:text-lg text-slate-400 mt-4 mx-auto md:mx-0 max-w-2xl lg:max-w-3xl">
            Our vision is to create the largest tech community in India by
            reaching and empowering regions where exposure to technology is
            limited.
          </p>
        </div>

        {/* Bento Box Container */}
        {/* Added top margin for spacing */}
        <div className="mt-16 group">
          <MagicBento
            textAutoHide={true}
            enableStars={true}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableTilt={true}
            enableMagnetism={true}
            clickEffect={true}
            spotlightRadius={300}
            particleCount={12}
            glowColor="var(--color-bento-rgb)"
          />
        </div>
      </div>
    </div>
  );
}
