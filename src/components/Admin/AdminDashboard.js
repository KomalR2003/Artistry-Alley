import React from "react";
import {
  Users,
  Palette,
  DollarSign,
  Activity,
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  MoreHorizontal,
  Search,
  ShoppingBag,
  TrendingUp,
  Star
} from "lucide-react";

// Mock Data
const stats = [
  {
    title: "User Statistics",
    barColor: "bg-[#98C4EC]",
    items: [
      { label: "Total Users", value: "190" },
      { label: "Artists", value: "40" },
      { label: "Users", value: "150" }
    ]
  },
  {
    title: "Gallery Overview",
    barColor: "bg-[#4ADE80]",
    items: [
      { label: "Total Arts", value: "840" },
      { label: "Albums", value: "450" },
      { label: "Likes", value: "300" }
    ]
  },
  {
    title: "Marketplace",
    barColor: "bg-[#C084FC]",
    items: [
      { label: "Products", value: "250" },
      { label: "Orders", value: "180" }
    ]
  },
  {
    title: "Events ",
    barColor: "bg-[#FE9E8F]",
    items: [
      { label: "Events", value: "45" },
      { label: "Booked", value: "13" }
    ]
  }
];

const recentRegistrations = [
  { name: "Alice Johnson", role: "User", date: "Jan 16", status: "Active", avatarColor: "bg-blue-600" },
  { name: "Michael Chen", role: "Artist", date: "Jan 15", status: "Active", avatarColor: "bg-purple-600" },
  { name: "Sarah Williams", role: "User", date: "Jan 15", status: "Active", avatarColor: "bg-teal-600" },
];

const recentOrders = [
  { id: "#ORD-5521", product: "Neon City Print", buyer: "Alex R.", amount: "$120", status: "Completed", color: "bg-green-500/20 text-green-400" },
  { id: "#ORD-5520", product: "Abstract Canvas", buyer: "Maria L.", amount: "$250", status: "Processing", color: "bg-blue-500/20 text-blue-400" },
  { id: "#ORD-5519", product: "Digital License", buyer: "John D.", amount: "$45", status: "Pending", color: "bg-yellow-500/20 text-yellow-400" },
];

const adminActivity = [
  {
    user: "Admin",
    action: "approved artist",
    target: "Michael Chen",
    time: "10 mins ago",
    avatar: "A",
  },
  {
    user: "System",
    action: "backup completed",
    target: "Database",
    time: "1 hour ago",
    avatar: "S",
  },
  {
    user: "Admin",
    action: "resolved report",
    target: "#4921",
    time: "3 hours ago",
    avatar: "A",
  },
];

const topArtists = [
  { name: "Eleanor Pena", sales: "$12.5k", likes: "8.5k", artworks: "42", rating: "4.9", avatarColor: "bg-pink-600" },
  { name: "Cody Fisher", sales: "$9.2k", likes: "6.7k", artworks: "28", rating: "4.8", avatarColor: "bg-cyan-600" },
  { name: "Arlene McCoy", sales: "$8.4k", likes: "5.2k", artworks: "35", rating: "4.7", avatarColor: "bg-emerald-600" },
];

