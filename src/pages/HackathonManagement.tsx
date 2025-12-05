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
  timelines?: { title: string; status: string }[];
};

type TeamDoc = {
  name?: string;
  leaderId?: string;
  leaderEmail?: string;
  membersEmails?: string[];
  submitted?: boolean;
  submittedAt?: any;
  status?: "under_review" | "accepted" | "rejected";
  pptUrl?: string;
  projectDescription?: string;
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
  const [teamMembers, setTeamMembers] = useState<{ email: string }[]>([]);
  const [isLeader, setIsLeader] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [pptFile, setPptFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submissionOpen, setSubmissionOpen] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [projectDescription, setProjectDescription] = useState("");

  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

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
        const hackData = hackSnap.data() as any;
        setHackathon({ id: hackSnap.id, ...hackData });

        const hackTimelines = hackData.timelines || [];
        setSubmissionOpen(
          hackTimelines.find((t) =>
            t.title.toLowerCase().includes("project submission")
          )?.status === "ongoing"
        );
        setRegistrationOpen(
          hackTimelines.find((t) =>
            t.title.toLowerCase().includes("registration")
          )?.status === "ongoing"
        );

        const teamsSnap = await getDocs(collection(db, "hackathons", id, "teams"));
        const found = teamsSnap.docs.find((t) => {
          const d = t.data() as TeamDoc;
          return Array.isArray(d.membersEmails) && d.membersEmails.includes(user.email || "");
        });

        if (found) {
          const data = found.data() as TeamDoc;
          setTeamId(found.id);
          setTeam(data);
          setIsLeader(data.leaderEmail === user.email);
          setIsIndividual(false);
          setTeamMembers((data.membersEmails || []).map((email) => ({ email })));
        } else {
          const regsSnap = await getDocs(collection(db, "hackathons", id, "registrations"));
          const regDoc = regsSnap.docs.find((r) => r.data().userId === user.uid);
          setIsIndividual(!!regDoc);
          setTeam(null);
          setTeamMembers([]);
          setIsLeader(false);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id, user]);

  const handleRemoveMember = async (memberEmail: string) => {
    if (!teamId || !isLeader) return;
    if (!confirm("Remove this member from your team?")) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, "hackathons", id!, "teams", teamId), {
        membersEmails: arrayRemove(memberEmail),
      });
      setTeamMembers((prev) => prev.filter((m) => m.email !== memberEmail));
      setTeam((t) =>
        t ? { ...t, membersEmails: (t.membersEmails || []).filter((e) => e !== memberEmail) } : t
      );
    } catch (err) {
      console.error(err);
      alert("Failed to remove member.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProjectDescription = async () => {
    if (!submissionOpen) return alert("Project submission is not open yet.");
    setSaving(true);
    try {
      if (teamId) {
        await updateDoc(doc(db, "hackathons", id!, "teams", teamId), { projectDescription });
      } else if (isIndividual) {
        const regsSnap = await getDocs(collection(db, "hackathons", id!, "registrations"));
        const regDoc = regsSnap.docs.find((r) => r.data().userId === user.uid);
        if (regDoc) {
          await updateDoc(doc(db, "hackathons", id!, "registrations", regDoc.id), {
            projectDescription,
          });
        }
      }
      alert("Project description saved!");
    } catch (err) {
      console.error(err);
      alert("Failed to save project description.");
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

  const handleUploadPPT = async () => {
    if (!pptFile) return alert("Please select a PPT file");
    if (!submissionOpen) return alert("Project submission is not open yet.");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", pptFile);
      formData.append("upload_preset", UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
        { method: "POST", body: formData }
      );

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      const pptUrl = data.secure_url;

      if (teamId) {
        await updateDoc(doc(db, "hackathons", id!, "teams", teamId), { pptUrl });
        setTeam((t) => (t ? { ...t, pptUrl } : t));
      } else if (isIndividual) {
        const regsSnap = await getDocs(collection(db, "hackathons", id!, "registrations"));
        const regDoc = regsSnap.docs.find((r) => r.data().userId === user.uid);
        if (regDoc) {
          await updateDoc(doc(db, "hackathons", id!, "registrations", regDoc.id), { pptUrl });
        }
      }

      alert("PPT uploaded successfully!");
      setPptFile(null);
    } catch (err) {
      console.error(err);
      alert("Failed to upload PPT. Check Cloudinary preset and file.");
    } finally {
      setUploading(false);
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

  const canSubmitTeam =
    isLeader && registrationOpen && (team?.membersEmails?.length || 0) >= 4 && !team?.submitted;

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    );

  if (!hackathon)
    return (
      <p className="text-center mt-12 text-red-500">Hackathon not found.</p>
    );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 py-20">
      {/* Hackathon Header */}
      <div className="bg-gray-900/80 backdrop-blur-md text-white rounded-2xl p-6 shadow-xl border border-gray-700 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">{hackathon.name}</h1>
          {hackathon.description && (
            <p className="text-gray-300 mt-1">{hackathon.description}</p>
          )}
        </div>
      </div>

      {/* Individual / Team Card */}
      {isIndividual ? (
        <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-700">
          <h2 className="text-xl font-semibold mb-2 text-green-400">
            Registered Individually ✅
          </h2>
          <p className="text-gray-300">
            <span className="font-medium">Name:</span> {user.name} •{" "}
            <span className="font-medium">Email:</span> {user.email}
          </p>
        </div>
      ) : team ? (
        <div className="bg-gray-900/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-700 space-y-6">
          {/* Team Info */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
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
              <p className="text-sm mt-1 text-gray-400">
                Submitted: {team.submitted ? "Yes" : "No"}
              </p>
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
                  className="px-3 py-2 rounded-xl border border-gray-600 bg-gray-800 text-gray-200 focus:ring-2 focus:ring-indigo-500 transition"
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
                  disabled={!canSubmitTeam || saving}
                  className={`px-4 py-2 rounded-xl font-medium transition ${
                    !canSubmitTeam
                      ? "bg-gray-600 cursor-not-allowed text-gray-300"
                      : "bg-green-500 hover:bg-green-600 text-white"
                  }`}
                >
                  {team?.submitted ? "Submitted" : "Submit Team"}
                </button>
              </div>
            )}
          </div>
          <p className="text-yellow-200 text-sm">Minimum 4 members needed to submit the team</p>

          {/* Members */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-200">Members</h3>
            <ul className="space-y-3">
              {teamMembers.map((m) => (
                <li
                  key={m.email}
                  className="flex justify-between items-center p-3 bg-gray-800/80 backdrop-blur-md rounded-xl shadow-sm border border-gray-700"
                >
                  <div>
                    <div className="font-semibold text-gray-200">{m.email}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isLeader && m.email !== team.leaderEmail && (
                      <button
                        onClick={() => handleRemoveMember(m.email)}
                        disabled={saving}
                        className="px-2 py-1 text-red-500 hover:text-red-700 font-medium transition"
                      >
                        Remove
                      </button>
                    )}
                    {m.email === team.leaderEmail && (
                      <span className="text-sm text-gray-400 font-medium">Leader</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-700">
          <h2 className="text-lg font-semibold mb-2 text-yellow-400">
            You are not registered yet ⚠️
          </h2>
          <button
            onClick={() => navigate(`/hackathon/${id}`)}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition"
          >
            Go to Hackathon Page
          </button>
        </div>
      )}

      {/* PPT & Project Description */}
      {(isLeader || isIndividual) && (
        <div className="relative bg-gray-900/80 backdrop-blur-md p-6 rounded-2xl shadow-xl flex flex-col gap-6 border border-gray-700 transition-all duration-300">
          {!submissionOpen && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
              <p className="text-yellow-400 font-semibold text-lg text-center">
                Project submission is not active yet ⚠️
              </p>
            </div>
          )}
          {submissionOpen && ((team?.pptUrl && team?.projectDescription) || (isIndividual && projectDescription && pptFile)) && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
              <p className="text-blue-400 font-semibold text-lg text-center">
                Submission received ✅<br />
                Wait for your result to be shortlisted.
              </p>
            </div>
          )}
          {submissionOpen && (
            <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-20">
              LIVE NOW
            </span>
          )}

          {/* PPT Upload */}
          <div className="flex flex-col md:flex-row md:items-center md:gap-4 z-0">
            <div className="flex-1">
              <label className="block text-gray-200 font-medium mb-2">Upload Your PPT (must be .pptx)</label>
              <input
                type="file"
                accept=".ppt,.pptx,.pdf"
                onChange={(e) => setPptFile(e.target.files?.[0] || null)}
                className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                disabled={!submissionOpen}
              />
              {team?.pptUrl && (
                <a
                  href={team.pptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 underline mt-2 inline-block"
                >
                  View Submitted PPT
                </a>
              )}
            </div>
            <button
              onClick={handleUploadPPT}
              disabled={uploading || !pptFile || !submissionOpen}
              className={`mt-4 md:mt-0 px-6 py-3 rounded-xl font-medium transition duration-300 ${
                submissionOpen
                  ? "bg-green-500 hover:bg-green-600 text-white shadow-lg"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }`}
            >
              {uploading ? "Uploading..." : "Upload PPT"}
            </button>
          </div>

          {/* Project Description */}
          <div className="flex flex-col md:flex-row md:items-start md:gap-4 z-0">
            <div className="flex-1">
              <label className="block text-gray-200 font-medium mb-2">Brief about idea</label>
              <textarea
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                rows={5}
                placeholder="Briefly describe your project..."
                className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none shadow-sm"
                disabled={!submissionOpen}
              />
            </div>
            <button
              onClick={handleSaveProjectDescription}
              disabled={!submissionOpen || saving}
              className={`mt-4 md:mt-0 px-6 py-3 rounded-xl font-medium transition duration-300 ${
                submissionOpen
                  ? "bg-blue-500 hover:bg-blue-600 text-white shadow-lg"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }`}
            >
              {saving ? "Saving..." : "Submit Description"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
