"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  User,
  Mail,
  Lock,
  Phone,
  Calendar,
  Briefcase,
  Palette,
  Globe,
  FileText,
  Eye,
  EyeOff,
  Sparkles,
  Heart,
  Star,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

export default function Register() {
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    mobile: "",
    dob: "",
    role: "user",
    experience: "",
    specialization: "",
    portfolio: "",
    bio: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const [currentFeature, setCurrentFeature] = useState(0);

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await axios.post("/api/auth/register", form);

      if (res.data?.success) {
        toast.success("Registered Successfully! 🎉");
        router.push("/login");
      } else {
        toast.error(res.data?.error ?? "Registration failed");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        let message = "Something went wrong";
        const data = error.response?.data;
        if (data && typeof data === "object") {
          if (typeof data.error === "string") {
            message = data.error;
          } else if (typeof data.message === "string") {
            message = data.message;
          }
        }
        toast.error(message);
      } else {
        toast.error("Unexpected error occurred");
      }
    }
  }

  const features = [
    {
      icon: Sparkles,
      title: "Create Your Identity",
      description: "Build a stunning portfolio that showcases your unique artistic vision to the world.",
      color: "from-[#FE9E8F] to-[#FF7A66]",
      bgColor: "bg-[#FE9E8F]",
    },
    {
      icon: Heart,
      title: "Connect with Artists",
      description: "Join a vibrant community of creators, collectors, and art enthusiasts globally.",
      color: "from-[#98C4EC] to-[#6BA3DC]",
      bgColor: "bg-[#98C4EC]",
    },
    {
      icon: Star,
      title: "Showcase Your Work",
      description: "Display your masterpieces in our curated gallery and get discovered by collectors.",
      color: "from-[#D1CAF2] to-[#B8AEE8]",
      bgColor: "bg-[#D1CAF2]",
    },
    {
      icon: TrendingUp,
      title: "Grow Your Brand",
      description: "Access tools and analytics to track your growth and expand your artistic reach.",
      color: "from-[#FFB88C] to-[#FF9F6E]",
      bgColor: "bg-[#FFB88C]",
    },
  ];

  return (
    <div className="min-h-screen bg-[#E8E5F0] flex items-center justify-center p-4">
      <div className="w-full max-w-7xl h-[95vh] bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-5 border-2 border-white/30">

        {/* LEFT SIDE - Animated Feature Carousel */}
        <div className="lg:col-span-2 relative bg-gradient-to-br from-[#E8E5F0] via-[#D8D3E8] to-[#F0E8E5] p-10 hidden lg:flex flex-col justify-between overflow-hidden border-r-2 border-gray-200">
          {/* Floating Background Circles */}
          <div className="absolute top-10 right-10 w-32 h-32 bg-[#FE9E8F] rounded-full opacity-10 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-10 w-40 h-40 bg-[#98C4EC] rounded-full opacity-10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

          {/* Logo */}
          <div className="relative z-10 flex justify-center mb-6">
            <img
              src="/Images/Artistry.png"
              alt="Artistry Alley Logo"
              className="h-24 w-auto object-contain"
            />
          </div>

          {/* Header */}
          <div className="relative z-10">
            <h1 className="text-4xl font-bold text-[#171C3C] mb-3">
              Welcome to <span className="text-[#FE9E8F]">Artistry Alley</span>
            </h1>
            <p className="text-gray-600 text-lg">
              Unlock the World of Art
            </p>
          </div>

          {/* Animated Feature Cards */}
          <div className="relative z-10 flex-1 flex items-center justify-center py-8">
            <div className="relative w-full h-80">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                const isActive = currentFeature === index;
                const isPrev = currentFeature === (index + 1) % 4;
                const isNext = (currentFeature + 1) % 4 === index;

                return (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-700 transform ${isActive
                      ? 'opacity-100 scale-100 translate-y-0'
                      : isPrev
                        ? 'opacity-0 scale-90 -translate-y-10'
                        : isNext
                          ? 'opacity-0 scale-90 translate-y-10'
                          : 'opacity-0 scale-75'
                      }`}
                  >
                    <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 border-2 border-gray-200 h-full flex flex-col justify-center hover:bg-white transition-all duration-300 hover:shadow-xl">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg`}>
                        <Icon size={32} className="text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-[#171C3C] mb-4">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-lg leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Progress Dots */}
          <div className="relative z-10 flex gap-3 justify-center">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentFeature(index)}
                className={`h-2 rounded-full transition-all duration-300 ${currentFeature === index
                  ? 'w-8 bg-[#FE9E8F]'
                  : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
              />
            ))}
          </div>

          {/* Bottom Stats */}
          <div className="relative z-10 grid grid-cols-3 gap-4 pt-8 border-t border-gray-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#FE9E8F]">10K+</div>
              <div className="text-sm text-gray-600">Artists</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#98C4EC]">50K+</div>
              <div className="text-sm text-gray-600">Artworks</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#D1CAF2]">100+</div>
              <div className="text-sm text-gray-600">Exhibitions</div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Registration Form */}
        <div className="lg:col-span-3 p-8 md:p-10 overflow-y-auto bg-white">
          <div className="max-w-xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[#171C3C] mb-2">Create Your Account</h2>
              <p className="text-gray-600">Join thousands of artists and creators worldwide</p>
              <div className="text-right mt-4">
                <span className="text-sm text-gray-600">Already have an account? </span>
                <Link
                  href="/login"
                  className="text-blue-600 font-semibold "
                >
                  Sign in
                </Link>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Account Information Card */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border-2 border-gray-100 hover:border-[#98C4EC]/30 transition-all duration-300">
                <h3 className="text-lg font-bold text-[#171C3C] mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#98C4EC]  flex items-center justify-center">
                    <User size={16} className="text-white" />
                  </div>
                  Account Information
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Username *</label>
                    <div className="relative">
                      <User
                        size={18}
                        className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === "username" ? "text-[#98C4EC]" : "text-gray-400"
                          }`}
                      />
                      <input
                        value={form.username}
                        onChange={(e) => update("username", e.target.value)}
                        onFocus={() => setFocusedField("username")}
                        onBlur={() => setFocusedField("")}
                        required
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl text-gray-900 bg-white transition-all duration-300 ${focusedField === "username"
                          ? "border-[#98C4EC] shadow-lg shadow-[#98C4EC]/20"
                          : "border-gray-200 hover:border-gray-300"
                          } focus:outline-none`}
                        placeholder="Your username"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                    <div className="relative">
                      <Mail
                        size={18}
                        className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === "email" ? "text-[#98C4EC]" : "text-gray-400"
                          }`}
                      />
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField("")}
                        required
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl text-gray-900 bg-white transition-all duration-300 ${focusedField === "email"
                          ? "border-[#98C4EC] shadow-lg shadow-[#98C4EC]/20"
                          : "border-gray-200 hover:border-gray-300"
                          } focus:outline-none`}
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Password *</label>
                    <div className="relative">
                      <Lock
                        size={18}
                        className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === "password" ? "text-[#98C4EC]" : "text-gray-400"
                          }`}
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={(e) => update("password", e.target.value)}
                        onFocus={() => setFocusedField("password")}
                        onBlur={() => setFocusedField("")}
                        required
                        className={`w-full pl-10 pr-12 py-3 border-2 rounded-xl text-gray-900 bg-white transition-all duration-300 ${focusedField === "password"
                          ? "border-[#98C4EC] shadow-lg shadow-[#98C4EC]/20"
                          : "border-gray-200 hover:border-gray-300"
                          } focus:outline-none`}
                        placeholder="Create a password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#98C4EC] transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Information Card */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border-2 border-gray-100 hover:border-[#FE9E8F]/30 transition-all duration-300">
                <h3 className="text-lg font-bold text-[#171C3C] mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FE9E8F] to-[#FFB88C] flex items-center justify-center">
                    <Phone size={16} className="text-white" />
                  </div>
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile *</label>
                    <div className="relative">
                      <Phone
                        size={18}
                        className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === "mobile" ? "text-[#FE9E8F]" : "text-gray-400"
                          }`}
                      />
                      <input
                        value={form.mobile}
                        onChange={(e) => update("mobile", e.target.value)}
                        onFocus={() => setFocusedField("mobile")}
                        onBlur={() => setFocusedField("")}
                        required
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl text-gray-900 bg-white transition-all duration-300 ${focusedField === "mobile"
                          ? "border-[#FE9E8F] shadow-lg shadow-[#FE9E8F]/20"
                          : "border-gray-200 hover:border-gray-300"
                          } focus:outline-none`}
                        placeholder="9123456789"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth *</label>
                    <div className="relative">
                      <Calendar
                        size={18}
                        className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === "dob" ? "text-[#FE9E8F]" : "text-gray-400"
                          }`}
                      />
                      <input
                        type="date"
                        value={form.dob}
                        onChange={(e) => update("dob", e.target.value)}
                        onFocus={() => setFocusedField("dob")}
                        onBlur={() => setFocusedField("")}
                        required
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl text-gray-900 bg-white transition-all duration-300 ${focusedField === "dob"
                          ? "border-[#FE9E8F] shadow-lg shadow-[#FE9E8F]/20"
                          : "border-gray-200 hover:border-gray-300"
                          } focus:outline-none`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Role Selection Card */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border-2 border-gray-100 hover:border-[#D1CAF2]/30 transition-all duration-300">
                <h3 className="text-lg font-bold text-[#171C3C] mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D1CAF2] to-[#B8AEE8] flex items-center justify-center">
                    <Briefcase size={16} className="text-white" />
                  </div>
                  Select Your Role *
                </h3>

                <div className="grid grid-cols-3 gap-3">
                  {["user", "artist", "admin"].map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => update("role", role)}
                      className={`py-3 px-4 rounded-xl text-sm font-bold capitalize border-2 transition-all duration-300 transform ${form.role === role
                        ? "bg-gradient-to-br from-[#171C3C] to-[#2a3154] text-white border-[#171C3C] shadow-lg scale-105"
                        : "bg-white text-gray-700 border-gray-200 hover:border-[#D1CAF2] hover:shadow-md hover:scale-102"
                        }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Artist Information Card (Conditional) */}
              {form.role === "artist" && (
                <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-6 border-2 border-purple-100 hover:border-purple-200 transition-all duration-300 animate-fadeIn">
                  <h3 className="text-lg font-bold text-[#171C3C] mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Palette size={16} className="text-white" />
                    </div>
                    Artist Information
                  </h3>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Experience (years)</label>
                        <div className="relative">
                          <Briefcase
                            size={18}
                            className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === "experience" ? "text-purple-500" : "text-gray-400"
                              }`}
                          />
                          <input
                            type="number"
                            value={form.experience}
                            onChange={(e) => update("experience", e.target.value)}
                            onFocus={() => setFocusedField("experience")}
                            onBlur={() => setFocusedField("")}
                            className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl text-gray-900 bg-white transition-all duration-300 ${focusedField === "experience"
                              ? "border-purple-500 shadow-lg shadow-purple-500/20"
                              : "border-gray-200 hover:border-gray-300"
                              } focus:outline-none`}
                            placeholder="e.g. 3"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Specialization</label>
                        <div className="relative">
                          <Palette
                            size={18}
                            className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === "specialization" ? "text-purple-500" : "text-gray-400"
                              }`}
                          />
                          <input
                            value={form.specialization}
                            onChange={(e) => update("specialization", e.target.value)}
                            onFocus={() => setFocusedField("specialization")}
                            onBlur={() => setFocusedField("")}
                            className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl text-gray-900 bg-white transition-all duration-300 ${focusedField === "specialization"
                              ? "border-purple-500 shadow-lg shadow-purple-500/20"
                              : "border-gray-200 hover:border-gray-300"
                              } focus:outline-none`}
                            placeholder="e.g. Digital Art"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Portfolio URL (optional)</label>
                      <div className="relative">
                        <Globe
                          size={18}
                          className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === "portfolio" ? "text-purple-500" : "text-gray-400"
                            }`}
                        />
                        <input
                          type="url"
                          value={form.portfolio}
                          onChange={(e) => update("portfolio", e.target.value)}
                          onFocus={() => setFocusedField("portfolio")}
                          onBlur={() => setFocusedField("")}
                          className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl text-gray-900 bg-white transition-all duration-300 ${focusedField === "portfolio"
                            ? "border-purple-500 shadow-lg shadow-purple-500/20"
                            : "border-gray-200 hover:border-gray-300"
                            } focus:outline-none`}
                          placeholder="https://yourportfolio.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Bio (optional)</label>
                      <div className="relative">
                        <FileText
                          size={18}
                          className={`absolute left-3 top-3 transition-colors duration-300 ${focusedField === "bio" ? "text-purple-500" : "text-gray-400"
                            }`}
                        />
                        <textarea
                          rows={3}
                          value={form.bio}
                          onChange={(e) => update("bio", e.target.value)}
                          onFocus={() => setFocusedField("bio")}
                          onBlur={() => setFocusedField("")}
                          className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl text-gray-900 bg-white transition-all duration-300 resize-none ${focusedField === "bio"
                            ? "border-purple-500 shadow-lg shadow-purple-500/20"
                            : "border-gray-200 hover:border-gray-300"
                            } focus:outline-none`}
                          placeholder="Tell something about yourself"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-[#171C3C] to-[#2a3154] text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-[#171C3C]/30 transform hover:-translate-y-1 active:translate-y-0 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              >
                {submitting ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
