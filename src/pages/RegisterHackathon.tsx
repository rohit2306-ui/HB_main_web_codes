import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../config/firebase";
import image1 from "../assets/images_hack_agra_chapter_1/mainbg2.jpg";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/UI/LoadingSpinner";

type Hackathon = { id: string; name: string; description: string };
type User = {
  id?: string;
  uid?: string;
  name: string;
  email: string;
  github?: string;
  linkedin?: string;
  college?: string;
};
type Team = {
  id: string;
  name: string;
  leaderId: string;
  membersEmails: string[];
  github?: string;
  linkedin?: string;
  college?: string;
};

const RegisterHackathon: React.FC = () => {
  const { hackathonId } = useParams<{ hackathonId: string }>();
  const { user } = useAuth() as { user: User | null };
  const navigate = useNavigate();

  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [activeTab, setActiveTab] = useState<"createTeam" | "joinTeam">("createTeam");

  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [college, setCollege] = useState("");
  const [teamName, setTeamName] = useState("");
  const [teamCode, setTeamCode] = useState("");
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [createdTeamCode, setCreatedTeamCode] = useState("");
  const [copied, setCopied] = useState(false);

  // Fetch hackathon & registration info
  useEffect(() => {
    if (!hackathonId || !user) return;

    const fetchHackathon = async () => {
      setLoading(true);
      try {
        const hackSnap = await getDoc(doc(db, "hackathons", hackathonId));
        if (!hackSnap.exists()) {
          setHackathon(null);
          setLoading(false);
          return;
        }
        setHackathon({ id: hackSnap.id, ...(hackSnap.data() as Omit<Hackathon, "id">) });

        const email = user.email || "";

        const teamsSnap = await getDocs(collection(db, "hackathons", hackathonId, "teams"));
        teamsSnap.docs.forEach((t) => {
          const tData = t.data() as Team;
          if (tData.membersEmails?.includes(email)) {
            setAlreadyRegistered(true);
            setCreatedTeamCode(t.id);
          }
        });
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    fetchHackathon();
  }, [hackathonId, user]);

  // Team creation
  const handleCreateTeam = async () => {
    if (!user) return;
    if (!teamName.trim() || !github.trim() || !linkedin.trim() || !college.trim()) {
      alert("Please fill all fields for team creation!");
      return;
    }

    setRegistering(true);
    try {
      const teamDoc = await addDoc(collection(db, "hackathons", hackathonId!, "teams"), {
        name: teamName.trim(),
        leaderId: user.id || user.uid!,
        membersEmails: [user.email || ""],
        github: github.trim(),
        linkedin: linkedin.trim(),
        college: college.trim(),
        leaderEmail: user.email || "",
        createdAt: serverTimestamp(),
      });

      setCreatedTeamCode(teamDoc.id);
      alert(`Team created! Your code: ${teamDoc.id}`);
      navigate(`/hackathon/${hackathonId}/manage`);
    } catch (err) {
      console.error(err);
      alert("Team creation failed!");
    }
    setRegistering(false);
  };

  // Join team
  const handleJoinTeam = async () => {
    if (!user || !teamCode.trim()) return;

    setRegistering(true);
    try {
      const teamRef = doc(db, "hackathons", hackathonId!, "teams", teamCode);
      const teamSnap = await getDoc(teamRef);

      if (!teamSnap.exists()) {
        alert("Invalid team code!");
        setRegistering(false);
        return;
      }

      const teamData = teamSnap.data() as Team;
      const memberEmail = user.email || "";

      if (teamData.membersEmails?.includes(memberEmail)) {
        alert("You are already in this team!");
        setRegistering(false);
        return;
      }

      if ((teamData.membersEmails?.length || 0) >= 6) {
        alert("This team is full (maximum 6 members allowed)!");
        setRegistering(false);
        return;
      }

      await updateDoc(teamRef, {
        membersEmails: arrayUnion(memberEmail),
      });

      alert("Joined team successfully!");
      navigate(`/hackathon/${hackathonId}/manage`);
    } catch (err) {
      console.error(err);
      alert("Failed to join team");
    }
    setRegistering(false);
  };

  const copyTeamCode = () => {
    if (!createdTeamCode) return;
    navigator.clipboard.writeText(createdTeamCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <LoadingSpinner size="lg" />;
  if (!hackathon) return <p className="text-center mt-12 text-red-500">Hackathon not found.</p>;

  return (
    <div
      className="min-h-screen w-full relative bg-black text-white"
      style={{
        backgroundImage: `url(${image1})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Transparent Dark Overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-16 sm:py-20">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">{hackathon.name}</h1>
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto px-4">
            {hackathon.description}
          </p>
        </div>

        {/* Registration Card */}
        <div className="bg-black/80 rounded-2xl shadow-xl border border-gray-700 overflow-hidden">
          {alreadyRegistered ? (
            <div className="p-10 text-center">
              <h2 className="text-2xl font-bold text-white mb-2">You are already registered!</h2>
              {createdTeamCode && (
                <div className="mt-8 p-6 bg-black/60 rounded-xl border border-gray-700 text-center">
                  <p className="text-sm font-medium text-gray-300 mb-3">Your Team Code</p>
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <code className="px-4 py-2.5 bg-black/70 border border-gray-600 rounded-lg font-mono text-lg font-semibold text-blue-400">
                      {createdTeamCode}
                    </code>
                    <button
                      onClick={copyTeamCode}
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <button
                    onClick={() => navigate(`/hackathon/${hackathonId}/manage`)}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-all"
                  >
                    Go to Team Page
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div className="flex justify-center gap-4 bg-black/50 py-6">
                {["createTeam", "joinTeam"].map((tab) => (
                  <button
                    key={tab}
                    className={`px-8 py-3 rounded-xl text-sm sm:text-base font-semibold transition-all border ${
                      activeTab === tab
                        ? "bg-blue-600/90 text-white shadow-md border-blue-500"
                        : "bg-black/30 text-gray-300 border-gray-600 hover:bg-blue-500/10 hover:text-blue-400"
                    }`}
                    onClick={() => setActiveTab(tab as any)}
                  >
                    {tab === "createTeam" ? "Create Team" : "Join Team"}
                  </button>
                ))}
              </div>

              {/* Form */}
              <div className="p-8 sm:p-10 space-y-6">
                {activeTab === "createTeam" && (
                  <div className="space-y-5">
                    <input
                      type="url"
                      placeholder="GitHub Profile"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      className="w-full px-4 py-3 bg-black/70 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                    />
                    <input
                      type="url"
                      placeholder="LinkedIn Profile"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      className="w-full px-4 py-3 bg-black/70 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                    />
                    <input
                      type="text"
                      placeholder="College / University"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      className="w-full px-4 py-3 bg-black/70 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 text-white"
                    />
                    <input
                      type="text"
                      placeholder="Team Name"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      className="w-full px-4 py-3 bg-black/70 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 text-white"
                    />
                  </div>
                )}

                {activeTab === "joinTeam" && (
                  <input
                    type="text"
                    placeholder="Team Code"
                    value={teamCode}
                    onChange={(e) => setTeamCode(e.target.value)}
                    className="w-full px-4 py-3 bg-black/70 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 text-white font-mono"
                  />
                )}

                <button
                  type="button"
                  onClick={activeTab === "createTeam" ? handleCreateTeam : handleJoinTeam}
                  disabled={registering}
                  className={`w-full py-4 rounded-lg font-semibold text-white text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    activeTab === "createTeam"
                      ? "bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/30"
                      : "bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/30"
                  }`}
                >
                  {registering
                    ? "Processing..."
                    : activeTab === "createTeam"
                    ? "Create Team & Register"
                    : "Join Team"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterHackathon;
