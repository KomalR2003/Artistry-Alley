import React, { useState, useEffect } from 'react';
import { Calendar, CalendarCheck, CalendarClock, CalendarX, Trash2, MapPin, IndianRupee, Users, Search, AlertTriangle, X, Edit2, Save } from 'lucide-react';

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [eventToDelete, setEventToDelete] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/events');
      const result = await res.json();
      if (result.success) {
        setEvents(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  };

  // Derived Statistics
  const totalEvents = events.length;
  const upcomingEvents = events.filter(e => new Date(e.startDate || e.date) >= new Date()).length;
  const completedEvents = events.filter(e => new Date(e.startDate || e.date) < new Date()).length;
  const totalBookings = events.reduce((sum, e) => sum + (e.bookingCount || 0), 0);

  // Filter Events
  const filteredEvents = events.filter(e => {
    return (e.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.location || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.artistId?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
  });

  const confirmDelete = async () => {
    if (!eventToDelete) return;
    try {
      const res = await fetch(`/api/admin/events?id=${eventToDelete}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setEventToDelete(null);
        fetchEvents();
      } else {
        alert(data.message || 'Failed to delete event');
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const openEditModal = (event) => {
    setEditingEvent({
      id: event._id,
      title: event.title || '',
      description: event.description || '',
      eventType: event.eventType || 'Event',
      startDate: event.startDate ? new Date(event.startDate).toISOString().split('T')[0] : '',
      endDate: event.endDate ? new Date(event.endDate).toISOString().split('T')[0] : '',
      startTime: event.startTime || '',
      endTime: event.endTime || '',
      location: event.location || '',
      price: event.price || 0,
      isFree: event.isFree !== false,
      status: event.status || 'Upcoming'
    });
  };

  const saveEventEdits = async () => {
    if (!editingEvent) return;
    try {
      const res = await fetch('/api/admin/events', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingEvent)
      });
      const data = await res.json();
      if (data.success) {
        setEditingEvent(null);
        fetchEvents();
      } else {
        alert(data.message || 'Failed to update event');
      }
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  return (
    <div className="w-full h-full bg-[#FAFAFA] text-[#171C3C] p-8 overflow-y-auto relative custom-scrollbar">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black border-none">
            Manage Events
          </h1>
          <p className="text-[#171C3C]/70 mt-1">
            Oversee all platform events, bookings, and schedules.
          </p>
        </div>

        {/* Search */}
        <div className="relative border border-[#D1CAF2]/40 rounded-xl overflow-hidden flex bg-white w-64 shadow-sm">
          <div className="px-3 py-2 text-[#171C3C]/40 flex items-center justify-center">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search events or organizers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 py-2 pr-4 bg-transparent text-sm font-medium focus:outline-none text-[#171C3C]"
          />
        </div>
      </div>



      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="flex flex-col transition-shadow">
          <h3 className="text-lg font-bold text-[#171C3C] mb-4">Events Overview</h3>
          <div className="flex items-center gap-4">
            <div className="w-2 h-14 rounded-l-full bg-[#FE9E8F] shrink-0"></div>
            <div className="flex gap-6 w-full">
              <div className="flex flex-col justify-center">
                <span className="text-sm text-[#171C3C]/60 font-medium mb-1">Total Events</span>
                <span className="text-xl font-bold text-[#171C3C]">{loading ? 0 : totalEvents}</span>
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-sm text-[#171C3C]/60 font-medium mb-1">Total Bookings</span>
                <span className="text-xl font-bold text-[#171C3C]">{loading ? 0 : totalBookings}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col transition-shadow">
          <h3 className="text-lg font-bold text-[#171C3C] mb-4">Schedule Tracker</h3>
          <div className="flex items-center gap-4">
            <div className="w-2 h-14 rounded-l-full bg-[#98C4EC] shrink-0"></div>
            <div className="flex gap-6 w-full">
              <div className="flex flex-col justify-center">
                <span className="text-sm text-[#171C3C]/60 font-medium mb-1">Upcoming</span>
                <span className="text-xl font-bold text-[#171C3C]">{loading ? 0 : upcomingEvents}</span>
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-sm text-[#171C3C]/60 font-medium mb-1">Completed</span>
                <span className="text-xl font-bold text-[#171C3C]">{loading ? 0 : completedEvents}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* List Section */}
      <div className="bg-white rounded-2xl border border-[#D1CAF2]/40 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAFAFA] border-b border-[#D1CAF2]/30 text-xs uppercase tracking-wider text-[#171C3C]/50">
                <th className="p-5 font-bold">Event Banner</th>
                <th className="p-5 font-bold">Organizer</th>
                <th className="p-5 font-bold hidden md:table-cell">Location</th>
                <th className="p-5 font-bold">Date & Time</th>
                <th className="p-5 font-bold text-center">Status</th>
                <th className="p-5 font-bold text-center">Bookings</th>
                <th className="p-5 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-[#171C3C]/50 font-medium">Scraping event schedules...</td>
                </tr>
              ) : filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-[#171C3C]/50 font-medium">No scheduled events matched your criteria.</td>
                </tr>
              ) : filteredEvents.map((event, idx) => {
                const eventDate = new Date(event.startDate || event.date);
                const isPast = eventDate < new Date();

                return (
                  <tr key={idx} className="border-b border-[#D1CAF2]/10 hover:bg-[#FAFAFA]/50 transition-colors group">
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 rounded-lg bg-slate-100 overflow-hidden shadow-sm shrink-0 flex items-center justify-center">
                          {event.image ? (
                            <img src={event.image.startsWith('http') || event.image.startsWith('data:') ? event.image : `http://localhost:3000${event.image}`} alt={event.title} className="w-full h-full object-cover" />
                          ) : event.images && event.images.length > 0 ? (
                            <img src={event.images[0].startsWith('http') || event.images[0].startsWith('data:') ? event.images[0] : `http://localhost:3000${event.images[0]}`} alt={event.title} className="w-full h-full object-cover" />
                          ) : (
                            <Calendar className="w-5 h-5 text-slate-300" />
                          )}
                        </div>
                        <h4 className="font-bold text-black text-sm group-hover:text-[#98C4EC] transition-colors line-clamp-2 max-w-[200px]">
                          {event.title}
                        </h4>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#171C3C] bg-cover bg-center shrink-0" style={{ backgroundImage: event.artistId?.profilePicture ? `url(${event.artistId.profilePicture})` : undefined }}>
                          {!event.artistId?.profilePicture && <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-white">{(event.artistId?.name || 'A').charAt(0).toUpperCase()}</div>}
                        </div>
                        <span className="text-sm font-semibold text-black line-clamp-1">{event.artistId?.username || event.artistId?.name || 'Unknown Artist'}</span>
                      </div>
                    </td>
                    <td className="p-5 hidden md:table-cell">
                      <div className="flex items-center gap-1.5 text-sm text-black">
                        <MapPin className="w-4 h-4 text-[#D1CAF2]" />
                        <span className="line-clamp-1 truncate max-w-[150px]">{event.location || 'Online'}</span>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-black">
                          {isNaN(eventDate.getTime()) ? 'Date Unknown' : eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="text-xs text-black mt-0.5">{event.startTime || 'TBD'}</span>
                      </div>
                    </td>
                    <td className="p-5 text-center">
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md border ${isPast ? 'bg-gray-50 text-gray-500 border-gray-200' : 'bg-green-50 text-green-600 border-green-200'}`}>
                        {isPast ? 'Past' : 'Upcoming'}
                      </span>
                    </td>
                    <td className="p-5 text-center font-bold text-black">
                      {event.bookingCount || 0}
                    </td>
                    <td className="p-5">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(event)}
                          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors tooltip-trigger"
                          title="Edit Event"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEventToDelete(event._id)}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors tooltip-trigger"
                          title="Delete Event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Event Modal */}
      {editingEvent && (
        <div className="absolute inset-0 z-50 bg-[#171C3C]/80 backdrop-blur-sm flex items-center justify-center p-4 min-h-screen">
          <div className="bg-white rounded-3xl w-full max-w-2xl p-8 shadow-2xl animate-fade-in relative border border-[#D1CAF2] max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button onClick={() => setEditingEvent(null)} className="absolute right-6 top-6 text-[#171C3C]/40 hover:text-[#FE9E8F] transition-colors p-1 bg-gray-100 rounded-full hover:bg-gray-200">
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-black text-[#171C3C] mb-6 tracking-tight">Edit Event</h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#171C3C]/60 uppercase tracking-wider mb-2 block pl-1">Event Title</label>
                <input type="text" value={editingEvent.title} onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })} className="w-full bg-[#FAFAFA] border border-[#D1CAF2]/40 rounded-xl px-4 py-3 text-[#171C3C] font-semibold focus:outline-none focus:border-[#98C4EC]" />
              </div>

              <div>
                <label className="text-xs font-bold text-[#171C3C]/60 uppercase tracking-wider mb-2 block pl-1">Description</label>
                <textarea rows="3" value={editingEvent.description} onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })} className="w-full bg-[#FAFAFA] border border-[#D1CAF2]/40 rounded-xl px-4 py-3 text-[#171C3C] text-sm focus:outline-none focus:border-[#98C4EC] resize-none"></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#171C3C]/60 uppercase tracking-wider mb-2 block pl-1">Event Type</label>
                  <select value={editingEvent.eventType} onChange={(e) => setEditingEvent({ ...editingEvent, eventType: e.target.value })} className="w-full bg-[#FAFAFA] border border-[#D1CAF2]/40 rounded-xl px-4 py-3 text-[#171C3C] font-semibold focus:outline-none focus:border-[#98C4EC] appearance-none">
                    <option value="Event">Event</option>
                    <option value="Exhibition">Exhibition</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#171C3C]/60 uppercase tracking-wider mb-2 block pl-1">Status</label>
                  <select value={editingEvent.status} onChange={(e) => setEditingEvent({ ...editingEvent, status: e.target.value })} className="w-full bg-[#FAFAFA] border border-[#D1CAF2]/40 rounded-xl px-4 py-3 text-[#171C3C] font-semibold focus:outline-none focus:border-[#98C4EC] appearance-none">
                    <option value="Upcoming">Upcoming</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#171C3C]/60 uppercase tracking-wider mb-2 block pl-1">Start Date</label>
                  <input type="date" value={editingEvent.startDate} onChange={(e) => setEditingEvent({ ...editingEvent, startDate: e.target.value })} className="w-full bg-[#FAFAFA] border border-[#D1CAF2]/40 rounded-xl px-4 py-3 text-[#171C3C] font-semibold focus:outline-none focus:border-[#98C4EC]" />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#171C3C]/60 uppercase tracking-wider mb-2 block pl-1">End Date</label>
                  <input type="date" value={editingEvent.endDate} onChange={(e) => setEditingEvent({ ...editingEvent, endDate: e.target.value })} className="w-full bg-[#FAFAFA] border border-[#D1CAF2]/40 rounded-xl px-4 py-3 text-[#171C3C] font-semibold focus:outline-none focus:border-[#98C4EC]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#171C3C]/60 uppercase tracking-wider mb-2 block pl-1">Start Time</label>
                  <input type="time" value={editingEvent.startTime} onChange={(e) => setEditingEvent({ ...editingEvent, startTime: e.target.value })} className="w-full bg-[#FAFAFA] border border-[#D1CAF2]/40 rounded-xl px-4 py-3 text-[#171C3C] font-semibold focus:outline-none focus:border-[#98C4EC]" />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#171C3C]/60 uppercase tracking-wider mb-2 block pl-1">End Time</label>
                  <input type="time" value={editingEvent.endTime} onChange={(e) => setEditingEvent({ ...editingEvent, endTime: e.target.value })} className="w-full bg-[#FAFAFA] border border-[#D1CAF2]/40 rounded-xl px-4 py-3 text-[#171C3C] font-semibold focus:outline-none focus:border-[#98C4EC]" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#171C3C]/60 uppercase tracking-wider mb-2 block pl-1">Location</label>
                <input type="text" value={editingEvent.location} onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })} className="w-full bg-[#FAFAFA] border border-[#D1CAF2]/40 rounded-xl px-4 py-3 text-[#171C3C] font-semibold focus:outline-none focus:border-[#98C4EC]" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#171C3C]/60 uppercase tracking-wider mb-2 block pl-1">Pricing Model</label>
                  <select value={editingEvent.isFree} onChange={(e) => setEditingEvent({ ...editingEvent, isFree: e.target.value === 'true' })} className="w-full bg-[#FAFAFA] border border-[#D1CAF2]/40 rounded-xl px-4 py-3 text-[#171C3C] font-semibold focus:outline-none focus:border-[#98C4EC] appearance-none">
                    <option value="true">Free</option>
                    <option value="false">Paid</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#171C3C]/60 uppercase tracking-wider mb-2 block pl-1">Ticket Price (₹)</label>
                  <input type="number" disabled={editingEvent.isFree} value={editingEvent.price} onChange={(e) => setEditingEvent({ ...editingEvent, price: e.target.value })} className={`w-full bg-[#FAFAFA] border border-[#D1CAF2]/40 rounded-xl px-4 py-3 text-[#171C3C] font-semibold focus:outline-none focus:border-[#98C4EC] ${editingEvent.isFree ? 'opacity-50 cursor-not-allowed' : ''}`} />
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button onClick={() => setEditingEvent(null)} className="flex-1 py-3 px-4 bg-gray-100 text-[#171C3C] rounded-xl font-bold hover:bg-gray-200 transition-colors">Cancel</button>
              <button onClick={saveEventEdits} className="flex-[2] py-3 px-4 bg-[#171C3C] text-white rounded-xl font-bold hover:bg-[#171C3C]/90 transition-all flex justify-center items-center gap-2">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {eventToDelete && (
        <div className="absolute inset-0 z-50 bg-[#171C3C]/80 backdrop-blur-sm flex items-center justify-center p-4 min-h-screen">
          <div className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl animate-fade-in relative border border-red-200">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-center text-[#171C3C] mb-3">Expel Event?</h2>
            <p className="text-sm text-center text-[#171C3C]/70 mb-8 font-medium">This action is dangerous and irreversible. The event and all related user bookings will be instantly wiped.</p>

            <div className="flex gap-3">
              <button onClick={() => setEventToDelete(null)} className="flex-1 py-3 bg-gray-100 text-[#171C3C] rounded-xl font-bold hover:bg-gray-200 transition-colors">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 shadow-md shadow-red-500/20 transition-all">Yes, Expel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEvents;
