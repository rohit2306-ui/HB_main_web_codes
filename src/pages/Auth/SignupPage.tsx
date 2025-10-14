import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Github,
  Chrome,
  Apple,
  UserRound,
  BookUser,
} from "lucide-react";
import bgLogoBoth from "../../../logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
export default function SignUpPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const {
    login,
    loading,
    user,
    loginWithGoogle,
    authError,
    signup,
    handlePasswordReset,
  } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  // const onSubmit = async (data) => {
  //   setIsLoading(true);
  //   console.log(data);
  //   // Simulate loading
  //   const success = await login(data.email, data.password);
  //   if (success) {
  //     console.log("Login successful");
  //     navigate("/feed"); // ab redirect kaam karega
  //   } else {
  //     errors.email = true;
  //     errors.password = true;
  //     alert("Login failed. Please check your credentials and try again.");
  //     // Handle login error (e.g., show error message)
  //   }
  //   setIsLoading(false);
  // };
  const onSubmit = async (formData) => {
    // e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await signup(formData); // signup se result milega
      setIsLoading(false);

      if (result.success) {
        // Signup ke baad direct /feed
        navigate("/feed");
      } else {
        setError(result.error || "Signup failed");
      }
    } catch (err) {
      setIsLoading(false);
      setError(err);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-blue-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      {/*Logo of the Company */}
      <div className="absolute left-0 top-0 m-4  text-white font-bold text-2xl z-50">
        <Link to={"/"} className="w-auto h-auto">
          <div className="w-auto h-auto p-1 flex">
            <img
              src={bgLogoBoth}
              alt="Company Logo"
              className="h-12 w-auto object-center"
            />
            <h1 className="text-green-500 font-bold text-xl justify-center flex items-end ">
              ack
            </h1>
            <h1 className="text-white font-bold text-xl flex items-end">
              base
            </h1>
          </div>
        </Link>
      </div>

      {/* Glass morphism container */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 hover:bg-white/15 transition-all duration-500">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Hello Dreamer !!
            </h1>
            <p className="text-gray-300 text-sm">
              Sign in to continue your journey
            </p>
          </div>
          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors duration-200" />
              </div>
              <input
                type="email"
                {...register("email", { required: true })}
                placeholder="Email address"
                className={`w-full ${
                  errors.email
                    ? "ring-red-400 border-red-400"
                    : "focus:ring-blue-500"
                } bg-white/5 border border-white/20 rounded-xl py-3 pl-12 pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2  focus:border-transparent transition-all duration-300 hover:bg-white/10`}
                required
              />
            </div>
            {errors.email && (
              <span className="text-red-400 text-xs inline">
                This field is required
              </span>
            )}
            {/* Name Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <UserRound className="h-5 w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors duration-200" />
              </div>
              <input
                type="text"
                {...register("name", { required: true })}
                placeholder="name"
                className={`w-full ${
                  errors.name
                    ? "ring-red-400 border-red-400"
                    : "focus:ring-blue-500"
                } bg-white/5 border border-white/20 rounded-xl py-3 pl-12 pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2  focus:border-transparent transition-all duration-300 hover:bg-white/10`}
                required
              />
            </div>
            {errors.name && (
              <span className="text-red-400 text-xs inline">
                This field is required
              </span>
            )}
            {/* Username Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <BookUser className="h-5 w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors duration-200" />
              </div>
              <input
                type="text"
                {...register("username", { required: true })}
                placeholder="Username"
                className={`w-full ${
                  errors.username
                    ? "ring-red-400 border-red-400"
                    : "focus:ring-blue-500"
                } bg-white/5 border border-white/20 rounded-xl py-3 pl-12 pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2  focus:border-transparent transition-all duration-300 hover:bg-white/10`}
                required
              />
            </div>
            {errors.username && (
              <span className="text-red-400 text-xs inline">
                This field is required
              </span>
            )}

            {/* Password Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors duration-200" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: true,
                  pattern:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
                })}
                placeholder="Password"
                className={`w-full ${
                  errors.password
                    ? "ring-red-400 border-red-400"
                    : "focus:ring-blue-500"
                } bg-white/5 border border-white/20 rounded-xl py-3 pl-12 pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2  focus:border-transparent transition-all duration-300 hover:bg-white/10`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-blue-400 transition-colors duration-200" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-blue-400 transition-colors duration-200" />
                )}
              </button>
            </div>
            {/* Confirm Password Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors duration-200" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                {...register("confirmPassword", {
                  required: true,
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })}
                placeholder="Password"
                className={`w-full ${
                  errors.confirmPassword
                    ? "ring-red-400 border-red-400"
                    : "focus:ring-blue-500"
                } bg-white/5 border border-white/20 rounded-xl py-3 pl-12 pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2  focus:border-transparent transition-all duration-300 hover:bg-white/10`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-blue-400 transition-colors duration-200" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-blue-400 transition-colors duration-200" />
                )}
              </button>
            </div>

            {/* {errors.password && (
              <span className="text-red-400 text-xs inline">
                Password must have atleast 1 uppercase letter, 1 lowercase
                letter, 1 number and 1 special character
              </span>
            )} */}
            {errors.password && (
              <span className="text-red-400 text-xs inline">
                {errors.password.type === "pattern"
                  ? "Password must have at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character"
                  : "Check whether both passwords match"}
              </span>
            )}
            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <button
                onClick={() => {
                  handlePasswordReset(watch("email"));
                  alert("Password reset email sent!");
                }}
                type="button"
                className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
              >
                Forgot password?
              </button>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 group"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </button>
          </form>
          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-white/20"></div>
            <span className="px-4 text-gray-400 text-sm">or</span>
            <div className="flex-1 border-t border-white/20"></div>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => loginWithGoogle()}
              className="w-full bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-xl border border-white/20 flex items-center justify-center space-x-3 transition-all duration-300 hover:scale-105"
            >
              <Chrome className="w-5 h-5" />
              <span className="font-medium">Continue with Google</span>
            </button>
            {/* <div className="flex space-x-3">
              <button className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-xl border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-105">
                <Github className="w-5 h-5" />
              </button>
              <button className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-xl border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-105">
                <Apple className="w-5 h-5" />
              </button>
            </div> */}
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-gray-300 text-sm mt-6">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
            >
              Sign up
            </button>
          </p>
        </div>

        {/* Floating elements */}
        <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full blur-xl opacity-60 animate-bounce"></div>
        <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-xl opacity-60 animate-bounce delay-1000"></div>
      </div>
    </div>
  );
}
