import React from "react";
import {
    TrendingUp,
    Users,
    Eye,
    ShoppingBag,
    ArrowUpRight,
    ArrowDownRight,
    MoreHorizontal,
    DollarSign,
    Palette,
    Clock,
    Plus,
    FileText
} from "lucide-react";
import Image from "next/image";

// Mock Data
const stats = [
    {
        title: "My Events",
        barColor: "bg-[#FE9E8F]",
        items: [
            { label: "Upcoming", value: "03" },
            { label: "Completed", value: "05" }
        ]
    },
    {
        title: "My Products",
        barColor: "bg-[#98C4EC]",
        items: [
            { label: "Total Products", value: "24" },
            { label: "Purchased", value: "12" }
        ]
    },
    {
        title: "My Gallery",
        barColor: "bg-[#D1CAF2]",
        items: [
            { label: "Total Images", value: "48" },
            { label: "Albums", value: "06" },
            { label: "Likes", value: "850" },
            { label: "comments", value: "40" }
        ]
    },

];

const recentActivity = [
    {
        user: "System",
        action: "published",
        item: "Neon City",
        time: "2 hours ago",
        avatar: "S",
    },
    {
        user: "You",
        action: "added product",
        item: "Abstract Print #4",
        time: "5 hours ago",
        avatar: "Y",
    },
    {
        user: "System",
        action: "reminder",
        item: "Art Exhibition",
        time: "1 day ago",
        avatar: "S",
    },
];

const recentGallery = [
    { name: "Neon City", date: "Jan 12", status: "Published", color: "bg-gradient-to-br from-[#FE9E8F] to-[#D1CAF2]" },
    { name: "Ocean Depth", date: "Jan 10", status: "Published", color: "bg-gradient-to-br from-[#98C4EC] to-[#D1CAF2]" },
    { name: "Forest Mist", date: "Jan 05", status: "Published", color: "bg-gradient-to-br from-[#D1CAF2] to-[#98C4EC]" },
];

const recentProducts = [
    { name: "Canvas Print", price: "$45", stock: "12", color: "bg-[#D1CAF2]" },
    { name: "Art Hoodie", price: "$60", stock: "25", color: "bg-[#98C4EC]" },
];

export default function Dashboard() {
    return (
        <div className="w-full h-full bg-white text-[#171C3C] p-8 overflow-y-auto custom-scrollbar">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#171C3C] via-[#D1CAF2] to-[#98C4EC]">
                        Artist Dashboard
                    </h1>
                    <p className="text-[#171C3C]/70 mt-1">
                        Welcome back! Here what is happening with your art today.
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-8 mb-10">
                {stats.map((stat, index) => (
                    <div key={index} className="flex flex-col">
                        {/* Title - positioned above the bar/stats */}
                        <h3 className="text-xl font-semibold text-[#171C3C] mb-4 pl-1">{stat.title}</h3>

                        <div className="flex items-center gap-4 px-2">
                            {/* Vertical Half-Pill Bar (Rounded Left, Flat Right) */}
                            <div className={`w-2.5 h-16 rounded-l-full rounded-r-none ${stat.barColor} shrink-0`}></div>

                            <div className="flex gap-8">
                                {stat.items.map((item, idx) => (
                                    <div key={idx} className="flex flex-col justify-center">
                                        <span className="text-sm text-[#171C3C]/60 font-medium whitespace-nowrap mb-1">{item.label}</span>
                                        <span className="text-2xl font-semibold text-[#171C3C] tracking-tight">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart Section (Visual Mockup) */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Gallery Overview */}
                    <div className="bg-[#D1CAF2]/10 p-6 rounded-2xl border border-[#D1CAF2]/40">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-[#171C3C]">Recent Gallery Uploads</h2>
                            <button className="text-sm text-[#171C3C] hover:text-[#98C4EC] transition-colors font-medium">View All</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {recentGallery.map((art, idx) => (
                                <div key={idx} className="p-3 rounded-xl bg-white border border-[#D1CAF2]/40 hover:border-[#98C4EC] transition-all cursor-pointer group shadow-sm hover:shadow-md">
                                    <div className={`h-32 mb-3 rounded-lg ${art.color} relative overflow-hidden`}>
                                        <div className="absolute inset-0 bg-white/10 group-hover:bg-transparent transition-colors"></div>
                                    </div>
                                    <h4 className="font-bold text-[#171C3C] mb-1 truncate">{art.name}</h4>
                                    <div className="flex justify-between items-center text-sm text-[#171C3C]/70">
                                        <span>{art.date}</span>
                                        <span className="text-[#98C4EC] text-xs px-2 py-0.5 bg-[#98C4EC]/20 rounded-full font-medium">{art.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Products */}
                    <div className="bg-[#98C4EC]/10 p-6 rounded-2xl border border-[#98C4EC]/40">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-[#171C3C]">Latest Products</h2>
                            <button className="text-sm text-[#171C3C] hover:text-[#98C4EC] transition-colors font-medium">View All</button>
                        </div>
                        <div className="space-y-4">
                            {recentProducts.map((prod, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#98C4EC]/40 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 rounded-lg ${prod.color}`}></div>
                                        <div>
                                            <h4 className="font-bold text-[#171C3C]">{prod.name}</h4>
                                            <p className="text-sm text-[#171C3C]/60">Stock: {prod.stock}</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-[#171C3C]">{prod.price}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Right Side Panel */}
                <div className="space-y-8">
                    {/* Recent Activity */}
                    <div className="bg-[#FE9E8F]/10 p-6 rounded-2xl border border-[#FE9E8F]/40 h-full">
                        <h2 className="text-xl font-bold text-[#171C3C] mb-6">Recent Activity</h2>
                        <div className="space-y-6">
                            {recentActivity.map((activity, index) => (
                                <div key={index} className="flex gap-4 items-start">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#D1CAF2] to-[#98C4EC] flex items-center justify-center text-sm font-bold border-2 border-white shadow-sm text-[#171C3C]">
                                        {activity.avatar}
                                    </div>
                                    <div>
                                        <p className="text-sm text-[#171C3C]">
                                            <span className="font-bold text-[#171C3C]">{activity.user}</span>{" "}
                                            {activity.action}{" "}
                                            <span className="text-[#FE9E8F] font-medium">{activity.item}</span>
                                        </p>
                                        <p className="text-xs text-[#171C3C]/60 mt-1 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {activity.time}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* <button className="w-full mt-6 py-3 border border-gray-700 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
                            View All Activity
                        </button> */}
                    </div>


                </div>
            </div>
        </div>
    );
}
