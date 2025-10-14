import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../config/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {
  Trophy,
  Users,
  Sparkles,
  MapPin,
  Calendar,
  ArrowRight,
  Code,
  Cpu,
  Layout,
  Zap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import Footer from "../components/Layout/Footer.jsx";

type Hackathon = {
  id: string;
  name: string;
  description: string;
  theme?: string;
  place?: string;
  city?: string;
  thumbnail?: string;
  createdBy: string;
  date?: string;
  price?: string;
  participants?: number;
};

const manualImages = [
  "https://img.freepik.com/free-vector/gradient-halftone-technology-twitch-banner_23-2149067484.jpg?semt=ais_hybrid&w=740&q=80",
  "https://img.freepik.com/free-vector/gradient-halftone-technology-linkedin-banner_23-2149164511.jpg?semt=ais_hybrid&w=740&q=80",
  "https://d1csarkz8obe9u.cloudfront.net/themedlandingpages/tlp_hero_banners-4ee457a41ec5c9a3ff7d870ac465b9bf.jpg",
  "https://img.freepik.com/free-psd/sport-banner-template_23-2148520660.jpg",
];

const ImageCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % manualImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + manualImages.length) % manualImages.length
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % manualImages.length);
  };

  return (
    <div className="relative w-full h-72 md:h-96 lg:h-[32rem] overflow-hidden rounded-3xl shadow-2xl mb-12 group">
      {manualImages.map((img, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            idx === currentIndex
              ? "opacity-100 scale-100"
              : "opacity-0 scale-105"
          }`}
        >
          <img
            src={img}
            alt={`slide-${idx}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Navigation Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {manualImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all ${
              idx === currentIndex
                ? "w-8 bg-white"
                : "w-2 bg-white/50 hover:bg-white/75"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const EventCard = ({ event, onClick }) => {
  const [participants, setParticipants] = useState<number | null>(null);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const regRef = collection(db, "hackathons", event.id, "registrations");
        const regSnap = await getDocs(regRef);
        setParticipants(regSnap.size);
      } catch (err) {
        console.error("Failed to fetch participants:", err);
      }
    };
    fetchParticipants();
  }, [event.id]);

  return (
    <div
      className="group relative cursor-pointer transform transition-all duration-300 hover:-translate-y-2"
      onClick={onClick}
    >
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 transition-all">
        {/* Image Section */}
        <div className="relative overflow-hidden h-48">
          {event.thumbnail ? (
            <img
              src={event.thumbnail}
              alt={event.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={(e) => {
                e.currentTarget.src = `https://placehold.co/600x400/3B82F6/FFFFFF?text=${encodeURIComponent(
                  event.name
                )}`;
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
              <Trophy className="w-16 h-16 text-white opacity-50" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

          {event.theme && (
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-900 dark:text-white shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                {event.theme}
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-5 space-y-3">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {event.name}
          </h3>

          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
            {event.description}
          </p>

          {/* Meta Information */}
          <div className="space-y-2 pt-2">
            {(event.city || event.place) && (
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span className="truncate">
                  {event.city}
                  {event.city && event.place && ", "}
                  {event.place}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between gap-2">
              {event.date && (
                <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4 text-green-500" />
                  <span>{event.date}</span>
                </div>
              )}

              {participants !== null && (
                <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                  <Users className="w-4 h-4 text-purple-500" />
                  <span className="font-medium">{participants}</span>
                </div>
              )}
            </div>
          </div>

          {/* CTA Button */}
          <button className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2.5 px-4 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300">
            View Details
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const HackathonInstructions: React.FC = () => {
  const steps = [
    {
      title: "Registration",
      desc: "Register individually or as a team to participate in the hackathon. Ensure all details are filled in correctly.",
      icon: <Users className="w-6 h-6" />,
      color: "from-blue-500 to-indigo-500",
    },
    {
      title: "Idea Submission",
      desc: "Submit your innovative idea along with a short description or PPT showcasing your approach.",
      icon: <Sparkles className="w-6 h-6" />,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Shortlisting",
      desc: "Ideas will be evaluated and shortlisted based on creativity, feasibility, and quality of submissions.",
      icon: <Trophy className="w-6 h-6" />,
      color: "from-yellow-500 to-orange-500",
    },
    {
      title: "Final Event",
      desc: "Participate in the final event at the venue. If online, join via the given platform link.",
      icon: <Calendar className="w-6 h-6" />,
      color: "from-pink-500 to-purple-500",
    },
  ];

  return (
    <div className="mt-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
          How It Works
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Follow these simple steps to participate and showcase your innovation
        </p>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-lg`}
                >
                  {step.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-bold text-gray-400 dark:text-gray-500">
                      STEP {idx + 1}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const HackathonGuidelines: React.FC = () => {
  const guidelines = [
    {
      icon: <Code className="w-7 h-7" />,
      title: "Choose a Problem",
      desc: "Identify real-world problems and brainstorm innovative solutions before the hackathon starts.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Cpu className="w-7 h-7" />,
      title: "Explore Technologies",
      desc: "Web, Mobile, AI/ML, Blockchain, IoT, Cloud — pick technologies based on your skillset.",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: <Layout className="w-7 h-7" />,
      title: "Teamwork & Roles",
      desc: "Form teams, assign clear roles (developer, designer, presenter) to work efficiently.",
      gradient: "from-pink-500 to-rose-500",
    },
    {
      icon: <Zap className="w-7 h-7" />,
      title: "Rapid Prototyping",
      desc: "Focus on creating working prototypes rather than perfect products; time is limited.",
      gradient: "from-yellow-500 to-orange-500",
    },
  ];

  return (
    <div className="mt-24 bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 md:p-12 border border-gray-200 dark:border-gray-700">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Hackathon Guidelines
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Make the most of your hackathon experience with these proven
          strategies
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {guidelines.map((item, idx) => (
          <div
            key={idx}
            className="group relative bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200 dark:border-gray-700"
          >
            <div
              className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${item.gradient} text-white mb-4 shadow-md group-hover:scale-110 transition-transform`}
            >
              {item.icon}
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {item.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const HackathonsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHackathons = async () => {
      setLoading(true);
      try {
        const hackathonsRef = collection(db, "hackathons");
        const q = query(hackathonsRef, orderBy("createdAt", "desc"), limit(6));
        const snapshot = await getDocs(q);
        const hackathonList: Hackathon[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Hackathon, "id">),
        }));
        setHackathons(hackathonList);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHackathons();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              Join the Innovation Movement
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Welcome to the World's{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Largest Innovators
            </span>{" "}
            Community
          </h1>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Connect with innovators, build groundbreaking solutions, and be part
            of the movement shaping the future of technology
          </p>
        </div>

        {/* Image Carousel */}
        <ImageCarousel />

        {/* Featured Hackathons Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Featured Hackathons
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Discover exciting opportunities to showcase your skills
              </p>
            </div>
          </div>

          {hackathons.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                <Trophy className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                No Hackathons Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
                Stay tuned! Exciting hackathons will be listed here soon.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {hackathons.map((hackathon) => (
                <EventCard
                  key={hackathon.id}
                  event={hackathon}
                  onClick={() => navigate(`/hackathon/${hackathon.id}`)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Guidelines & Instructions */}
        <HackathonGuidelines />
        <HackathonInstructions />

        {/* Footer */}
        <div className="mt-10 absolute left-0 w-full">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default HackathonsPage;
