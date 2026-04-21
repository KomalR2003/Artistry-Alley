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
    ShoppingCart,
    Bell
} from "lucide-react";

const navLinks = [
    { label: "Home", href: "/home" },
    { label: "About Us", href: "/home" },
    { label: "Gallery", href: "/home" },
    { label: "Products", href: "/home" },
    { label: "Events", href: "/home" },
    { label: "Our Team", href: "/home" },
    { label: "Dashboard", href: "/home" },
    { label: "Contact Us", href: "/home" },
    { label: "Messages", href: "/messages" },
];

export default function Navbar({ onNavigate, activeView }) {
    const router = useRouter();
    const { getCartCount } = useCart();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadNotifications, setUnreadNotifications] = useState(0);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    React.useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const userId = sessionStorage.getItem('userId');
                if (!userId) return;
                const res = await fetch(`/api/notifications?userId=${userId}`);
                const data = await res.json();
                if (data.success) {
                    setNotifications(data.notifications);
                    setUnreadNotifications(data.unreadCount);
                }
            } catch (error) {
                console.error("Failed to fetch notifications:", error);
            }
        };

        fetchNotifications();
        const interval = setInterval(fetchNotifications, 15000); // poll every 15s
        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (id) => {
        try {
            await fetch(`/api/notifications/${id}/read`, { method: 'PUT' });
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
            setUnreadNotifications(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error(error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const userId = sessionStorage.getItem('userId');
            if(!userId) return;
            await fetch(`/api/notifications/all/read?userId=${userId}`, { method: 'PUT' });
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadNotifications(0);
        } catch (error) {
            console.error(error);
        }
    };

    // Hide cart badge when on Cart page
    const showCartBadge = activeView !== 'Cart';

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleLogout = () => {
        // Clear sessionStorage
        sessionStorage.clear();
        // Close modal
        setIsLogoutModalOpen(false);
        // Redirect to login page
        router.push("/login");
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
            <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16">
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
                    <div className="hidden lg:flex items-center justify-center gap-6  flex-1 px-2">
                        {navLinks.map((link) => {
                            return (
                                <Link
                                    key={link.href + link.label}
                                    href={link.href}
                                    className="px-2 xl:px-3 py-2 text-[13px] xl:text-[14px] rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium whitespace-nowrap shrink-0"
                                    onClick={(e) => {
                                        if (onNavigate && link.href === "/home") {
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
                    <div className="hidden lg:flex items-center gap-3 relative">
                        {/* Notification Bell */}
                        <div className="relative">
                            <button
                                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                className="relative p-2 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                            >
                                <Bell size={24} />
                                {unreadNotifications > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                        {unreadNotifications}
                                    </span>
                                )}
                            </button>
                            
                            {/* Notifications Dropdown */}
                            {isNotificationsOpen && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                                    <div className="flex items-center justify-between px-4 pb-2 border-b border-gray-100">
                                        <h3 className="font-semibold text-gray-800">Notifications</h3>
                                        <button onClick={markAllAsRead} className="text-xs text-blue-600 hover:text-blue-800">Mark all read</button>
                                    </div>
                                    <div className="max-h-[300px] overflow-y-auto">
                                        {notifications.length === 0 ? (
                                            <div className="px-4 py-6 text-center text-sm text-gray-500">No new notifications</div>
                                        ) : (
                                            notifications.map(notif => (
                                                <div 
                                                    key={notif._id} 
                                                    onClick={() => {
                                                        if (!notif.isRead) markAsRead(notif._id);
                                                        if (notif.link) router.push(notif.link);
                                                    }}
                                                    className={`px-4 py-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${notif.isRead ? 'opacity-60' : 'bg-blue-50/30'}`}
                                                >
                                                    <p className="text-sm text-gray-800">{notif.message}</p>
                                                    <span className="text-[10px] text-gray-500 mt-1 block">
                                                        {new Date(notif.createdAt).toLocaleDateString()} {new Date(notif.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                    </span>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

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
                                        if (onNavigate && link.href === "/home") {
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
