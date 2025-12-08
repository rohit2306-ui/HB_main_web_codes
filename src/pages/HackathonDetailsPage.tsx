import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import { ArrowRight, Play, Calendar, MapPin, Users, Award, Video } from "lucide-react";

type Prize = {
  id?: string;
  title: string;
  amount?: string | number;
  description?: string;
};

type TimelineItem = {
  title: string;
  date: string;
  description?: string;
  status?: "upcoming" | "ongoing" | "complete";
};

type GuidanceSession = {
  id?: string;
  title?: string;
  youtubeUrl?: string;
  date?: string;
  description?: string;
};

type Hackathon = {
  id: string;
  name: string;
  description: string;
  theme?: string;
  themeImage?: string;
  place?: string;
  city?: string;
  address?: string;
  thumbnail?: string;
  createdBy?: string;
  venueDescription?: string;
  venueImages?: string[];
  status?: "open" | "closed";
  timelines?: TimelineItem[];
  guidanceSessions?: GuidanceSession[];
  prizes?: Prize[];
};

const extractYouTubeId = (url?: string) => {
  if (!url) return null;
  const regExp =
    /(?:youtube(?:-nocookie)?\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

const CountdownTimer: React.FC<{
  countdown: { days: number; hours: number; minutes: number; seconds: number };
}> = ({ countdown }) => (
  <div className="flex flex-wrap justify-center gap-4 mt-12">
    {[
      { label: "Days", value: countdown.days },
      { label: "Hours", value: countdown.hours },
      { label: "Minutes", value: countdown.minutes },
      { label: "Seconds", value: countdown.seconds },
    ].map((item) => (
      <div key={item.label} className="text-center">
        <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700 rounded-2xl p-4 min-w-[80px] shadow-xl hover:scale-105 transition-transform duration-200">
          <span className="block text-3xl sm:text-4xl font-bold text-white dark:text-gray-100">
            {String(item.value).padStart(2, "0")}
          </span>
          <span className="block text-sm text-white/80 dark:text-gray-400 font-medium mt-1">
            {item.label}
          </span>
        </div>
      </div>
    ))}
  </div>
);

const HackathonDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const GuidanceRef = useRef<HTMLDivElement>(null);
  const AboutRef = useRef<HTMLDivElement>(null);
  const TimelineRef = useRef<HTMLDivElement>(null);
  const VenueRef = useRef<HTMLDivElement>(null);
  const PrizesRef = useRef<HTMLDivElement>(null);

  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const handleScrollToSection = (ref: any) => {
    ref.current.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
  };

  useEffect(() => {
    if (!id) return;
    const fetchHackathon = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, "hackathons", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          let prizesArray: Prize[] = [];
          if (data.prizes) {
            if (Array.isArray(data.prizes)) {
              prizesArray = data.prizes;
            } else if (typeof data.prizes === "object") {
              prizesArray = Object.entries(data.prizes)
                .filter(([_, value]) => value !== null && value !== "")
                .map(([key, value]) => ({
                  id: key,
                  title:
                    key === "first"
                      ? "🥇 1st Prize"
                      : key === "second"
                      ? "🥈 2nd Prize"
                      : key === "third"
                      ? "🥉 3rd Prize"
                      : key,
                  amount: value,
                  description: "Reward for top performance",
                }));
            }
          }

          let guidanceArray: GuidanceSession[] = [];
          if (data.guidanceSessions && Array.isArray(data.guidanceSessions)) {
            guidanceArray = data.guidanceSessions.map((s: any) => ({
              ...s,
              youtubeId: extractYouTubeId(s.youtubeUrl),
            }));
          }

          setHackathon({
            id: docSnap.id,
            ...data,
            prizes: prizesArray,
            guidanceSessions: guidanceArray,
          } as Hackathon);
        }
      } catch (err) {
        console.error("Error fetching hackathon:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHackathon();
  }, [id]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!hackathon?.timelines?.length) return;
      const startDateStr = hackathon.timelines[0].date;
      const eventDate = new Date(startDateStr);
      const now = new Date();
      const diff = eventDate.getTime() - now.getTime();

      if (diff > 0) {
        setCountdown({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [hackathon]);

  if (loading) return <LoadingSpinner size="lg" />;
  if (!hackathon)
    return <p className="text-center mt-12 text-red-500">Hackathon not found.</p>;

  const isClosed = hackathon.status === "closed";
  const isOnline = (hackathon as any)?.isOnline !== undefined
    ? Boolean((hackathon as any).isOnline)
    : !hackathon.place && (!hackathon.city || /online/i.test(String(hackathon.city)));

  const parseTechs = () => {
    const raw = ((hackathon as any)?.techStack ?? (hackathon as any)?.techs ?? (hackathon as any)?.stack ?? []) as any;
    if (Array.isArray(raw)) return raw.filter(Boolean).map((t) => String(t).trim());
    if (typeof raw === 'string') return raw.split(/[,|]/).map((t) => t.trim()).filter(Boolean);
    return [];
  };
  const techs = parseTechs();

  const primaryDate = hackathon.timelines?.[0]?.date || (hackathon as any)?.date || "Date TBA";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950">
        {hackathon.thumbnail && (
          <div
            className="absolute inset-0 opacity-20 mix-blend-overlay"
            style={{
              backgroundImage: `url(${hackathon.thumbnail})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <span
            className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold shadow-lg ${
              isClosed
                ? "bg-gradient-to-r from-red-500 to-red-600 text-white"
                : "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                isClosed ? "bg-red-200" : "bg-green-200 animate-pulse"
              }`}
            />
            {isClosed ? "Registration Closed" : "Open for Registration"}
          </span>
          <h1 className="mt-8 text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight">
            {hackathon.name}
          </h1>
          <p className="mt-6 text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            {hackathon.description}
          </p>

          <CountdownTimer countdown={countdown} />

          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            {isClosed ? (
              <div className="bg-gray-700/80 backdrop-blur-sm text-white font-bold text-lg px-10 py-5 rounded-2xl shadow-2xl">
                Registration Closed
              </div>
            ) : (
              <button
                onClick={() =>
                  navigate(
                    user
                      ? `/hackathon/registration/${hackathon.id}/${user?.id}`
                      : "/login"
                  )
                }
                className="group bg-white dark:bg-gradient-to-r dark:from-indigo-600 dark:to-purple-600 text-gray-900 dark:text-white font-bold text-lg px-10 py-5 rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 flex items-center justify-center"
              >
                Apply Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </button>
            )}
            <button
              onClick={() => handleScrollToSection(GuidanceRef)}
              className="group backdrop-blur-sm bg-white/10 hover:bg-white/20 border-2 border-white/30 text-white font-semibold text-lg px-10 py-5 rounded-2xl transition-all duration-300 flex items-center justify-center"
            >
              <Play className="mr-2 w-5 h-5" /> Watch Guidance
            </button>
          </div>
        </div>
      </section>

      {/* Info Bar & Quick Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-4 md:p-6">
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs md:text-sm font-semibold bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
              <Calendar className="w-4 h-4" /> {primaryDate}
            </span>
            <button
              type="button"
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs md:text-sm font-semibold border transition ${isOnline
                ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
                : "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800"}`}
              onClick={() => {
                if (!isOnline) {
                  const q = hackathon.place || hackathon.city || hackathon.name;
                  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(String(q))}`;
                  window.open(url, '_blank');
                }
              }}
            >
              {isOnline ? (
                <>
                  <Video className="w-4 h-4" /> Online Event
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4" /> {hackathon.city || "Venue"}
                </>
              )}
            </button>
            {hackathon.theme && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs md:text-sm font-semibold bg-pink-50 text-pink-700 border border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-800">
                <Award className="w-4 h-4" /> {hackathon.theme}
              </span>
            )}
            {techs.length > 0 && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs md:text-sm font-semibold bg-gray-50 text-gray-700 border border-gray-200 dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700">
                Tech: {techs.slice(0,3).join(" • ")}{techs.length>3 ? ` +${techs.length-3}` : ""}
              </span>
            )}
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <button onClick={() => AboutRef.current?.scrollIntoView({behavior:"smooth"})} className="px-3 py-1.5 text-xs md:text-sm rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800">Overview</button>
            {hackathon.timelines?.length ? (
              <button onClick={() => TimelineRef.current?.scrollIntoView({behavior:"smooth"})} className="px-3 py-1.5 text-xs md:text-sm rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800">Timeline</button>
            ) : null}
            {hackathon.place ? (
              <button onClick={() => VenueRef.current?.scrollIntoView({behavior:"smooth"})} className="px-3 py-1.5 text-xs md:text-sm rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800">Venue</button>
            ) : null}
            {hackathon.guidanceSessions?.length ? (
              <button onClick={() => GuidanceRef.current?.scrollIntoView({behavior:"smooth"})} className="px-3 py-1.5 text-xs md:text-sm rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800">Guidance</button>
            ) : null}
            {hackathon.prizes?.length ? (
              <button onClick={() => PrizesRef.current?.scrollIntoView({behavior:"smooth"})} className="px-3 py-1.5 text-xs md:text-sm rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800">Prizes</button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* About */}
        <div ref={AboutRef} className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 p-6 sm:p-10 hover:shadow-2xl transition-shadow duration-300">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                About {hackathon.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm sm:text-base">
                {hackathon.description}
              </p>
              <div className="grid gap-4 pt-4">
                {hackathon.theme && (
                  <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl">
                    <Award className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Theme
                      </p>
                      <p className="text-gray-900 dark:text-white">{hackathon.theme}</p>
                    </div>
                  </div>
                )}
                {hackathon.place && (
                  <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-xl">
                    <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Venue
                      </p>
                      <p className="text-gray-900 dark:text-white">{hackathon.place}</p>
                    </div>
                  </div>
                )}
                {hackathon.city && (
                  <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl">
                    <MapPin className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        City
                      </p>
                      <p className="text-gray-900 dark:text-white">{hackathon.city}</p>
                    </div>
                  </div>
                )}
                {hackathon.createdBy && (
                  <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 rounded-xl">
                    <Users className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Hosted by
                      </p>
                      <p className="text-gray-900 dark:text-white">{hackathon.createdBy}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {hackathon.thumbnail && (
              <img
                src={hackathon.thumbnail}
                alt={hackathon.name}
                className="w-full h-68 sm:h-96 md:h-[25rem] lg:h-[20rem] object-cover rounded-2xl shadow-2xl ring-4 ring-gray-200 dark:ring-gray-800"
              />
            )}
          </div>
          {techs.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Tech stack</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {techs.slice(0, 6).map((tech, idx) => (
                  <span key={`${tech}-${idx}`} className="px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700">
                    {tech}
                  </span>
                ))}
                {techs.length > 6 && (
                  <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700">
                    +{techs.length - 6}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

     
        {/* Timeline Section */}
{hackathon.timelines?.length ? (
  <div ref={TimelineRef} className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 p-6 sm:p-10 mb-12">
    <div className="text-center mb-10 sm:mb-12">
      <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 sm:mb-3">
        Event Timeline
      </h2>
      <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
        Track every milestone of your journey
      </p>
    </div>

    <div className="relative max-w-full sm:max-w-4xl mx-auto">
      {/* Gradient Timeline Line */}
      <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 via-yellow-400 to-gray-300 dark:from-green-400 dark:via-yellow-400 dark:to-gray-600 rounded-full" />

      {hackathon.timelines.map((t, idx) => {
        const isLast = idx === hackathon.timelines.length - 1;

        const dotConfig = {
          complete: { bg: "bg-green-500 dark:bg-green-400", ring: "ring-green-200 dark:ring-green-900", glow: "shadow-green-500/50" },
          ongoing: { bg: "bg-yellow-400 dark:bg-yellow-300", ring: "ring-yellow-200 dark:ring-yellow-900", glow: "shadow-yellow-400/50 animate-pulse" },
          upcoming: { bg: "bg-gray-400 dark:bg-gray-600", ring: "ring-gray-200 dark:ring-gray-700", glow: "shadow-gray-400/30" },
        };

        const cardConfig = {
          complete: { bg: "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30", border: "border-green-200 dark:border-green-800", opacity: "opacity-80" },
          ongoing: { bg: "bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30", border: "border-yellow-300 dark:border-yellow-700", shadow: "shadow-xl shadow-yellow-200/50 dark:shadow-yellow-900/30" },
          upcoming: { bg: "bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/30 dark:to-slate-900/30", border: "border-gray-200 dark:border-gray-700", opacity: "" },
        };

        const labelConfig = {
          complete: { emoji: "✅", text: "Completed", color: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 border border-green-300 dark:border-green-700" },
          ongoing: { emoji: "🔥", text: "Ongoing", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-700" },
          upcoming: { emoji: "🕓", text: "Upcoming", color: "bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-300 border border-gray-300 dark:border-gray-600" },
        };

        const dot = dotConfig[t.status || "upcoming"];
        const card = cardConfig[t.status || "upcoming"];
        const label = labelConfig[t.status || "upcoming"];

        return (
          <div key={idx} className={`relative pl-14 sm:pl-20 ${!isLast ? "pb-10 sm:pb-12" : "pb-6 sm:pb-8"} group`}>
            {/* Enhanced Status Dot */}
            <div className={`absolute left-6 sm:left-8 top-3 -translate-x-1/2 w-4 sm:w-5 h-4 sm:h-5 rounded-full ${dot.bg} ${dot.ring} ${dot.glow} ring-6 sm:ring-8 border-4 border-white dark:border-gray-900 shadow-lg transition-all duration-300 group-hover:scale-125 z-10`} />

            {/* Timeline Card */}
            <div className={`${card.bg} ${card.border} ${card.shadow || ""} ${card.opacity || ""} border-2 rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl cursor-pointer`}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-2 sm:mb-3">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex-1">
                  {t.title}
                </h3>
                <span className={`${label.color} text-xs sm:text-sm font-bold px-3 py-1 sm:px-4 sm:py-2 rounded-full flex items-center gap-1 sm:gap-2 whitespace-nowrap shadow-sm`}>
                  <span className="text-base">{label.emoji}</span>
                  <span>{label.text}</span>
                </span>
              </div>

              <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 sm:mb-4">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{t.date}</span>
              </div>

              {t.description && (
                <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                  {t.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>

    {/* Timeline Legend */}
    <div className="mt-8 sm:mt-12 pt-4 sm:pt-8 border-t border-gray-200 dark:border-gray-800">
      <div className="flex flex-wrap gap-4 sm:gap-6 justify-center text-xs sm:text-sm">
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="w-3 sm:w-4 h-3 sm:h-4 rounded-full bg-green-500 dark:bg-green-400 shadow-md" />
          <span className="text-gray-700 dark:text-gray-300 font-medium">Completed</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="w-3 sm:w-4 h-3 sm:h-4 rounded-full bg-yellow-400 dark:bg-yellow-300 shadow-md" />
          <span className="text-gray-700 dark:text-gray-300 font-medium">Ongoing</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="w-3 sm:w-4 h-3 sm:h-4 rounded-full bg-gray-400 dark:bg-gray-600 shadow-md" />
          <span className="text-gray-700 dark:text-gray-300 font-medium">Upcoming</span>
        </div>
      </div>
    </div>
  </div>
) : null}
        {/* Theme Section */}
{hackathon.theme && hackathon.themeImage && (
  <div ref={AboutRef} className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 mb-12 hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
   <h1 className="text-2xl m-5">theme</h1>
    <img
      src={hackathon.themeImage}
      alt={hackathon.theme}
      className="w-full h-80 md:h-96 lg:h-[400px] object-cover rounded-3xl"
    />
  </div>
)}

{/* Venue Section */}
{hackathon.place && (
  <div ref={VenueRef} className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 p-10 mb-12 hover:shadow-2xl transition-shadow duration-300 text-center">
    <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-6">
      Venue
    </h2>

    <div className="mb-8">
      <p className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
        {hackathon.place}
      </p>
      {hackathon.venueDescription && (
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl mx-auto">
          {hackathon.venueDescription}
        </p>
      )}
    </div>

    {hackathon.venueImages && hackathon.venueImages.length > 0 && (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-5xl mx-auto">
        {hackathon.venueImages.map(
          (img, idx) =>
            img && (
              <img
                key={idx}
                src={img}
                alt={`Venue ${idx + 1}`}
                className="w-full aspect-square object-cover rounded-xl shadow-md"
              />
            )
        )}
      </div>
    )}
  </div>
)}


        {/* Guidance Sessions */}
        {hackathon.guidanceSessions &&
          hackathon.guidanceSessions.length > 0 && (
            <div
              ref={GuidanceRef}
              className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950/30 dark:via-pink-950/30 dark:to-blue-950/30 rounded-3xl shadow-xl border border-purple-200/50 dark:border-purple-800/50 p-10"
            >
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/50 px-4 py-2 rounded-full mb-4">
                  <Video className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                    Learning Resources
                  </span>
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  Guidance Sessions
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Expert insights to help you succeed
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {hackathon.guidanceSessions.map((g, idx) => {
                  const vid = extractYouTubeId(g.youtubeUrl);
                  return (
                    <div
                      key={g.id || idx}
                      className="rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
                    >
                      {vid ? (
                        <div
                          className="w-full relative"
                          style={{ aspectRatio: "16/9" }}
                        >
                          <iframe
                            title={g.title || `guidance-${idx}`}
                            src={`https://www.youtube.com/embed/${vid}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-48 flex items-center justify-center text-sm text-gray-500 bg-gray-100 dark:bg-gray-800">
                          Invalid or missing YouTube URL
                        </div>
                      )}

                      <div className="p-6">
                        <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">
                          {g.title || "Untitled Session"}
                        </h3>
                        {g.date && (
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                            <Calendar className="w-4 h-4" />
                            {g.date}
                          </div>
                        )}
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                          {g.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        {/* Prizes */}
        {hackathon.prizes && hackathon.prizes.length > 0 && (
          <section className="relative py-20 px-8 bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 rounded-3xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAgMi4yMS0xLjc5IDQtNCA0cy00LTEuNzktNC00IDEuNzktNCA0LTQgNCAxLjc5IDQgNHptMCAxMGMwIDIuMjEtMS43OSA0LTQgNHMtNC0xLjc5LTQtNCAxLjc5LTQgNC00IDQgMS43OSA0IDR6bTAgMTBjMCAyLjIxLTEuNzkgNC00IDRzLTQtMS43OS00LTQgMS43OS00IDQtNCA0IDEuNzkgNCA0eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />

            <div className="relative z-10">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-yellow-500/20 px-4 py-2 rounded-full mb-4 border border-yellow-500/30">
                  <Award className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm font-semibold text-yellow-400">
                    Recognition
                  </span>
                </div>
                <h2 className="text-5xl font-bold text-white mb-3">
                  Prizes & Awards
                </h2>
                <p className="text-gray-400">
                  Celebrating excellence and innovation
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {hackathon.prizes.map((p, i) => {
                  const isFirst = p.title?.toLowerCase().includes("1st");
                  const isSecond = p.title?.toLowerCase().includes("2nd");
                  const isThird = p.title?.toLowerCase().includes("3rd");

                  const config = isFirst
                    ? {
                        gradient: "from-yellow-400 to-amber-500",
                        border: "border-yellow-400/50",
                        shadow: "shadow-yellow-500/50",
                        glow: "group-hover:shadow-yellow-500/80",
                      }
                    : isSecond
                    ? {
                        gradient: "from-gray-300 to-gray-400",
                        border: "border-gray-400/50",
                        shadow: "shadow-gray-400/50",
                        glow: "group-hover:shadow-gray-400/80",
                      }
                    : isThird
                    ? {
                        gradient: "from-orange-400 to-amber-600",
                        border: "border-orange-400/50",
                        shadow: "shadow-orange-500/50",
                        glow: "group-hover:shadow-orange-500/80",
                      }
                    : {
                        gradient: "from-blue-400 to-cyan-500",
                        border: "border-blue-400/50",
                        shadow: "shadow-blue-500/50",
                        glow: "group-hover:shadow-blue-500/80",
                      };

                  return (
                    <div
                      key={i}
                      className={`group relative rounded-3xl p-8 bg-gradient-to-br from-gray-900 to-gray-800 border-2 ${config.border} shadow-xl ${config.shadow} hover:scale-105 hover:-translate-y-2 ${config.glow} transition-all duration-500 cursor-pointer`}
                    >
                      {/* Rank Badge */}
                      <div
                        className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-2xl ring-4 ring-white/10`}
                      >
                        <span className="text-4xl">
                          {isFirst
                            ? "🥇"
                            : isSecond
                            ? "🥈"
                            : isThird
                            ? "🥉"
                            : "🎖️"}
                        </span>
                      </div>

                      <h3 className="text-2xl font-bold text-white text-center mb-3">
                        {p.title}
                      </h3>
                      {p.amount && (
                        <div
                          className={`text-4xl font-extrabold text-center mb-4 bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}
                        >
                          ₹{p.amount}
                        </div>
                      )}
                      {p.description && (
                        <p className="text-gray-400 text-center text-sm leading-relaxed">
                          {p.description}
                        </p>
                      )}

                      {/* Decorative Corner */}
                      <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
                        <div
                          className={`absolute top-0 right-0 w-full h-full bg-gradient-to-br ${config.gradient} opacity-20 rotate-45 translate-x-10 -translate-y-10`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Special Mention */}
              <div ref={PrizesRef} className="mt-16 flex justify-center">
                <div className="group px-8 py-4 border-2 border-cyan-400/50 rounded-2xl bg-gradient-to-r from-cyan-950/50 to-blue-950/50 shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105 transition-all duration-500 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💡</span>
                    <span className="text-white font-semibold text-lg">
                      Special Mention: Best Innovation Award
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default HackathonDetailsPage;
