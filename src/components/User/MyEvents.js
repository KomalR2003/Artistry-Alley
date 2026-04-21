'use client';
import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Ticket, Download, ArrowRight, X, User } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';

const MyEvents = () => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ticketDownloading, setTicketDownloading] = useState(null);
    const [filter, setFilter] = useState('all'); // all, upcoming, past

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const fetchRegistrations = async () => {
        try {
            setLoading(true);
            const userId = sessionStorage.getItem('userId');
            const email = sessionStorage.getItem('userEmail');

            if (!userId && !email) {
                setRegistrations([]);
                setLoading(false);
                return;
            }

            const response = await fetch(`/api/events/user/registrations?userId=${userId || ''}&email=${email || ''}`);
            const data = await response.json();

            if (data.success) {
                setRegistrations(data.registrations || []);
            } else {
                setRegistrations([]);
            }
        } catch (error) {
            console.error('Error fetching registrations:', error);
            setRegistrations([]);
        } finally {
            setLoading(false);
        }
    };

    const isUpcoming = (eventDate) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return new Date(eventDate) >= today;
    };

    const filteredRegistrations = registrations.filter(reg => {
        if (!reg.eventId?.startDate) return false;
        if (filter === 'all') return true;
        
        const upcoming = isUpcoming(reg.eventId.startDate);
        return filter === 'upcoming' ? upcoming : !upcoming;
    });

    const issueElectronicTicket = async (registration) => {
        const ticketId = `ticket-template-${registration._id}`;
        const ticketElement = document.getElementById(ticketId);
        
        if (!ticketElement) return;

        setTicketDownloading(registration._id);
        try {
            ticketElement.style.display = 'block';
            
            const imgData = await toPng(ticketElement, {
                pixelRatio: 2,
                backgroundColor: '#ffffff'
            });
            
            const canvasWidth = ticketElement.offsetWidth * 2;
            const canvasHeight = ticketElement.offsetHeight * 2;
            
            const pdf = new jsPDF('l', 'mm', 'a4'); // Landscape for ticket layout
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvasHeight * pdfWidth) / canvasWidth;
            
            // Center the ticket vertically on the A4 page
            const yOffset = (pdf.internal.pageSize.getHeight() - pdfHeight) / 2;
            
            pdf.addImage(imgData, 'PNG', 0, yOffset, pdfWidth, pdfHeight);
            pdf.save(`Artistry_Ticket_${registration.eventId.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
            
        } catch (error) {
            console.error("Failed to generate ticket PDF:", error);
        } finally {
            ticketElement.style.display = 'none';
            setTicketDownloading(null);
        }
    };

    if (loading) {
        return (
            <div className="flex-1 min-h-[60vh] flex flex-col items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
                <p className="text-gray-500 font-medium animate-pulse">Loading your upcoming events...</p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold text-[#171C3C] mb-2 flex items-center gap-3">
                        <Ticket className="w-8 h-8 text-[#98C4EC]" />
                        My Events
                    </h1>
                    <p className="text-[#171C3C]/60 text-lg">Manage your registrations and download your event tickets</p>
                </div>

                {/* Filters */}
                <div className="mb-8 flex flex-wrap gap-3">
                    {['all', 'upcoming', 'past'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm ${filter === status
                                    ? 'bg-[#171C3C] text-white shadow-md transform scale-105'
                                    : 'bg-white text-[#171C3C]/70 hover:bg-[#171C3C]/5 border border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)} Events
                        </button>
                    ))}
                </div>

                {/* Registrations List */}
                {filteredRegistrations.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                        <Calendar className="w-24 h-24 text-[#D1CAF2] mx-auto mb-6" />
                        <h3 className="text-2xl font-semibold text-[#171C3C] mb-2">No registrations found</h3>
                        <p className="text-[#171C3C]/50 text-lg">
                            {registrations.length === 0
                                ? "You haven't booked any tickets yet. Explore our upcoming events!"
                                : `You don't have any ${filter} events.`}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {filteredRegistrations.map((reg) => {
                            const event = reg.eventId;
                            const isPast = !isUpcoming(event.startDate);

                            return (
                                <div
                                    key={reg._id}
                                    className={`relative bg-white rounded-3xl overflow-hidden shadow-md border hover:shadow-xl transition-all duration-300 ${isPast ? 'border-gray-200 opacity-75' : 'border-[#98C4EC]/30'}`}
                                >
                                    <div className="flex flex-col md:flex-row h-full">
                                        {/* Event Image Column */}
                                        <div className="w-full md:w-[35%] relative overflow-hidden bg-gray-100 min-h-[250px]">
                                            {event.image ? (
                                                <img 
                                                    src={event.image} 
                                                    alt={event.title} 
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center absolute inset-0 text-[#171C3C]/20 bg-gradient-to-br from-[#D1CAF2]/20 to-[#98C4EC]/20">
                                                    <Ticket className="w-16 h-16" />
                                                </div>
                                            )}
                                            
                                            {/* Labels overlay */}
                                            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                                                <span className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest shadow-lg ${
                                                    event.eventType === 'Exhibition' ? 'bg-[#FE9E8F] text-white' : 'bg-[#98C4EC] text-white'
                                                }`}>
                                                    {event.eventType || 'Event'}
                                                </span>
                                            </div>
                                            
                                            {!isPast && (
                                                <div className="absolute bottom-4 left-4 right-4 z-10 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-white/50 text-center">
                                                    <p className="text-[#171C3C] text-xs font-black uppercase tracking-wider mb-1">Passes Issued</p>
                                                    <p className="text-xl font-bold text-[#171C3C]">{reg.tickets} Ticket(s)</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Event Details Column */}
                                        <div className="w-full md:w-[40%] p-6 md:p-8 flex flex-col justify-center border-r border-dashed border-gray-200 relative">
                                            {/* Separation Line Cutouts */}
                                            <div className="hidden md:block absolute top-[-16px] right-[-16px] w-8 h-8 rounded-full bg-gray-50 border-b border-gray-200 z-10"></div>
                                            <div className="hidden md:block absolute bottom-[-16px] right-[-16px] w-8 h-8 rounded-full bg-gray-50 border-t border-gray-200 z-10"></div>

                                            <div className="mb-4">
                                                <p className={`text-xs font-black uppercase tracking-widest mb-1 ${isPast ? 'text-gray-400' : 'text-[#98C4EC]'}`}>
                                                    {isPast ? 'Past Event' : 'Upcoming Schedule'}
                                                </p>
                                                <h3 className="text-2xl font-bold text-[#171C3C] line-clamp-2">{event.title}</h3>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-start gap-4">
                                                    <div className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center shrink-0 border ${isPast ? 'bg-gray-100 border-gray-200 text-gray-400' : 'bg-[#D1CAF2]/20 border-[#D1CAF2]/40 text-[#171C3C]'}`}>
                                                        <span className="text-[9px] font-bold uppercase leading-none mb-0.5">{new Date(event.startDate).toLocaleDateString('en-GB', { month: 'short' })}</span>
                                                        <span className="text-sm font-black leading-none">{new Date(event.startDate).getDate()}</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold uppercase tracking-widest text-[#171C3C]/40 mb-0.5">Date</p>
                                                        <p className="text-sm font-semibold text-[#171C3C]">
                                                            {new Date(event.startDate).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric' })}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-4">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${isPast ? 'bg-gray-100 border-gray-200 text-gray-400' : 'bg-[#98C4EC]/20 border-[#98C4EC]/40 text-[#171C3C]'}`}>
                                                        <Clock className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold uppercase tracking-widest text-[#171C3C]/40 mb-0.5">Time</p>
                                                        <p className="text-sm font-semibold text-[#171C3C]">{event.startTime || 'TBA'} {event.endTime ? `- ${event.endTime}` : ''}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-4">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${isPast ? 'bg-gray-100 border-gray-200 text-gray-400' : 'bg-[#FE9E8F]/20 border-[#FE9E8F]/40 text-[#171C3C]'}`}>
                                                        <MapPin className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold uppercase tracking-widest text-[#171C3C]/40 mb-0.5">Location</p>
                                                        <p className="text-sm font-semibold text-[#171C3C] line-clamp-1">{event.location || 'Artistry Main Gallery'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Column */}
                                        <div className="w-full md:w-[25%] p-6 md:p-8 bg-gradient-to-b from-white to-[#FAFAFC] flex flex-col justify-center items-center text-center">
                                            {/* User Details Box */}
                                            <div className="bg-white px-4 py-3 rounded-xl border border-gray-100 shadow-sm w-full mb-6">
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-[#171C3C]/40 mb-1">Registered To</p>
                                                <p className="text-sm font-bold text-[#171C3C] truncate">{reg.customerDetails?.name || sessionStorage.getItem('userName') || 'Guest'}</p>
                                                <p className="text-xs text-[#171C3C]/60 truncate">{reg.customerDetails?.email || sessionStorage.getItem('userEmail')}</p>
                                            </div>

                                            {/* Action Button */}
                                            {!isPast ? (
                                                <button
                                                    onClick={() => issueElectronicTicket(reg)}
                                                    disabled={ticketDownloading === reg._id}
                                                    className={`w-full py-4 text-white rounded-xl font-bold flex items-center justify-center gap-3 transition-all duration-300 shadow-lg ${
                                                        ticketDownloading === reg._id 
                                                        ? 'bg-gray-400 cursor-not-allowed' 
                                                        : 'bg-[#171C3C] hover:bg-[#98C4EC] hover:text-[#171C3C] hover:-translate-y-1 shadow-[#171C3C]/20 hover:shadow-[#98C4EC]/30'
                                                    }`}
                                                >
                                                    <Download className={`w-5 h-5 ${ticketDownloading === reg._id ? 'animate-bounce' : ''}`} />
                                                    {ticketDownloading === reg._id ? 'Generating...' : 'Download Ticket'}
                                                </button>
                                            ) : (
                                                <button
                                                    disabled
                                                    className="w-full py-4 bg-gray-100 text-gray-400 rounded-xl font-bold flex items-center justify-center gap-2 cursor-not-allowed border border-gray-200"
                                                >
                                                    <X className="w-5 h-5" />
                                                    Event Passed
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* OFF-SCREEN PRINTABLE RECEIPT FOR PDF */}
                                    <div 
                                        id={`ticket-template-${reg._id}`} 
                                        style={{ display: 'none' }}
                                        className="w-[800px] bg-white text-black p-12 font-sans absolute top-0 left-0 z-[-50]"
                                    >
                                        {/* Header */}
                                        <div className="border-b-2 border-black pb-6 mb-8 flex justify-between items-end">
                                            <div>
                                                <h1 className="text-4xl font-extrabold uppercase tracking-widest text-black">Artistry</h1>
                                                <p className="text-sm mt-2 text-gray-600 font-semibold tracking-wider">PREMIUM EVENT TICKET</p>
                                                <p className="text-xs mt-1 text-gray-500">123 Creative Avenue, Art District</p>
                                            </div>
                                            <div className="text-right">
                                                <h2 className="text-2xl font-bold uppercase tracking-widest text-gray-800 mb-2">Gate Pass</h2>
                                                <p className="text-sm font-bold text-black uppercase tracking-widest">{reg._id.slice(-8).toUpperCase()}</p>
                                                <p className="text-xs text-gray-500 mt-1">Status: {reg.isFree ? 'Free Registration' : 'Paid Confirmed'}</p>
                                            </div>
                                        </div>

                                        {/* Ticket Details */}
                                        <div className="mb-10 text-sm">
                                            <h3 className="font-bold text-gray-600 uppercase mb-2">Guest Details:</h3>
                                            <p className="font-bold text-2xl text-black">{reg.customerDetails?.name || sessionStorage.getItem('userName') || 'VIP'}</p>
                                            {reg.customerDetails?.email && <p className="text-gray-700">{reg.customerDetails.email}</p>}
                                        </div>

                                        {/* Event Table */}
                                        <div className="mb-10">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="border-b-2 border-black text-sm uppercase tracking-wide text-gray-700">
                                                        <th className="py-3 font-bold">Event Name</th>
                                                        <th className="py-3 font-bold text-center">Date & Time</th>
                                                        <th className="py-3 font-bold text-right">Location</th>
                                                        <th className="py-3 font-bold text-center">Admits</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-sm">
                                                    <tr className="border-b border-gray-200">
                                                        <td className="py-4 text-gray-800 font-bold text-lg">{event.title}<br/><span className="text-xs text-gray-500 font-normal uppercase tracking-wide mt-1 inline-block">{event.eventType || 'Event'}</span></td>
                                                        <td className="py-4 text-center text-gray-800 font-medium">{new Date(event.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}<br/><span className="text-gray-500 text-xs">{event.startTime || 'TBA'}</span></td>
                                                        <td className="py-4 text-right text-gray-800">{event.location || 'Artistry Main Gallery'}</td>
                                                        <td className="py-4 text-center font-bold text-2xl text-black">{reg.tickets}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Terms / Footer */}
                                        <div className="mt-20 flex justify-between items-center text-xs text-gray-500 pt-6 border-t border-gray-200">
                                            <div>
                                                <p className="font-bold text-black uppercase tracking-wider mb-1">Important Instructions</p>
                                                <p>1. Please present this ticket at the entrance.</p>
                                                <p>2. This ticket is non-transferable.</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="inline-block p-4 border-2 border-black text-center font-mono tracking-[0.2em] font-bold text-black bg-gray-50">
                                                    VALIDATED
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* END OFF-SCREEN RECEIPT */}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyEvents;
