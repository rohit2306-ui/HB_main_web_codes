import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../config/firebase";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/UI/LoadingSpinner";

type Hackathon = { id: string; name: string; description: string };
type User = {
  id?: string; // auth context may provide uid
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
  members: string[];
  github?: string;
  linkedin?: string;
  college?: string;
};

const RegisterHackathon: React.FC = () => {
  const { hackathonId } = useParams<{ hackathonId: string }>();
  const { user } = useAuth() as { user: User | null };
  const navigate = useNavigate();

  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [registering, setRegistering] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"individual" | "createTeam" | "joinTeam">("individual");

  const [github, setGithub] = useState<string>("");
  const [linkedin, setLinkedin] = useState<string>("");
  const [college, setCollege] = useState<string>("");
  const [teamName, setTeamName] = useState<string>("");
  const [teamCode, setTeamCode] = useState<string>("");
  const [alreadyRegistered, setAlreadyRegistered] = useState<boolean>(false);
  const [createdTeamCode, setCreatedTeamCode] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  // Fetch hackathon & registration info
  useEffect(() => {
    if (!hackathonId || !user) return;

    const fetchHackathon = async () => {
      setLoading(true);
      try {
        const hackSnap = await getDoc(doc(db, "hackathons", hackathonId));
        if (hackSnap.exists())
          setHackathon({ id: hackSnap.id, ...(hackSnap.data() as Omit<Hackathon, "id">) });

        // Check individual registration
        const regSnap = await getDocs(
          query(collection(db, "hackathons", hackathonId, "registrations"), where("userId", "==", user.id || user.uid))
        );
        if (!regSnap.empty) setAlreadyRegistered(true);

        // Check team registration
        const teamsSnap = await getDocs(collection(db, "hackathons", hackathonId, "teams"));
        teamsSnap.docs.forEach((t) => {
          const tData = t.data() as Team;
          if (tData.members.includes(user.id || user.uid || "")) {
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

  // Individual registration
  const handleIndividualRegister = async () => {
    if (!user || !(user.id || user.uid)) {
      alert("User not loaded yet!");
      return;
    }
    if (!github.trim() || !linkedin.trim() || !college.trim()) {
      alert("Please provide GitHub, LinkedIn, and College Name!");
      return;
    }

    setRegistering(true);
    try {
      await addDoc(collection(db, "hackathons", hackathonId!, "registrations"), {
        userId: user.id || user.uid!,
        name: user.name || "",
        email: user.email || "",
        github: github.trim(),
        linkedin: linkedin.trim(),
        college: college.trim(),
        type: "individual",
        createdAt: serverTimestamp(),
      });

      // await updateDoc(doc(db, "users", user.id || user.uid!), {
      //   github: github.trim(),
      //   linkedin: linkedin.trim(),
      //   college: college.trim(),
      // });

      alert("Registered individually successfully!");
      navigate(`/hackathon/${hackathonId}/manage`);
    } catch (err) {
      console.error(err);
      alert("Registration failed!");
    }
    setRegistering(false);
  };

  // Team creation
  const handleCreateTeam = async () => {
    if (!user || !(user.id || user.uid)) return;
    if (!teamName.trim() || !github.trim() || !linkedin.trim() || !college.trim()) {
      alert("Please fill all fields for team creation!");
      return;
    }

    setRegistering(true);
    try {
      const teamDoc = await addDoc(collection(db, "hackathons", hackathonId!, "teams"), {
        name: teamName.trim(),
        leaderId: user.id || user.uid!,
        members: [user.id || user.uid!],
        github: github.trim(),
        linkedin: linkedin.trim(),
        college: college.trim(),
        createdAt: serverTimestamp(),
      });

      // await updateDoc(doc(db, "users", user.id || user.uid!), {
      //   github: github.trim(),
      //   linkedin: linkedin.trim(),
      //   college: college.trim(),
      // });

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
    if (!user || !(user.id || user.uid) || !teamCode.trim()) return;

    setRegistering(true);
    try {
      const teamRef = doc(db, "hackathons", hackathonId!, "teams", teamCode);
      const teamSnap = await getDoc(teamRef);
      if (!teamSnap.exists()) {
        alert("Invalid team code!");
        setRegistering(false);
        return;
      }

      await updateDoc(teamRef, { members: arrayUnion(user.id || user.uid!) });
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
  if (!hackathon)
    return <p className="text-center mt-12 text-red-500">Hackathon not found.</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-12 sm:py-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-block px-4 py-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
              Event Registration
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
            {hackathon.name}
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
            {hackathon.description}
          </p>
        </div>

        {/* Registration Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {alreadyRegistered ? (
            <div className="p-8 sm:p-12 text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Registration Confirmed
              </h2>
              {createdTeamCode && (
                <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Your Team Code
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <code className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-lg font-semibold text-blue-600 dark:text-blue-400">
                      {createdTeamCode}
                    </code>
                    <button onClick={copyTeamCode} className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30">
                <div className="flex flex-col sm:flex-row sm:justify-center gap-2 sm:gap-1 p-4 sm:p-0">
                  {["individual", "createTeam", "joinTeam"].map((tab) => (
                    <button
                      key={tab}
                      className={`px-6 py-3.5 text-sm font-semibold transition-all relative ${
                        activeTab === tab
                          ? "text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                      } ${activeTab === tab && "sm:border-b-2 sm:border-blue-600 dark:sm:border-blue-400"} rounded-lg sm:rounded-none`}
                      onClick={() => setActiveTab(tab as any)}
                    >
                      {tab === "individual" ? "Individual" : tab === "createTeam" ? "Create Team" : "Join Team"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form */}
              <div className="p-6 sm:p-10">
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  {(activeTab === "individual" || activeTab === "createTeam") && (
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">GitHub Profile</label>
                          <input
                            type="url"
                            placeholder="https://github.com/username"
                            value={github}
                            onChange={(e) => setGithub(e.target.value)}
                            className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-shadow"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">LinkedIn Profile</label>
                          <input
                            type="url"
                            placeholder="https://linkedin.com/in/username"
                            value={linkedin}
                            onChange={(e) => setLinkedin(e.target.value)}
                            className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-shadow"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">College/University</label>
                        <input
                          type="text"
                          placeholder="Enter your institution name"
                          value={college}
                          onChange={(e) => setCollege(e.target.value)}
                          className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-shadow"
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === "createTeam" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Team Name</label>
                      <input
                        type="text"
                        placeholder="Choose a unique team name"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-shadow"
                      />
                    </div>
                  )}

                  {activeTab === "joinTeam" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Team Code</label>
                      <input
                        type="text"
                        placeholder="Enter the team code shared by your leader"
                        value={teamCode}
                        onChange={(e) => setTeamCode(e.target.value)}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-shadow font-mono"
                      />
                    </div>
                  )}

                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={
                        activeTab === "individual"
                          ? handleIndividualRegister
                          : activeTab === "createTeam"
                          ? handleCreateTeam
                          : handleJoinTeam
                      }
                      disabled={registering}
                      className={`w-full py-4 rounded-lg text-white font-semibold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                        activeTab === "individual"
                          ? "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30"
                          : activeTab === "createTeam"
                          ? "bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/30"
                          : "bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/30"
                      }`}
                    >
                      {registering ? "Processing..." : activeTab === "individual" ? "Complete Registration" : activeTab === "createTeam" ? "Create Team & Register" : "Join Team"}
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterHackathon;
