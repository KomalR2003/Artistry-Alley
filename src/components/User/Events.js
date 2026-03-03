'use client';
import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Clock, Search, Filter, X, Loader2, IndianRupee, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Events() {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('all');

    const [stats, setStats] = useState({
        total: 0,
        exhibitions: 0,
        freeEvents: 0,
        paidEvents: 0
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        filterEvents();
    }, [events, searchQuery, selectedType]);

    const fetchEvents = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/events');
            const data = await response.json();

            if (data.success) {
                // Only show upcoming or ongoing events (filter out past events based on endDate)
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const activeEvents = data.events.filter(evt => {
                    const eventEndDate = new Date(evt.endDate || evt.startDate);
                    return eventEndDate >= today;
                });

                setEvents(activeEvents);

                // Calculate stats
                const total = activeEvents.length;
                const exhibitions = activeEvents.filter(e => e.eventType === 'Exhibition').length;
                const freeEvents = activeEvents.filter(e => e.isFree).length;
                const paidEvents = activeEvents.filter(e => !e.isFree).length;

                setStats({ total, exhibitions, freeEvents, paidEvents });
            } else {
                setError(data.error || 'Failed to fetch events');
            }
        } catch (err) {
            setError('An error occurred while fetching events');
            console.error('Error fetching events:', err);
        } finally {
            setLoading(false);
        }
    };

    const filterEvents = () => {
        let filtered = [...events];

        // Filter by type
        if (selectedType !== 'all') {
            filtered = filtered.filter(e => e.eventType === selectedType);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(e =>
                e.title.toLowerCase().includes(query) ||
                e.description.toLowerCase().includes(query) ||
                e.location.toLowerCase().includes(query) ||
                (e.artistId?.username && e.artistId.username.toLowerCase().includes(query))
            );
        }

        setFilteredEvents(filtered);
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedType('all');
    };

    return (
        <div className="w-full h-full bg-white text-[#171C3C] p-8 overflow-y-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#171C3C] via-[#98C4EC] to-[#FE9E8F]">
                    Events & Exhibitions
                </h1>
                <p className="text-[#171C3C]/70 mt-2">
                    Discover upcoming art exhibitions, workshops, and community events.
                </p>
            </div>

            {/* Quick Stats - Dashboard Style with Groups (Matching Artist Side) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 mb-10">
                {/* Event Stats Group */}
                <div className="flex flex-col">
                    <h3 className="text-xl font-semibold text-[#171C3C] mb-4 pl-1">Event Overview</h3>
                    <div className="flex items-center gap-4 px-2">
                        <div className="w-2.5 h-16 rounded-l-full rounded-r-none bg-[#FE9E8F] shrink-0"></div>
                        <div className="flex gap-8">
                            <div className="flex flex-col justify-center">
                                <span className="text-sm text-[#171C3C]/60 font-medium whitespace-nowrap mb-1">Total Upcoming</span>
                                <span className="text-2xl font-semibold text-[#171C3C] tracking-tight">{stats.total}</span>
                            </div>
                            <div className="flex flex-col justify-center">
                                <span className="text-sm text-[#171C3C]/60 font-medium whitespace-nowrap mb-1">Exhibitions</span>
                                <span className="text-2xl font-semibold text-[#171C3C] tracking-tight">{stats.exhibitions}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Entry Group */}
                <div className="flex flex-col">
                    <h3 className="text-xl font-semibold text-[#171C3C] mb-4 pl-1">Entry Types</h3>
                    <div className="flex items-center gap-4 px-2">
                        <div className="w-2.5 h-16 rounded-l-full rounded-r-none bg-[#98C4EC] shrink-0"></div>
                        <div className="flex gap-8">
                            <div className="flex flex-col justify-center">
                                <span className="text-sm text-[#171C3C]/60 font-medium whitespace-nowrap mb-1">Free Entry</span>
                                <span className="text-2xl font-semibold text-[#171C3C] tracking-tight">{stats.freeEvents}</span>
                            </div>
                            <div className="flex flex-col justify-center">
                                <span className="text-sm text-[#171C3C]/60 font-medium whitespace-nowrap mb-1">Paid Entry</span>
                                <span className="text-2xl font-semibold text-[#171C3C] tracking-tight">{stats.paidEvents}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="mb-8 flex flex-col md:flex-row gap-4">
                {/* Search Bar */}
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#171C3C]/40" />
                    <input
                        type="text"
                        placeholder="Search events, artists, or locations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#98C4EC] focus:ring-2 focus:ring-[#98C4EC]/20 transition-all"
                    />
                </div>

                {/* Type Filter */}
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#171C3C]/40 pointer-events-none" />
                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#98C4EC] focus:ring-2 focus:ring-[#98C4EC]/20 transition-all appearance-none bg-white cursor-pointer min-w-[200px]"
                    >
                        <option value="all">All Event Types</option>
                        <option value="Event">Events</option>
                        <option value="Exhibition">Exhibitions</option>
                    </select>
                </div>

                {/* Clear Filters */}
                {(searchQuery || selectedType !== 'all') && (
                    <button
                        onClick={clearFilters}
                        className="flex items-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-medium"
                    >
                        <X className="w-5 h-5" />
                        Clear
                    </button>
                )}
            </div>

            {/* Events Grid */}
            {loading ? (
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-[#98C4EC]" />
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            ) : filteredEvents.length === 0 ? (
                <div className="bg-[#98C4EC]/10 rounded-2xl border border-[#98C4EC]/40 p-12 text-center">
                    <Calendar className="w-16 h-16 text-[#98C4EC] mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-[#171C3C] mb-2">No Events Found</h2>
                    <p className="text-[#171C3C]/60 mb-6">
                        {events.length === 0
                            ? 'No upcoming events or exhibitions at the moment'
                            : 'Try adjusting your filters or search query'}
                    </p>
                    {(searchQuery || selectedType !== 'all') && (
                        <button
                            onClick={clearFilters}
                            className="px-6 py-3 bg-[#171C3C] text-white rounded-xl hover:bg-[#171C3C]/90 transition-all font-medium inline-flex items-center gap-2"
                        >
                            <X className="w-5 h-5" />
                            Clear Filters
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                    {filteredEvents.map((evt) => (
                        <div
                            key={evt._id}
                            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group flex flex-col h-full"
                        >
                            {/* Image Placeholder */}
                            <div className="relative h-56 bg-gradient-to-br from-[#D1CAF2]/20 to-[#98C4EC]/20 overflow-hidden shrink-0">
                                {evt.image ? (
                                    <img
                                        src={evt.image}
                                        alt={evt.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <ImageIcon className="w-16 h-16 text-[#98C4EC]/40" />
                                    </div>
                                )}

                                {/* Type Badge */}
                                <div className="absolute top-4 left-4">
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-sm ${evt.eventType === 'Exhibition'
                                        ? 'bg-[#FE9E8F] text-white'
                                        : 'bg-[#98C4EC] text-white'
                                        }`}>
                                        {evt.eventType}
                                    </span>
                                </div>
                                {/* Free/Paid Badge */}
                                <div className="absolute top-4 right-4">
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-sm flex items-center gap-1 ${evt.isFree
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {evt.isFree ? 'Free' : `₹${evt.price}`}
                                    </span>
                                </div>
                            </div>

                            {/* Event Details */}
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="mb-4">
                                    <h3 className="font-bold text-[#171C3C] text-xl mb-1 line-clamp-1 truncate" title={evt.title}>
                                        {evt.title}
                                    </h3>
                                    {evt.artistId?.username && (
                                        <p className="text-sm text-[#171C3C]/60 font-medium">Hosted by <span className="text-[#171C3C] underline decoration-[#98C4EC] decoration-2 underline-offset-2">{evt.artistId.username}</span></p>
                                    )}
                                </div>

                                <div className="space-y-3 mb-5">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 w-8 h-8 rounded-full bg-[#171C3C]/5 flex items-center justify-center shrink-0">
                                            <Calendar className="w-4 h-4 text-[#98C4EC]" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-[#171C3C]">Date</p>
                                            <p className="text-sm text-[#171C3C]/70">
                                                {new Date(evt.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                {new Date(evt.startDate).getTime() !== new Date(evt.endDate).getTime() &&
                                                    ` - ${new Date(evt.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 w-8 h-8 rounded-full bg-[#171C3C]/5 flex items-center justify-center shrink-0">
                                            <Clock className="w-4 h-4 text-[#D1CAF2]" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-[#171C3C]">Time</p>
                                            <p className="text-sm text-[#171C3C]/70 w-full">
                                                {evt.startTime} - {evt.endTime}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 w-8 h-8 rounded-full bg-[#171C3C]/5 flex items-center justify-center shrink-0">
                                            <MapPin className="w-4 h-4 text-[#FE9E8F]" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-[#171C3C]">Location</p>
                                            <p className="text-sm text-[#171C3C]/70 line-clamp-2" title={evt.location}>
                                                {evt.location}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="mt-auto pt-4 border-t border-gray-100">
                                    <p className="text-sm text-[#171C3C]/70 line-clamp-3 mb-4 min-h-[60px]">
                                        {evt.description}
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                                    <button
                                        onClick={() => {
                                            if (!evt.isFree) {
                                                toast.success('Please complete payment to book tickets. (Integration pending)');
                                            } else {
                                                toast.success('You have successfully registered for this event!');
                                            }
                                        }}
                                        className="flex-1 py-3 px-4 bg-[#171C3C] text-white rounded-xl hover:bg-[#171C3C]/90 transition-colors font-medium flex items-center justify-center gap-2 text-sm"
                                    >
                                        {evt.isFree ? 'Register Now' : 'Book Tickets'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
