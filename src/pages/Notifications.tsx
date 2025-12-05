import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import { db } from "../config/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import image1 from "../assets/images_hack_agra_chapter_1/mainbg2.jpg"
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Star,
  Heart,
  ArrowRight,
  Globe,
  Mic,
  BookOpen,
  Video,
  Coffee,
  Search,
  Filter,
  TrendingUp,
} from "lucide-react";
import { User } from "firebase/auth";

type Event = {
  id: string;
  title: string;
  description: string;
  type?: "conference" | "workshop" | "seminar" | "meetup" | "webinar";
  category?: string;
  date?: string;
  time?: string;
  city?: string;
  venue?: string;
  thumbnail?: string;
  isVirtual?: boolean;
  attendees?: number;
  price?: string;
  featured?: boolean;
  createdBy: string;
};

const EventTypeIcon = ({ type }: { type?: Event["type"] }) => {
  switch (type) {
    case "conference":
      return <Mic className="w-4 h-4" />;
    case "workshop":
      return <BookOpen className="w-4 h-4" />;
    case "seminar":
      return <Users className="w-4 h-4" />;
    case "meetup":
      return <Coffee className="w-4 h-4" />;
    case "webinar":
      return <Video className="w-4 h-4" />;
    default:
      return <Calendar className="w-4 h-4" />;
  }
};

const EventCard = ({ event, user }: { event: Event; user: User }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const navigate = useNavigate();

  const getTypeColor = (type?: Event["type"]) => {
    switch (type) {
      case "conference":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "workshop":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "seminar":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "meetup":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "webinar":
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const getTypeName = (type?: Event["type"]) => {
    return type ? type.charAt(0).toUpperCase() + type.slice(1) : "Event";
  };

  return (
    <div className="group h-full">
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:border-indigo-500/50 hover:-translate-y-1">
        {/* Thumbnail Section */}
        <div className="relative h-52 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
          {event.thumbnail ? (
            <img
              src={event.thumbnail}
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = `https://placehold.co/600x400/6366F1/FFFFFF?text=${encodeURIComponent(
                  event.title || "Event"
                )}`;
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Calendar className="w-16 h-16 text-gray-400" />
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Type Badge */}
          {event.type && (
            <div
              className={`absolute top-3 left-3 px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-md border ${getTypeColor(
                event.type
              )} flex items-center gap-1.5`}
            >
              <EventTypeIcon type={event.type} />
              {getTypeName(event.type)}
            </div>
          )}

          {/* Virtual Badge */}
          {event.isVirtual && (
            <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              Virtual
            </div>
          )}

          {/* Bookmark Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsBookmarked(!isBookmarked);
            }}
            className={`absolute bottom-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 ${
              isBookmarked
                ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
                : "bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-500/30"
            }`}
          >
            <Heart
              className={`w-4 h-4 transition-all ${
                isBookmarked ? "fill-current scale-110" : ""
              }`}
            />
          </button>
        </div>

        {/* Content Section */}
        <div className="p-6 flex flex-col flex-grow">
          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {event.title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3 mb-4">
            {event.description}
          </p>

          {/* Event Details */}
          <div className="space-y-2.5 mb-4">
            {event.date && (
              <div className="flex items-center gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                <Calendar className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                <span className="font-medium">{event.date}</span>
              </div>
            )}

            {event.time && (
              <div className="flex items-center gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                <Clock className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                <span>{event.time}</span>
              </div>
            )}

            {(event.venue || event.city) && (
              <div className="flex items-center gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                <MapPin className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                <span className="line-clamp-1">
                  {event.venue && event.city
                    ? `${event.venue}, ${event.city}`
                    : event.venue || event.city}
                </span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              {event.attendees ? (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Users className="w-4 h-4" />
                  <span className="font-medium">
                    {event.attendees.toLocaleString()} attending
                  </span>
                </div>
              ) : (
                <div />
              )}

              {event.price && (
                <div
                  className={`text-sm font-bold ${
                    event.price === "0"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-gray-900 dark:text-white"
                  }`}
                >
                  {event.price === "0" ? "FREE" : `₹${event.price}`}
                </div>
              )}
            </div>

            {/* Register Button */}
            <button
              onClick={() =>
                navigate(user ? `/event/registration/${event.id}` : "/login")
              }
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-semibold shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 group/btn"
            >
              Register Now
              <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const EventsPage: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const eventsRef = collection(db, "events");
      const q = query(eventsRef, orderBy("date", "asc"));
      const snapshot = await getDocs(q);
      const eventsList: Event[] = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Event, "id">),
        }))
        // 👇 Only show events that are NOT marked as deleted
        .filter((event) => !event.deleted);
      setEvents(eventsList);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
    setLoading(false);
  };
  fetchEvents();
}, []);


  const filteredEvents = events.filter(
    (event) =>
      (event.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (event.description?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (event.city?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center">
        <LoadingSpinner size="lg" />
        <p className="text-gray-600 dark:text-gray-400 mt-4 font-medium">
          Loading events...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header Section */}
      
{/* Header Section */}
<div className="relative w-full h-[400px] lg:h-[500px]">

  {/* Background Image (both modes) */}
  <div className="absolute inset-0">
    <img
      src={image1}
      alt="Events Hero"
      className="w-full h-full object-cover"
    />
  </div>

  {/* Light Mode White Transparent Layer */}
  <div className="absolute inset-0 bg-white/60 dark:bg-transparent"></div>

  {/* Dark Mode Black Overlay */}
  <div className="absolute inset-0 hidden dark:block bg-black/75"></div>

  {/* Content */}
  <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6 lg:px-8">

    <div className="inline-flex items-center gap-2 bg-black/20 dark:bg-white/20 backdrop-blur-md text-gray-900 dark:text-white px-4 py-2 rounded-full text-sm font-semibold mb-6 animate-fadeIn">
      <TrendingUp className="w-4 h-4" />
      Discover Amazing Events
    </div>

    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight animate-fadeIn delay-100">
      Upcoming workshops & Events
    </h1>

    <p className="text-xl text-gray-700 dark:text-white/80 max-w-2xl mx-auto mb-10 animate-fadeIn delay-200">
      Join thousands of innovators at conferences, workshops, webinars, and hackathons — stay ahead in tech and innovation.
    </p>

    {/* Search Bar */}
    <div className="max-w-2xl w-full animate-fadeIn delay-300">
      <div className="relative">
        <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-700 dark:text-white/70 w-5 h-5" />
        <input
          type="text"
          placeholder="Search by name, type, or city..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-14 pr-5 py-4 rounded-2xl bg-white/70 dark:bg-white/20 border-2 border-gray-300 dark:border-transparent text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-white/70 shadow-lg focus:ring-4 focus:ring-indigo-500/40 focus:outline-none text-lg backdrop-blur-sm transition-all duration-300"
        />
      </div>
    </div>
  </div>
</div>


      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Results Info */}
        <div className="mb-8">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {filteredEvents.length === 0 ? (
              "No events found"
            ) : (
              <>
                Showing{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {filteredEvents.length}
                </span>{" "}
                {filteredEvents.length === 1 ? "event" : "events"}
              </>
            )}
          </p>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-200 dark:bg-gray-800 rounded-full mb-6">
              <Calendar className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              No events found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-md mx-auto">
              Try adjusting your search terms or check back later for new events
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
