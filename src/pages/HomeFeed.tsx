import React, { useEffect, useState } from "react";
import { db } from "../config/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import darkimg from "../assets/images_hack_agra_chapter_1/mainbg2.jpg";
import {
  PlayCircle,
  Trophy,
  Users,
  Sparkles,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Camera,
} from "lucide-react";

import LoadingSpinner from "../components/UI/LoadingSpinner";
import Footer from "../components/Layout/Footer";

import image1 from "../assets/images_hack_agra_chapter_1/image1.jpg";
import image2 from "../assets/images_hack_agra_chapter_1/image2.jpg";
import image3 from "../assets/images_hack_agra_chapter_1/image3.jpg";
import image4 from "../assets/images_hack_agra_chapter_1/image4.jpg";
import image5 from "../assets/images_hack_agra_chapter_1/image5.jpg";
import image6 from "../assets/images_hack_agra_chapter_1/image7.jpg";

// ------------------------- BANNER -------------------------
const bannerImages = [
  "https://img.sanishtech.com/u/5cb916d87ed30501fcfe25b86c51663b.png",
  image4,
  image6,
  image5,
];

const ImageCarousel = React.memo(() => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setIndex((prev) => (prev + 1) % bannerImages.length),
      3000
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-64 sm:h-80 md:h-[28rem] rounded-2xl overflow-hidden shadow-2xl group">
      {bannerImages.map((src, i) => (
        <img
          key={i}
          src={src}
          loading="lazy"
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

      <button
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 p-2 rounded-full text-white opacity-0 group-hover:opacity-100"
        onClick={() =>
          setIndex((prev) => (prev - 1 + bannerImages.length) % bannerImages.length)
        }
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 p-2 rounded-full text-white opacity-0 group-hover:opacity-100"
        onClick={() => setIndex((prev) => (prev + 1) % bannerImages.length)}
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {bannerImages.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all ${
              index === i ? "w-6 bg-white" : "w-2 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
});

// ---------------------- EVENT CARD -----------------------
const EventCard = ({ event, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
    >
      <div className="relative rounded-3xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div className="relative h-64 w-full">
          <img
            src={
              event.thumbnail ||
              `https://placehold.co/600x400/111/fff?text=${encodeURIComponent(
                event.name
              )}`
            }
            alt={event.name}
            className="w-full h-90% object-cotain pt-5"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        </div>

        <div className="p-5 space-y-2">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
            {event.name}
          </h3>

          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {event.description}
          </p>

          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-300 mt-2">
            <span>{event.teamCount} Teams</span>
            {event.date && <span>{event.date}</span>}
          </div>

          <button className="mt-4 w-full py-2 rounded-2xl bg-gradient-to-r from-blue-500 to-black-400 text-white font-semibold shadow-lg">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

// ------------------------- GUIDELINES -------------------------
const HackathonGuidelines = React.memo(() => {
  return (
    <div className="mt-20 bg-black/70 rounded-3xl p-6 md:p-10 text-white shadow-2xl backdrop-blur-lg">
      <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-8">
        How Hackbase Works
      </h2>

      <div className="grid lg:grid-cols-2 gap-10 items-center">
        <div className="rounded-2xl overflow-hidden border border-gray-700 bg-black/40 shadow-xl">
          <iframe
            src="https://www.youtube.com/embed/oDBjQtAnrt0"
            loading="lazy"
            className="w-full h-60 sm:h-80 md:h-96 rounded-2xl"
            allowFullScreen
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <PlayCircle className="w-8 h-8 text-green-400" /> Why Hackbase?
          </h3>

          {[
            "Host or participate with next-gen simplicity",
            "Smart team formation & live tracking",
            "AI-ready judging system",
            "Instant announcements & communication",
          ].map((txt, i) => (
            <div
              key={i}
              className="flex gap-3 items-center bg-white/10 px-4 py-3 rounded-xl border border-gray-700"
            >
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <p className="text-gray-200 text-sm">{txt}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

// ------------------------- STEPS + GALLERY -------------------------
const HackathonInstructions = React.memo(() => {
  const steps = [
    {
      title: "Registration",
      desc: "Register individually or as a team.",
      icon: <Users className="w-6 h-6" />,
      color: "from-blue-500 to-indigo-500",
    },
    {
      title: "Idea Submission",
      desc: "Submit your innovative idea.",
      icon: <Sparkles className="w-6 h-6" />,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Shortlisting",
      desc: "Ideas are shortlisted.",
      icon: <Trophy className="w-6 h-6" />,
      color: "from-yellow-500 to-orange-500",
    },
    {
      title: "Final Event",
      desc: "Participate onsite/online.",
      icon: <Calendar className="w-6 h-6" />,
      color: "from-pink-500 to-purple-500",
    },
  ];

  return (
    <div className="mt-20">
      <h2 className="text-center text-3xl md:text-5xl font-bold mb-6">
        How It Works
      </h2>

      <div className="grid sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {steps.map((s, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md"
          >
            <div
              className={`w-14 h-14 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white mb-3`}
            >
              {s.icon}
            </div>
            <h3 className="text-xl font-bold mb-1">{s.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{s.desc}</p>
          </div>
        ))}
      </div>

      <h2 className="text-center text-3xl md:text-4xl font-bold mt-16 mb-6">
        Past Events
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-6xl mx-auto">
        {[image1, image2, image3, image4, image5, image6].map((src, i) => (
          <div key={i} className="rounded-xl overflow-hidden shadow-md relative">
            <img
              src={src}
              loading="lazy"
              className="w-full h-40 sm:h-52 object-cover"
            />
            <div className="absolute top-2 right-2 bg-black/50 p-2 rounded-full">
              <Camera className="w-4 h-4 text-white" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

// ------------------------- MAIN PAGE -------------------------
const HackathonsPage = () => {
  const navigate = useNavigate();
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHackathons = async () => {
      setLoading(true);

      try {
        const ref = collection(db, "hackathons");
        const q = query(ref, orderBy("createdAt", "desc"), limit(6));
        const snap = await getDocs(q);

        const data = await Promise.all(
          snap.docs.map(async (doc) => {
            const teamsRef = collection(db, "hackathons", doc.id, "teams");
            const teamsSnap = await getDocs(teamsRef);

            return {
              id: doc.id,
              teamCount: teamsSnap.size,
              ...doc.data(),
            };
          })
        );

        setHackathons(data);
      } finally {
        setLoading(false);
      }
    };

    fetchHackathons();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <LoadingSpinner size="lg" />
      </div>
    );

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white">
      <div
        className="hidden dark:block fixed inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url(${darkimg})` }}
      />

      <div className="relative px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto pt-24">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-6">
          Welcome to the
          <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            {" "}
            World’s Largest Innovators Community
          </span>
        </h1>

        <p className="text-center max-w-2xl mx-auto text-gray-600 dark:text-gray-300 mb-10">
          Build solutions. Join events. Shape the future.
        </p>

        <ImageCarousel />

        <h2 className="text-3xl font-bold mt-16 mb-6">Featured Hackathons</h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hackathons.map((h) => (
            <EventCard
              key={h.id}
              event={h}
              onClick={() => navigate(`/hackathon/${h.id}`)}
            />
          ))}
        </div>

        <HackathonGuidelines />
        <HackathonInstructions />

        <Footer />
      </div>
    </div>
  );
};

export default HackathonsPage;
