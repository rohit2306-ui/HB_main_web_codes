import { useLayoutEffect, useEffect, useRef, useState } from "react";
import { ImQuotesLeft, ImQuotesRight } from "react-icons/im";

const StarRating = ({ rating }) => {
  const stars = Array.from({ length: 5 }, (_, index) => {
    const starClass = index < rating ? "text-yellow-400" : "text-gray-300";
    return (
      <svg
        key={index}
        className={`w-4 h-4 ${starClass} transition-colors duration-200`}
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.95a1 1 0 00.95.69h4.167c.969 0 1.371 1.24.588 1.81l-3.367 2.446a1 1 0 00-.364 1.118l1.287 3.95a1 1 0 01-.589 1.81l-3.366-2.447a1 1 0 00-1.176 0l-3.366 2.447a1 1 0 01-.589-1.81l1.287-3.95a1 1 0 00-.364-1.118L2.094 9.387c-.783-.57-.381-1.81.588-1.81h4.167a1 1 0 00.95-.69l1.286-3.95z" />
      </svg>
    );
  });
  return <div className="flex justify-center gap-1 mb-3">{stars}</div>;
};

// Simple card with optional scroll animations
function SocialMediaCard({ props, scrollProgress }) {
  const platformColors = {
    linkedIn: "from-blue-600 to-blue-700",
    facebook: "from-blue-500 to-blue-600",
    twitter: "from-sky-400 to-sky-500",
  };

  const platformBadgeColor = {
    linkedIn: "bg-blue-100 text-blue-800 border-blue-200",
    facebook: "bg-blue-100 text-blue-800 border-blue-200",
    twitter: "bg-sky-100 text-sky-800 border-sky-200",
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mx-4 my-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
      style={{
        opacity: scrollProgress,
        transform: `translateY(${(1 - scrollProgress) * 20}px)`,
      }}
    >
      {/* Platform Badge */}
      <div className="flex justify-end mb-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${
            platformBadgeColor[props.platform] ||
            "bg-gray-100 text-gray-800 border-gray-200"
          }`}
        >
          {props.platform}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
        {/* User Profile Section */}
        <div className="flex flex-col items-center lg:items-start min-w-[200px]">
          <div className="relative mb-4">
            <img
              src={props.profileImg}
              alt={`${props.name}'s profile`}
              className="w-20 h-20 rounded-full object-cover shadow-lg ring-4 ring-white"
            />
            <div
              className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r ${
                platformColors[props.platform] || "from-gray-400 to-gray-500"
              } flex items-center justify-center`}
            >
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-1">{props.name}</h3>
          <p className="text-sm text-gray-500 mb-2">{props.username}</p>
          <p className="text-xs text-gray-400 text-center lg:text-left mb-3 max-w-[180px]">
            {props.userdesc}
          </p>
          <StarRating rating={props.rating} />
        </div>

        {/* Vertical Divider - Hidden on mobile */}
        <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent h-32 self-center"></div>

        {/* Testimonial Content Section */}
        <div className="flex-1 relative self-center">
          <div className="relative">
            <ImQuotesLeft
              size={24}
              className="text-blue-500 opacity-60 absolute -top-4 -left-2"
            />

            <blockquote className="text-gray-700 text-2xl leading-relaxed italic px-6 py-2">
              {props.testimonial}
            </blockquote>

            <ImQuotesRight
              size={24}
              className="text-blue-500 opacity-60 absolute -bottom-4 -right-2"
            />
          </div>

          {/* Link */}
          {props.link && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <a
                href={props.link}
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                View on {props.platform} →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TestimonialScrollStack() {
  const [scrollProgress, setScrollProgress] = useState([1, 0, 0]);
  const cardsRef = useRef([]);

  useEffect(() => {
    const handleScroll = () => {
      const progress = cardsRef.current.map((card) => {
        if (!card) return 0;
        const rect = card.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Calculate visibility percentage
        const visibleTop = Math.max(0, Math.min(windowHeight, rect.bottom));
        const visibleBottom = Math.max(
          0,
          Math.min(windowHeight, windowHeight - rect.top)
        );
        const visibleHeight = Math.min(visibleTop, visibleBottom);
        const visibility = visibleHeight / windowHeight;

        return Math.max(0, Math.min(1, visibility * 1.5));
      });

      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const SocialTestimonials = [
    {
      name: "Adinath",
      username: "@adinath",
      userdesc: "Full-stack Developer",
      link: "https://linkedin.com/in/adinath",
      platform: "linkedIn",
      testimonial:
        "This is the best app that I have ever used. It really changed my life and workflow completely! 💖",
      rating: 5,
      profileImg:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Rohit",
      username: "@RORO",
      userdesc: "Founder of HackBase | AIML Engineer",
      link: "https://facebook.com/RORO",
      platform: "facebook",
      testimonial:
        "The amount of information and insights I gained was incredible. Highly recommend to all developers!",
      rating: 4,
      profileImg:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Elon Musk",
      username: "@elonmusk",
      userdesc: "CEO of SpaceX, Tesla, Boring Company, Neuralink, Starlink",
      link: "https://twitter.com/elonmusk",
      platform: "twitter",
      testimonial:
        "Bitcoin doom, HackBase BOOM!! Revolutionary platform for the future of development.",
      rating: 3,
      profileImg:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-black">
      <div className="flex justify-center items-center flex-col pt-20 px-4">
        {/* Header Section */}
        <div className="text-center max-w-4xl mb-12">
          <h2 className="font-bold text-5xl md:text-7xl text-white mb-6 leading-tight">
            Top{" "}
            <span className="bg-gradient-to-r z-20 from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Testimonials
            </span>
          </h2>
          <p className="font-normal text-lg md:text-xl text-white max-w-2xl mx-auto leading-relaxed">
            Witness the success stories of our happiest users who have
            experienced the{" "}
            <span className="text-blue-600 font-semibold">HackBase</span>{" "}
            ecosystem firsthand.
          </p>
        </div>

        {/* Testimonials - flows with parent scroll */}
        <div className="w-full max-w-6xl pb-20">
          {SocialTestimonials.map((item, index) => (
            <div key={index} ref={(el) => (cardsRef.current[index] = el)}>
              <SocialMediaCard
                props={item}
                scrollProgress={scrollProgress[index] || 0}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
