import React from 'react';
import { Activity, Heart, ShoppingBag, Eye, Package } from 'lucide-react';

export default function Dashboard({ onNavigate }) {
    return (
        <div className="w-full h-full bg-white text-[#171C3C] p-8 overflow-y-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#171C3C] via-[#98C4EC] to-[#D1CAF2]">
                    User Dashboard
                </h1>
                <p className="text-[#171C3C]/70 mt-2">
                    Welcome to your dashboard space.
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-[#98C4EC]/10 p-6 rounded-xl border border-[#98C4EC]/40 hover:shadow-lg transition-shadow">
                    <Eye className="w-8 h-8 text-[#98C4EC] mb-3" />
                    <h3 className="text-2xl font-bold text-[#171C3C]">42</h3>
                    <p className="text-sm text-[#171C3C]/60">Gallery Views</p>
                </div>

                <div className="bg-[#D1CAF2]/10 p-6 rounded-xl border border-[#D1CAF2]/40 hover:shadow-lg transition-shadow">
                    <Heart className="w-8 h-8 text-[#D1CAF2] mb-3" />
                    <h3 className="text-2xl font-bold text-[#171C3C]">18</h3>
                    <p className="text-sm text-[#171C3C]/60">Favorites</p>
                </div>

                <div
                    onClick={() => onNavigate && onNavigate('My Orders')}
                    className="bg-[#FE9E8F]/10 p-6 rounded-xl border border-[#FE9E8F]/40 hover:shadow-lg transition-all cursor-pointer hover:scale-105"
                >
                    <ShoppingBag className="w-8 h-8 text-[#FE9E8F] mb-3" />
                    <h3 className="text-2xl font-bold text-[#171C3C]">5</h3>
                    <p className="text-sm text-[#171C3C]/60">Purchases</p>
                    <p className="text-xs text-[#FE9E8F] mt-2 font-semibold">View Orders →</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-[#171C3C]/20 hover:shadow-lg transition-shadow">
                    <Activity className="w-8 h-8 text-[#171C3C]/60 mb-3" />
                    <h3 className="text-2xl font-bold text-[#171C3C]">Active</h3>
                    <p className="text-sm text-[#171C3C]/60">Account Status</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div
                    onClick={() => onNavigate && onNavigate('My Orders')}
                    className="bg-gradient-to-br from-[#FE9E8F]/10 to-[#FE9E8F]/5 rounded-2xl border border-[#FE9E8F]/40 p-8 hover:shadow-xl transition-all cursor-pointer group"
                >
                    <div className="flex items-start justify-between">
                        <div>
                            <Package className="w-12 h-12 text-[#FE9E8F] mb-4 group-hover:scale-110 transition-transform" />
                            <h2 className="text-2xl font-bold text-[#171C3C] mb-2">My Orders</h2>
                            <p className="text-[#171C3C]/60 mb-4">Track your purchases and order status</p>
                            <button className="px-6 py-2 bg-[#FE9E8F] text-white rounded-lg hover:bg-[#fe8e7f] transition-colors font-semibold">
                                View All Orders →
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-[#98C4EC]/10 to-[#D1CAF2]/10 rounded-2xl border border-[#98C4EC]/40 p-8 hover:shadow-xl transition-all">
                    <Activity className="w-12 h-12 text-[#98C4EC] mb-4" />
                    <h2 className="text-2xl font-bold text-[#171C3C] mb-2">Your Activity</h2>
                    <p className="text-[#171C3C]/60">Track your interactions with artworks, purchases, and favorites</p>
                </div>
            </div>
        </div>
    );
}
