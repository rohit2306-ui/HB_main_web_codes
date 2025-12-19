import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../config/firebase";
import { collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";

type HackathonDoc = {
  id: string;
  name: string;
  description?: string;
  createdBy?: string;
  closeDate?: string;
};

type RegistrationDoc = {
  id: string;
  userId: string;
  teamId?: string;
  createdAt?: any;
};

type UserDoc = {
  id: string;
  name?: string;
  email?: string;
  username?: string;
};

export default function HostHackathonDashboard() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [hackathon, setHackathon] = useState<HackathonDoc | null>(null);
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState<(RegistrationDoc & { user?: UserDoc })[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [savingStatus, setSavingStatus] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        if (!id || !user) {
          setAuthorized(false);
          setLoading(false);
          return;
        }
        const snap = await getDoc(doc(db, "hackathons", id));
        if (!snap.exists()) {
          setError("Hackathon not found");
          setAuthorized(false);
          setLoading(false);
          return;
        }
        const data = { id: snap.id, ...(snap.data() as any) } as HackathonDoc;
        setHackathon(data);
        const isOwner = data.createdBy === user.uid;
        setAuthorized(isOwner);
        if (!isOwner) {
          setLoading(false);
          return;
        }

        const regsSnap = await getDocs(collection(db, "hackathons", id, "registrations"));
        const regs: RegistrationDoc[] = regsSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));

        const enriched: (RegistrationDoc & { user?: UserDoc })[] = [];
        for (const r of regs) {
          let u: UserDoc | undefined = undefined;
          try {
            const uSnap = await getDoc(doc(db, "users", r.userId));
            if (uSnap.exists()) u = { id: uSnap.id, ...(uSnap.data() as any) } as UserDoc;
          } catch {}
          enriched.push({ ...r, user: u });
        }
        setRegistrations(enriched);
      } catch (err) {
        console.error(err);
        setError("Failed to load host dashboard.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, user]);

  const toggleStatus = async (newStatus: "open" | "closed") => {
    if (!hackathon || !authorized) return;
    setSavingStatus(true);
    try {
      await updateDoc(doc(db, "hackathons", hackathon.id), { status: newStatus });
      setHackathon((h) => (h ? { ...h, status: newStatus as any } : h));
    } catch (err) {
      console.error(err);
      alert("Failed to update status. Check Firestore rules.");
    } finally {
      setSavingStatus(false);
    }
  };

  if (loading) return <div className="pt-20 text-center">Loading host dashboard...</div>;
  if (authorized === false)
    return (
      <div className="pt-20 max-w-2xl mx-auto p-6 rounded-xl bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800">
        You’re not authorized to view this hackathon’s registrations.
      </div>
    );
  if (error) return <div className="pt-20 text-center text-red-500">{error}</div>;
  if (!hackathon) return null;

  return (
    <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 sm:p-10 text-white shadow-xl mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{hackathon.name}</h1>
        <p className="mt-3 text-white/90">Host view: registrations and basic stats</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg font-bold mb-3">Hackathon Info</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">ID: {hackathon.id}</p>
          {hackathon.closeDate && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Registration closes: {hackathon.closeDate}</p>
          )}
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Total registrations: {registrations.length}</p>

          <div className="mt-4">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Status</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${hackathon.status === "closed" ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800" : "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"}`}>
                {hackathon.status === "closed" ? "Closed" : "Open"}
              </span>
              <button
                disabled={savingStatus}
                onClick={() => toggleStatus(hackathon.status === "closed" ? "open" : "closed")}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold disabled:opacity-60"
              >
                {savingStatus ? "Saving..." : hackathon.status === "closed" ? "Reopen" : "Close Now"}
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Hosts can override the close date by toggling status.</p>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg font-bold mb-4">Registered Users</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Username</th>
                  <th className="py-2 pr-4">Email</th>
                  <th className="py-2 pr-4">User ID</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((r) => (
                  <tr key={r.id} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-2 pr-4">{r.user?.name || "—"}</td>
                    <td className="py-2 pr-4">{r.user?.username || "—"}</td>
                    <td className="py-2 pr-4">{r.user?.email || "—"}</td>
                    <td className="py-2 pr-4">{r.userId}</td>
                  </tr>
                ))}
                {registrations.length === 0 && (
                  <tr>
                    <td className="py-4 text-gray-500 dark:text-gray-400" colSpan={4}>
                      No registrations yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Summary: Registrations by day */}
          <div className="mt-8">
            <h3 className="text-base font-semibold mb-3">Registrations by Day</h3>
            {(() => {
              const counts: Record<string, number> = {};
              for (const r of registrations) {
                const ts: any = (r as any).createdAt;
                let d: Date | null = null;
                if (ts && typeof ts.toDate === "function") d = ts.toDate();
                else if (typeof ts === "string") d = new Date(ts);
                const key = d ? d.toISOString().slice(0, 10) : "Unknown";
                counts[key] = (counts[key] || 0) + 1;
              }
              const entries = Object.entries(counts).sort(([a], [b]) => a.localeCompare(b));
              const max = Math.max(1, ...entries.map(([, v]) => v));
              return entries.length ? (
                <div className="space-y-2">
                  {entries.map(([day, count]) => (
                    <div key={day} className="flex items-center gap-3">
                      <span className="w-28 text-xs text-gray-600 dark:text-gray-400">{day}</span>
                      <div className="flex-1 h-3 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                        <div
                          className="h-3 bg-indigo-500 dark:bg-indigo-600"
                          style={{ width: `${(count / max) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-700 dark:text-gray-300">{count}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">No registration activity yet.</p>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}