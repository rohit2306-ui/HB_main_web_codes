import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import { db } from "../config/firebase";
import image1 from "../assets/images_hack_agra_chapter_1/mainbg2.jpg"
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Search,
  Filter,
  Plus,
  Check,
  Star,
  MessageCircle,
  Lock,
  X,
  ChevronRight,
} from "lucide-react";

type Community = {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  members?: string[];
  tags?: string[];
  category?: string;
  weeklyPosts?: number;
  rating?: number;
  isPrivate?: boolean;
};

const CommunitiesPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "joined">("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [joinedCommunities, setJoinedCommunities] = useState<Set<string>>(
    new Set()
  );

  const categories = [
    { id: "all", label: "All Categories", icon: "🌐" },
    { id: "technology", label: "Technology", icon: "💻" },
    { id: "gaming", label: "Gaming", icon: "🎮" },
    { id: "art", label: "Art & Design", icon: "🎨" },
    { id: "music", label: "Music", icon: "🎵" },
    { id: "fitness", label: "Fitness", icon: "💪" },
    { id: "education", label: "Education", icon: "📚" },
  ];

  useEffect(() => {
    const fetchCommunities = async () => {
      setLoading(true);
      try {
        const snapshot = await getDocs(collection(db, "communities"));
        const list: Community[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            members: data.members || [],
          };
        });
        setCommunities(list);

        if (user) {
          const joinedSet = new Set(
            list.filter((c) => c.members.includes(user.email)).map((c) => c.id)
          );
          setJoinedCommunities(joinedSet);
        }
      } catch (err) {
        console.error("Error fetching communities:", err);
      }
      setLoading(false);
    };
    fetchCommunities();
  }, [user]);

  const handleJoinCommunity = async (communityId: string) => {
    if (!user) return;
    setJoining(communityId);

    try {
      const communityRef = doc(db, "communities", communityId);
      await updateDoc(communityRef, {
        members: arrayUnion(user.email), // Add email to Firestore
      });

      // Update local state
      setJoinedCommunities((prev) => new Set(prev).add(communityId));
      setCommunities((prev) =>
        prev.map((c) =>
          c.id === communityId
            ? { ...c, members: c.members ? [...c.members, user.email] : [user.email] }
            : c
        )
      );

      // Navigate to community/chat after joining
      navigate(`/community/${communityId}`);
    } catch (err) {
      console.error("Error joining community:", err);
    } finally {
      setJoining(null);
    }
  };

  const filteredCommunities = communities.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags?.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === "all" || c.category === selectedCategory;
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "joined" && joinedCommunities.has(c.id));

    return matchesSearch && matchesCategory && matchesTab;
  });

  const CommunityCard = ({ community }: { community: Community }) => {
    const isJoined = joinedCommunities.has(community.id);

    return (
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 overflow-hidden group">
        <div className="relative h-40 overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
          {community.thumbnail ? (
            <img
              src={community.thumbnail}
              alt={community.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {community.isPrivate && (
            <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium text-white flex items-center gap-1 border border-white/20">
              <Lock className="w-3 h-3" />
              Private
            </div>
          )}

          {community.category && (
            <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium text-white border border-white/30">
              {community.category}
            </div>
          )}

          {isJoined && (
            <div className="absolute bottom-3 left-3 bg-green-500/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-white flex items-center gap-1">
              <Check className="w-3 h-3" />
              Joined
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="mb-4">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-xl mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {community.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-2">
              {community.description}
            </p>
          </div>

          {community.tags && community.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {community.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="grid grid-cols-3 gap-3 mb-5 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="text-center">
              <div className="flex items-center justify-center text-gray-900 dark:text-gray-100 font-bold text-lg mb-1">
                <Users className="w-4 h-4 mr-1 text-blue-500" />
                {community.members?.length || 0}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Members
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center text-gray-900 dark:text-gray-100 font-bold text-lg mb-1">
                <MessageCircle className="w-4 h-4 mr-1 text-purple-500" />
                {community.weeklyPosts || 0}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Posts/wk
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center text-gray-900 dark:text-gray-100 font-bold text-lg mb-1">
                <Star className="w-4 h-4 mr-1 text-yellow-500" />
                {community.rating?.toFixed(1) || "0.0"}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Rating
              </div>
            </div>
          </div>

          <button
            disabled={joining === community.id}
            onClick={() => {
              if (isJoined) {
                navigate(`/community/${community.id}`);
              } else {
                handleJoinCommunity(community.id);
              }
            }}
            className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
              joining === community.id
                ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                : isJoined
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            }`}
          >
            {joining === community.id ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                Joining...
              </>
            ) : isJoined ? (
              <>
                Open Community
                <ChevronRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Join Community
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="lg" />
        <p className="text-gray-600 dark:text-gray-400 mt-4 text-lg font-medium">
          Loading communities...
        </p>
      </div>
    );
  }

  return (
 <div
  className="min-h-screen relative text-gray-900 dark:text-gray-100 
  bg-[linear-gradient(rgba(255,255,255,0.6),rgba(255,255,255,0.6))] 
  dark:bg-[linear-gradient(rgba(0,0,0,0.75),rgba(0,0,0,0.75))]"
  style={{
    backgroundImage: image1
      ? `linear-gradient(transparent, transparent), url(${image1})`
      : undefined,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
>

  {/* Your inner content */}


      {/* Header */}
      <div className="bg-white dark:bg-black-800 pt-20 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 backdrop-blur-lg bg-white/90 dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Discover Communities
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Join {communities.length} active communities and connect with
                like-minded people
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-xl">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {joinedCommunities.size} Joined
                </span>
              </div>
            </div>
          </div>

          {/* Search and Tabs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search communities, tags, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === "all"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                All Communities
              </button>
              <button
                onClick={() => setActiveTab("joined")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                  activeTab === "joined"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                My Communities
                {joinedCommunities.size > 0 && (
                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-bold">
                    {joinedCommunities.size}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-6">
        {/* Sidebar */}
        <div className="hidden lg:block w-72 space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sticky top-32">
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Categories
            </h3>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-3 ${
                    selectedCategory === cat.id
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <span className="text-xl">{cat.icon}</span>
                  <span className="flex-1">{cat.label}</span>
                  {selectedCategory === cat.id && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Communities Grid */}
        <div className="flex-1">
          {filteredCommunities.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCommunities.map((community) => (
                <CommunityCard key={community.id} community={community} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-16 text-center">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                {activeTab === "joined"
                  ? "No joined communities yet"
                  : searchQuery
                  ? "No communities found"
                  : "No communities available"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                {activeTab === "joined"
                  ? "Start by joining some communities that match your interests and passions."
                  : searchQuery
                  ? "Try adjusting your search or filter to find what you're looking for."
                  : "Check back soon for new communities to join."}
              </p>
              {activeTab === "joined" && (
                <button
                  onClick={() => setActiveTab("all")}
                  className="px-6 py-3 bg-blue-400 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                >
                  Browse All Communities
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunitiesPage;
