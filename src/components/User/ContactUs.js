import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactUs() {
    return (
        <div className="w-full h-full bg-white text-[#171C3C] p-8 overflow-y-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#171C3C] via-[#FE9E8F] to-[#98C4EC]">
                    Contact Us
                </h1>
                <p className="text-[#171C3C]/70 mt-2">
                    Get in touch with us.
                </p>
            </div>

            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-[#FE9E8F]/10 p-6 rounded-xl border border-[#FE9E8F]/40 hover:shadow-lg transition-shadow">
                    <Mail className="w-8 h-8 text-[#FE9E8F] mb-3" />
                    <h3 className="text-lg font-bold text-[#171C3C] mb-2">Email</h3>
                    <p className="text-sm text-[#171C3C]/60">info@artistry.com</p>
                </div>

                <div className="bg-[#98C4EC]/10 p-6 rounded-xl border border-[#98C4EC]/40 hover:shadow-lg transition-shadow">
                    <Phone className="w-8 h-8 text-[#98C4EC] mb-3" />
                    <h3 className="text-lg font-bold text-[#171C3C] mb-2">Phone</h3>
                    <p className="text-sm text-[#171C3C]/60">+1 (555) 123-4567</p>
                </div>

                <div className="bg-[#D1CAF2]/10 p-6 rounded-xl border border-[#D1CAF2]/40 hover:shadow-lg transition-shadow">
                    <MapPin className="w-8 h-8 text-[#D1CAF2] mb-3" />
                    <h3 className="text-lg font-bold text-[#171C3C] mb-2">Address</h3>
                    <p className="text-sm text-[#171C3C]/60">123 Art Street, Gallery City</p>
                </div>
            </div>

            {/* Content Placeholder */}
            <div className="bg-gradient-to-br from-[#FE9E8F]/10 via-white to-[#D1CAF2]/10 rounded-2xl border border-[#FE9E8F]/40 p-12 text-center">
                <Send className="w-16 h-16 text-[#FE9E8F] mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-[#171C3C] mb-2">Send Us a Message</h2>
                <p className="text-[#171C3C]/60">Contact form will be available here</p>
            </div>
        </div>
    );
}
