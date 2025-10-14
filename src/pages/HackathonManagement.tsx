// src/pages/HackathonManagement.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  arrayRemove,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/UI/LoadingSpinner";

type Hackathon = {
  id: string;
  name: string;
  description?: string;
};

type UserData = {
  id: string;
  name?: string;
  email?: string;
};

type TeamDoc = {
  name?: string;
  leaderId?: string;
  members?: string[];
  submitted?: boolean;
  submittedAt?: any;
  status?: "under_review" | "accepted" | "rejected";
};

export default function HackathonManagement() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [loading, setLoading] = useState(true);
  const [isIndividual, setIsIndividual] = useState(false);
  const [teamId, setTeamId] = useState<string | null>(null);
  const [team, setTeam] = useState<TeamDoc | null>(null);
  const [teamMembers, setTeamMembers] = useState<UserData[]>([]);
  const [isLeader, setIsLeader] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");

  useEffect(() => {
    if (!id || !user) return;
    setLoading(true);

    const fetchAll = async () => {
      try {
        const hackSnap = await getDoc(doc(db, "hackathons", id));
        if (!hackSnap.exists()) {
          setHackathon(null);
          setLoading(false);
          return;
        }
        setHackathon({ id: hackSnap.id, ...(hackSnap.data() as any) });

        const regsSnap = await getDocs(collection(db, "hackathons", id, "registrations"));
        const regDoc = regsSnap.docs.find((r) => r.data().userId === user.id);
        if (regDoc) {
          setIsIndividual(true);
          setLoading(false);
          return;
        }

        const teamsSnap = await getDocs(collection(db, "hackathons", id, "teams"));
        const found = teamsSnap.docs.find((t) => {
          const d = t.data() as TeamDoc;
          return Array.isArray(d.members) && d.members.includes(user.id);
        });

        if (found) {
          const data = found.data() as TeamDoc;
          setTeamId(found.id);
          setTeam(data);
          setIsLeader(data.leaderId === user.id);
          setNewTeamName(data.name || "");
          const members: UserData[] = [];
          for (const memberId of data.members || []) {
            const uSnap = await getDoc(doc(db, "users", memberId));
            if (uSnap.exists()) members.push({ id: uSnap.id, ...(uSnap.data() as any) });
            else members.push({ id: memberId, name: "Unknown" });
          }
          setTeamMembers(members);
        } else {
          setTeam(null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id, user]);

  const handleRemoveMember = async (memberId: string) => {
    if (!teamId || !isLeader) return;
    if (!confirm("Remove this member from your team?")) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, "hackathons", id!, "teams", teamId), {
        members: arrayRemove(memberId),
      });
      setTeamMembers((prev) => prev.filter((m) => m.id !== memberId));
      setTeam((t) => (t ? { ...t, members: (t.members || []).filter((m) => m !== memberId) } : t));
    } catch (err) {
      console.error(err);
      alert("Failed to remove member.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveTeamName = async () => {
    if (!teamId || !isLeader) return;
    if (!newTeamName.trim()) return alert("Team name cannot be empty");
    setSaving(true);
    try {
      await updateDoc(doc(db, "hackathons", id!, "teams", teamId), { name: newTeamName });
      setTeam((t) => (t ? { ...t, name: newTeamName } : t));
      alert("Team name updated");
    } catch (err) {
      console.error(err);
      alert("Failed to update team name");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitTeam = async () => {
    if (!teamId || !isLeader) return;
    if (!confirm("Submit team for admin review?")) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, "hackathons", id!, "teams", teamId), {
        submitted: true,
        submittedAt: serverTimestamp(),
      });
      setTeam((t) => (t ? { ...t, submitted: true } : t));
      alert("Team submitted for review");
    } catch (err) {
      console.error(err);
      alert("Failed to submit team");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  if (!hackathon) return <p className="text-center mt-12 text-red-500">Hackathon not found.</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6 py-20">
      {/* Hackathon Header */}
      <div className="bg-gray-800 text-white rounded-2xl p-6 shadow-lg flex flex-col md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-3xl font-bold">{hackathon.name}</h1>
          {hackathon.description && <p className="text-gray-300 mt-1">{hackathon.description}</p>}
        </div>
      </div>

      {/* Individual Registration */}
      {isIndividual ? (
        <div className="bg-gray-700 p-6 rounded-2xl shadow transition">
          <h2 className="text-xl font-semibold mb-2 text-green-400">You are registered individually ✅</h2>
          <p className="text-gray-300">
            <span className="font-medium">Name:</span> {user.name} • <span className="font-medium">Email:</span> {user.email}
          </p>
        </div>
      ) : team ? (
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg space-y-6 transition">
          {/* Team Info */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <h2 className="text-2xl font-bold text-indigo-300">{team.name || "(No Name)"}</h2>
              <p className="text-sm text-gray-400 mt-1">
                Team code:{" "}
                <span
                  className="font-mono text-teal-400 cursor-pointer hover:underline"
                  onClick={() => {
                    if (teamId) {
                      navigator.clipboard.writeText(teamId);
                      alert("Team code copied!");
                    }
                  }}
                >
                  {teamId} (Click to copy)
                </span>
              </p>
              <p className="text-sm mt-1 text-gray-400">Submitted: {team.submitted ? "Yes" : "No"}</p>
              <p className="text-sm mt-1 text-gray-400">
                Status:{" "}
                {team.submitted
                  ? team.status === "accepted"
                    ? "Shortlisted ✅"
                    : team.status === "rejected"
                    ? "Not Selected ❌"
                    : "Under Review ⏳"
                  : "Not Submitted"}
              </p>
            </div>

            {/* Leader Actions */}
            {isLeader && (
              <div className="flex flex-col md:flex-row gap-2 mt-4 md:mt-0">
                <input
                  type="text"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="Edit team name"
                  className="px-3 py-2 rounded-xl border border-gray-600 bg-gray-900 text-gray-200 focus:ring-2 focus:ring-indigo-500 transition"
                />
                <button
                  onClick={handleSaveTeamName}
                  disabled={saving}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition"
                >
                  Save
                </button>
                <button
                  onClick={handleSubmitTeam}
                  disabled={saving || !!team.submitted}
                  className={`px-4 py-2 rounded-xl font-medium transition ${
                    team.submitted
                      ? "bg-gray-600 cursor-not-allowed text-gray-300"
                      : "bg-green-500 hover:bg-green-600 text-white"
                  }`}
                >
                  {team.submitted ? "Submitted" : "Submit Team"}
                </button>
              </div>
            )}
          </div>

          {/* Team Members */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-200">Members</h3>
            <ul className="space-y-3">
              {teamMembers.map((m) => (
                <li
                  key={m.id}
                  className="flex justify-between items-center p-3 bg-gray-700 rounded-xl shadow-sm"
                >
                  <div>
                    <div className="font-semibold text-gray-200">{m.name || m.email || m.id}</div>
                    <div className="text-xs text-gray-400">{m.email}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isLeader && m.id !== team.leaderId && (
                      <button
                        onClick={() => handleRemoveMember(m.id)}
                        disabled={saving}
                        className="px-2 py-1 text-red-500 hover:text-red-700 font-medium transition"
                      >
                        Remove
                      </button>
                    )}
                    {m.id === team.leaderId && (
                      <span className="text-sm text-gray-400 font-medium">Leader</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="bg-gray-700 p-6 rounded-2xl shadow transition">
          <h2 className="text-lg font-semibold mb-2 text-yellow-400">You are not registered yet ⚠️</h2>
          <button
            onClick={() => navigate(`/hackathon/${id}`)}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition"
          >
            Go to Hackathon Page
          </button>
        </div>
      )}
    </div>
  );
}
