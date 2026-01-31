"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
// import group from '../../public/Images/Group 370.png';
import group from '../../../public/Images/Group 370.png';
import { Sparkles, Palette, Users, TrendingUp, ArrowRight, Eye, Heart } from 'lucide-react';

export default function Home({ onNavigate }) {
    const [currentStat, setCurrentStat] = useState(0);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // Auto-rotate stats highlight
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStat((prev) => (prev + 1) % 4);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // Track mouse position for parallax effect
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth - 0.5) * 20,
                y: (e.clientY / window.innerHeight - 0.5) * 20,
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const stats = [
        {
            icon: Palette,
            value: "200+",
            label: "Artworks Available",
            sublabel: "Explore now",
            color: "from-[#98C4EC] to-[#6BA3DC]",
            iconBg: "bg-[#98C4EC]"
        },
        {
            icon: Eye,
            value: "20",
            label: "Exhibitions Held",
            sublabel: "Join Our Exhibitions",
            color: "from-[#FE9E8F] to-[#FF7A66]",
            iconBg: "bg-[#FE9E8F]"
        },
        {
            icon: Heart,
            value: "1000+",
            label: "Happy Customers",
            sublabel: "Join with Us",
            color: "from-[#D1CAF2] to-[#B8AEE8]",
            iconBg: "bg-[#D1CAF2]"
        },
        {
            icon: Users,
            value: "30",
            label: "Talented Artists",
            sublabel: "Explore more",
            color: "from-[#FFB88C] to-[#FF9F6E]",
            iconBg: "bg-[#FFB88C]"
        },
    ];

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-[#f8f9fa] via-white to-[#f0f4f8] text-gray-900 overflow-y-auto relative">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-[#98C4EC] rounded-full opacity-10 blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#FE9E8F] rounded-full opacity-10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-[#D1CAF2] rounded-full opacity-10 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 relative z-10">
                {/* Hero Section */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-12">
                    {/* Left Side: Text Content */}
                    <div className="flex-1 space-y-8 md:w-6/12">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#98C4EC]/20 to-[#FE9E8F]/20 px-4 py-2 rounded-full border border-[#98C4EC]/30 backdrop-blur-sm">
                            <Sparkles className="text-[#FE9E8F]" size={18} />
                            <span className="text-sm font-semibold text-gray-700">Welcome to Artistry</span>
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                            <span className="bg-gradient-to-r from-[#171C3C] via-[#2a3154] to-[#171C3C] bg-clip-text text-transparent">
                                Step into
                            </span>
                            <br />
                            <span className="text-gray-700">creativity, where</span>
                            <br />
                            <span className="bg-gradient-to-r from-[#98C4EC] via-[#FE9E8F] to-[#D1CAF2] bg-clip-text text-transparent">
                                Art comes alive
                            </span>
                        </h1>

                        {/* Description */}
                        <div className="space-y-4 text-gray-600 text-lg max-w-xl">
                            <p className="leading-relaxed">
                                Explore the beauty of Expression, where creativity knows no
                                limits and inspiration awaits at every corner.
                            </p>
                            <p className="leading-relaxed">
                                Welcome to a space where imagination meets reality, and every
                                piece of art tells a unique story.
                            </p>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={() => onNavigate?.('aboutus')}
                                className="group bg-gradient-to-r from-[#171C3C] to-[#2a3154] text-white font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-[#171C3C]/30 transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
                            >
                                EXPLORE MORE
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                            </button>
                            <button
                                onClick={() => onNavigate?.('gallery')}
                                className="group bg-white text-[#171C3C] font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl border-2 border-gray-200 hover:border-[#98C4EC] transform hover:-translate-y-1 transition-all duration-300"
                            >
                                View Gallery
                            </button>
                        </div>

                    </div>

                    {/* Right Side: Image with Parallax */}
                    <div className="flex-1 md:w-6/12 flex items-center justify-center">
                        <div
                            className="relative group"
                            style={{
                                transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
                                transition: 'transform 0.3s ease-out'
                            }}
                        >
                            {/* Glow effect behind image */}
                            <div className="absolute -inset-4 bg-gradient-to-r from-[#98C4EC] via-[#FE9E8F] to-[#D1CAF2] rounded-3xl opacity-30 blur-2xl group-hover:opacity-50 transition-opacity duration-500"></div>

                            {/* Image container */}
                            <div className="relative bg-white p-4 rounded-3xl shadow-2xl transform rotate-3 group-hover:rotate-0 transition-all duration-500">
                                <Image
                                    src={group}
                                    alt="Art Collage"
                                    className="w-[400px] h-auto rounded-2xl"
                                />
                            </div>

                            {/* Floating badge */}
                            <div className="absolute -bottom-4 -left-4 bg-white px-6 py-3 rounded-2xl shadow-xl border-2 border-[#98C4EC]/30 animate-bounce">
                                <div className="text-2xl font-bold text-[#171C3C]">🎨</div>
                                <div className="text-sm font-semibold text-gray-700">Featured</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-[#98C4EC]/10 to-[#98C4EC]/5 p-8 rounded-3xl border border-[#98C4EC]/20 hover:shadow-xl transition-all duration-300 group cursor-pointer">
                        <div className="w-14 h-14 rounded-2xl bg-[#98C4EC] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Palette className="text-white" size={28} />
                        </div>
                        <h4 className="text-xl font-bold text-[#171C3C] mb-3">Discover Art</h4>
                        <p className="text-gray-600">Browse through thousands of curated artworks from talented artists worldwide.</p>
                    </div>

                    <div className="bg-gradient-to-br from-[#FE9E8F]/10 to-[#FE9E8F]/5 p-8 rounded-3xl border border-[#FE9E8F]/20 hover:shadow-xl transition-all duration-300 group cursor-pointer">
                        <div className="w-14 h-14 rounded-2xl bg-[#FE9E8F] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Users className="text-white" size={28} />
                        </div>
                        <h4 className="text-xl font-bold text-[#171C3C] mb-3">Connect Artists</h4>
                        <p className="text-gray-600">Join a vibrant community of artists, collectors, and art enthusiasts.</p>
                    </div>

                    <div className="bg-gradient-to-br from-[#D1CAF2]/10 to-[#D1CAF2]/5 p-8 rounded-3xl border border-[#D1CAF2]/20 hover:shadow-xl transition-all duration-300 group cursor-pointer">
                        <div className="w-14 h-14 rounded-2xl bg-[#D1CAF2] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Heart className="text-white" size={28} />
                        </div>
                        <h4 className="text-xl font-bold text-[#171C3C] mb-3">Collect & Own</h4>
                        <p className="text-gray-600">Build your personal collection of unique artworks and support artists.</p>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes pulse {
                    0%, 100% {
                        opacity: 0.1;
                    }
                    50% {
                        opacity: 0.15;
                    }
                }
                .animate-pulse {
                    animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}</style>
        </div>
    );
}
