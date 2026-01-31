import React from 'react';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';

export default function Events() {
    return (
        <div className="w-full h-full bg-white text-[#171C3C] p-8 overflow-y-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#171C3C] via-[#FE9E8F] to-[#D1CAF2]">
                    Events
                </h1>
                <p className="text-[#171C3C]/70 mt-2">
                    Stay updated with our upcoming exhibitions and events.
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-[#FE9E8F]/10 p-6 rounded-xl border border-[#FE9E8F]/40 hover:shadow-lg transition-shadow">
                    <Calendar className="w-8 h-8 text-[#FE9E8F] mb-3" />
                    <h3 className="text-2xl font-bold text-[#171C3C]">20+</h3>
                    <p className="text-sm text-[#171C3C]/60">Exhibitions</p>
                </div>

                <div className="bg-[#98C4EC]/10 p-6 rounded-xl border border-[#98C4EC]/40 hover:shadow-lg transition-shadow">
                    <Clock className="w-8 h-8 text-[#98C4EC] mb-3" />
                    <h3 className="text-2xl font-bold text-[#171C3C]">5</h3>
                    <p className="text-sm text-[#171C3C]/60">Upcoming</p>
                </div>

                <div className="bg-[#D1CAF2]/10 p-6 rounded-xl border border-[#D1CAF2]/40 hover:shadow-lg transition-shadow">
                    <Users className="w-8 h-8 text-[#D1CAF2] mb-3" />
                    <h3 className="text-2xl font-bold text-[#171C3C]">2000+</h3>
                    <p className="text-sm text-[#171C3C]/60">Attendees</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-[#171C3C]/20 hover:shadow-lg transition-shadow">
                    <MapPin className="w-8 h-8 text-[#171C3C]/60 mb-3" />
                    <h3 className="text-2xl font-bold text-[#171C3C]">3</h3>
                    <p className="text-sm text-[#171C3C]/60">Venues</p>
                </div>
            </div>

            {/* Content Placeholder */}
            <div className="bg-gradient-to-br from-[#FE9E8F]/10 via-white to-[#D1CAF2]/10 rounded-2xl border border-[#FE9E8F]/40 p-12 text-center">
                <Calendar className="w-16 h-16 text-[#FE9E8F] mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-[#171C3C] mb-2">Upcoming Events</h2>
                <p className="text-[#171C3C]/60">Join us for exclusive art exhibitions and cultural events</p>
            </div>
        </div>
    );
}
