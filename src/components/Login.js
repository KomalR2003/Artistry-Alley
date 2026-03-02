"use client";

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await axios.post("/api/auth/login", {
        email: form.email,
        password: form.password,
      });

      if (res.data?.success) {
        // Store user info in localStorage
        if (res.data.userId) {
          localStorage.setItem('userId', res.data.userId);
        }
        if (res.data.role) {
          localStorage.setItem('userRole', res.data.role);
        }
        if (res.data.username) {
          localStorage.setItem('username', res.data.username);
        }
        // Store email for order retrieval
        if (form.email) {
          localStorage.setItem('userEmail', form.email);
        }

        toast.success("Login successful");
        let redirectTo = res.data.redirect ?? "/home";
        if (redirectTo === "/dashboard") redirectTo = "/home";
        router.push(redirectTo);
      } else {
        toast.error(res.data?.error ?? "Login failed");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        let message = "Something went wrong";
        const data = error.response?.data;
        if (data && typeof data === "object") {
          const errField = data.error;
          const msgField = data.message;
          if (typeof errField === "string") {
            message = errField;
          } else if (typeof msgField === "string") {
            message = msgField;
          } else if (typeof error.message === "string") {
            message = error.message;
          }
        } else if (typeof error.message === "string") {
          message = error.message;
        }
        toast.error(message);
      } else {
        toast.error("Unexpected error occurred");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#E8E5F0] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl h-[94vh] bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-5">

        {/* Left Side - Masonry Layout (NO SCROLL) */}
        <div className="lg:col-span-3 relative bg-gray-50 p-2 hidden lg:flex items-center justify-center overflow-hidden">
          <div className="w-full h-full grid grid-cols-3 grid-rows-4 gap-2">

            {/* Row 1 - 3 items */}
            <div className="relative rounded-2xl overflow-hidden group">
              <img
                src="https://artstreet.in/cdn/shop/files/91e3_EIFoCL_1200x1200.jpg?v=1755502517"
                alt="Art Gallery"
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-[#FE9E8F] flex flex-col items-start justify-center p-6 hover:bg-opacity-90 transition-all">
              <div className="text-lg font-bold text-white mb-2 leading-tight">
                &quot;Art is not what you see, but what you make others see&quot;
              </div>

            </div>

            <div className="relative rounded-2xl overflow-hidden bg-gray-800 group">
              <img
                src="https://www.artworkcanvas.com/cdn/shop/products/il_fullxfull.5084888970_4lbj_1024x1024.jpg?v=1689379920"
                alt="Digital Art"
                className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-500"
              />
            </div>

            {/* Row 2 - 3 items */}
            <div className="relative rounded-2xl overflow-hidden group">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3ofdru3uSu67ZcvVqwLEcm5m8zjBOXHTT4A&s"
                alt="Artist Studio"
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            <div className="col-span-2 relative rounded-2xl overflow-hidden group">
              <img
                src="https://cdn11.bigcommerce.com/s-x49po/products/909/images/7030/20140404152024__66280_zoom__88753__61054.1506573890.500.659.jpg?c=2"
                alt="Sculpture"
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            {/* Row 3 - 3 items */}
            <div className="relative rounded-2xl overflow-hidden group">
              <img
                src="https://www.stevenbrownart.co.uk/cdn/shop/files/Bonnie-McButterflee-Canvas-Prints-Canvas-Prints-ESP-5_700x700.jpg?v=1726882086"
                alt="Art Supplies"
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-[#171C3C] flex items-center justify-center hover:bg-opacity-90 transition-all">
              <div className="text-center text-white">
                <div className="text-2xl font-bold">Make Art</div>
                <div className="text-2xl font-semibold mt-1">With Heart</div>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden group">
              <img
                src="https://eleanosgallery.com/cdn/shop/files/2_66e41a41-06ff-417f-832a-3a22d2ad644f.webp?v=1752139734&width=1500"
                alt="Abstract Art"
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            {/* Row 4 - Full width */}
            <div className="col-span-2 relative rounded-2xl overflow-hidden bg-[#98C4EC] flex items-center justify-center p-6 hover:bg-opacity-90 transition-all">
              <div className="text-center w-full">
                <div className="text-3xl font-bold text-slate-500 tracking-wider">
                  EXPLORE <span className="text-slate-600">•</span> CONNECT <span className="text-slate-600">•</span> COLLECT
                </div>
                <div className="text-sm font-medium text-slate-600 mt-2">
                  The Art Gallery Experience
                </div>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden group">
              <img
                src="
                https://i.etsystatic.com/50420792/r/il/d11e47/5774651504/il_570xN.5774651504_5gs8.jpg"
                alt="Gallery"
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="lg:col-span-2 p-8 md:p-10 flex flex-col justify-center bg-white">

          {/* Logo at left corner */}
          <div className="mb-4">
            <img
              src="/Images/Artistry.png"
              alt="Artistry Alley Logo"
              className="h-16 w-auto object-contain"
            />
          </div>

          {/* Signup link aligned right */}
          <div className="text-right mb-6">
            <span className="text-sm text-gray-600">Don&apos;t have an account? </span>
            <Link
              href="/register"
              className="text-blue-700 font-semibold "
            >
              Sign up
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#171C3C] mb-2">
              Welcome to <span className="text-[#98C4EC]">Artistry Alley</span>
            </h1>
            <p className="text-gray-700 text-sm">
              Where every brushstrokes tells a story and every canvas is alive.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="k@gmail.com"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-gray-50 focus:outline-none focus:border-[#98C4EC] focus:ring-2 focus:ring-[#98C4EC]/20 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••"
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-gray-50 focus:outline-none focus:border-[#98C4EC] focus:ring-2 focus:ring-[#98C4EC]/20 focus:bg-white transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#171C3C] text-white py-3.5 px-6 rounded-xl font-semibold text-base hover:bg-[#2a3154] hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
              {submitting ? "Logging in..." : "Login"}
            </button>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
            </div>


          </form>
        </div>
      </div>
    </div>
  );
}
