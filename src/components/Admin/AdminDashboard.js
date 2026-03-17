import React, { useState, useEffect } from "react";
import {
  Users, Palette, DollarSign, Activity, Shield, AlertCircle,
  CheckCircle, Clock, MoreHorizontal, Search, ShoppingBag,
  TrendingUp, Star, Calendar, X, Save, Edit2
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState([
    {
      title: "User Statistics", barColor: "bg-[#98C4EC]", items: [
        { label: "Total Accounts", value: "0" }, { label: "Artists", value: "0" }, { label: "Users", value: "0" }
      ]
    },
    {
      title: "Gallery Overview", barColor: "bg-[#4ADE80]", items: [
        { label: "Total Arts", value: "0" }, { label: "Albums", value: "0" }, { label: "Likes", value: "0" }
      ]
    },
    {
      title: "Marketplace", barColor: "bg-[#C084FC]", items: [
        { label: "Products", value: "0" }, { label: "Orders", value: "0" }
      ]
    },
    {
      title: "Events", barColor: "bg-[#FE9E8F]", items: [
        { label: "Total Events", value: "0" }, { label: "Booked", value: "0" }
      ]
    }
  ]);

  const [recentArtists, setRecentArtists] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [systemActivities, setSystemActivities] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI States
  const [regTab, setRegTab] = useState('artists'); // 'artists' | 'users'
  const [editingUser, setEditingUser] = useState(null);

  // Fetch Dashboard Master API
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/dashboard");
      const json = await res.json();

      if (json.success && json.data) {
        setStats(json.data.stats || stats);
        setRecentArtists(json.data.recentArtists || []);
        setRecentUsers(json.data.recentUsers || []);
        setRecentOrders(json.data.recentOrders || []);
        setRecentEvents(json.data.recentEvents || []);
        setSystemActivities(json.data.systemActivities || []);
        setTopArtists(json.data.topArtists || []);
      }
    } catch (error) {
      console.error("Error fetching admin stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (user) => {
    setEditingUser({
      ...user,
      newName: user.name,
      newRole: user.role.toLowerCase()
    });
  };

  const closeEditModal = () => setEditingUser(null);

  const saveUserEdits = async () => {
    if (!editingUser) return;
    try {
      // Hitting the central user API endpoint
      const res = await fetch('/api/user/route', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: editingUser.id,
          username: editingUser.newName,
          role: editingUser.newRole
        })
      });
      const data = await res.json();
      if (data.success) {
        closeEditModal();
        fetchDashboardData(); // Refresh UI
      } else {
        alert(data.message || 'Failed to update user');
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const displayedRegistrations = regTab === 'artists' ? recentArtists : recentUsers;

  return (
    <div className="w-full h-full bg-[#FAFAFA] text-[#171C3C] p-8 overflow-y-auto custom-scrollbar relative">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black">
            Admin Dashboard
          </h1>
          <p className="text-[#171C3C]/70 mt-1">
            Overview of system performance, events, and user management.
          </p>
        </div>
        <div className="relative border border-[#D1CAF2]/40 rounded-lg overflow-hidden flex bg-white w-64">
          <div className="px-3 py-2 text-[#171C3C]/50 flex items-center justify-center">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search database..."
            className="flex-1 py-2 pr-4 bg-transparent text-sm focus:outline-none text-[#171C3C]"
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, index) => (
          <div key={index} className="flex flex-col  transition-shadow">
            <h3 className="text-lg font-bold text-[#171C3C] mb-4">{stat.title}</h3>
            <div className="flex items-center gap-4">
              <div className={`w-2 h-14 rounded-l-full ${stat.barColor} shrink-0`}></div>
              <div className="flex gap-6 w-full">
                {stat.items.map((item, idx) => (
                  <div key={idx} className="flex flex-col justify-center">
                    <span className="text-sm text-[#171C3C]/60 font-medium mb-1">{item.label}</span>
                    <span className="text-xl font-bold text-[#171C3C]">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT COLUMN: Registrations & Events */}
        <div className="lg:col-span-1 space-y-8">

          {/* Categorized Registrations */}
          <div className="bg-white rounded-2xl border border-[#D1CAF2]/40 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-[#D1CAF2]/30 flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#171C3C]">Registrations</h2>
              <div className="flex bg-[#D1CAF2]/20 rounded-lg p-1">
                <button onClick={() => setRegTab('artists')} className={`text-xs px-3 py-1 rounded-md font-bold transition-colors ${regTab === 'artists' ? 'bg-white text-[#171C3C] shadow-sm' : 'text-[#171C3C]/60 hover:text-[#171C3C]'}`}>Artists</button>
                <button onClick={() => setRegTab('users')} className={`text-xs px-3 py-1 rounded-md font-bold transition-colors ${regTab === 'users' ? 'bg-white text-[#171C3C] shadow-sm' : 'text-[#171C3C]/60 hover:text-[#171C3C]'}`}>Users</button>
              </div>
            </div>
            <div className="flex flex-col">
              {loading ? (
                <p className="text-sm text-gray-500 text-center py-6">Loading {regTab}...</p>
              ) : displayedRegistrations.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-6">No recent {regTab}.</p>
              ) : displayedRegistrations.map((user, idx) => (
                <div key={idx} className="flex flex-col p-4 border-b border-[#D1CAF2]/20 last:border-0 hover:bg-[#FAFAFA] transition-colors relative group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${user.avatarColor} bg-cover bg-center flex items-center justify-center text-sm font-bold text-white shadow-sm`} style={{ backgroundImage: user.profilePicture ? `url(${user.profilePicture})` : undefined }}>
                        {!user.profilePicture && (user.name && user.name.length > 0 ? user.name.charAt(0).toUpperCase() : 'U')}
                      </div>
                      <div>
                        <h4 className="font-bold text-[#171C3C] text-sm group-hover:text-[#98C4EC] transition-colors">{user.name || 'Anonymous'}</h4>
                        <p className="text-xs text-[#171C3C]/60 uppercase tracking-wider font-semibold">{user.role}</p>
                      </div>
                    </div>
                    {/* Action buttons appear on hover */}
                    <button onClick={() => openEditModal(user)} className="p-1.5 bg-[#D1CAF2]/30 text-[#171C3C] rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#D1CAF2]/60">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Events Display */}
          <div className="bg-[#FE9E8F]/10 rounded-2xl border border-[#FE9E8F]/40 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-[#FE9E8F]/30">
              <h2 className="text-xl font-bold text-[#171C3C]">Upcoming Details</h2>
            </div>
            <div className="p-5 flex flex-col gap-4">
              {loading ? (
                <p className="text-sm text-[#171C3C]/60 text-center py-2">Loading events...</p>
              ) : recentEvents.length === 0 ? (
                <p className="text-sm text-[#171C3C]/60 text-center py-2">No active events.</p>
              ) : recentEvents.map((event, idx) => (
                <div key={idx} className="bg-white p-3 rounded-xl border border-[#FE9E8F]/30 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-[#171C3C] text-sm">{event.title}</h4>
                    <span className="text-[10px] font-bold bg-[#FE9E8F]/20 text-[#FE9E8F] px-2 py-0.5 rounded-full uppercase">{event.status}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-semibold text-[#171C3C]/60">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-[#FE9E8F]" /> {event.date}</span>
                    <span>{event.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* MIDDLE COLUMN: Orders & Top Artists */}
        <div className="lg:col-span-1 space-y-8">

          {/* Top Artists Widget */}
          <div className="bg-white rounded-2xl border border-[#D1CAF2]/40 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-[#D1CAF2]/30 flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#171C3C]">Top Artists</h2>
              <TrendingUp className="w-5 h-5 text-[#4ADE80]" />
            </div>
            <div className="flex flex-col p-2">
              {loading ? (
                <p className="text-sm text-[#171C3C]/60 text-center py-4">Calculating rankings...</p>
              ) : topArtists.length === 0 ? (
                <p className="text-sm text-[#171C3C]/60 text-center py-4">No artists evaluated yet.</p>
              ) : topArtists.map((artist, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 hover:bg-[#FAFAFA] rounded-xl transition-colors group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-6 font-bold text-[#D1CAF2] text-center">#{idx + 1}</div>
                    <div className={`w-8 h-8 rounded-full ${artist.avatarColor} bg-cover bg-center flex justify-center items-center text-xs font-bold text-white shadow-sm`} style={{ backgroundImage: artist.profilePicture ? `url(${artist.profilePicture})` : undefined }}>
                      {!artist.profilePicture && artist.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#171C3C] text-sm">{artist.name}</h4>
                      <p className="text-[11px] text-[#171C3C]/60 font-semibold">{artist.artworks} Entries</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 justify-end font-bold text-[#171C3C] text-sm">
                      <Star className="w-3 h-3 text-[#FE9E8F] fill-[#FE9E8F]" /> {artist.rating}
                    </div>
                    <p className="text-[11px] text-[#4ADE80] font-bold">{artist.likes?.length || 0} Likes</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders Display */}
          <div className="bg-[#98C4EC]/10 rounded-2xl border border-[#98C4EC]/40 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-[#98C4EC]/30">
              <h2 className="text-xl font-bold text-[#171C3C]">Latest Marketplace Transactions</h2>
            </div>
            <div className="flex flex-col">
              {loading ? (
                <p className="text-sm text-[#171C3C]/60 text-center py-6">Loading orders...</p>
              ) : recentOrders.length === 0 ? (
                <p className="text-sm text-[#171C3C]/60 text-center py-6">No recent orders yet.</p>
              ) : recentOrders.map((order, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 hover:bg-white/60 transition-colors border-b border-[#98C4EC]/20 last:border-0 group cursor-default">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-white rounded-xl shadow-sm border border-[#98C4EC]/20 text-[#98C4EC] group-hover:scale-110 transition-transform">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#171C3C] text-sm">{order.product}</h4>
                      <p className="text-[11px] text-[#171C3C]/60 font-semibold mt-0.5">
                        <span className="text-[#171C3C]">{order.buyer}</span> paid <span className="text-[#4ADE80]">{order.amount}</span>
                      </p>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2.5 py-1 rounded-md uppercase font-bold tracking-wider ${order.color}`}>
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: System Live Action Feed */}
        <div className="lg:col-span-1">
          <div className="bg-[#171C3C] rounded-2xl border border-[#D1CAF2]/20 overflow-hidden shadow-md h-full min-h-[500px] flex flex-col p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-3 h-3 bg-[#4ADE80] rounded-full animate-pulse shadow-[0_0_10px_#4ADE80]"></div>
              <h2 className="text-xl font-bold text-white">Live System Feed</h2>
            </div>

            <div className="flex-1 space-y-6">
              {loading ? (
                <p className="text-sm text-white/50 text-center">Syncing timeline...</p>
              ) : systemActivities.length === 0 ? (
                <p className="text-sm text-white/50 text-center">System idle.</p>
              ) : systemActivities.map((act, idx) => (
                <div key={idx} className="flex gap-4 items-start relative pb-6 last:pb-0 group">
                  <div className="absolute left-4 top-10 bottom-0 w-px bg-white/10 group-last:hidden"></div>
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold border border-white/20 shadow-sm z-10 shrink-0 text-white backdrop-blur-md">
                    {typeof act.avatar === 'string' && act.avatar.length > 0 ? act.avatar.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <div className="flex-1 mt-1">
                    <p className="text-sm text-white/90">
                      <span className="font-bold text-white">{act.user}</span>{" "}
                      <span className="text-white/60">{act.action}</span>{" "}
                      <span className="font-bold text-[#D1CAF2]">{act.target}</span>
                    </p>
                    <p className="text-[10px] text-[#FE9E8F] font-bold mt-1.5 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3 h-3" /> {act.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Edit User Modal Overlay */}
      {editingUser && (
        <div className="absolute inset-0 z-50 bg-[#171C3C]/80 backdrop-blur-sm flex items-center justify-center p-4 min-h-[600px] overflow-hidden">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-fade-in relative border border-[#D1CAF2]">
            {/* Close Button */}
            <button onClick={closeEditModal} className="absolute right-6 top-6 text-[#171C3C]/40 hover:text-[#FE9E8F] transition-colors p-1 bg-gray-100 rounded-full hover:bg-gray-200">
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-black text-[#171C3C] mb-6 tracking-tight">Modify Account</h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#171C3C]/60 uppercase tracking-wider mb-2 block pl-1">Display Name</label>
                <input
                  type="text"
                  value={editingUser.newName}
                  onChange={(e) => setEditingUser({ ...editingUser, newName: e.target.value })}
                  className="w-full bg-[#FAFAFA] border border-[#D1CAF2]/40 rounded-xl px-4 py-3 text-[#171C3C] font-semibold focus:outline-none focus:border-[#98C4EC] focus:ring-1 focus:ring-[#98C4EC]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#171C3C]/60 uppercase tracking-wider mb-2 block pl-1">Role Configuration</label>
                <select
                  value={editingUser.newRole}
                  onChange={(e) => setEditingUser({ ...editingUser, newRole: e.target.value })}
                  className="w-full bg-[#FAFAFA] border border-[#D1CAF2]/40 rounded-xl px-4 py-3 text-[#171C3C] font-semibold focus:outline-none focus:border-[#98C4EC] focus:ring-1 focus:ring-[#98C4EC] appearance-none"
                >
                  <option value="user">Standard User</option>
                  <option value="artist">Artist Account</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button onClick={closeEditModal} className="flex-1 py-3 px-4 bg-gray-100 text-[#171C3C] rounded-xl font-bold hover:bg-gray-200 transition-colors">Cancel</button>
              <button onClick={saveUserEdits} className="flex-[2] py-3 px-4 bg-[#171C3C] text-white rounded-xl font-bold shadow-md hover:bg-[#171C3C]/90 transition-all flex justify-center items-center gap-2">
                <Save className="w-4 h-4" /> Save Configuration
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
