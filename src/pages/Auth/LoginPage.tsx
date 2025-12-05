import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Chrome } from "lucide-react";
import bgLogoBoth from "../../../logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import sideImg from "../../assets/images_hack_agra_chapter_1/image6.jpg"; 

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { loginWithGoogle, loginWithEmail, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/feed");
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await loginWithEmail(email, password);
    setIsLoading(false);

    if (result.success) navigate("/feed");
    else setError(result.error || "Invalid credentials");
  };

  const handleGoogle = async () => {
    setIsLoading(true);
    const result = await loginWithGoogle();
    setIsLoading(false);

    if (result.success) navigate("/feed");
    else setError(result.error || "Google login failed");
  };

  return (
    <div className="min-h-screen w-full bg-black text-white flex">

      {/* LEFT SIDE */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-8 md:px-16 lg:px-24">
        <div className="w-full max-w-md">

          {/* Logo */}
          <Link to="/" className="flex justify-center mb-10">
            <img src={bgLogoBoth} className="h-14 opacity-90" />
          </Link>

          <h1 className="text-4xl font-semibold text-center text-green-400">
            Welcome Back
          </h1>
          <p className="text-green-200/50 text-center mt-2">
            Login to continue your journey
          </p>

          {/* Error */}
          {error && (
            <div className="mt-4 p-3 text-sm bg-green-900/20 text-green-400 border border-green-700/30 rounded-lg text-center">
              <h1>Something went wrong. Try again.</h1>
            </div>
          )}

          {/* Form */}
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500/60" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full bg-[#0f0f0f] border border-green-900/40 rounded-xl py-3 pl-12 pr-4 text-white focus:border-green-500 outline-none"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500/60" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-[#0f0f0f] border border-green-900/40 rounded-xl py-3 pl-12 pr-12 text-white focus:border-green-500 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500/60 hover:text-green-300"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-700/30 hover:bg-green-700/40 border border-green-700/40 text-green-300 py-3 rounded-xl transition-all flex justify-center backdrop-blur-sm"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-green-600/20 border-t-green-400 rounded-full animate-spin"></div>
              ) : (
                <div className="flex items-center gap-2">
                  Sign In <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-green-700/20"></div>
            <span className="text-xs text-green-500/50">OR</span>
            <div className="flex-1 h-px bg-green-700/20"></div>
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogle}
            className="w-full bg-[#0f0f0f] hover:bg-[#151515] border border-green-700/40 py-3 rounded-xl flex items-center justify-center gap-3 transition-all"
          >
            <Chrome className="w-5 h-5 text-green-300" /> 
            <span className="text-green-300">Continue with Google</span>
          </button>

          <p className="text-center text-white-200/60 text-sm mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-green-400 underline-offset-4 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="hidden md:flex w-1/2 relative bg-black">
        <img
          src={sideImg}
          className="w-full h-full object-cover opacity-80"
          alt="Auth Visual"
        />

        <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px] flex flex-col justify-center p-16">
          <h2 className="text-4xl font-bold mb-4">
            Empowering Tier-2 & Tier-3 Innovators
          </h2>

          <p className=" text-lg max-w-md leading-relaxed">
            HackBase is on a mission to unlock hidden talent across India.
            Students with great potential — now finally getting the right
            exposure, ecosystem, and opportunity to grow.
          </p>
        </div>
      </div>
    </div>
  );
}
