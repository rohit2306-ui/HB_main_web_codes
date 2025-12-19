import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../config/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

type HackathonCard = {
  id: string;
  name: string;
  status?: "open" | "closed";
  date?: string;
  closeDate?: string;
  thumbnail?: string;
};

export default function MyHackathons() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<HackathonCard[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        if (!user) {
          setLoading(false);
          return;
        }
        const q = query(collection(db, "hackathons"), where("createdBy", "==", user.uid));
        const snap = await getDocs(q);
        setItems(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as HackathonCard[]);
      } catch (err) {
        console.error(err);
        setError("Failed to load your hackathons.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  if (loading) return <div className="pt-20 text-center">Loading your hackathons...</div>;
  if (error) return <div className="pt-20 text-center text-red-500">{error}</div>;

  return (
    <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 sm:p-10 text-white shadow-xl mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">My Hackathons</h1>
          <p className="mt-3 text-white/90">Quickly jump into managing your events.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/my-hackathon')}
            className="px-4 py-2.5 rounded-lg bg-white text-indigo-700 font-semibold hover:bg-gray-100"
          >
            Manage Hackathon
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-8 bg-white dark:bg-gray-900 text-center">
          <p className="text-gray-600 dark:text-gray-400">You haven’t hosted any hackathons yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((h) => {
            const closedByDate = h.closeDate ? new Date(h.closeDate) < new Date() : false;
            const isClosed = h.status === "closed" || closedByDate;
            return (
              <div key={h.id} className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow">
                <div className="h-32 bg-gradient-to-r from-purple-600 to-indigo-600 relative">
                  {h.thumbnail && (
                    <img src={h.thumbnail} alt={h.name} className="absolute inset-0 w-full h-full object-cover" />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold">{h.name}</h3>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${isClosed ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800" : "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"}`}>
                      {isClosed ? "Closed" : "Open"}
                    </span>
                    {h.date && <span className="text-xs text-gray-600 dark:text-gray-400">{h.date}</span>}
                    {h.closeDate && <span className="text-xs text-gray-600 dark:text-gray-400">Closes: {h.closeDate}</span>}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => navigate(`/hackathon/${h.id}`)}
                      className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs"
                    >
                      View
                    </button>
                    <button
                      onClick={() => navigate(`/host/hackathon/${h.id}`)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-xs"
                    >
                      Manage
                    </button>
                   
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}