import React from 'react';
import { Calendar, CalendarCheck, CalendarClock, CalendarX } from 'lucide-react';

const ManageEvents = () => {
  return (
    <div className="w-full h-full bg-white text-[#171C3C] p-8 overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#171C3C] via-[#FE9E8F] to-[#D1CAF2]">
          Manage Events
        </h1>
        <p className="text-[#171C3C]/70 mt-2">
          Manage all events here
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#FE9E8F]/10 p-6 rounded-xl border border-[#FE9E8F]/40 hover:shadow-lg transition-shadow">
          <Calendar className="w-8 h-8 text-[#FE9E8F] mb-3" />
          <h3 className="text-2xl font-bold text-[#171C3C]">45</h3>
          <p className="text-sm text-[#171C3C]/60">Total Events</p>
        </div>

        <div className="bg-[#98C4EC]/10 p-6 rounded-xl border border-[#98C4EC]/40 hover:shadow-lg transition-shadow">
          <CalendarClock className="w-8 h-8 text-[#98C4EC] mb-3" />
          <h3 className="text-2xl font-bold text-[#171C3C]">18</h3>
          <p className="text-sm text-[#171C3C]/60">Upcoming</p>
        </div>

        <div className="bg-[#D1CAF2]/10 p-6 rounded-xl border border-[#D1CAF2]/40 hover:shadow-lg transition-shadow">
          <CalendarCheck className="w-8 h-8 text-[#D1CAF2] mb-3" />
          <h3 className="text-2xl font-bold text-[#171C3C]">27</h3>
          <p className="text-sm text-[#171C3C]/60">Completed</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#171C3C]/20 hover:shadow-lg transition-shadow">
          <CalendarX className="w-8 h-8 text-[#171C3C]/60 mb-3" />
          <h3 className="text-2xl font-bold text-[#171C3C]">13</h3>
          <p className="text-sm text-[#171C3C]/60">Bookings</p>
        </div>
      </div>

      {/* Content Placeholder */}
      <div className="bg-[#FE9E8F]/10 rounded-2xl border border-[#FE9E8F]/40 p-12 text-center">
        <Calendar className="w-16 h-16 text-[#FE9E8F] mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-[#171C3C] mb-2">Event Management</h2>
        <p className="text-[#171C3C]/60">Event management features will be implemented here</p>
      </div>
    </div>
  );
};

export default ManageEvents;
