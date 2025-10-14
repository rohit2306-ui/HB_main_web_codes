import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../config/firebase";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

interface EventData {
  thumbnail?: string;
  id: string;
  title: string;
  description: string;
  date: string;
}

export default function EventRegistrationPage() {
  const { eventId } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;
      try {
        const docRef = doc(db, "events", eventId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setEvent({ id: docSnap.id, ...(docSnap.data() as EventData) });
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  useEffect(() => {
    const checkRegistration = async () => {
      if (!eventId || !user) return;
      try {
        const q = query(
          collection(db, `events/${eventId}/registrations`),
          where("userId", "==", user.id)
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          const regData = snap.docs[0].data();
          setAlreadyRegistered(true);
          setStatus(regData.status || "under review");
        }
      } catch (error) {
        console.error("Error checking registration:", error);
      }
    };

    checkRegistration();
  }, [eventId, user]);

  const handleRegister = async () => {
    if (!user || !eventId) return;

    try {
      await addDoc(collection(db, `events/${eventId}/registrations`), {
        userId: user.id,
        email: user.email,
        github,
        linkedin,
        createdAt: new Date(),
        status: "under review",
      });
      setAlreadyRegistered(true);
      setStatus("under review");
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100">
        <span className="animate-pulse text-lg font-semibold">Loading Event...</span>
      </div>
    );

  if (!event)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100">
        <span className="text-lg font-semibold">Event not found.</span>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex justify-center py-20 px-4">
      <div className="w-full max-w-2xl bg-gray-900/70 backdrop-blur-md border border-gray-700 rounded-3xl shadow-2xl p-6 sm:p-10 flex flex-col space-y-6">
        {event.thumbnail && (
          <img
            src={event.thumbnail}
            alt={event.title}
            loading="lazy"
            className="w-full h-60 object-cover rounded-2xl shadow-xl border border-gray-700 transition-transform transform hover:scale-105"
          />
        )}
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
          {event.title}
        </h1>
        <p className="text-gray-300 text-lg">{event.description}</p>
        <p className="text-sm text-gray-400 mb-4 flex items-center gap-2">
          📅 <span>{event.date}</span>
        </p>

        {alreadyRegistered ? (
          <p className="font-semibold mt-2 text-center text-lg">
            {status === "accepted" && (
              <span className="text-green-400 animate-pulse">✅ Registration Accepted!</span>
            )}
            {status === "rejected" && (
              <span className="text-red-500">❌ Registration Rejected</span>
            )}
            {status === "under review" && (
              <span className="text-yellow-400 animate-pulse">⏳ Under Review</span>
            )}
          </p>
        ) : (
          <div className="flex flex-col space-y-4">
            <h2 className="text-xl font-semibold text-cyan-400">Complete Registration</h2>

            <input
              type="url"
              placeholder="GitHub Profile Link"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-600 bg-gray-800 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
            />

            <input
              type="url"
              placeholder="LinkedIn Profile Link"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-600 bg-gray-800 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
            />

            <button
              onClick={handleRegister}
              className="w-full py-3 bg-gradient-to-r from-green-400 to-cyan-400 text-gray-900 font-bold rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-transform"
            >
              Register Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
