import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { db } from "../config/firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

type AdminStats = {
  totalHackathons: number;
  openHackathons: number;
  closedHackathons: number;
  totalRegistrations: number;
  totalUsers: number;
};

export default function SuperAdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        if (!user) {
          setAuthorized(false);
          setLoading(false);
          return;
        }
        // Check admin role
        const aSnap = await getDoc(doc(db, "admins", user.uid));
        const aData = aSnap.exists() ? (aSnap.data() as any) : null;
        const isSuperAdmin = aData?.type === "superadmin";
        setAuthorized(isSuperAdmin);
        if (!isSuperAdmin) {
          setLoading(false);
          return;
        }

        // Fetch users
        const usersSnap = await getDocs(collection(db, "users"));
        const totalUsers = usersSnap.size;

        // Fetch hackathons
        const hacksSnap = await getDocs(collection(db, "hackathons"));
        const hackathons = hacksSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
        const now = new Date();
        let totalRegistrations = 0;
        let openHackathons = 0;
        let closedHackathons = 0;

        for (const h of hackathons) {
          const closedByStatus = h?.status === "closed";
          const closedByDate = h?.closeDate ? new Date(h.closeDate) < now : false;
          const isClosed = closedByStatus || closedByDate;
          if (isClosed) closedHackathons++; else openHackathons++;

          // registrations count per hackathon
          try {
            const regsSnap = await getDocs(collection(db, "hackathons", h.id, "registrations"));
            totalRegistrations += regsSnap.size;
          } catch {}
        }

        setStats({
          totalHackathons: hackathons.length,
          openHackathons,
          closedHackathons,
          totalRegistrations,
          totalUsers,
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load admin stats.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  if (loading) return <div className="pt-20 text-center">Loading admin dashboard...</div>;
  if (authorized === false)
    return (
      <div className="pt-20 max-w-2xl mx-auto p-6 rounded-xl bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800">
        You’re not authorized to view the Super Admin Dashboard.
      </div>
    );
  if (error) return <div className="pt-20 text-center text-red-500">{error}</div>;
  if (!stats) return null;

  return (
    <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 sm:p-10 text-white shadow-xl mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Super Admin Dashboard</h1>
        <p className="mt-3 text-white/90">Platform-wide overview of hackathons, registrations, and users.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Hackathons" value={stats.totalHackathons} color="indigo" />
        <StatCard title="Open Hackathons" value={stats.openHackathons} color="green" />
        <StatCard title="Closed Hackathons" value={stats.closedHackathons} color="red" />
        <StatCard title="Total Registrations" value={stats.totalRegistrations} color="purple" />
      </div>

      <div className="mt-8">
        <StatCard title="Total Users" value={stats.totalUsers} color="blue" />
      </div>
    </div>
  );
}

const StatCard: React.FC<{ title: string; value: number; color: "indigo" | "green" | "red" | "purple" | "blue" }> = ({ title, value, color }) => {
  const colorMap: Record<string, string> = {
    indigo: "from-indigo-500 to-indigo-600",
    green: "from-green-500 to-emerald-600",
    red: "from-red-500 to-rose-600",
    purple: "from-purple-500 to-fuchsia-600",
    blue: "from-blue-500 to-cyan-600",
  };
  return (
    <div className={`rounded-2xl p-6 bg-gradient-to-br ${colorMap[color]} text-white shadow-lg`}>
      <p className="text-sm font-medium opacity-80">{title}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
};