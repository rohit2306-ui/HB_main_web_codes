import React, { useEffect, useState } from "react";
import {
  Calendar,
  UserPlus,
  Users,
  Trophy,
  MapPin,
  Mail,
  Settings,
  LogOut,
  Bookmark,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import useBookmarks from "../hooks/useBookmarks";

interface Community {
  id: string;
  name: string;
}

interface Hackathon {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  date?: string;
  place?: string;
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { bookmarks } = useBookmarks();

  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState<number>(0);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);

  useEffect(() => {
    if (user) {
      loadFriends();
      loadUserCommunities();
      loadUserHackathons();
    }
  }, [user]);

  const loadFriends = async () => {
    if (!user) return;
    try {
      const q1 = query(
        collection(db, "connections"),
        where("status", "==", "friends"),
        where("userIdA", "==", user.id)
      );
      const q2 = query(
        collection(db, "connections"),
        where("status", "==", "friends"),
        where("userIdB", "==", user.id)
      );
      const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
      setFriends(snap1.docs.length + snap2.docs.length);
    } catch (err) {
      console.error("Error fetching connections:", err);
    }
  };
   if (!user) {
    console.log(user.id);
   }

  const loadUserCommunities = async () => {
    if (!user) return;
    try {
      const q = query(
        collection(db, "communities"),
        where("members", "array-contains", user.id)
      );
      const snap = await getDocs(q);
      setCommunities(snap.docs.map((d) => ({ id: d.id, name: d.data().name })));
    } catch (err) {
      console.error("Error loading communities:", err);
    }
  };

  const loadUserHackathons = async () => {
    if (!user) return;
    try {
      const hackRef = collection(db, "hackathons");
      const hackSnap = await getDocs(hackRef);
      const userHackathons: Hackathon[] = [];

      for (const hackDoc of hackSnap.docs) {
        const hackData = hackDoc.data();

        let isRegistered = false;
        const regSnap = await getDocs(
          collection(db, "hackathons", hackDoc.id, "registrations")
        );
        if (regSnap.docs.some((r) => r.data().userId === user.id))
          isRegistered = true;

        const teamSnap = await getDocs(
          collection(db, "hackathons", hackDoc.id, "teams")
        );
        if (teamSnap.docs.some((t) => t.data().members?.includes(user.id)))
          isRegistered = true;

        if (isRegistered) {
          userHackathons.push({
            id: hackDoc.id,
            title: hackData.title,
            description: hackData.description,
            thumbnail: hackData.thumbnail,
            date: hackData.date,
            place: hackData.place,
          });
        }
      }

      setHackathons(userHackathons);
    } catch (err) {
      console.error("Error loading hackathons:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    const parsed = new Date(date);
    return isNaN(parsed.getTime())
      ? "Invalid date"
      : parsed.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
  };

  const getInitials = (name: string) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U"
    );
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (!user) return null;
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
          <div className="px-6 sm:px-8 pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-16 mb-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-4xl font-bold text-white shadow-xl border-4 border-white dark:border-gray-800">
                  {getInitials(user.name || "User")}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  {user.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  @{user.username}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Joined {formatDate(user.joinedDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>
                  {friends} {friends === 1 ? "Friend" : "Friends"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4" />
                <span>{bookmarks.length} Bookmarks</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {communities.length}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Communities Joined
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {hackathons.length}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Hackathons Registered
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {friends}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Friends
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 sm:px-8 py-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quick Actions</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Jump into what matters most.</p>
          </div>
          <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => navigate("/feed")}
              className="group p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-300 dark:hover:border-purple-700 transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">Explore Hackathons</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Find upcoming events to join</p>
                </div>
              </div>
            </button>
            <button
              onClick={() => navigate("/communities")}
              className="group p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700 transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">Find Communities</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Connect with peers</p>
                </div>
              </div>
            </button>
            <button
              onClick={() => navigate("/dsa")}
              className="group p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                  <Settings className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Practice DSA</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Sharpen problem-solving</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Communities Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 sm:px-8 py-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Your Communities
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {communities.length}{" "}
                    {communities.length === 1 ? "community" : "communities"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate("/communities")}
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                View All
              </button>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {communities.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Not part of any communities yet
                </p>
                <button
                  onClick={() => navigate("/communities")}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Explore Communities
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {communities.map((comm) => (
                  <div
                    key={comm.id}
                    onClick={() => navigate(`/community/${comm.id}`)}
                    className="p-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {comm.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {comm.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Click to view
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Hackathons Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 sm:px-8 py-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Registered Hackathons
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {hackathons.length}{" "}
                    {hackathons.length === 1 ? "event" : "events"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate("/feed")}
                className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
              >
                View All
              </button>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {hackathons.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  You haven't registered for any hackathons yet
                </p>
                <button
                  onClick={() => navigate("/feed")}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                >
                  Explore Hackathons
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {hackathons.map((hack) => (
                  <div
                    key={hack.id}
                    onClick={() => navigate(`/hackathon/${hack.id}/manage`)}
                    className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-300 dark:hover:border-purple-700 cursor-pointer transition-all group"
                  >
                    {hack.thumbnail ? (
                      <img
                        src={hack.thumbnail}
                        alt={hack.title}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                        {hack.title.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {hack.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 mt-1">
                        {hack.description}
                      </p>
                      <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                        {hack.date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(hack.date)}
                          </span>
                        )}
                        {hack.place && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {hack.place}
                          </span>
                        )}
                      </div>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
