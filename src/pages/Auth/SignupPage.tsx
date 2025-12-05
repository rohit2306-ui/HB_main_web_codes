// Updated SignUpPage — Dark Green Premium Theme
import React, { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  UserRound,
  Chrome,
} from "lucide-react";
import bgLogoBoth from "../../../logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import bgimage from "../../assets/images_hack_agra_chapter_1/mainbg2.jpg";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signup, loginWithGoogle, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/feed");
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError(null);
    setIsLoading(true);
    const result = await signup(form);
    setIsLoading(false);

    if (result.success) navigate("/feed");
    else setError(result.error || "Signup failed");
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    const result = await loginWithGoogle();
    setIsLoading(false);

    if (result.success) navigate("/feed");
    else setError(result.error || "Google signup failed");
  };

  return (
    <div className="min-h-screen w-full bg-black flex flex-col lg:flex-row relative">
      {/* MOBILE BG + LOGO */}
      <div className="lg:hidden absolute inset-0 w-full h-full overflow-hidden">
        <img src={bgimage} className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-black/70"></div>
      </div>

      {/* MOBILE LOGO */}
      <div className="lg:hidden w-full flex justify-center pt-10 relative z-10">
        <img src={bgLogoBoth} className="h-20 drop-shadow-2xl" />
      </div>

      {/* LEFT SIDE — DESKTOP IMAGE */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center">
        <img
          src={bgimage}
          alt="Hackbase"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black/70 to-green-900/40"></div>

        <div className="relative p-12 text-white max-w-xl">
          <img
            src={bgLogoBoth}
            className="h-20 mb-8 drop-shadow-2xl"
            alt="Hackbase Logo"
          />
          <h1 className="text-5xl font-extrabold leading-tight">
            Join the next wave of  
            <span className="text-green-400"> innovators.</span>
          </h1>

          <p className="text-green-200/80 mt-4 text-lg leading-relaxed">
            Build projects, join hackathons, learn AI & startups — Hackbase gives
            you everything to grow fast.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE — SIGN UP FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
        <div className="bg-green-900/10 backdrop-blur-xl border border-green-700/30 p-10 rounded-3xl shadow-2xl w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-green-400 mb-2">
              Create Your Account
            </h1>
            <p className="text-green-200/60 text-sm">Start your Hackbase journey</p>
          </div>

          {error && (
            <div className="mb-4 text-green-300 text-sm text-center p-2 bg-green-900/20 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="relative">
              <UserRound className="absolute left-4 top-3.5 text-green-400/60" />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full name"
                required
                className="w-full bg-black/40 border border-green-700/30 rounded-xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-green-400/60" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email address"
                required
                className="w-full bg-black/40 border border-green-700/30 rounded-xl py-3 pl-12 pr-4 text-white  focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-green-400/60" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className="w-full bg-black/40 border border-green-700/30 rounded-xl py-3 pl-12 pr-12 text-white focus:ring-2 focus:ring-green-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-green-400/60 hover:text-green-300"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-green-400/60" />
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                required
                className="w-full bg-black/40 border border-green-700/30 rounded-xl py-3 pl-12 pr-4 text-white  focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-700/40 hover:bg-green-700/60 text-green-300 py-3 rounded-xl flex items-center justify-center gap-2 border border-green-700/40"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-green-400/20 border-t-green-400 rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-green-700/20"></div>
            <span className="px-4 text-green-300/60 text-sm">or</span>
            <div className="flex-1 border-t border-green-700/20"></div>
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogleSignup}
            disabled={isLoading}
            className="w-full bg-black/30 hover:bg-black/40 text-green-300 py-3 rounded-xl border border-green-700/30 flex items-center justify-center gap-3"
          >
            <Chrome className="w-5 h-5 text-green-400" />
            <span>Continue with Google</span>
          </button>

          {/* Bottom Link */}
          <p className="text-center text-white text-sm mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-green-400 hover:text-green-300">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
