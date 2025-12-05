import React, { useEffect, useState } from "react";
import { Calendar, UserPlus, Users, Trophy, MapPin, Mail, LogOut, Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import LoadingSpinner from "../components/UI/LoadingSpinner";

interface Community { id: string; name: string; }
interface Hackathon { id: string; title: string; description: string; thumbnail?: string; date?: string; place?: string; }

const formatDate = (date: string) => {
  const d = new Date(date);
  return isNaN(d.getTime()) ? "Invalid date" : d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};
const getInitials = (name: string) => name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U";

/* Custom Hooks */
const useFriends = (uid?: string) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!uid) return;
    const load = async () => {
      try {
        const q1 = query(collection(db, "connections"), where("status", "==", "friends"), where("userIdA", "==", uid));
        const q2 = query(collection(db, "connections"), where("status", "==", "friends"), where("userIdB", "==", uid));
        const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
        setCount(snap1.docs.length + snap2.docs.length);
      } catch (err) { console.error(err); }
    };
    load();
  }, [uid]);
  return count;
};

const useCommunities = (email?: string) => {
  const [communities, setCommunities] = useState<Community[]>([]);
  useEffect(() => {
    if (!email) return;
    const load = async () => {
      try {
        const q = query(collection(db, "communities"), where("members", "array-contains", email));
        const snap = await getDocs(q);
        setCommunities(snap.docs.map((d) => ({ id: d.id, name: d.data().name })));
      } catch (err) { console.error(err); }
    };
    load();
  }, [email]);
  return communities;
};

const useUserHackathons = (user: any) => {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      try {
        const hackSnap = await getDocs(collection(db, "hackathons"));
        const results = await Promise.all(
          hackSnap.docs.map(async (hack) => {
            const hackData = hack.data();
            const regSnap = await getDocs(query(collection(db, "hackathons", hack.id, "registrations"), where("userId", "==", user.uid)));
            const teamSnap = await getDocs(collection(db, "hackathons", hack.id, "teams"));
            let inTeam = false;
            teamSnap.forEach((t) => {
              const tData = t.data();
              if (tData.membersEmails?.includes(user.email) || tData.leaderEmail === user.email || tData.leaderId === user.uid)
                inTeam = true;
            });
            if (!regSnap.empty || inTeam)
              return { id: hack.id, title: hackData.name || hackData.title || "Untitled Hackathon", description: hackData.description || "", thumbnail: hackData.thumbnail || "", date: hackData.date || "", place: hackData.place || "" };
            return null;
          })
        );
        setHackathons(results.filter((x) => x !== null) as Hackathon[]);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, [user]);
  return { hackathons, loading };
};

/* UI Components */
const MetricCard = ({ icon, label, value }: any) => (
  <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
    <div className="w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">{icon}</div>
    <div>
      <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
      <div className="text-xl font-semibold text-gray-900 dark:text-white">{value}</div>
    </div>
  </div>
);

const CommunityCard = ({ c, onClick }: any) => (
  <div onClick={onClick} className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition">
    <div className="font-medium text-gray-900 dark:text-white">{c.name}</div>
    <div className="text-xs text-gray-500 dark:text-gray-400">Open</div>
  </div>
);

const HackItem = ({ h, onClick }: any) => (
  <div onClick={onClick} className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition">
    {h.thumbnail ? (
      <img src={h.thumbnail} alt={h.title} className="w-16 h-16 rounded-md object-cover" />
    ) : (
      <div className="w-16 h-16 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-lg font-bold text-gray-900 dark:text-white">{h.title.charAt(0)}</div>
    )}
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-center">
        <div className="font-semibold text-gray-900 dark:text-white truncate">{h.title}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{h.place || ""}</div>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">{h.description}</p>
      <div className="flex gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
        {h.date && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(h.date)}</span>}
        {h.place && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {h.place}</span>}
      </div>
    </div>
  </div>
);

const EmptyStateCard = ({ title, description, actionLabel, onAction }: any) => (
  <div className="p-6 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-center">
    <div className="font-semibold text-gray-900 dark:text-white">{title}</div>
    <div className="text-sm text-gray-600 dark:text-gray-300 mt-2">{description}</div>
    <button onClick={onAction} className="mt-3 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition text-sm">{actionLabel}</button>
  </div>
);

/* Dashboard */
const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);

  const friends = useFriends(user?.uid);
  const communities = useCommunities(user?.email);
  const { hackathons, loading } = useUserHackathons(user);

  useEffect(() => { document.documentElement.classList.toggle("dark", darkMode); }, [darkMode]);

  const handleLogout = async () => { try { await logout(); navigate("/"); } catch (err) { console.error(err); } };

  if (!user) return null;
  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white py-12 pt-24">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Profile */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-2xl font-bold text-gray-900 dark:text-white">{getInitials(user.name)}</div>
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">@{user.username}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1"><Mail className="w-3 h-3" /> {user.email}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1"><Calendar className="w-3 h-3" /> Joined {formatDate(user.joinedDate)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1"><Users className="w-3 h-3" /> {friends} friends</p>
            </div>
          </div>
          <div className="flex gap-2">
            {/* <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition">{darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}</button> */}
            <button onClick={handleLogout} className="p-2 rounded-lg bg-red-600 hover:bg-red-500 text-white transition flex items-center gap-2"><LogOut className="w-4 h-4" /> Logout</button>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <MetricCard icon={<Users className="w-5 h-5" />} label="Communities" value={communities.length} />
          <MetricCard icon={<Trophy className="w-5 h-5" />} label="Hackathons" value={hackathons.length} />
          <MetricCard icon={<UserPlus className="w-5 h-5" />} label="Friends" value={friends} />
        </div>

        {/* Communities */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Your Communities</h2>
            <button onClick={() => navigate("/communities")} className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm transition">View all</button>
          </div>
          {communities.length === 0 ? <EmptyStateCard title="No communities yet" description="Explore and join communities." actionLabel="Explore" onAction={() => navigate("/communities")} /> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {communities.map((c) => <CommunityCard key={c.id} c={c} onClick={() => navigate(`/community/${c.id}`)} />)}
            </div>
          )}
        </div>

        {/* Hackathons */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Registered Hackathons</h2>
            <button onClick={() => navigate("/feed")} className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm transition">Browse feed</button>
          </div>
          {hackathons.length === 0 ? <EmptyStateCard title="No hackathons registered" description="Find events and register." actionLabel="Discover" onAction={() => navigate("/feed")} /> : (
            <div className="flex flex-col gap-4">
              {hackathons.map((h) => <HackItem key={h.id} h={h} onClick={() => navigate(`/hackathon/${h.id}/manage`)} />)}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
