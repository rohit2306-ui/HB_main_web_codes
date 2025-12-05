import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import { ArrowRight, Play, Calendar, MapPin, Users, Award, Video } from "lucide-react";
import backgroundImageURL from '../assets/images_hack_agra_chapter_1/mainbg.jpg';

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
  registrationStartDate?: string;
  registrationEndDate?: string;
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

  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [loading, setLoading] = useState(true);
  const [problemStatements, setProblemStatements] = useState<{
  topic: string;
  type: string;
  description: string;
}[]>([]);
  
  const [countdown, setCountdown] = useState({
  
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const formatDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};


  const handleScrollToSection = (ref: any) => {
    ref.current.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
  };
  useEffect(() => {
  if (!id) return;

  const fetchHackathonProblemStatements = async () => {
    try {
      const docRef = doc(db, "hackathons", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setProblemStatements(data.problemStatements || []);
      }
    } catch (err) {
      console.error("Error fetching problem statements:", err);
    }
  };

  fetchHackathonProblemStatements();
}, [id]);

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
            pptFormatUrl: data.pptFormatUrl || null,

            guidanceSessions: guidanceArray,
            registrationStartDate: data.regStartDate || null,
registrationEndDate: data.regEndDate || null,


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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-black dark:via-black dark:to-balck text-gray-900 dark:text-gray-100 transition-colors duration-300 relative overflow-hidden pt-[80px] sm:pt-[100px]">
      {/* Hero Section */}
      <section className="relative overflow-hidden
  bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600
  dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950
  pt-[90px] sm:pt-[120px] lg:pt-[160px] px-4 sm:px-6 lg:px-8
">
  {/* Background image overlay */}
  {hackathon.thumbnail && (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url(${hackathon.thumbnail})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    />
  )}

  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />

  {/* Content */}
  <div className="relative z-10 max-w-7xl mx-auto text-center flex flex-col items-center">
    {/* Status Badge */}
    <span
      className={`inline-flex items-center gap-2 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg mb-3 sm:mb-4
        ${isClosed
          ? "bg-gradient-to-r from-red-500 to-red-600 text-white"
          : "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
        }`}
    >
      <div className={`w-2 h-2 rounded-full ${isClosed ? "bg-red-200" : "bg-green-200 animate-pulse"}`} />
      {isClosed ? "Registration Closed" : "Open for Registration"}
    </span>

    {/* Title */}
    <h1 className="mt-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white tracking-tight max-w-3xl">
      {hackathon.name}
    </h1>

    {/* Description */}
    <p className="mt-2 text-sm sm:text-base md:text-lg lg:text-xl text-white/90 max-w-3xl leading-relaxed px-2 sm:px-0">
      {hackathon.description}
    </p>

    {/* Countdown Timer */}
    <div className="w-full mt-6 sm:mt-8">
      <CountdownTimer countdown={countdown} />
    </div>

    {/* Buttons */}
    <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full max-w-lg">
      {isClosed ? (
        <div className="bg-gray-700/80 backdrop-blur-sm text-white font-bold text-base sm:text-lg px-6 py-3 sm:px-8 sm:py-4 rounded-2xl shadow-2xl w-full text-center">
          Registration Closed
        </div>
      ) : (
        <button
          onClick={() =>
            navigate(user ? `/hackathon/registration/${hackathon.id}/${user?.id}` : "/login")
          }
          className="group bg-white dark:bg-gradient-to-r dark:from-indigo-600 dark:to-purple-600
            text-gray-900 dark:text-white font-bold text-base sm:text-lg px-6 py-3 sm:px-8 sm:py-4 rounded-2xl shadow-2xl
            hover:shadow-3xl hover:scale-105 transition-all duration-300 flex items-center justify-center w-full sm:w-auto m-5"
        >
          Apply Now
          <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform" />
        </button>
      )}
      <button
        onClick={() => handleScrollToSection(GuidanceRef)}
        className="group backdrop-blur-sm bg-white/10 hover:bg-white/20 border-2 border-white/30 m-5
          text-white font-semibold text-base sm:text-lg px-6 py-3 sm:px-8 sm:py-4 rounded-2xl transition-all duration-300 flex items-center justify-center w-full sm:w-auto"
      >
        <Play className="mr-2 w-4 h-4 sm:w-5 sm:h-5" /> Watch Guidance
      </button>
    </div>
  </div>
</section>


      {/* Details Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* About */}
        <div className="bg-white dark:bg-black rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 p-6 sm:p-10 hover:shadow-2xl transition-shadow duration-300">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                About {hackathon.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm sm:text-base">
                {hackathon.description}
              </p>
             {(hackathon.registrationStartDate || hackathon.registrationEndDate) && (
  <div
  className="relative p-5 rounded-2xl 
             bg-gradient-to-r from-yellow-50 to-pink-50
             dark:from-yellow-950/20 dark:via-orange-950/20 dark:to-pink-950/20
             border-[2px] border-black dark:border-white
             shadow-lg space-y-4"
>

  {/* PERFECT FIXED CORNER */}
  <div
    className="absolute -top-[2px] -right-[2px]
               w-7 h-7
               border-t-[2px] border-r-[2px]
               border-black dark:border-white
               rounded-tr-[18px]
               pointer-events-none"
  ></div>

  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
    Registration Period
  </h3>
    {/* Registration Start + End in a single row */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

      {/* START DATE */}
      {hackathon.registrationStartDate && (
        <div className="flex items-start gap-3 p-4 bg-white/40 dark:bg-black/20 
                        rounded-xl backdrop-blur-sm">
          <Calendar className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Registration Starts
            </p>
           <p className="text-gray-900 dark:text-white">
  {formatDate(hackathon.registrationStartDate)}
</p>

          </div>
        </div>
      )}

      {/* END DATE */}
      {hackathon.registrationEndDate && (
        <div className="flex items-start gap-3 p-4 bg-white/40 dark:bg-black/20 
                        rounded-xl backdrop-blur-sm">
          <Calendar className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Registration Ends
            </p>
           <p className="text-gray-900 dark:text-white">
  {formatDate(hackathon.registrationEndDate)}
</p>

          </div>
        </div>
      )}

    </div>

  </div>
)}


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
                {/* {hackathon.createdBy && (
                  <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 rounded-xl">
                    <Users className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Hosted by
                      </p>
                      <p className="text-gray-900 dark:text-white">{hackathon.createdBy}</p>
                    </div>
                  </div>
                )} */}
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
        </div>
        {hackathon.pptFormatUrl && (
  <div className="mt-4 p-5 bg-indigo-50 dark:bg-indigo-950/20 rounded-xl border border-indigo-200 dark:border-indigo-700 shadow">
    <h3 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">
      PPT Submission Format
    </h3>

    <p className="text-gray-700 dark:text-gray-300 mt-1 text-sm">
      Download the official PPT template for your hackathon submission.
    </p>

    <a
      href={hackathon.pptFormatUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block mt-3 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition"
    >
      📥 Download PPT Format
    </a>
  </div>
)}


     
        {/* Timeline Section */}
    {hackathon.timelines?.length ? (
  <div
    className="relative rounded-3xl overflow-hidden p-6 sm:p-10 mb-12"
    style={{
      // backgroundImage: `url(${backgroundImageURL})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}
  >
    {/* Black overlay 75% */}
    <div className="absolute inset-0 bg-black/65"></div>

    <div className="relative max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10 sm:mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-500 via-green-200 to-blue-500 bg-clip-text text-transparent mb-2 sm:mb-3">
          Event Timeline
        </h2>
        <p className="text-gray-200 text-sm sm:text-base">
          Track every milestone of your hackathon
        </p>
      </div>

      {/* Vertical line */}
      <div className="absolute left-5 top-0 bottom-0 w-1 bg-gradient-to-b from-white via-white to-blue rounded-full"></div>

      {hackathon.timelines.map((t, idx) => (
        <div key={idx} className="relative pl-16 mb-10 last:mb-0">
          {/* Status Dot */}
          <div
            className={`absolute left-0 top-3 w-5 h-5 rounded-full border-4 shadow-lg
              ${
                t.status === "complete"
                  ? "bg-green-500 shadow-green-500/50"
                  : t.status === "ongoing"
                  ? "bg-yellow-400 animate-pulse shadow-yellow-400/50"
                  : "bg-gray-400 shadow-gray-500/40"
              }
            `}
          ></div>

          {/* Timeline Card */}
          <div
            className={`w-full sm:w-[550px] bg-white/10 dark:bg-gray-900/40 backdrop-blur-md rounded-2xl p-6 sm:p-8 border-2 shadow-lg hover:shadow-2xl transition-all duration-300
              ${
                t.status === "complete"
                  ? "border-green-500/50"
                  : t.status === "ongoing"
                  ? "border-yellow-400/50"
                  : "border-gray-500/40"
              }
            `}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-white">{t.title}</h3>
              <span className="text-xs sm:text-sm text-gray-200 font-medium">
                {t.date}
              </span>
            </div>

            {t.description && (
              <p className="text-sm sm:text-base text-gray-200 leading-relaxed">
                {t.description}
              </p>
            )}

            <span
              className={`inline-block mt-4 px-3 py-1 text-xs rounded-full font-medium
                ${
                  t.status === "complete"
                    ? "bg-green-100/30 text-green-200"
                    : t.status === "ongoing"
                    ? "bg-yellow-100/30 text-yellow-200"
                    : "bg-gray-100/30 text-gray-300"
                }
              `}
            >
              {t.status?.toUpperCase() || "UPCOMING"}
            </span>
          </div>
        </div>
      ))}

      {/* Legend */}
      <div className="mt-10 pt-6 border-t border-white/30 flex flex-wrap gap-4 justify-center text-sm text-gray-200">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-green-500"></span> Completed
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-yellow-400 animate-pulse"></span> Ongoing
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-gray-400"></span> Upcoming
        </div>
      </div>
    </div>
  </div>
) : null}


{hackathon.theme && hackathon.themeImage && (
  <div className="bg-white dark:bg-black rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 mb-12 hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
    {/* Theme Title */}
    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white text-center mt-6">
      Themes
    </h2>

    {/* Theme Image */}
    <div className="mt-4 px-4 sm:px-6">
      <div className="w-full aspect-[16/9] sm:aspect-[4/3] lg:aspect-[16/9] overflow-hidden rounded-3xl shadow-md">
        <img
          src={hackathon.themeImage}
          alt={hackathon.theme}
          className="w-full h-full object-cover rounded-3xl"
        />
      </div>
    </div>

    {/* Theme Boxes */}
    <div className="mt-6 px-4 sm:px-6 pb-6 flex flex-wrap justify-center gap-3 sm:gap-4">
      {hackathon.theme.split(",").map((themeItem, idx) => (
        <div
          key={idx}
          className="bg-black/80 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-medium shadow-md hover:scale-105 transition-transform duration-300 backdrop-blur-sm"
        >
          {themeItem.trim()}
        </div>
      ))}
    </div>
  </div>
)}

{problemStatements.length > 0 && (
  <section className="relative py-28 px-6 lg:px-20 bg-white dark:bg-[#0B0B0C] transition-colors duration-300 rounded-3xl">
    {/* Ambient Glow */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-0 left-1/2 w-[650px] h-[650px] bg-black/5 dark:bg-white/5 rounded-full -translate-x-1/2 blur-[150px]"></div>
    </div>

    <div className="relative z-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-20">
        <h2 className="text-5xl md:text-6xl font-semibold text-gray-900 dark:text-white tracking-tight">
          Problem Statements
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl mt-4">
          Choose a challenge and start solving it
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        {problemStatements.map((ps, idx) => (
          <div
            key={idx}
            className="group relative rounded-2xl bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-neutral-200 dark:border-white/10 p-10 shadow-sm hover:border-neutral-300 hover:dark:border-white/20 hover:bg-neutral-50/80 hover:dark:bg-white/[0.08] transition-all duration-400"
          >
            {/* Badge */}
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full flex items-center justify-center text-xl font-semibold shadow-md bg-indigo-400 text-white">
              {idx + 1}
            </div>

            <div className="mt-6 text-center">
              {/* Topic */}
              <h3 className="text-2xl font-medium tracking-tight text-gray-900 dark:text-white">
                {ps.topic}
              </h3>

              {/* Type */}
              <span className="inline-block mt-3 px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100">
                {ps.type}
              </span>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mt-4">
                {ps.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)}



{/* Venue Section */}
{hackathon.place && (
  <div className=" bg-white dark:bg-[#0B0B0C]
    transition-colors duration-300 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 p-10 mb-12 hover:shadow-2xl transition-shadow duration-300 text-center">
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
       {hackathon.guidanceSessions && hackathon.guidanceSessions.length > 0 && (
  <div
    ref={GuidanceRef}
    className="relative rounded-3xl shadow-2xl border border-purple-200/30 dark:border-purple-800/40 p-10 bg-black/5 dark:bg-gray-900/20 backdrop-blur-sm"
  >
    {/* Header */}
    <div className="text-center mb-12">
      <div className="inline-flex items-center gap-2 bg-purple-100/20 dark:bg-purple-900/30 px-4 py-2 rounded-full mb-4">
        <Video className="w-5 h-5 text-black-600 dark:text-white-400" />
        <span className="text-sm font-semibold text-green-700 dark:text-purple-300">
          Learning Resources
        </span>
      </div>
      <h2 className="text-4xl font-extrabold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
        Guidance Sessions
      </h2>
      <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
        Expert insights to help you succeed. Watch, learn and improve your hackathon performance.
      </p>
    </div>

    <div className="space-y-12">
      {hackathon.guidanceSessions.map((g, idx) => {
        const vid = extractYouTubeId(g.youtubeUrl);
        return (
          <div
            key={g.id || idx}
            className="flex flex-col md:flex-row items-center gap-6 bg-white/10 dark:bg-gray-900/30 backdrop-blur-md rounded-3xl p-6 md:p-8 border-2 border-purple-400/20 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
          >
            {/* Video / iframe left */}
            <div className="relative w-full md:w-1/2 rounded-xl overflow-hidden shadow-md">
              {vid ? (
                <div className="relative" style={{ aspectRatio: "16/9" }}>
                  <iframe
                    title={g.title || `guidance-${idx}`}
                    src={`https://www.youtube.com/embed/${vid}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full rounded-xl"
                  />
                </div>
              ) : (
                <div className="w-full h-48 flex items-center justify-center text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 rounded-xl">
                  Invalid or missing YouTube URL
                </div>
              )}

              {/* Status Dot */}
              {g.status && (
                <span
                  className={`absolute top-3 left-3 w-4 h-4 rounded-full shadow-md
                  ${
                    g.status === "complete"
                      ? "bg-green-500 shadow-green-400/50"
                      : g.status === "ongoing"
                      ? "bg-yellow-400 shadow-yellow-400/50 animate-pulse"
                      : "bg-gray-400 shadow-gray-500/40"
                  }`}
                />
              )}
            </div>

            {/* Content right */}
            <div className="w-full md:w-1/2 flex flex-col justify-start gap-3">
              <h3 className="font-extrabold text-2xl md:text-3xl text-gray-900 dark:text-white">
                {g.title || "Untitled Session"}
              </h3>

              {g.date && (
                <span className="inline-block mb-2 px-3 py-1 text-xs font-semibold rounded-full bg-purple-200/30 dark:bg-purple-700/30 text-purple-800 dark:text-purple-200">
                  {g.date}
                </span>
              )}

              <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed">
                {g.description || "No description available."}
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
  <section className="relative py-28 px-6 lg:px-20 
    bg-white dark:bg-[#0B0B0C]
    transition-colors duration-300 rounded-3xl"
  >
    {/* Ambient Glow */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="
        absolute top-0 left-1/2 w-[650px] h-[650px] 
        bg-black/5 dark:bg-white/5 
        rounded-full -translate-x-1/2 blur-[150px]
      "></div>
    </div>

    <div className="relative z-10 max-w-7xl mx-auto">

      {/* HEADER */}
      <div className="text-center mb-20">
        <h2 className="text-5xl md:text-6xl font-semibold 
          text-gray-900 dark:text-white tracking-tight"
        >
          Prizes & Awards
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl mt-4">
          Celebrate excellence. Reward innovation.
        </p>
      </div>

      {/* PRIZE GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        {hackathon.prizes.map((p, i) => {
          const isFirst = p.title?.toLowerCase().includes("1st");
          const isSecond = p.title?.toLowerCase().includes("2nd");
          const isThird = p.title?.toLowerCase().includes("3rd");

          const badgeColor = isFirst
            ? "bg-[#E4C76A]"
            : isSecond
            ? "bg-[#C8CCD1]"
            : isThird
            ? "bg-[#D89A63]"
            : "bg-neutral-200 dark:bg-neutral-700";

          return (
            <div
              key={i}
              className="
                group relative rounded-2xl 
                bg-white/50 dark:bg-white/5 
                backdrop-blur-xl 
                border border-neutral-200 dark:border-white/10 
                p-10 shadow-sm
                hover:border-neutral-300 hover:dark:border-white/20
                hover:bg-neutral-50/80 hover:dark:bg-white/[0.08]
                transition-all duration-400
              "
            >
              {/* Badge */}
              <div
                className={`
                  absolute -top-7 left-1/2 -translate-x-1/2
                  w-16 h-16 rounded-full flex items-center justify-center
                  text-xl font-semibold shadow-md ${badgeColor}
                `}
              >
                {isFirst ? "🥇" : isSecond ? "🥈" : isThird ? "🥉" : "🎖️"}
              </div>

              <div className="mt-6 text-center">
                {/* Prize Title */}
                <h3 className="
                  text-2xl font-medium tracking-tight
                  text-gray-900 dark:text-white
                ">
                  {p.title}
                </h3>

                {/* Prize Amount */}
                {p.amount && (
                  <p className="
                    text-3xl font-semibold 
                    text-gray-900 dark:text-white mt-3
                  ">
                    ₹{p.amount}
                  </p>
                )}

                {/* Description */}
                {p.description && (
                  <p className="
                    text-gray-600 dark:text-gray-400 
                    text-sm leading-relaxed mt-4
                  ">
                    {p.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* SPECIAL MENTIONS */}
      <div className="mt-24 flex flex-wrap justify-center gap-6">
        {[
          { icon: "💡", text: "Best Innovation Award" },
          { icon: "⭐", text: "Most Creative Solution" },
        ].map((item, idx) => (
          <div
            key={idx}
            className="
              bg-white/50 dark:bg-white/5 
              backdrop-blur-xl 
              border border-neutral-200 dark:border-white/10  
              rounded-xl px-8 py-5 flex items-center gap-3
              hover:bg-neutral-50/80 hover:dark:bg-white/[0.08]
              hover:border-neutral-300 hover:dark:border-white/20
              transition-all duration-300
            "
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-gray-900 dark:text-white font-medium text-lg">
              {item.text}
            </span>
          </div>
        ))}
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
