'use client';
import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Clock, Search, Filter, X, Loader2, IndianRupee, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Events({ onNavigate }) {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('all');

    // Registration State
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [detailsEvent, setDetailsEvent] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [registrationData, setRegistrationData] = useState({
        name: '',
        email: '',
        phone: '',
        tickets: 1
    });

    // Load Razorpay Script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

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

    const openRegisterModal = (evt) => {
        setSelectedEvent(evt);
        setIsRegisterModalOpen(true);
        // Reset form or prepopulate if user is logged in (optional implementation)
        setRegistrationData({ name: '', email: '', phone: '', tickets: 1 });
    };

    const openDetailsModal = (evt) => {
        setDetailsEvent(evt);
        setIsDetailsModalOpen(true);
    };

    const handleRegisterFromDetails = () => {
        setIsDetailsModalOpen(false);
        openRegisterModal(detailsEvent);
    };

    const handleRegistrationChange = (e) => {
        const { name, value } = e.target;
        setRegistrationData(prev => ({ ...prev, [name]: value }));
    };

    const handleRegistrationSubmit = async (e) => {
        e.preventDefault();

        if (!registrationData.name || !registrationData.email || !registrationData.phone) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsProcessing(true);

        try {
            if (selectedEvent.isFree) {
                // Free Event Flow
                toast.loading('Registering...', { id: 'evt-reg' });
                const res = await fetch('/api/events/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        eventId: selectedEvent._id,
                        customerDetails: registrationData,
                        tickets: registrationData.tickets,
                        isFree: true,
                        totalAmount: 0
                    })
                });
                const data = await res.json();
                if (res.ok && data.success) {
                    toast.success('Registration successful! Check your email.', { id: 'evt-reg' });
                    setIsRegisterModalOpen(false);
                    if (onNavigate) {
                        onNavigate('EventSuccess', {
                            registrationId: data.registrationId,
                            event: selectedEvent,
                            customerDetails: registrationData,
                            tickets: registrationData.tickets,
                            isFree: true
                        });
                    }
                } else {
                    throw new Error(data.error || 'Registration failed');
                }
                setIsProcessing(false);
            } else {
                // Paid Event Flow
                const amount = selectedEvent.price * registrationData.tickets;

                // 1. Create order
                const res = await fetch('/api/payment/create-order', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount })
                });
                const data = await res.json();

                if (!res.ok || !data.success) {
                    throw new Error(data.error || 'Failed to initialize payment');
                }

                const rzpKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

                if (data.isMock || !rzpKey || rzpKey === 'undefined' || rzpKey.includes('placeholder')) {
                    toast.success('Mock Payment Processing...', { id: 'evt-reg' });

                    await new Promise(r => setTimeout(r, 1500));

                    const verifyRes = await fetch('/api/events/register', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            eventId: selectedEvent._id,
                            customerDetails: registrationData,
                            tickets: registrationData.tickets,
                            totalAmount: amount,
                            isFree: false,
                            isMock: true,
                            razorpay_order_id: data.order.id,
                            razorpay_payment_id: `mock_pay_${Date.now()}`,
                            razorpay_signature: 'mock_signature'
                        })
                    });

                    const verifyData = await verifyRes.json();
                    if (verifyRes.ok && verifyData.success) {
                        toast.success('Registration and mock payment successful!', { id: 'evt-reg' });
                        setIsRegisterModalOpen(false);
                        fetchEvents(); // Refresh to update tickets
                        if (onNavigate) {
                            onNavigate('EventSuccess', {
                                registrationId: verifyData.registrationId,
                                event: selectedEvent,
                                customerDetails: registrationData,
                                tickets: registrationData.tickets,
                                isFree: false
                            });
                        }
                    } else {
                        throw new Error(verifyData.error || 'Payment verification failed');
                    }
                    setIsProcessing(false);
                    return;
                }

                // 2. Open Razorpay
                const options = {
                    key: rzpKey,
                    amount: data.order.amount,
                    currency: data.order.currency,
                    name: "Artistry Gallery Events",
                    description: `Registration for ${selectedEvent.title}`,
                    image: "/logo.png",
                    order_id: data.order.id,
                    handler: async function (response) {
                        try {
                            toast.loading('Verifying payment...', { id: 'evt-reg' });
                            const verifyRes = await fetch('/api/events/register', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    eventId: selectedEvent._id,
                                    customerDetails: registrationData,
                                    tickets: registrationData.tickets,
                                    totalAmount: amount,
                                    isFree: false,
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature
                                })
                            });

                            const verifyData = await verifyRes.json();
                            if (verifyRes.ok && verifyData.success) {
                                toast.success('Ticket booked successfully! Check your email.', { id: 'evt-reg' });
                                setIsRegisterModalOpen(false);
                                if (onNavigate) {
                                    onNavigate('EventSuccess', {
                                        registrationId: verifyData.registrationId,
                                        event: selectedEvent,
                                        customerDetails: registrationData,
                                        tickets: registrationData.tickets,
                                        isFree: false
                                    });
                                }
                            } else {
                                throw new Error(verifyData.error || 'Payment verification failed');
                            }
                        } catch (err) {
                            toast.error(err.message || 'Error processing registration', { id: 'evt-reg' });
                        } finally {
                            setIsProcessing(false);
                        }
                    },
                    prefill: {
                        name: registrationData.name,
                        email: registrationData.email,
                        contact: registrationData.phone
                    },
                    theme: { color: "#171C3C" },
                    modal: {
                        ondismiss: function () {
                            setIsProcessing(false);
                            toast.error('Payment cancelled');
                        }
                    }
                };

                const rzp = new window.Razorpay(options);
                rzp.on('payment.failed', function (response) {
                    setIsProcessing(false);
                    toast.error(response.error.description || 'Payment Failed');
                });
                rzp.open();
            }
        } catch (error) {
            console.error('Registration error:', error);
            toast.error(error.message || 'Registration failed. Please try again.');
            setIsProcessing(false);
        }
    };

    return (
        <div className="w-full h-full bg-[#FAFAFC] text-[#171C3C] p-3 md:p-10 overflow-y-auto relative">
            {/* Ambient Background Glows */}
            <div className="fixed top-0 left-0 w-full h-96 bg-gradient-to-br from-[#FE9E8F]/10 via-[#D1CAF2]/10 to-transparent pointer-events-none z-0"></div>
            <div className="fixed top-0 right-0 w-96 h-96 bg-[#98C4EC]/10 rounded-full blur-3xl pointer-events-none z-0"></div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
                    <div className="max-w-2xl">
                       
                        <h1 className="text-2xl md:text-4xl font-semibold text-[#171C3C] tracking-tight mb-4">
                            Exclusive <span className="text-[#171C3C]">Events</span>
                        </h1>
                        <p className="text-[#171C3C]/60 text-lg leading-relaxed font-medium">
                            Join our prestigious art exhibitions, exclusive workshops, and captivating gallery nights.
                        </p>
                    </div>

                    {/* Premium Stats Pill */}
                    <div className="flex gap-8 bg-white/80 backdrop-blur-md px-8 py-5 rounded-3xl border border-white shadow-[0_8px_30px_rgb(23,28,60,0.06)]">
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-black text-[#171C3C]">{stats.total}</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#171C3C]/50 mt-1">Upcoming</span>
                        </div>
                        <div className="w-px h-12 bg-gradient-to-b from-transparent via-[#171C3C]/10 to-transparent"></div>
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-black text-[#171C3C]">{stats.exhibitions}</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#171C3C]/50 mt-1">Exhibits</span>
                        </div>
                    </div>
                </div>

                {/* Filters & Search - Sleek design */}
                <div className="flex flex-col lg:flex-row gap-4 mb-12 items-center bg-white/80 backdrop-blur-xl p-3 rounded-3xl shadow-[0_8px_30px_rgb(23,28,60,0.04)] border border-white sticky top-4 z-20">
                    {/* Search */}
                    <div className="flex-1 relative w-full group">
                        <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#171C3C]/40 group-focus-within:text-[#98C4EC] transition-colors" />
                        <input
                            type="text"
                            placeholder="Discover events, artists, or locations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-transparent border-none focus:outline-none focus:ring-0 text-[#171C3C] placeholder-[#171C3C]/40 font-medium text-lg"
                        />
                    </div>

                    {/* Type Filters Pill Layout */}
                    <div className="w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 scrollbar-hide border-t lg:border-t-0 lg:border-l border-[#171C3C]/10 px-2 lg:pl-4">
                        <div className="flex gap-2 min-w-max items-center py-2 lg:py-0">
                            {[
                                { id: 'all', label: 'All Events' },
                                { id: 'Event', label: 'Workshops & Events' },
                                { id: 'Exhibition', label: 'Gallery Exhibits' }
                            ].map(type => (
                                <button
                                    key={type.id}
                                    onClick={() => setSelectedType(type.id)}
                                    className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 ${selectedType === type.id
                                        ? 'bg-[#171C3C] text-white shadow-lg shadow-[#171C3C]/20 scale-100'
                                        : 'bg-transparent text-[#171C3C]/60 hover:bg-[#D1CAF2]/20 hover:text-[#171C3C] scale-95 hover:scale-100'
                                        }`}
                                >
                                    {type.label}
                                </button>
                            ))}
                            {(searchQuery || selectedType !== 'all') && (
                                <button
                                    onClick={clearFilters}
                                    className="ml-2 p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all duration-300"
                                    title="Clear Filters"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Events Display */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center p-24 h-[50vh]">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-[#D1CAF2]/20 rounded-full"></div>
                            <div className="w-16 h-16 border-4 border-[#98C4EC] rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
                        </div>
                        <p className="mt-4 text-[#171C3C]/60 font-medium animate-pulse">Loading schedule...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center gap-4">
                        <X className="w-6 h-6" />
                        <span className="font-medium">{error}</span>
                    </div>
                ) : filteredEvents.length === 0 ? (
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white p-20 text-center shadow-[0_8px_30px_rgb(23,28,60,0.04)]">
                        <div className="w-24 h-24 bg-gradient-to-br from-[#FE9E8F] to-[#D1CAF2] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#FE9E8F]/40">
                            <Calendar className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-2xl font-semibold text-[#171C3C] mb-3">No Upcoming Events</h2>
                        <p className="text-[#171C3C]/60 mb-8 text-lg max-w-md mx-auto">
                            {events.length === 0
                                ? 'We are currently planning our next magnificent events. Check back soon.'
                                : 'We couldn\'t find any events matching your criteria.'}
                        </p>
                        {(searchQuery || selectedType !== 'all') && (
                            <button
                                onClick={clearFilters}
                                className="px-8 py-4 bg-[#171C3C] text-white rounded-2xl hover:bg-[#171C3C]/90 transition-all font-bold inline-flex items-center gap-3 shadow-xl shadow-[#171C3C]/20"
                            >
                                <Filter className="w-5 h-5" />
                                View All Events
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col gap-8">
                        {filteredEvents.map((evt) => (
                            <div
                                key={evt._id}
                                className="group relative flex flex-col md:flex-row bg-white rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border border-gray-100 min-h-[160px]"
                            >
                                {/* Left Side: Image */}
                                <div 
                                    className="w-full md:w-[25%] relative bg-gradient-to-br from-[#D1CAF2]/20 to-[#98C4EC]/20 overflow-hidden shrink-0 cursor-pointer"
                                    onClick={() => openDetailsModal(evt)}
                                >
                                    {evt.image ? (
                                        <img
                                            src={evt.image}
                                            alt={evt.title}
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full min-h-[160px]">
                                            <div className="w-16 h-16 bg-[#171C3C]/5 rounded-2xl flex items-center justify-center">
                                                <ImageIcon className="w-8 h-8 text-[#171C3C]/20" />
                                            </div>
                                        </div>
                                    )}

                                    {/* Event Type Badge */}
                                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                                        <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm ${evt.eventType === 'Exhibition'
                                            ? 'bg-[#FE9E8F] text-white'
                                            : 'bg-[#98C4EC] text-white'
                                            }`}>
                                            {evt.eventType}
                                        </span>
                                    </div>

                                    {/* Host Info Float */}
                                    {evt.artistId?.username && (
                                        <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-md px-3 py-2 rounded-lg shadow-sm flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#171C3C] to-[#98C4EC] flex items-center justify-center text-white font-bold text-[10px] uppercase">
                                                {evt.artistId.username[0]}
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-bold text-[#171C3C]/50 uppercase tracking-widest">Host</p>
                                                <p className="text-xs font-bold text-[#171C3C] truncate max-w-[80px]">{evt.artistId.username}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Horizontal Dashed Separator Line & Cutouts (visible on mobile only) */}
                                <div className="md:hidden flex flex-row items-center justify-between relative py-0 z-10 bg-white">
                                    <div className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-6 h-6 bg-[#FAFAFC] rounded-full shadow-inner border-r border-[#171C3C]/5"></div>
                                    <div className="w-full border-b-2 border-dashed border-[#171C3C]/10 h-[2px]"></div>
                                    <div className="absolute right-[-12px] top-1/2 -translate-y-1/2 w-6 h-6 bg-[#FAFAFC] rounded-full shadow-inner border-l border-[#171C3C]/5"></div>
                                </div>

                                {/* Middle Side: Info */}
                                <div className="flex-1 p-5 md:p-6 flex flex-col justify-center">
                                    <h3 className="font-semibold text-[#171C3C] text-xl mb-4 line-clamp-1 group-hover:text-[#98C4EC] transition-colors">
                                        {evt.title}
                                    </h3>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-[#D1CAF2]/20 flex items-center justify-center shrink-0 border border-[#D1CAF2]/40">
                                                <Calendar className="w-4 h-4 text-[#171C3C]" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-[#171C3C]/40 mb-0.5">Date</p>
                                                <p className="text-sm font-semibold text-[#171C3C]">
                                                    {new Date(evt.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                                    {new Date(evt.startDate).getTime() !== new Date(evt.endDate).getTime() &&
                                                        ` - ${new Date(evt.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-[#98C4EC]/20 flex items-center justify-center shrink-0 border border-[#98C4EC]/40">
                                                <Clock className="w-4 h-4 text-[#171C3C]" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-[#171C3C]/40 mb-0.5">Time</p>
                                                <p className="text-sm font-semibold text-[#171C3C]">
                                                    {evt.startTime}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 sm:col-span-2">
                                            <div className="w-10 h-10 rounded-xl bg-[#FE9E8F]/20 flex items-center justify-center shrink-0 border border-[#FE9E8F]/40">
                                                <MapPin className="w-4 h-4 text-[#171C3C]" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-[#171C3C]/40 mb-0.5">Location</p>
                                                <p className="text-sm font-semibold text-[#171C3C] line-clamp-1">
                                                    {evt.location}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-3 border-t border-[#171C3C]/5 flex justify-between items-center">
                                        <p className="text-[#171C3C]/70 line-clamp-2 text-xs flex-1 pr-4">
                                            {evt.description}
                                        </p>
                                        <span className="text-[#98C4EC] text-xs font-bold uppercase tracking-widest whitespace-nowrap hidden sm:block group-hover:translate-x-1 transition-transform">
                                            View Details &rarr;
                                        </span>
                                    </div>
                                </div>

                                {/* Dashed Separator Line & Cutouts for the Ticket Feel (visible on md+ only) */}
                                <div className="hidden md:flex flex-col items-center justify-between relative px-0 bg-white z-10">
                                    <div className="absolute top-[-16px] left-1/2 -translate-x-1/2 w-8 h-8 bg-[#FAFAFC] rounded-full shadow-inner border-b border-[#171C3C]/5 z-20"></div>
                                    <div className="h-full border-r-2 border-dashed border-[#171C3C]/10 w-[2px]"></div>
                                    <div className="absolute bottom-[-16px] left-1/2 -translate-x-1/2 w-8 h-8 bg-[#FAFAFC] rounded-full shadow-inner border-t border-[#171C3C]/5 z-20"></div>
                                </div>

                                {/* Right Side: Action Phase */}
                                <div className="w-full md:w-[22%] p-5 flex flex-col justify-center items-center bg-gradient-to-b from-white to-[#FAFAFC] text-center shrink-0 rounded-r-[1.5rem]">
                                    <div className="mb-4">
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-[#171C3C]/40 mb-1.5">Ticket Type</p>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${evt.isFree
                                            ? 'bg-green-100/50 text-green-700'
                                            : 'bg-[#D1CAF2]/30 text-[#171C3C]'
                                            }`}>
                                            {evt.isFree ? 'Free' : 'Paid'}
                                        </span>
                                    </div>

                                    <div className="mb-5">
                                        <div className="text-3xl font-black text-[#171C3C]">
                                            {evt.isFree ? 'Free' : `₹${evt.price}`}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => openRegisterModal(evt)}
                                        className="w-full py-3 px-4 bg-[#171C3C] text-white rounded-xl hover:bg-[#98C4EC] hover:text-[#171C3C] hover:-translate-y-0.5 transition-all duration-300 font-bold text-sm tracking-wide shadow-md shadow-[#171C3C]/10 group-hover:shadow-[#98C4EC]/30"
                                    >
                                        {evt.isFree ? 'Register' : 'Book'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Premium Ticket Registration Modal */}
            {isRegisterModalOpen && selectedEvent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Darker Blur Backdrop */}
                    <div className="absolute inset-0 bg-[#171C3C]/60 backdrop-blur-md transition-opacity" onClick={() => !isProcessing && setIsRegisterModalOpen(false)}></div>

                    <div className="relative bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl transform transition-all shadow-[0_30px_60px_rgba(23,28,60,0.3)]">
                        {/* Elegant Header */}
                        <div className="bg-gradient-to-r from-[#171C3C] to-[#252a5c] p-10 text-white text-center relative overflow-hidden">
                            <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-[#98C4EC]/20 rounded-full blur-2xl"></div>
                            <div className="absolute bottom-[-50px] left-[-50px] w-32 h-32 bg-[#FE9E8F]/20 rounded-full blur-2xl"></div>

                            <h2 className="text-2xl font-black mb-2 relative z-10">{selectedEvent.isFree ? 'Free Registration' : 'Book Tickets'}</h2>
                            <p className="text-white/70 font-medium text-sm px-4 relative z-10">
                                {selectedEvent.title}
                            </p>
                            <button
                                onClick={() => setIsRegisterModalOpen(false)}
                                disabled={isProcessing}
                                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white text-white hover:text-[#171C3C] transition-colors z-20 disabled:opacity-50"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Decorative Cutouts */}
                            <div className="absolute bottom-[-15px] left-[-15px] w-8 h-8 rounded-full bg-white"></div>
                            <div className="absolute bottom-[-15px] right-[-15px] w-8 h-8 rounded-full bg-white"></div>
                        </div>

                        <form onSubmit={handleRegistrationSubmit} className="p-8 space-y-6">
                            <div className="relative group">
                                <label className="block text-xs font-bold uppercase tracking-widest text-[#171C3C]/50 mb-2">Guest Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={registrationData.name}
                                    onChange={handleRegistrationChange}
                                    required
                                    className="w-full px-5 py-3.5 bg-[#FAFAFC] border border-[#171C3C]/10 rounded-2xl focus:bg-white focus:border-[#98C4EC] focus:ring-4 focus:ring-[#98C4EC]/20 focus:outline-none transition-all font-semibold text-[#171C3C]"
                                    placeholder="Enter your full name"
                                />
                            </div>

                            <div className="relative group">
                                <label className="block text-xs font-bold uppercase tracking-widest text-[#171C3C]/50 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={registrationData.email}
                                    onChange={handleRegistrationChange}
                                    required
                                    className="w-full px-5 py-3.5 bg-[#FAFAFC] border border-[#171C3C]/10 rounded-2xl focus:bg-white focus:border-[#FE9E8F] focus:ring-4 focus:ring-[#FE9E8F]/20 focus:outline-none transition-all font-semibold text-[#171C3C]"
                                    placeholder="your@email.com"
                                />
                            </div>

                            <div className="relative group">
                                <label className="block text-xs font-bold uppercase tracking-widest text-[#171C3C]/50 mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={registrationData.phone}
                                    onChange={handleRegistrationChange}
                                    required
                                    className="w-full px-5 py-3.5 bg-[#FAFAFC] border border-[#171C3C]/10 rounded-2xl focus:bg-white focus:border-[#D1CAF2] focus:ring-4 focus:ring-[#D1CAF2]/30 focus:outline-none transition-all font-semibold text-[#171C3C]"
                                    placeholder="+91 00000 00000"
                                />
                            </div>

                            <div className="pt-2 border-t border-[#171C3C]/5">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-xs font-bold uppercase tracking-widest text-[#171C3C]/50">Number of Tickets</label>
                                    <div className="text-xl font-black text-[#171C3C]">
                                        {selectedEvent.isFree ? 'Free' : `₹${selectedEvent.price * registrationData.tickets}`}
                                    </div>
                                </div>
                                <input
                                    type="number"
                                    name="tickets"
                                    min="1"
                                    max="10"
                                    value={registrationData.tickets}
                                    onChange={handleRegistrationChange}
                                    required
                                    className="w-full px-5 py-3.5 bg-[#FAFAFC] border border-[#171C3C]/10 rounded-2xl focus:bg-white focus:border-[#98C4EC] focus:ring-4 focus:ring-[#98C4EC]/20 focus:outline-none transition-all font-black text-[#171C3C] text-lg text-center"
                                />
                            </div>

                            <div className="pt-6 border-t border-[#171C3C]/5">
                                <button
                                    type="submit"
                                    disabled={isProcessing}
                                    className="w-full py-4 bg-[#171C3C] text-white rounded-2xl hover:bg-[#171C3C]/90 hover:-translate-y-1 transition-all shadow-xl shadow-[#171C3C]/20 font-black text-lg tracking-wide disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed flex justify-center items-center gap-3 overflow-hidden relative group"
                                >
                                    {/* Shimmer effect */}
                                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shimmer"></div>

                                    {isProcessing && <Loader2 className="w-6 h-6 animate-spin" />}
                                    <span className="relative z-10">
                                        {isProcessing ? 'Processing Request...' : (selectedEvent.isFree ? 'Confirm Registration' : 'Proceed to Checkout')}
                                    </span>
                                </button>
                                <p className="text-center text-[10px] uppercase font-bold text-[#171C3C]/40 tracking-widest mt-4">Safe & Secure Process</p>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
            {/* Event Full Details Modal */}
            {isDetailsModalOpen && detailsEvent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Darker Blur Backdrop */}
                    <div className="absolute inset-0 bg-[#171C3C]/60 backdrop-blur-md transition-opacity" onClick={() => setIsDetailsModalOpen(false)}></div>

                    <div className="relative bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
                        
                        {/* Event Image Banner */}
                        <div className="relative h-64 w-full bg-gray-100 shrink-0">
                            {detailsEvent.image ? (
                                <img src={detailsEvent.image} alt={detailsEvent.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-[#171C3C]/20 bg-gradient-to-br from-[#D1CAF2]/30 to-[#98C4EC]/30">
                                    <ImageIcon className="w-20 h-20 mb-2" />
                                </div>
                            )}
                            {/* Close Button */}
                            <button
                                onClick={() => setIsDetailsModalOpen(false)}
                                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors z-20"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            {/* Event Type Badge */}
                            <div className="absolute bottom-4 left-6">
                                <span className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest shadow-lg ${
                                    detailsEvent.eventType === 'Exhibition' ? 'bg-[#FE9E8F] text-white' : 'bg-[#98C4EC] text-white'
                                }`}>
                                    {detailsEvent.eventType || 'Event'}
                                </span>
                            </div>
                        </div>

                        {/* Event Details Body */}
                        <div className="p-8 md:p-10 flex-1">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-3xl font-black text-[#171C3C] mb-2">{detailsEvent.title}</h2>
                                    <p className="text-sm font-bold text-[#98C4EC] uppercase tracking-widest">
                                        By {detailsEvent.artistId?.name || 'Artistry Gallery'}
                                    </p>
                                </div>
                                <div className="text-right shrink-0 ml-4">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#171C3C]/40 mb-1">Ticket Option</p>
                                    <span className="text-2xl font-black text-[#171C3C]">
                                        {detailsEvent.isFree ? 'FREE ENTRY' : `₹${detailsEvent.price}`}
                                    </span>
                                </div>
                            </div>

                            <p className="text-[#171C3C]/80 leading-relaxed mb-8 text-sm md:text-base">
                                {detailsEvent.description || 'No description provided.'}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 border-t border-gray-100 pt-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-[#D1CAF2]/20 flex items-center justify-center shrink-0 border border-[#D1CAF2]/40 text-[#171C3C]">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest text-[#171C3C]/40 mb-1">Date</p>
                                        <p className="text-sm font-semibold text-[#171C3C]">
                                            {new Date(detailsEvent.startDate).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                        {detailsEvent.endDate && detailsEvent.endDate !== detailsEvent.startDate && (
                                            <p className="text-xs text-[#171C3C]/60 mt-0.5">
                                                to {new Date(detailsEvent.endDate).toLocaleDateString('en-GB', { month: 'long', day: 'numeric', year: 'numeric' })}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-[#98C4EC]/20 flex items-center justify-center shrink-0 border border-[#98C4EC]/40 text-[#171C3C]">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest text-[#171C3C]/40 mb-1">Time</p>
                                        <p className="text-sm font-semibold text-[#171C3C]">
                                            {detailsEvent.startTime || 'TBA'} {detailsEvent.endTime ? `- ${detailsEvent.endTime}` : ''}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-[#FE9E8F]/20 flex items-center justify-center shrink-0 border border-[#FE9E8F]/40 text-[#171C3C]">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest text-[#171C3C]/40 mb-1">Location</p>
                                        <p className="text-sm font-semibold text-[#171C3C]">
                                            {detailsEvent.location || 'Artistry Main Gallery'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200 text-[#171C3C]">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest text-[#171C3C]/40 mb-1">Capacity</p>
                                        <p className="text-sm font-semibold text-[#171C3C]">
                                            {detailsEvent.availableTickets !== undefined ? `${detailsEvent.availableTickets} tickets remaining` : 'Available for Booking'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 border-t border-gray-100 pt-8 mt-auto">
                                <button
                                    onClick={() => setIsDetailsModalOpen(false)}
                                    className="flex-1 py-4 bg-gray-50 text-[#171C3C] hover:bg-gray-100 rounded-2xl font-bold flex items-center justify-center transition-all border border-gray-200 shadow-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleRegisterFromDetails}
                                    disabled={detailsEvent.availableTickets === 0}
                                    className={`flex-1 py-4 text-white rounded-2xl font-black text-lg flex items-center justify-center transition-all shadow-xl ${
                                        detailsEvent.availableTickets === 0
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-[#171C3C] hover:bg-[#98C4EC] hover:text-[#171C3C] hover:-translate-y-1 shadow-[#171C3C]/20 hover:shadow-[#98C4EC]/30'
                                    }`}
                                >
                                    {detailsEvent.availableTickets === 0 ? 'Sold Out' : (detailsEvent.isFree ? 'Register Now' : 'Book Tickets')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
