"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import logo from "../../public/Images/Artistry.png";
import LogoutModal from "./LogoutModal";
import {
    Home,
    Users,
    Image as ImageIcon,
    Box,
    Calendar,
    Phone,
    Menu,
    X,
    LogOut,
    LayoutDashboard,
    ShoppingCart
} from "lucide-react";

const navLinks = [
    { label: "Home", href: "/home" },
    { label: "About Us", href: "/home" },
    { label: "Gallery", href: "/home" },
    { label: "Products", href: "/home" },
    { label: "Events", href: "/home" },
    { label: "Our Team", href: "/home" },
    { label: "Dashboard", href: "/home" },
    { label: "Contact Us", href: "/contact" },
];

export default function Navbar({ onNavigate, activeView }) {
    const router = useRouter();
    const { getCartCount } = useCart();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    // Hide cart badge when on Cart page
    const showCartBadge = activeView !== 'Cart';

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
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
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">

                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/home">
                            <Image
                                src={logo}
                                alt="Artistry Alley Logo"
                                width={120}
                                height={60}
                                className="object-contain cursor-pointer"
                                priority
                            />
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-1">
                        {navLinks.map((link) => {
                            return (
                                <Link
                                    key={link.href + link.label}
                                    href={link.href}
                                    className="px-4 py-2 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium"
                                    onClick={(e) => {
                                        if (onNavigate) {
                                            e.preventDefault();
                                            onNavigate(link.label);
                                        }
                                    }}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Desktop Right Side Actions */}
                    <div className="hidden lg:flex items-center gap-3">
                        {/* Cart Icon */}
                        <button
                            onClick={(e) => {
                                if (onNavigate) {
                                    e.preventDefault();
                                    onNavigate('Cart');
                                } else {
                                    router.push('/user/cart');
                                }
                            }}
                            className="relative p-2 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                        >
                            <ShoppingCart size={24} />
                            {showCartBadge && getCartCount() > 0 && (
                                <span className="absolute -top-1 -right-1 bg-[#FE9E8F] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {getCartCount()}
                                </span>
                            )}
                        </button>

                        {/* Logout Button */}
                        <button
                            onClick={() => setIsLogoutModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#FE9E8F] to-[#FF7A66] text-white hover:shadow-lg transition-all duration-200 font-medium"
                        >
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMobileMenu}
                        className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                        aria-label="Toggle Menu"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden bg-white border-t border-gray-200 animate-slideDown">
                    <div className="px-4 py-4 space-y-2">
                        {navLinks.map((link) => {
                            return (
                                <Link
                                    key={link.href + link.label}
                                    href={link.href}
                                    className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 font-medium"
                                    onClick={(e) => {
                                        if (onNavigate) {
                                            e.preventDefault();
                                            onNavigate(link.label);
                                        }
                                        setIsMobileMenuOpen(false);
                                    }}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}

                        <div className="pt-4 border-t border-gray-200 space-y-2">
                            {/* Cart Button */}
                            <button
                                onClick={(e) => {
                                    if (onNavigate) {
                                        e.preventDefault();
                                        onNavigate('Cart');
                                    } else {
                                        router.push('/user/cart');
                                    }
                                    setIsMobileMenuOpen(false);
                                }}
                                className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-[#98C4EC]/10 text-[#171C3C] font-semibold hover:bg-[#98C4EC]/20 transition-all"
                            >
                                <span className="flex items-center gap-3">
                                    <ShoppingCart size={20} />
                                    <span>Cart</span>
                                </span>
                                {showCartBadge && getCartCount() > 0 && (
                                    <span className="bg-[#FE9E8F] text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                        {getCartCount()}
                                    </span>
                                )}
                            </button>

                            {/* Logout Button */}
                            <button
                                onClick={() => {
                                    setIsLogoutModalOpen(true);
                                    setIsMobileMenuOpen(false);
                                }}
                                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-gradient-to-r from-[#FE9E8F] to-[#FF7A66] text-white font-semibold hover:shadow-lg transition-all"
                            >
                                <LogOut size={20} />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Logout Confirmation Modal */}
            <LogoutModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={handleLogout}
            />
            <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
        </nav>
    );
}
