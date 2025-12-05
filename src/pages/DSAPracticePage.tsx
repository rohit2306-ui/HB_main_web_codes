import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db, auth } from "../config/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

interface Question {
  id: number;
  title: string;
}

interface LevelCard {
  level: number;
  title: string;
  description: string;
  color: string;
  icon: string;
}

export default function DSALevelPage() {
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [levels, setLevels] = useState<LevelCard[]>([]);
  const [beginnerQuestions, setBeginnerQuestions] = useState<Question[]>([]);
  const [expertQuestions, setExpertQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  const [userSubmissions, setUserSubmissions] = useState<any>({});
  const [userTotalAccuracy, setUserTotalAccuracy] = useState<number>(0);
  const [userRank, setUserRank] = useState<number>(0);

  useEffect(() => {
    setLevels([
      {
        level: 1,
        title: "Beginner",
        description: "Master the fundamentals with easy problems",
        color: "from-emerald-500 to-teal-600",
        icon: "🌱",
      },
      {
        level: 2,
        title: "Intermediate",
        description: "Build confidence with medium-level challenges",
        color: "from-blue-500 to-indigo-600",
        icon: "🚀",
      },
      {
        level: 3,
        title: "Advanced",
        description: "Tackle complex algorithmic problems",
        color: "from-orange-500 to-red-600",
        icon: "⚡",
      },
      {
        level: 4,
        title: "Expert Premium",
        description: "Elite challenges for top performers",
        color: "from-purple-500 to-pink-600",
        icon: "👑",
      },
    ]);
  }, []);

  useEffect(() => {
    const fetchQuestionsAndUser = async () => {
      setLoading(true);
      try {
        // Beginner Questions
        const beginnerSnap = await getDocs(
          query(collection(db, "hackbasedsaquestions"), orderBy("id", "asc"))
        );
        setBeginnerQuestions(
          beginnerSnap.docs.map((doc) => doc.data() as Question)
        );

        // Expert Questions
        const expertSnap = await getDocs(
          query(collection(db, "dsaQuestions"), orderBy("id", "asc"))
        );
        setExpertQuestions(
          expertSnap.docs.map((doc) => doc.data() as Question)
        );

        // User data
        if (auth.currentUser) {
          const userRef = doc(db, "users", auth.currentUser.uid);
          const userSnap = await getDoc(userRef);
          const userData = userSnap.data();
          setUserSubmissions(userData?.submissions || {});
          setUserTotalAccuracy(userData?.totalAccuracy || 0);
          setUserRank(userData?.rank || 0);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestionsAndUser();
  }, []);

  const filteredQuestions = (): Question[] => {
    if (selectedLevel === 4) return expertQuestions;
    switch (selectedLevel) {
      case 1:
        return beginnerQuestions.slice(0, 60);
      case 2:
        return beginnerQuestions.slice(60, 90);
      case 3:
        return beginnerQuestions.slice(90, 120);
      default:
        return [];
    }
  };

  const getActivityData = () => {
    const allSubmissions: any[] = [];
    Object.values(userSubmissions).forEach((col: any) => {
      Object.values(col).forEach((q: any) => allSubmissions.push(q));
    });

    const map: Record<string, number> = {};
    allSubmissions.forEach((s) => {
      const date = new Date(s.timestamp).toLocaleDateString();
      map[date] = (map[date] || 0) + 1;
    });

    return Object.entries(map)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .slice(-7) // Show last 7 days
      .map(([date, solved]) => ({
        date: new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        solved,
      }));
  };

  const getTotalSolved = () => {
    let total = 0;
    Object.values(userSubmissions).forEach((col: any) => {
      total += Object.keys(col).length;
    });
    return total;
  };

  const getAccuracyPercentage = () => {
    return Math.round(userTotalAccuracy * 100) || 0;
  };

  const getSolvedInLevel = (level: number) => {
    const questions = filteredQuestions();
    const collectionName =
      level === 4 ? "dsaQuestions" : "hackbasedsaquestions";
    return questions.filter((q) => userSubmissions[collectionName]?.[q.id])
      .length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Loading your DSA journey...</p>
        </div>
      </div>
    );
  }

  return (
<div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white dark:from-gray-50 dark:via-gray-100 dark:to-gray-50 dark:text-gray-900">
      {/* Header Section */}
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4 dark:from-blue-600 dark:via-purple-700 dark:to-pink-700">
              DSA Learning Path
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto dark:text-gray-600">
              Master Data Structures & Algorithms with our structured learning
              approach
            </p>
          </div>

          {/* Stats Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {/* Total Solved */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-emerald-500/50 transition-all duration-300 group dark:from-gray-100/50 dark:to-gray-200/50 dark:border-gray-300/50 dark:hover:border-emerald-500/50">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                  <span className="text-2xl">✅</span>
                </div>
                <span className="text-3xl font-bold text-emerald-400 dark:text-emerald-600">
                  {getTotalSolved()}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider dark:text-gray-600">
                Problems Solved
              </h3>
            </div>

            {/* Accuracy */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 group dark:from-gray-100/50 dark:to-gray-200/50 dark:border-gray-300/50 dark:hover:border-blue-500/50">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                  <span className="text-2xl">🎯</span>
                </div>
                <span className="text-3xl font-bold text-blue-400 dark:text-blue-600">
                  {getAccuracyPercentage()}%
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider dark:text-gray-600">
                Accuracy Rate
              </h3>
            </div>

            {/* Rank */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-yellow-500/50 transition-all duration-300 group dark:from-gray-100/50 dark:to-gray-200/50 dark:border-gray-300/50 dark:hover:border-yellow-500/50">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center group-hover:bg-yellow-500/30 transition-colors">
                  <span className="text-2xl">🏆</span>
                </div>
                <span className="text-3xl font-bold text-yellow-400 dark:text-yellow-600">
                  #{userRank}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider dark:text-gray-600">
                Global Rank
              </h3>
            </div>

            {/* Activity Chart */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 dark:from-gray-100/50 dark:to-gray-200/50 dark:border-gray-300/50 dark:hover:border-purple-500/50">
              <div className="mb-3">
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4 dark:text-gray-600">
                  7-Day Activity
                </h3>
                <ResponsiveContainer width="100%" height={80}>
                  <AreaChart data={getActivityData()}>
                    <defs>
                      <linearGradient
                        id="activityGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#8b5cf6"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#8b5cf6"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="solved"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      fill="url(#activityGradient)"
                    />
                    <XAxis dataKey="date" hide />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        fontSize: "14px",
                      }}
                      className="dark:bg-gray-700 dark:border-gray-500 dark:text-gray-200"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Levels Sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-4">
              <h2 className="text-2xl font-bold mb-6 text-gray-200 dark:text-gray-800">
                Choose Your Level
              </h2>
              {levels.map((level) => {
                const solvedCount = getSolvedInLevel(level.level);
                const totalCount =
                  level.level === selectedLevel
                    ? filteredQuestions().length
                    : 0;

                return (
                  <div
                    key={level.level}
                    onClick={() => setSelectedLevel(level.level)}
                    className={`cursor-pointer group relative overflow-hidden rounded-2xl p-6 border transition-all duration-300 ${
                      selectedLevel === level.level
                        ? "border-white/30 bg-gradient-to-r " +
                          level.color +
                          " shadow-2xl scale-105 dark:border-gray-300 dark:from-white/30 dark:to-gray-200/30"
                        : "border-gray-700/50 bg-gray-800/20 hover:border-gray-600/50 hover:bg-gray-800/40 dark:border-gray-300/50 dark:bg-gray-100/20 dark:hover:border-gray-400/50 dark:hover:bg-gray-100/40"
                    }`}
                  >
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-3xl">{level.icon}</span>
                        {selectedLevel === level.level && (
                          <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium dark:bg-gray-300/50 dark:text-gray-800">
                            Active
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold mb-2 dark:text-gray-900">
                        {level.title}
                      </h3>
                      <p className="text-sm opacity-90 mb-4 dark:text-gray-700">
                        {level.description}
                      </p>
                      {selectedLevel === level.level && totalCount > 0 && (
                        <div className="flex items-center justify-between text-sm dark:text-gray-800">
                          <span>Progress</span>
                          <span className="font-semibold">
                            {solvedCount}/{totalCount}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Questions List */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden dark:from-gray-100/30 dark:to-gray-200/30 dark:border-gray-300/50">
              <div className="p-6 border-b border-gray-700/50 dark:border-gray-300/50">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold dark:text-gray-900">
                    {levels.find((l) => l.level === selectedLevel)?.title}{" "}
                    Problems
                  </h2>
                  <span className="bg-gray-700/50 px-4 py-2 rounded-full text-sm font-medium dark:bg-gray-300/50 dark:text-gray-800">
                    {filteredQuestions().length} problems
                  </span>
                </div>
              </div>

              <div className="max-h-[600px] overflow-y-auto">
                <div className="p-6 space-y-3">
                  {filteredQuestions().map((q, index) => {
                    const collectionName =
                      selectedLevel === 4
                        ? "dsaQuestions"
                        : "hackbasedsaquestions";
                    const solved = userSubmissions[collectionName]?.[q.id]
                      ? true
                      : false;

                    return (
                      <Link
                        key={q.id}
                        to={`/dsa/${selectedLevel}/${q.id}`}
                        className="group block"
                      >
                        <div
                          className={`p-4 rounded-xl border transition-all duration-200 ${
                            solved
                              ? "border-emerald-500/50 bg-emerald-500/5 hover:bg-emerald-500/10 dark:border-emerald-600/50 dark:bg-emerald-100/50 dark:hover:bg-emerald-100/70"
                              : "border-gray-700/50 bg-gray-800/20 hover:border-gray-600/50 hover:bg-gray-800/40 dark:border-gray-300/50 dark:bg-gray-100/20 dark:hover:border-gray-400/50 dark:hover:bg-gray-100/40"
                          } group-hover:scale-[1.02] group-hover:shadow-lg`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                                  solved
                                    ? "bg-emerald-500 text-white dark:bg-emerald-600"
                                    : "bg-gray-700 text-gray-300 dark:bg-gray-300 dark:text-gray-800"
                                }`}
                              >
                                {solved ? "✓" : q.id}
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-200 group-hover:text-white transition-colors dark:text-gray-800 dark:group-hover:text-gray-950">
                                  {q.title}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-600">
                                  Problem #{q.id}
                                </p>
                              </div>
                            </div>
                            {solved && (
                              <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm font-medium dark:bg-emerald-600/20 dark:text-emerald-600">
                                Solved
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
