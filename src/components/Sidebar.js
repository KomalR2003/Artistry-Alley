"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import logo from "../../public/Images/Artistry.png";
import LogoutModal from "./LogoutModal";
import {
  Home,
  Users,
  Image as ImageIcon,
  Box,
  Calendar,
  Phone,
  FileText,
  Menu,
  X,
  LayoutDashboard
} from "lucide-react";

import Link from "next/link";

const navItems = [
  { label: "Home", icon: Home, href: "/home", roles: ["user"] },
  { label: "Dashboard", icon: LayoutDashboard, href: "/home", roles: ["user"] },
  { label: "About Us", icon: Users, href: "/home", roles: ["user"] },
  { label: "Gallery", icon: ImageIcon, href: "/home", roles: ["user"] },
  { label: "Products", icon: Box, href: "/home", roles: ["user"] },
  { label: "Events", icon: Calendar, href: "/home", roles: ["user"] },
  { label: "Our Team", icon: Users, href: "/home", roles: ["user"] },
  // { label: "Blogs", icon: FileText, href: "/blogs", roles: ["user"] },
  { label: "Contact Us", icon: Phone, href: "/contact", roles: ["user"] },

  { label: "AdminDashboard", icon: LayoutDashboard, href: "/admin", roles: ["admin"] },
  { label: "ManageGallery", icon: ImageIcon, href: "/admin", roles: ["admin"] },
  { label: "ManageProducts", icon: Box, href: "/admin", roles: ["admin"] },
  { label: "ManageEvents", icon: Calendar, href: "/admin", roles: ["admin"] },
  { label: "ManageTeam", icon: Users, href: "/admin", roles: ["admin"] },
  // { label: "Manage Blogs", icon: ImageIcon, href: "/blogs", roles: ["admin"] },

  { label: "MyDashboard", icon: FileText, href: "/artist", roles: ["artist"] },
  { label: "MyGallery", icon: ImageIcon, href: "/artist", roles: ["artist"] },
  { label: "MyProducts", icon: Box, href: "/artist", roles: ["artist"] },
  { label: "MyEvents", icon: Calendar, href: "/artist", roles: ["artist"] },
  // { label: "My Blogs", icon: Box, href: "/artist", roles: ["artist"] },
  { label: "MyPortfolio", icon: ImageIcon, href: "/artist", roles: ["artist"] },
];

export default function Sidebar({ role = "user", onNavigate }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(role)
  );

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    // Clear localStorage
    localStorage.clear();
    // Close modal
    setIsLogoutModalOpen(false);
    // Redirect to login page
    router.push("/login");
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#121212] text-gray-300 rounded-md hover:text-white focus:outline-none"
        aria-label="Toggle Menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-purple-50 flex-col text-gray-700 p-4 border-r border-[#dfe9f3] shadow-sm transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}

      >
        {/* Logo Section */}
        <div className=" flex justify-center  mb-6 border-b border-gray-100">
          <Image
            src={logo}
            alt="Artistry Logo"
            width={140}
            height={80}
            className="object-contain"
            priority
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto space-y-1 no-scrollbar">
          {filteredNavItems.map((item) => (
            <Link
              key={item.href + item.label}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 transition-all duration-300 group border border-transparent hover:border-blue-100 hover:shadow-sm"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate(item.label);
                }
                setIsOpen(false);
              }}
            >
              <item.icon className="h-5 w-5 text-gray-500 group-hover:text-blue-600 transition-colors" />
              <span className="font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="mt-auto pt-6 border-t border-gray-100">
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex items-center justify-center gap-2 w-full bg-[#E57A6B] text-white font-semibold py-3 px-4 rounded-xl hover:bg-[#D66A5A] transition-all duration-300"
          >
            <span>LOGOUT</span>
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}
