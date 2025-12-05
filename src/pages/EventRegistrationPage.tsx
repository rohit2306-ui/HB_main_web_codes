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
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

interface ExtraField {
  label: string;
  value?: string;
}

interface EventData {
  id: string;
  name: string;
  description: string;
  date: string;
  venue?: string;
  thumbnail?: string;
  extraFields?: ExtraField[];
}

export default function EventRegistrationPage() {
  const { eventId } = useParams();
  const { user } = useAuth();

  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [inputs, setInputs] = useState<{ [key: string]: string }>({});
  const [registering, setRegistering] = useState(false);

  // 🟢 Fetch event + initialize form fields
  useEffect(() => {
    if (!eventId) return;

    const fetchEvent = async () => {
      try {
        const docRef = doc(db, "events", eventId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as EventData;
          setEvent({ id: docSnap.id, ...data });

          const extras = data.extraFields ?? [];
          const defaultInputs: Record<string, string> = {};
          extras.forEach((field) => {
            defaultInputs[field.label] = "";
          });
          setInputs(defaultInputs);
        } else {
          setEvent(null);
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  // 🟢 Check if user already registered
  useEffect(() => {
    if (!eventId || !user?.uid) return;

    const checkRegistration = async () => {
      try {
        const q = query(
          collection(db, `events/${eventId}/registrations`),
          where("userId", "==", user.uid)
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

  // 🟢 Handle input change
  const handleInputChange = (label: string, value: string) => {
    setInputs((prev) => ({ ...prev, [label]: value }));
  };

  // 🟢 Handle registration submit
  const handleRegister = async () => {
    if (!user?.uid) return alert("Please login to register.");
    if (!eventId) return alert("Event ID missing.");

    const missing = Object.entries(inputs).filter(([_, v]) => !v.trim());
    if (missing.length > 0)
      return alert("Please fill all fields before submitting.");

    setRegistering(true);
    try {
      await addDoc(collection(db, `events/${eventId}/registrations`), {
        userId: user.uid,
        email: user.email || "",
        formResponses: inputs,
        createdAt: serverTimestamp(),
        status: "under review",
      });

      setAlreadyRegistered(true);
      setStatus("under review");
      alert("Registration successful ✅");
    } catch (error: any) {
      console.error("Registration error:", error);
      alert(
        "Registration failed! Check console for details (possible Firestore rules issue)."
      );
    } finally {
      setRegistering(false);
    }
  };

  // 🟢 UI States
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-100">
        <span className="animate-pulse text-lg font-semibold">
          Loading Event...
        </span>
      </div>
    );

  if (!event)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-100">
        <span className="text-lg font-semibold">Event not found.</span>
      </div>
    );

  // 🟢 MAIN UI
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Top Banner */}
      <div className="relative w-full h-72 md:h-96 overflow-hidden">
        <img
          src={event.thumbnail}
          alt={event.name}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-gray-950 flex flex-col justify-center items-center text-center p-6">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-green-400">
            {event.name}
          </h1>
          <p className="text-gray-300 mt-2 text-lg">📅 {event.date}</p>
          {event.venue && (
            <p className="text-gray-400 text-sm mt-1">📍 {event.venue}</p>
          )}
        </div>
      </div>

      {/* Main Section */}
      {/* <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 px-6 md:px-12 py-12"> */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 px-6 md:px-12 py-12 items-start">

        {/* Left: Event Info */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-cyan-400">
            Event Details
          </h2>

          {event.thumbnail && (
            <img
              src={event.thumbnail}
              alt={`${event.name} poster`}
              className="w-full rounded-2xl border border-white/20 shadow-xl mb-6 object-cover"
            />
          )}
           <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3 mb-5">
            <p className="text-gray-400">
              <span className="font-semibold text-white">Date:</span>{" "}
              {event.date}
            </p>
            {event.venue && (
              <p className="text-gray-400">
                <span className="font-semibold text-white">Venue:</span>{" "}
                {event.venue}
              </p>
            )}
            <p className="text-gray-400">
              <span className="font-semibold text-white">Organized by:</span>{" "}
              HackBase.in
            </p>
            <p className="text-gray-400 italic text-sm">
              🌟 Get ready to innovate, collaborate, and showcase your ideas!
            </p>
          </div>

          {/* 🧾 Description with auto height */}
         <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3 mb-5">
           <p className="text-gray-200 whitespace-pre-line leading-relaxed mb-6">
            {event.description || "No description provided."}
          </p>

         </div>
         
        </div>

        {/* Right: Registration Form */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl mt-12">
          {alreadyRegistered ? (
            <div className="flex flex-col items-center justify-center text-center space-y-4 py-10">
              {status === "accepted" && (
                <p className="text-green-400 text-2xl font-bold animate-pulse">
                  ✅ Registration Accepted!
                </p>
              )}
              {status === "rejected" && (
                <p className="text-red-500 text-2xl font-bold">
                  ❌ Registration Rejected
                </p>
              )}
              {status === "under review" && (
                <p className="text-yellow-400 text-2xl font-bold animate-pulse">
                  ⏳ Under Review
                </p>
              )}
              <p className="text-gray-400 text-sm">
                Thank you for showing interest in this event.
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                Register for this Event
              </h2>

              <div className="flex flex-col space-y-5 overflow-y-auto max-h-[75vh]">
                {event.extraFields && event.extraFields.length > 0 ? (
                  event.extraFields.map((field, index) => {
                    const isLink =
                      field.value && field.value.startsWith("http");
                    return (
                      <div key={index} className="flex flex-col">
                        <label className="text-sm text-gray-300 mb-1 ml-1">
                          {field.label}
                        </label>
                        <input
                          type="text"
                          placeholder={field.label}
                          value={inputs[field.label] || ""}
                          onChange={(e) =>
                            handleInputChange(field.label, e.target.value)
                          }
                          className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-800 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                        />
                        {isLink && (
                          <a
                            href={field.value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-cyan-400 hover:underline mt-1 ml-1"
                          >
                            🔗 {field.value}
                          </a>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-400 italic text-sm">
                    This event doesn’t require any extra details.
                  </p>
                )}

                <button
                  onClick={handleRegister}
                  disabled={registering}
                  className={`mt-4 w-full py-3.5 font-bold rounded-2xl transition-all shadow-lg ${
                    registering
                      ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-400 to-cyan-400 text-gray-900 hover:scale-105"
                  }`}
                >
                  {registering ? "Registering..." : "Register Now"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