export default function AdminDashboard() {
  return (
    <div className="w-full h-full bg-white text-[#171C3C] p-8 overflow-y-auto custom-scrollbar">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#171C3C] via-[#98C4EC] to-[#D1CAF2]">
            Admin Dashboard
          </h1>
          <p className="text-[#171C3C]/70 mt-1">
            Overview of system performance and user management.
          </p>
        </div>
        {/* Search Bar Mockup */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#171C3C]/50" />
          <input
            type="text"
            placeholder="Search users, artists..."
            className="pl-10 pr-4 py-2 bg-white border border-[#D1CAF2]/40 rounded-lg text-sm focus:outline-none focus:border-[#98C4EC] transition-colors w-64 text-[#171C3C]"
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, index) => (
          <div key={index} className="flex flex-col hover:scale-[1.02] transition-transform duration-200">
            <h3 className="text-xl font-semibold text-[#171C3C] mb-4 pl-1">{stat.title}</h3>
            <div className="flex items-center gap-4 px-2">
              {/* Vertical Half-Pill Bar */}
              <div className={`w-2.5 h-16 rounded-l-full rounded-r-none ${stat.barColor} shrink-0`}></div>
              <div className="flex gap-8 w-full pr-4">
                {stat.items.map((item, idx) => (
                  <div key={idx} className="flex flex-col justify-center">
                    <span className="text-sm text-[#171C3C]/60 font-medium whitespace-nowrap mb-1">{item.label}</span>
                    <span className="text-xl font-semibold text-[#171C3C] tracking-tight">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Section */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Registrations */}
          <div className="bg-[#D1CAF2]/10 rounded-2xl border border-[#D1CAF2]/40 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-[#D1CAF2]/30 flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#171C3C]">New Registrations</h2>
              <button className="text-sm text-[#171C3C] hover:text-[#98C4EC] transition-colors font-medium">View All</button>
            </div>
            <div className="flex flex-col">
              {recentRegistrations.map((user, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 hover:bg-white/60 transition-all duration-200 cursor-pointer border-b border-[#D1CAF2]/20 last:border-0 group hover:pl-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full ${user.avatarColor} flex items-center justify-center text-sm font-bold text-white shadow-sm`}>
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#171C3C] group-hover:text-[#98C4EC] transition-colors text-sm">{user.name}</h4>
                      <p className="text-xs text-[#171C3C]/60">{user.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-[#171C3C]/60">{user.date}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${user.status === 'Active' ? 'bg-[#98C4EC]/20 text-[#98C4EC]' : 'bg-[#FE9E8F]/20 text-[#FE9E8F]'} font-medium`}>
                      {user.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders - Replaces System Reports */}
          <div className="bg-[#98C4EC]/10 rounded-2xl border border-[#98C4EC]/40 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-[#98C4EC]/30 flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#171C3C]">Recent Orders</h2>
              <button className="text-sm text-[#171C3C] hover:text-[#98C4EC] transition-colors font-medium">View All</button>
            </div>
            <div className="flex flex-col">
              {recentOrders.map((order, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 hover:bg-white/60 transition-all duration-200 cursor-pointer border-b border-[#98C4EC]/20 last:border-0 hover:pl-6">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-[#D1CAF2]/30 rounded-lg">
                      <ShoppingBag className="w-5 h-5 text-[#171C3C]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#171C3C] text-sm">{order.product}</h4>
                      <p className="text-xs text-[#171C3C]/60">
                        by {order.buyer} • <span className="text-[#171C3C] font-medium">{order.amount}</span>
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${order.color} font-medium`}>
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side Panel */}
        <div className="space-y-8">
          {/* Admin Activity */}
          <div className="bg-[#FE9E8F]/10 p-6 rounded-2xl border border-[#FE9E8F]/40 shadow-sm">
            <h2 className="text-xl font-bold text-[#171C3C] mb-6">Recent Activity</h2>
            <div className="space-y-6">
              {adminActivity.map((activity, index) => (
                <div key={index} className="flex gap-4 items-start relative px-2 hover:translate-x-1 transition-transform duration-200">
                  <div className="absolute left-6 top-10 bottom-[-24px] w-0.5 bg-[#D1CAF2]/30 last:hidden"></div>
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#D1CAF2] to-[#98C4EC] flex items-center justify-center text-xs font-bold border-2 border-white shadow-sm z-10 shrink-0 text-[#171C3C]">
                    {activity.avatar}
                  </div>
                  <div>
                    <p className="text-sm text-[#171C3C]">
                      <span className="font-bold text-[#171C3C]">{activity.user}</span>{" "}
                      {activity.action}{" "}
                      <span className="text-[#FE9E8F] font-medium">{activity.target}</span>
                    </p>
                    <p className="text-xs text-[#171C3C]/60 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performing Artists - Switched to Right Side */}
          <div className="bg-white p-6 rounded-2xl border border-[#D1CAF2]/40 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#171C3C]">Top Artists</h3>
              <TrendingUp className="w-5 h-5 text-[#171C3C]/50" />
            </div>

            <div className="space-y-4">
              {topArtists.map((artist, idx) => (
                <div key={idx} className="flex items-center justify-between hover:bg-[#D1CAF2]/10 p-2 rounded-lg transition-colors cursor-pointer -mx-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${artist.avatarColor} flex items-center justify-center text-xs font-bold text-white shadow-sm`}>
                      {artist.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#171C3C]">{artist.name}</h4>
                      <p className="text-xs text-[#171C3C]/60">{artist.artworks} Artworks</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#171C3C]">{artist.likes}</p>
                    <div className="flex items-center gap-1 justify-end">
                      <Star className="w-3 h-3 text-[#FE9E8F] fill-[#FE9E8F]" />
                      <span className="text-xs text-[#171C3C]/60">{artist.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
