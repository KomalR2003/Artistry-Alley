import React from 'react';
import { Users, Award, Heart, Target } from 'lucide-react';

export default function OurTeam() {
    return (
        <div className="w-full h-full bg-white text-[#171C3C] p-8 overflow-y-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#171C3C] via-[#D1CAF2] to-[#FE9E8F]">
                    Our Team
                </h1>
                <p className="text-[#171C3C]/70 mt-2">
                    Meet the people behind Artistry.
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-[#D1CAF2]/10 p-6 rounded-xl border border-[#D1CAF2]/40 hover:shadow-lg transition-shadow">
                    <Users className="w-8 h-8 text-[#D1CAF2] mb-3" />
                    <h3 className="text-2xl font-bold text-[#171C3C]">30+</h3>
                    <p className="text-sm text-[#171C3C]/60">Team Members</p>
                </div>

                <div className="bg-[#FE9E8F]/10 p-6 rounded-xl border border-[#FE9E8F]/40 hover:shadow-lg transition-shadow">
                    <Award className="w-8 h-8 text-[#FE9E8F] mb-3" />
                    <h3 className="text-2xl font-bold text-[#171C3C]">15+</h3>
                    <p className="text-sm text-[#171C3C]/60">Artists</p>
                </div>

                <div className="bg-[#98C4EC]/10 p-6 rounded-xl border border-[#98C4EC]/40 hover:shadow-lg transition-shadow">
                    <Heart className="w-8 h-8 text-[#98C4EC] mb-3" />
                    <h3 className="text-2xl font-bold text-[#171C3C]">10+</h3>
                    <p className="text-sm text-[#171C3C]/60">Years</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-[#171C3C]/20 hover:shadow-lg transition-shadow">
                    <Target className="w-8 h-8 text-[#171C3C]/60 mb-3" />
                    <h3 className="text-2xl font-bold text-[#171C3C]">100%</h3>
                    <p className="text-sm text-[#171C3C]/60">Dedicated</p>
                </div>
            </div>

            {/* Content Placeholder */}
            <div className="bg-gradient-to-br from-[#D1CAF2]/10 via-white to-[#98C4EC]/10 rounded-2xl border border-[#D1CAF2]/40 p-12 text-center">
                <Users className="w-16 h-16 text-[#D1CAF2] mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-[#171C3C] mb-2">Meet Our Team</h2>
                <p className="text-[#171C3C]/60">Get to know the passionate individuals who make Artistry possible</p>
            </div>
        </div>
    );
}
