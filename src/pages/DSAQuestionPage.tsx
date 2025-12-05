import React, { useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";

import Editor from "@monaco-editor/react";

import { GoogleGenAI } from "@google/genai";

import { db, auth } from "../config/firebase";

import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

interface Example {
  input: string;

  output: string;
}

interface Question {
  id: number;

  title: string;

  description: string;

  constraints: string;

  inputFormat: string;

  outputFormat: string;

  examples: Example[];

  templateCode?: string;

  topic?: string;
}

const languages = [
  { name: "C++ (17)", id: 52, monaco: "cpp", icon: "⚡" },

  { name: "Python 3", id: 71, monaco: "python", icon: "🐍" },

  { name: "Java", id: 62, monaco: "java", icon: "☕" },

  { name: "JavaScript", id: 63, monaco: "javascript", icon: "🟨" },

  { name: "Go", id: 60, monaco: "go", icon: "🔵" },
];

const languagePatterns: Record<string, RegExp> = {
  cpp: /#include|int main|std::/i,

  python: /def |import |print\(/i,

  java: /public class|System\.out\.println/i,

  javascript: /console\.log|function |let |const /i,

  go: /package |func |import /i,
};

const difficultyColors = {
  1: {
    bg: "bg-emerald-500/20",

    text: "text-emerald-400",

    border: "border-emerald-500/50",

    label: "Beginner",
  },

  2: {
    bg: "bg-blue-500/20",

    text: "text-blue-400",

    border: "border-blue-500/50",

    label: "Intermediate",
  },

  3: {
    bg: "bg-orange-500/20",

    text: "text-orange-400",

    border: "border-orange-500/50",

    label: "Advanced",
  },

  4: {
    bg: "bg-purple-500/20",

    text: "text-purple-400",

    border: "border-purple-500/50",

    label: "Expert",
  },
};

export default function DSAQuestionPage() {
  const { id, level } = useParams<{ id: string; level: string }>();

  const navigate = useNavigate();

  const [question, setQuestion] = useState<Question | null>(null);

  const [code, setCode] = useState("// Write your code here");

  const [language, setLanguage] = useState(languages[0]);

  const [feedback, setFeedback] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  const [accuracy, setAccuracy] = useState<number>(0);

  const [languageHint, setLanguageHint] = useState<string>("");

  const [userSubmission, setUserSubmission] = useState<any>(null);

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  const currentUser = auth.currentUser;

  const numericLevel = Number(level);

  const collectionName =
    numericLevel === 4 ? "dsaQuestions" : "hackbasedsaquestions";

  const difficulty =
    difficultyColors[numericLevel as keyof typeof difficultyColors] ||
    difficultyColors[1];

  // Fetch question and user submission

  useEffect(() => {
    if (!id || !level || !currentUser) return;

    const fetchQuestion = async () => {
      try {
        // Fetch question

        const qSnap = await getDocs(
          query(collection(db, collectionName), orderBy("id", "asc"))
        );

        const questions: Question[] = qSnap.docs.map(
          (doc) => doc.data() as Question
        );

        const q = questions.find((q) => q.id === Number(id));

        setQuestion(q || null);

        if (q?.templateCode) setCode(q.templateCode);

        // Fetch user submission

        const userRef = doc(db, "users", currentUser.uid);

        const userSnap = await getDoc(userRef);

        const submissions = userSnap.data()?.submissions || {};

        const saved = submissions[collectionName]?.[id];

        if (saved) {
          setCode(saved.code);

          setIsCorrect(saved.accuracy === 100);

          setAccuracy(saved.accuracy || 0);

          setUserSubmission(saved);

          setIsSubmitted(saved.accuracy === 100);
        }
      } catch (err) {
        console.error("Error fetching question or submission:", err);
      }
    };

    fetchQuestion();
  }, [id, level, currentUser]);

  // Language detection

  useEffect(() => {
    if (!code || code === "// Write your code here") return;

    const pattern = languagePatterns[language.monaco];

    const isMatching = pattern.test(code);

    if (!isMatching) {
      setLanguageHint(
        `Code might not match selected language (${language.name})`
      );
    } else {
      setLanguageHint("");
    }
  }, [code, language]);

  // Run code via Gemini AI

  const runWithGemini = async () => {
    if (!question) return;

    setLoading(true);

    setFeedback("");

    const prompt = `

Problem: ${question.title}

Description: ${question.description}

Constraints: ${question.constraints}

Input Format: ${question.inputFormat}

Output Format: ${question.outputFormat}

Examples: ${question.examples

      .map((e) => `Input: ${e.input}\nOutput: ${e.output}`)

      .join("\n\n")}



User's Code (${language.name}):

${code}



Task: Check if the code is correct and provide accuracy (0-100).

Respond ONLY with JSON: {"correct": true/false, "accuracy": 85, "hint": "short hint if incorrect"}

`;

    try {
      const ai = new GoogleGenAI({
        apiKey: import.meta.env.VITE_GEMINI_API_KEY,
      });

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",

        contents: prompt,
      });

      // Clean Gemini response

      let rawText =
        response.text ||
        '{"correct": false, "accuracy":0,"hint":"No response"}';

      rawText = rawText

        .replace(/```json/g, "")

        .replace(/```/g, "")

        .trim();

      const data = JSON.parse(rawText);

      setAccuracy(data.accuracy);

      if (data.correct) {
        setFeedback(
          `🎉 Excellent work! Your solution is correct and efficient.`
        );

        setIsCorrect(true);
      } else {
        setFeedback(
          `💡 ${data.hint}\n\nKeep refining your approach - you're on the right track!`
        );

        setIsCorrect(false);
      }

      // Save submission in Firebase

      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);

        const userSnap = await getDoc(userRef);

        const userData = userSnap.data() || {};

        const submissions = userData.submissions || {};

        if (!submissions[collectionName]) submissions[collectionName] = {};

        submissions[collectionName][id] = {
          code,

          accuracy: data.accuracy,

          timestamp: Date.now(),
        };

        // Update average accuracy

        let total = 0,
          count = 0;

        Object.values(submissions).forEach((col: any) => {
          Object.values(col).forEach((q: any) => {
            total += q.accuracy;

            count++;
          });
        });

        const avgAccuracy = count ? total / count : 0;

        await setDoc(
          userRef,

          { submissions, averageAccuracy: avgAccuracy },

          { merge: true }
        );

        setUserSubmission(submissions[collectionName][id]);
      }
    } catch (err) {
      console.error(err);

      setFeedback(
        "❌ Error occurred while analyzing your code. Please try again."
      );

      setIsCorrect(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitted(true);

    // Add animation delay for better UX

    setTimeout(() => {
      alert(
        "🎉 Congratulations! Your solution has been submitted successfully!"
      );
    }, 500);
  };

  if (!question) {
    return (
      <div className="h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-gray-300 text-lg">Loading question...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white flex flex-col">
      {/* Header */}

      <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              title="Go back"
            >
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>

            <div>
              <h1 className="text-xl font-bold text-white">Problem #{id}</h1>

              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${difficulty.bg} ${difficulty.text} ${difficulty.border} border`}
                >
                  {difficulty.label}
                </span>

                {question.topic && (
                  <span className="px-2 py-1 text-xs font-medium bg-gray-700/50 text-gray-300 rounded-full border border-gray-600">
                    {question.topic}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {userSubmission && (
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    accuracy === 100 ? "bg-emerald-400" : "bg-orange-400"
                  }`}
                ></div>

                <span className="text-sm font-medium">
                  Accuracy: {accuracy}%
                </span>
              </div>
            )}

            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors md:hidden"
            >
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}

      <div className="flex-1 flex overflow-hidden">
        {/* Problem Description Sidebar */}

        <div
          className={`${
            sidebarCollapsed ? "hidden" : "block"
          } w-full md:w-2/5 lg:w-1/2 bg-gray-900/30 backdrop-blur-sm border-r border-gray-700/50 overflow-hidden flex flex-col`}
        >
          <div className="p-6 overflow-y-auto flex-1 ">
            <div className="space-y-6">
              {/* Title */}

              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {question.title}
                </h2>

                <p className="text-gray-300 leading-relaxed">
                  {question.description}
                </p>
              </div>

              {/* Problem Details */}

              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5  border border-gray-700/50">
                <h3 className="font-semibold text-emerald-400 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                  Problem Details
                </h3>

                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-300">
                      Constraints:
                    </span>

                    <p className="text-gray-400 mt-1">{question.constraints}</p>
                  </div>

                  <div>
                    <span className="font-medium text-gray-300">
                      Input Format:
                    </span>

                    <p className="text-gray-400 mt-1">{question.inputFormat}</p>
                  </div>

                  <div>
                    <span className="font-medium text-gray-300">
                      Output Format:
                    </span>

                    <p className="text-gray-400 mt-1">
                      {question.outputFormat}
                    </p>
                  </div>
                </div>
              </div>

              {/* Examples */}

              <div>
                <h3 className="font-semibold text-blue-400 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  Examples
                </h3>

                <div className="space-y-4">
                  {question.examples.map((ex, i) => (
                    <div
                      key={i}
                      className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50"
                    >
                      <div className="mb-3">
                        <p className="font-medium text-gray-300 mb-2">Input:</p>

                        <pre className="bg-black/30 p-3 rounded-lg text-sm text-green-300 overflow-x-auto font-mono">
                          {ex.input}
                        </pre>
                      </div>

                      <div>
                        <p className="font-medium text-gray-300 mb-2">
                          Output:
                        </p>

                        <pre className="bg-black/30 p-3 rounded-lg text-sm text-blue-300 overflow-x-auto font-mono">
                          {ex.output}
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Code Editor Section */}

        <div
          className={`${
            sidebarCollapsed ? "w-full" : "w-full md:w-3/5 lg:w-1/2"
          } flex flex-col`}
        >
          {/* Editor Header */}

          <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-300">
                  Language:
                </span>

                <select
                  value={language.id}
                  onChange={(e) => {
                    const lang = languages.find(
                      (l) => l.id === Number(e.target.value)
                    );

                    if (lang) setLanguage(lang);
                  }}
                  className="bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  {languages.map((lang) => (
                    <option key={lang.id} value={lang.id}>
                      {lang.icon} {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              {languageHint && (
                <div className="flex items-center gap-2 text-yellow-400 text-sm">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>

                  <span>{languageHint}</span>
                </div>
              )}
            </div>
          </div>

          {/* Code Editor */}

          <div className="flex-1 relative">
            <Editor
              height="90%"
              language={language.monaco}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                minimap: { enabled: false },

                fontSize: 14,

                lineNumbers: "on",

                roundedSelection: false,

                scrollBeyondLastLine: false,

                automaticLayout: true,

                tabSize: 2,

                wordWrap: "on",

                padding: { top: 16, bottom: 16 },
              }}
            />
          </div>

          {/* Results & Actions Section */}

          <div className="bg-gray-900/50 backdrop-blur-sm border-t border-gray-700/50 p-6 max-h-80 overflow-y-auto">
            {/* Action Buttons */}

            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={runWithGemini}
                disabled={loading}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  loading
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg hover:shadow-emerald-500/25 hover:scale-105"
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    Run Code
                  </>
                )}
              </button>

              {accuracy === 100 && !isSubmitted && (
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium rounded-xl shadow-lg hover:shadow-blue-500/25 hover:scale-105 transition-all duration-200"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Submit Solution
                </button>
              )}

              {isSubmitted && (
                <div className="flex items-center gap-2 px-6 py-3 bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 rounded-xl font-medium">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Submitted
                </div>
              )}
            </div>

            {/* Feedback Section */}

            {feedback && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isCorrect
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-orange-500/20 text-orange-400"
                    }`}
                  >
                    {isCorrect ? "✓" : "💡"}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-medium text-white mb-2">
                      {isCorrect ? "Perfect Solution!" : "AI Feedback"}
                    </h3>

                    <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                      {feedback}
                    </div>

                    {accuracy > 0 && (
                      <div className="mt-3 flex items-center gap-2">
                        <div className="bg-gray-700/50 rounded-full h-2 flex-1">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              accuracy === 100
                                ? "bg-emerald-400"
                                : accuracy >= 70
                                ? "bg-orange-400"
                                : "bg-red-400"
                            }`}
                            style={{ width: `${accuracy}%` }}
                          ></div>
                        </div>

                        <span className="text-sm font-medium text-gray-300">
                          {accuracy}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
