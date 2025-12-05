import React from "react";
import { CalendarDays, MapPin, ArrowRight } from "lucide-react";

export default function UpcomingEvents() {
  const events = [
    {
      title: "HackBase National Hackathon 2025",
      date: "March 22–23, 2025",
      location: "Hybrid — Delhi + Online",
      desc: "India’s largest beginner-friendly hackathon designed for Tier-2 & Tier-3 innovators.",
      tag: "Flagship",
    },
    {
      title: "AI Builders Bootcamp",
      date: "April 5, 2025",
      location: "Online",
      desc: "Master Gen-AI development with hands-on projects, mentorship & real-world applications.",
      tag: "AI",
    },
    {
      title: "Startup Ideathon 3.0",
      date: "April 18, 2025",
      location: "Chandigarh",
      desc: "Pitch your startup idea, build your team, and get early validation from real mentors.",
      tag: "Startups",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-black text-white pt-24 pb-32 px-6 overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-20 left-0 w-80 h-80 bg-[#0AFF9D22] blur-[160px]"></div>
      <div className="absolute bottom-20 right-0 w-80 h-80 bg-[#0AFF9D33] blur-[160px]"></div>

      {/* HERO */}
      <div className="max-w-5xl mx-auto text-center mb-20 relative">
        <h1 className="text-5xl md:text-7xl font-bold leading-tight">
          Explore Our
          <span className="text-[#0AFF9D] drop-shadow-[0_0_15px_#0AFF9D99]">
            {" "}
            Upcoming Events
          </span>
        </h1>

        <p className="text-gray-400 text-lg md:text-xl mt-6 max-w-3xl mx-auto">
          Join HackBase’s official hackathons, tech bootcamps, and exclusive 
          offline meetups designed especially for Tier-2 & Tier-3 talent.
        </p>
      </div>

      {/* EVENTS GRID */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 relative">

        {events.map((event, i) => (
          <div
            key={i}
            className="
              group relative p-8 rounded-2xl
              bg-white/[0.04] border border-white/10 backdrop-blur-xl
              hover:bg-white/[0.07] transition-all duration-300
              hover:-translate-y-2 shadow-[0_0_25px_rgba(0,255,150,0.15)]
            "
          >
            {/* Tag */}
            <span className="px-3 py-1 text-xs rounded-full bg-[#0AFF9D]/20 text-[#0AFF9D]">
              {event.tag}
            </span>

            <h3 className="text-2xl font-semibold mt-4">{event.title}</h3>

            <p className="text-gray-400 mt-3 leading-relaxed">{event.desc}</p>

            {/* DATE + LOCATION */}
            <div className="mt-6 space-y-2 text-gray-300">
              <p className="flex items-center gap-2">
                <CalendarDays size={18} className="text-[#0AFF9D]" />
                {event.date}
              </p>
              <p className="flex items-center gap-2">
                <MapPin size={18} className="text-[#0AFF9D]" />
                {event.location}
              </p>
            </div>

            {/* CTA */}
            <button
              className="
                mt-6 w-full py-3 rounded-xl
                bg-[#0AFF9D] text-black font-semibold
                flex items-center justify-center gap-2
                transition-all group-hover:shadow-[0_0_20px_#0AFF9Daa]
                group-hover:scale-[1.02]
              "
            >
              Register Now <ArrowRight size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* FOOT NOTE */}
      <p className="text-center text-gray-500 mt-20 text-sm">
        More events coming soon — stay tuned.
      </p>
    </div>
  );
}
