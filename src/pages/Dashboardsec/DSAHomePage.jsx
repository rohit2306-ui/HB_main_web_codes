import React, { useState } from "react";
import {
  Code,
  CheckCircle,
  Circle,
  Star,
  TrendingUp,
  Calendar,
  Target,
  Filter,
  Search,
  Crown,
  Flame,
  Award,
  Clock,
} from "lucide-react";

const DSAHomepage = () => {
  const [activeTab, setActiveTab] = useState("beginner");
  const [searchQuery, setSearchQuery] = useState("");

  // Sample questions data
  const questions = {
    beginner: [
      {
        id: 1,
        title: "Two Sum",
        difficulty: "Easy",
        solved: true,
        topics: ["Array", "Hash Table"],
        timeComplexity: "O(n)",
      },
      {
        id: 2,
        title: "Palindrome Number",
        difficulty: "Easy",
        solved: true,
        topics: ["Math"],
        timeComplexity: "O(log n)",
      },
      {
        id: 3,
        title: "Roman to Integer",
        difficulty: "Easy",
        solved: false,
        topics: ["Hash Table", "String"],
        timeComplexity: "O(n)",
      },
      {
        id: 4,
        title: "Valid Parentheses",
        difficulty: "Easy",
        solved: false,
        topics: ["Stack", "String"],
        timeComplexity: "O(n)",
      },
      {
        id: 5,
        title: "Merge Two Sorted Lists",
        difficulty: "Easy",
        solved: true,
        topics: ["Linked List", "Recursion"],
        timeComplexity: "O(n)",
      },
    ],
    medium: [
      {
        id: 6,
        title: "Add Two Numbers",
        difficulty: "Medium",
        solved: true,
        topics: ["Linked List", "Math"],
        timeComplexity: "O(max(m,n))",
      },
      {
        id: 7,
        title: "Longest Substring Without Repeating",
        difficulty: "Medium",
        solved: false,
        topics: ["String", "Sliding Window"],
        timeComplexity: "O(n)",
      },
      {
        id: 8,
        title: "3Sum",
        difficulty: "Medium",
        solved: false,
        topics: ["Array", "Two Pointers"],
        timeComplexity: "O(n²)",
      },
      {
        id: 9,
        title: "Container With Most Water",
        difficulty: "Medium",
        solved: true,
        topics: ["Array", "Two Pointers"],
        timeComplexity: "O(n)",
      },
      {
        id: 10,
        title: "Generate Parentheses",
        difficulty: "Medium",
        solved: false,
        topics: ["String", "Backtracking"],
        timeComplexity: "O(4^n)",
      },
    ],
    advanced: [
      {
        id: 11,
        title: "Median of Two Sorted Arrays",
        difficulty: "Hard",
        solved: false,
        topics: ["Array", "Binary Search"],
        timeComplexity: "O(log(m+n))",
      },
      {
        id: 12,
        title: "Regular Expression Matching",
        difficulty: "Hard",
        solved: false,
        topics: ["String", "Dynamic Programming"],
        timeComplexity: "O(mn)",
      },
      {
        id: 13,
        title: "Merge k Sorted Lists",
        difficulty: "Hard",
        solved: true,
        topics: ["Linked List", "Heap"],
        timeComplexity: "O(n log k)",
      },
      {
        id: 14,
        title: "Trapping Rain Water",
        difficulty: "Hard",
        solved: false,
        topics: ["Array", "Two Pointers"],
        timeComplexity: "O(n)",
      },
      {
        id: 15,
        title: "Largest Rectangle in Histogram",
        difficulty: "Hard",
        solved: false,
        topics: ["Array", "Stack"],
        timeComplexity: "O(n)",
      },
    ],
    premium: [
      {
        id: 16,
        title: "Design Phone Directory",
        difficulty: "Medium",
        solved: false,
        topics: ["Design", "Hash Table"],
        timeComplexity: "O(1)",
        premium: true,
      },
      {
        id: 17,
        title: "Meeting Rooms II",
        difficulty: "Medium",
        solved: true,
        topics: ["Array", "Heap"],
        timeComplexity: "O(n log n)",
        premium: true,
      },
      {
        id: 18,
        title: "Alien Dictionary",
        difficulty: "Hard",
        solved: false,
        topics: ["Graph", "Topological Sort"],
        timeComplexity: "O(C)",
        premium: true,
      },
      {
        id: 19,
        title: "Word Squares",
        difficulty: "Hard",
        solved: false,
        topics: ["Array", "Backtracking"],
        timeComplexity: "O(N × 26^L)",
        premium: true,
      },
    ],
  };

  const analytics = {
    totalSolved: 7,
    totalQuestions: 19,
    easyCompletionRate: 60,
    mediumCompletionRate: 40,
    hardCompletionRate: 20,
    currentStreak: 5,
    bestStreak: 12,
    weeklyGoal: 15,
    weeklyProgress: 7,
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-500";
      case "Medium":
        return "text-yellow-500";
      case "Hard":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getDifficultyBg = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTabIcon = (tab) => {
    switch (tab) {
      case "beginner":
        return <Code className="w-4 h-4" />;
      case "medium":
        return <Target className="w-4 h-4" />;
      case "advanced":
        return <Flame className="w-4 h-4" />;
      case "premium":
        return <Crown className="w-4 h-4" />;
      default:
        return <Code className="w-4 h-4" />;
    }
  };

  const filteredQuestions =
    questions[activeTab]?.filter(
      (q) =>
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.topics.some((topic) =>
          topic.toLowerCase().includes(searchQuery.toLowerCase())
        )
    ) || [];

  return (
    <div className="min-h-screen dark:from-slate-900 dark:to-slate-800 from-slate-100 to-slate-200 ">
      <div className="max-w-7xl mx-auto  ">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-20">
          {/* Analytics Section */}
          <div className="lg:col-span-1 space-y-6 ">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                Progress Analytics
              </h2>

              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700">
                      Questions Solved
                    </span>
                    <span className="text-2xl font-bold text-blue-800">
                      {analytics.totalSolved}/{analytics.totalQuestions}
                    </span>
                  </div>
                  <div className="mt-2 bg-blue-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 rounded-full h-2 transition-all duration-300"
                      style={{
                        width: `${
                          (analytics.totalSolved / analytics.totalQuestions) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm text-green-700">Easy</span>
                    <span className="text-sm font-semibold text-green-800">
                      {analytics.easyCompletionRate}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                    <span className="text-sm text-yellow-700">Medium</span>
                    <span className="text-sm font-semibold text-yellow-800">
                      {analytics.mediumCompletionRate}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span className="text-sm text-red-700">Hard</span>
                    <span className="text-sm font-semibold text-red-800">
                      {analytics.hardCompletionRate}%
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Weekly Goal
                    </span>
                    <span className="text-sm font-semibold">
                      {analytics.weeklyProgress}/{analytics.weeklyGoal}
                    </span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 rounded-full h-2 transition-all duration-300"
                      style={{
                        width: `${
                          (analytics.weeklyProgress / analytics.weeklyGoal) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <span className="text-sm text-orange-700 flex items-center">
                    <Award className="w-4 h-4 mr-1" />
                    Best Streak
                  </span>
                  <span className="text-sm font-semibold text-orange-800">
                    {analytics.bestStreak} days
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 ">
            <div className="bg-white rounded-lg shadow-sm">
              {/* Search Bar */}
              <div className="p-6 border-b">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search problems by title or topic..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Category Tabs */}
              <div className="border-b">
                <nav className="flex space-x-8 px-6">
                  {["beginner", "medium", "advanced", "premium"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-2 border-b-2 font-medium text-sm capitalize flex items-center space-x-2 transition-colors ${
                        activeTab === tab
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      {getTabIcon(tab)}
                      <span>{tab}</span>
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                        {questions[tab]?.length || 0}
                      </span>
                      {tab === "premium" && (
                        <Crown className="w-3 h-3 text-yellow-500" />
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Questions List */}
              <div className="divide-y divide-gray-200">
                {filteredQuestions.map((question, index) => (
                  <div
                    key={question.id}
                    className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="flex-shrink-0 mt-1">
                          {question.solved ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-400" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors">
                              {question.title}
                            </h3>
                            {question.premium && (
                              <Crown className="w-4 h-4 text-yellow-500" />
                            )}
                          </div>

                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyBg(
                                question.difficulty
                              )}`}
                            >
                              {question.difficulty}
                            </span>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{question.timeComplexity}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mt-2">
                            {question.topics.map((topic) => (
                              <span
                                key={topic}
                                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex-shrink-0 ml-4">
                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                          <Star className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredQuestions.length === 0 && (
                  <div className="p-12 text-center text-gray-500">
                    <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-400 mb-2">
                      No problems found
                    </h3>
                    <p className="text-sm">
                      Try adjusting your search criteria or browse different
                      categories.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DSAHomepage;
