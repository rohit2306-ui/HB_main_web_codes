import { useEffect, useRef, useState } from "react";
import { ImQuotesLeft, ImQuotesRight } from "react-icons/im";

const StarRating = ({ rating }) => {
  return (
    <div className="flex gap-1 justify-center mt-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
            i < rating
              ? "bg-[#0AFF9D] shadow-[0_0_10px_#0AFF9Daa]"
              : "bg-white/15"
          }`}
        />
      ))}
    </div>
  );
};

function SocialMediaCard({ props, scrollProgress }) {
  return (
    <div
      className="
      relative p-10 mx-4 my-16 rounded-3xl backdrop-blur-xl
      border border-white/10
      bg-white/[0.03]
      shadow-[0px_0px_50px_rgba(0,0,0,0.6)]
      transition-all duration-700 
      hover:-translate-y-3 scale-[1.02]
      hover:shadow-[0_0_60px_rgba(0,255,150,0.25)]
      "
      style={{
        opacity: scrollProgress,
        transform: `translateY(${(1 - scrollProgress) * 60}px)`,
      }}
    >
      <div className="absolute inset-0 rounded-3xl pointer-events-none border border-[#0AFF9D]/10 shadow-[inset_0_0_25px_#0AFF9D10]"></div>

      <div className="flex flex-col lg:flex-row items-center gap-14">
        
        {/* Profile */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              src={props.profileImg}
              className="w-28 h-28 rounded-full object-cover ring-4 ring-[#0AFF9D]/20 shadow-2xl"
            />
            <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-[#0AFF9D] shadow-[0_0_15px_#0AFF9D]" />
          </div>

          <h3 className="text-2xl font-semibold text-white mt-4 tracking-wide">
            {props.name}
          </h3>

          <p className="text-sm text-white/50">{props.username}</p>

          <p className="text-sm text-white/40 max-w-[200px] text-center mt-3 leading-relaxed">
            {props.userdesc}
          </p>

          <StarRating rating={props.rating} />
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-px h-36 bg-gradient-to-b from-transparent via-white/15 to-transparent"></div>

        {/* Testimonial */}
        <div className="flex-1 text-center lg:text-left">
          <ImQuotesLeft className="text-[#0AFF9D] opacity-70 mb-4" size={30} />

          <blockquote className="text-white/80 text-2xl leading-relaxed italic font-light tracking-wide">
            {props.testimonial}
          </blockquote>

          <ImQuotesRight
            className="text-[#0AFF9D] opacity-70 mt-6 ml-auto"
            size={30}
          />

          {props.link && (
            <a
              href={props.link}
              className="inline-block mt-8 text-base text-[#0AFF9D] hover:text-white transition-all duration-200 font-medium"
              target="_blank"
            >
              View on {props.platform} →
            </a>
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
      const p = cardsRef.current.map((card) => {
        if (!card) return 0;
        const rect = card.getBoundingClientRect();
        const vh = window.innerHeight;

        const visibleH =
          Math.max(0, Math.min(vh, rect.bottom)) -
          Math.max(0, Math.min(vh, rect.top));

        return Math.min(1, (visibleH / vh) * 1.5);
      });

      setScrollProgress(p);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const SocialTestimonials = [
    {
      name: "Ashish Solanki ",
      username: "@ashishsolanki",
      userdesc: "Full-stack Developer",
      platform: "LinkedIn",
      testimonial:
        "HackBase ne literally mera workflow double speed pe kar diya. Simplicity × Power. Love it.",
      rating: 5,
      profileImg:"https://media.licdn.com/dms/image/v2/D5603AQGHhAMDDTcmeg/profile-displayphoto-scale_400_400/B56ZqsEoZqHIAg-/0/1763823487620?e=1765411200&v=beta&t=HsNGcyyhJzNJV1FDzGVG08mNihXGu--ZWL6C0gavGm0",
    },
    {
      name: "Dhananjay Tyagi",
      username: "@dhananjay",
      userdesc: "Product Manager Intern — Bosscoder Academy",
      platform: "Facebook",
      testimonial:
        "HackBase is genuinely transforming Tier-2 and Tier-3 cities. Students with talent but zero exposure are finally getting the right education and right opportunities.",
      rating: 4,
      profileImg:
        "https://media.licdn.com/dms/image/v2/D5603AQHczgTmv5B08g/profile-displayphoto-scale_400_400/B56ZhbmOJXHQAk-/0/1753883406091?e=1765411200&v=beta&t=4WWo2AufIBy_wl6_t1iruRIB4Q6hCDIpSo5geyfejcE",
    },
    {
      name: "Aditi Negi",
      username: "@aditi",
      userdesc: "Student | Tech Learner",
      testimonial:
        "HackBase is empowering Tier-2 & Tier-3 students with the right exposure, right skills, and the right education — something they always deserved.",
      rating: 5,
      profileImg:
        "https://media.licdn.com/dms/image/v2/D5603AQFGeWckjREZbg/profile-displayphoto-scale_400_400/B56Zeew1x_GoAg-/0/1750715294394?e=1765411200&v=beta&t=qJeViaaEwWHnZ2WpEXPQH9kPkBat9xWaZzUlOvGfR0Q",
    },
  ];

  return (
    <div className="min-h-screen bg-black">


      {/* Header */}
      <div className="text-center max-w-4xl mx-auto mb-24 px-6">
        <h2 className="text-6xl md:text-7xl font-bold text-white mb-8 tracking-tight">
          Loved by{" "}
          <span className="text-[#0AFF9D] drop-shadow-[0_0_25px_#0AFF9D77]">
            Thousands
          </span>
        </h2>

        <p className="text-white/60 text-2xl leading-relaxed font-light">
          Real stories from developers, founders & learners who grew with HackBase.
        </p>
      </div>
      
      {/* Cards */}
      <div className="max-w-7xl mx-auto px-6">
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
  );
}
