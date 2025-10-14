import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../config/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";

type Message = {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: any;
};

type Community = {
  name: string;
  thumbnail?: string;
};

const CommunityChatPage: React.FC = () => {
  const { user } = useAuth();
  const { communityId } = useParams<{ communityId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [community, setCommunity] = useState<Community | null>(null);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!communityId) return;

    const fetchCommunity = async () => {
      const docRef = doc(db, "communities", communityId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCommunity(docSnap.data() as Community);
      } else {
        navigate("/communities");
      }
    };

    fetchCommunity();
  }, [communityId, navigate]);

  useEffect(() => {
    if (!communityId) return;

    const messagesRef = collection(
      db,
      "communityChats",
      communityId,
      "messages"
    );
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Message, "id">),
      }));
      setMessages(msgs);
      setTimeout(scrollToBottom, 100);
    });

    return () => unsubscribe();
  }, [communityId]);

  const handleSend = async () => {
    if (!newMessage.trim() || !user || !communityId || isSending) return;

    setIsSending(true);
    const messageText = newMessage.trim();
    setNewMessage("");

    try {
      const messagesRef = collection(
        db,
        "communityChats",
        communityId,
        "messages"
      );
      await addDoc(messagesRef, {
        userId: user.id,
        userName: user.name || "Anonymous",
        text: messageText,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      setNewMessage(messageText);
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000)
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const getInitials = (name: string) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "?"
    );
  };

  const getAvatarColor = (userId: string) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-red-500",
      "bg-yellow-500",
      "bg-teal-500",
    ];
    const index =
      userId?.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0;
    return colors[index % colors.length];
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 mx-20 pt-20 pb-2  dark:bg-gray-900">
      {/* Header */}
      <header className="flex-shrink-0 bg-white dark:bg-gray-800 rounded-t-2xl border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="px-4 py-3 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <button
              onClick={() => navigate("/communities")}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors lg:hidden"
            >
              <svg
                className="w-5 h-5 text-gray-600 dark:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {community?.thumbnail ? (
              <img
                src={community.thumbnail}
                alt={community.name}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {getInitials(community?.name || "C")}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <h1 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
                {community?.name || "Community Chat"}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {messages.length}{" "}
                {messages.length === 1 ? "message" : "messages"}
              </p>
            </div>
          </div>

          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <svg
              className="w-5 h-5 text-gray-600 dark:text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 rounded-lg bg-gray-50 dark:bg-gray-900 ">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 ">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex  items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
              No messages yet
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Be the first to start the conversation!
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isOwnMessage = msg.userId === user?.id;
            const showAvatar =
              idx === 0 || messages[idx - 1].userId !== msg.userId;
            const isLastInGroup =
              idx === messages.length - 1 ||
              messages[idx + 1].userId !== msg.userId;

            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${
                  isOwnMessage ? "justify-end" : "justify-start"
                } ${!showAvatar && !isOwnMessage ? "ml-10" : ""}`}
              >
                {/* Avatar for other users */}
                {!isOwnMessage && showAvatar && (
                  <div
                    className={`w-8 h-8 rounded-full ${getAvatarColor(
                      msg.userId
                    )} flex items-center justify-center text-white text-xs font-semibold flex-shrink-0`}
                  >
                    {getInitials(msg.userName)}
                  </div>
                )}

                {!isOwnMessage && !showAvatar && <div className="w-8" />}

                {/* Message bubble */}
                <div
                  className={`flex flex-col ${
                    isOwnMessage ? "items-end" : "items-start"
                  } max-w-xs sm:max-w-md`}
                >
                  {showAvatar && !isOwnMessage && (
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 px-3">
                      {msg.userName}
                    </span>
                  )}

                  <div
                    className={`px-4 py-2.5 rounded-2xl break-words ${
                      isOwnMessage
                        ? "bg-blue-600 text-white rounded-br-sm"
                        : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-bl-sm"
                    } ${
                      !isLastInGroup
                        ? isOwnMessage
                          ? "rounded-br-2xl"
                          : "rounded-bl-2xl"
                        : ""
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.text}
                    </p>
                  </div>

                  {isLastInGroup && (
                    <span
                      className={`text-xs text-gray-400 dark:text-gray-500 mt-1 px-3`}
                    >
                      {formatTime(msg.createdAt)}
                    </span>
                  )}
                </div>

                {/* Avatar for own messages */}
                {isOwnMessage && showAvatar && (
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                    {getInitials(user?.name || "You")}
                  </div>
                )}

                {isOwnMessage && !showAvatar && <div className="w-8" />}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 rounded-b-2xl bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-3 sm:px-6">
        <div className="flex items-end gap-2 sm:gap-3 max-w-5xl mx-auto">
          <div className="flex-1 relative overflow-hidden ">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type a message..."
              rows={1}
              className="w-full resize-none rounded-xl overflow-hidden  border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
              style={{
                minHeight: "44px",
                maxHeight: "120px",
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "44px";
                target.style.height = Math.min(target.scrollHeight, 120) + "px";
              }}
            />
          </div>

          <button
            onClick={handleSend}
            disabled={!newMessage.trim() || isSending}
            className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white p-3 rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md disabled:shadow-none"
          >
            {isSending ? (
              <svg
                className="w-5 h-5 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            )}
          </button>
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-center">
          Press Enter to send, Shift + Enter for new line
        </p>
      </div>
    </div>
  );
};

export default CommunityChatPage;
