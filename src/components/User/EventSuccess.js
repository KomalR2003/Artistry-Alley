'use client';
import React, { useState } from 'react';
import { Calendar, CheckCircle, Ticket, MapPin, Clock, Download, Home as HomeIcon, ArrowRight } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';
import { useRouter } from 'next/navigation';

export default function EventSuccess({ eventData, onNavigate }) {
    const router = useRouter();
    const [isDownloading, setIsDownloading] = useState(false);

    // Retrieve full event context or defaults
    const regId = eventData?.registrationId || 'REG-' + Date.now();
    const event = eventData?.event || {};
    const customerDetails = eventData?.customerDetails || {};
    const tickets = eventData?.tickets || 1;
    const isFree = eventData?.isFree || false;

    // Use fallback values if missing
    const userName = customerDetails?.name || sessionStorage.getItem('userName') || 'Guest';
    const startDate = event.startDate ? new Date(event.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'TBA';
    const startTime = event.startTime || 'TBA';
    const location = event.location || 'Artistry Main Gallery';

    const issueElectronicTicket = async () => {
        const ticketElement = document.getElementById('success-ticket-template');
        if (!ticketElement) return;

        setIsDownloading(true);
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
            pdf.save(`Artistry_Ticket_${event.title ? event.title.replace(/[^a-zA-Z0-9]/g, '_') : 'Event'}.pdf`);
            
        } catch (error) {
            console.error("Failed to generate PDF:", error);
        } finally {
            ticketElement.style.display = 'none';
            setIsDownloading(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-[#FAFAFC] via-white to-[#D1CAF2]/10 text-[#171C3C] flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
            
            {/* OFF-SCREEN PRINTABLE RECEIPT FOR PDF (Clean, B&W, Standard Fonts) */}
            <div 
                id="success-ticket-template" 
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
                        <p className="text-sm font-bold text-black uppercase tracking-widest">{regId}</p>
                        <p className="text-xs text-gray-500 mt-1">Status: {isFree ? 'Free Registration' : 'Paid Confirmed'}</p>
                    </div>
                </div>

                {/* Ticket Details */}
                <div className="mb-10 text-sm">
                    <h3 className="font-bold text-gray-600 uppercase mb-2">Guest Details:</h3>
                    <p className="font-bold text-2xl text-black">{userName}</p>
                    {customerDetails?.email && <p className="text-gray-700">{customerDetails.email}</p>}
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
                                <td className="py-4 text-gray-800 font-bold text-lg">{event.title || 'Exclusive Event'}<br/><span className="text-xs text-gray-500 font-normal uppercase tracking-wide mt-1 inline-block">{event.eventType || 'Event'}</span></td>
                                <td className="py-4 text-center text-gray-800 font-medium">{startDate}<br/><span className="text-gray-500 text-xs">{startTime}</span></td>
                                <td className="py-4 text-right text-gray-800">{location}</td>
                                <td className="py-4 text-center font-bold text-2xl text-black">{tickets}</td>
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


            <div className="max-w-2xl w-full relative z-10">
                {/* Success Animation Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6 animate-bounce shadow-lg shadow-green-100/50">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-black text-[#171C3C] mb-3 tracking-tight">
                        Registration Confirmed!
                    </h1>
                    <p className="text-[#171C3C]/70 text-lg max-w-md mx-auto font-medium">
                        You're all set! Your place at the event is reserved. Download your ticket to enter.
                    </p>
                </div>

                {/* Dashboard-Style Booking Details Card */}
                <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-white mb-8 relative overflow-hidden">
                    <div className="absolute top-[-30px] right-[-30px] w-40 h-40 bg-gradient-to-br from-[#98C4EC]/20 to-[#D1CAF2]/20 rounded-full blur-2xl z-0 pointer-events-none"></div>

                    <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100 relative z-10">
                        <Ticket className="w-8 h-8 text-[#98C4EC]" />
                        <div>
                            <h2 className="text-2xl font-bold text-[#171C3C]">Official Booking</h2>
                            <p className="text-xs text-[#171C3C]/60 font-bold uppercase tracking-widest mt-1">{regId}</p>
                        </div>
                    </div>

                    <div className="space-y-4 relative z-10">
                        {/* Event Name */}
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl hover:bg-white border border-transparent hover:border-[#98C4EC]/30 transition-all">
                            <span className="text-[#171C3C]/70 font-semibold text-sm">Event</span>
                            <span className="text-[#171C3C] font-black">{event.title || 'Artistry Exclusive'}</span>
                        </div>

                        {/* Date & Time */}
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl hover:bg-white border border-transparent hover:border-[#98C4EC]/30 transition-all">
                            <span className="text-[#171C3C]/70 font-semibold text-sm">Schedule</span>
                            <span className="text-[#171C3C] font-bold text-right">
                                {startDate}<br/>
                                <span className="text-xs text-[#171C3C]/60">{startTime}</span>
                            </span>
                        </div>

                        {/* Tickets */}
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl hover:bg-white border border-transparent hover:border-[#98C4EC]/30 transition-all">
                            <span className="text-[#171C3C]/70 font-semibold text-sm">Guest Passes</span>
                            <span className="text-[#171C3C] font-black text-xl">{tickets}</span>
                        </div>

                        {/* Status */}
                        <div className="flex justify-between items-center p-4 bg-green-50/50 rounded-2xl border border-green-100">
                            <span className="text-[#171C3C]/70 font-semibold text-sm">Status</span>
                            <span className="text-green-600 font-bold flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                Confirmed {isFree ? '(Free Registration)' : '(Paid)'}
                            </span>
                        </div>
                    </div>

                    {/* Check Email Note */}
                    <div className="mt-8 p-5 bg-gradient-to-r from-[#D1CAF2]/10 to-[#98C4EC]/10 rounded-2xl border border-[#98C4EC]/20 relative z-10 text-center">
                        <p className="text-sm font-semibold text-[#171C3C]/80">
                            We've sent a confirmation email to <span className="text-[#171C3C] font-bold">{customerDetails?.email || 'your email'}</span>.
                        </p>
                    </div>
                </div>

                {/* Primary Actions */}
                <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                    <button
                        onClick={issueElectronicTicket}
                        disabled={isDownloading}
                        className={`flex-1 ${isDownloading ? 'bg-[#98C4EC]/70' : 'bg-[#98C4EC] hover:bg-[#85b7e2] hover:-translate-y-1'} text-white py-4 px-6 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-xl shadow-[#98C4EC]/20 group`}
                    >
                        <Download className={`w-6 h-6 ${isDownloading ? 'animate-bounce' : 'group-hover:scale-110 transition-transform'}`} />
                        {isDownloading ? 'Structuring PDF...' : 'Download Ticket'}
                    </button>
                </div>

                {/* Secondary Actions */}
                <div className="flex gap-4 mt-6 max-w-lg mx-auto">
                    <button
                        onClick={() => onNavigate && onNavigate('My Events')}
                        className="flex-1 bg-white text-[#171C3C] py-3 rounded-xl hover:bg-gray-50 font-bold flex items-center justify-center gap-2 transition-all border border-gray-200 shadow-sm"
                    >
                        <Ticket className="w-4 h-4" />
                        My Events
                    </button>
                    
                    <button
                        onClick={() => {
                            if (onNavigate) {
                                onNavigate('Home');
                            } else {
                                router.push('/home');
                            }
                        }}
                        className="flex-1 bg-white text-[#171C3C] py-3 rounded-xl hover:bg-gray-50 font-bold flex items-center justify-center gap-2 transition-all border border-gray-200 shadow-sm"
                    >
                        <HomeIcon className="w-4 h-4" />
                        Back to Home
                    </button>
                </div>
            </div>

            <style>
                {`
                    @keyframes bounce {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-8px); }
                    }
                    .animate-bounce {
                        animation: bounce 2s infinite ease-in-out;
                    }
                `}
            </style>
        </div>
    );
}
