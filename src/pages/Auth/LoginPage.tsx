import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Chrome } from "lucide-react";
import bgLogoBoth from "../../../logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { loginWithGoogle, loginWithEmail, user } = useAuth();
  const navigate = useNavigate();

  // ✅ Redirect if user already logged in
  useEffect(() => {
    if (user) navigate("/feed");
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await loginWithEmail(email, password);
      if (result.success) navigate("/feed");
      else setError(result.error || "Invalid email or password");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setIsLoading(true);
    const result = await loginWithGoogle();
    setIsLoading(false);
    if (result.success) navigate("/feed");
    else setError(result.error || "Google login failed");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-blue-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background animation */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 hover:bg-white/15 transition-all duration-500">
          <div className="absolute left-1/2 top-4 transform -translate-x-1/2 z-50 bg-black w-20 h-20 flex items-center justify-center rounded-full border border-white/20">
            <Link to={"/"}>
              <img src={bgLogoBoth} alt="Logo" className="h-14 w-auto object-contain" />
            </Link>
          </div>

          <div className="text-center mb-8 mt-20">
            <h1 className="text-3xl font-bold text-white mb-2">Login to Hackbase</h1>
            <p className="text-gray-300 text-sm">Sign in to continue your journey</p>
          </div>

          {error && <div className="mb-4 text-red-400 text-sm text-center p-2 bg-red-900/30 rounded-lg">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors duration-200" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full bg-white/5 border border-white/20 rounded-xl py-3 pl-12 pr-12 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                required
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors duration-200" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-white/5 border border-white/20 rounded-xl py-3 pl-12 pr-12 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center">
                {showPassword ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-blue-400" /> : <Eye className="h-5 w-5 text-gray-400 hover:text-blue-400" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-3 px-4 rounded-xl flex items-center justify-center space-x-2"
            >
              {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <>
                <span>Sign In</span> <ArrowRight className="w-4 h-4" />
              </>}
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-white/20"></div>
            <span className="px-4 text-gray-400 text-sm">or</span>
            <div className="flex-1 border-t border-white/20"></div>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-xl border border-white/20 flex items-center justify-center space-x-3"
          >
            <Chrome className="w-5 h-5" />
            <span>Continue with Google</span>
          </button>

          <p className="text-center text-gray-300 text-sm mt-6">
            Don't have an account? <Link to="/signup" className="text-blue-400 hover:text-blue-300">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
