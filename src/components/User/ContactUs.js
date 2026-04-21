import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactUs() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call for form submission
        setTimeout(() => {
            toast.success('Your message has been sent successfully!');
            setFormData({ name: '', email: '', subject: '', message: '' });
            setIsSubmitting(false);
        }, 1500);
    };

    return (
        <div className="w-full h-full bg-white text-[#171C3C] p-8 overflow-y-auto">
            {/* Header */}
            <div className="mb-12 text-center max-w-3xl mx-auto">
                <h1 className="text-xl md:text-3xl font-semibold text-[#171C3C] mb-4 pb-2">
                    Get in Touch
                </h1>
                <p className="text-[#171C3C]/70 text-lg">
                    Have a question, feedback, or want to collaborate? We'd love to hear from you. Reach out using the details below or send us a message directly.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
                {/* Contact Info Cards */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <div className="bg-gradient-to-br from-[#FE9E8F]/10 to-transparent p-8 rounded-3xl border border-[#FE9E8F]/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#FE9E8F]/10 rounded-bl-full -mr-4 -mt-4 group-hover:bg-[#FE9E8F]/20 transition-colors"></div>
                        <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm mb-6 relative z-10 border border-[#FE9E8F]/20">
                            <Mail className="w-7 h-7 text-[#FE9E8F]" />
                        </div>
                        <h3 className="text-xl font-semibold text-[#171C3C] mb-2 relative z-10">Email</h3>
                        <p className="text-[#171C3C]/60 mb-1 relative z-10 text-sm">Our friendly team is here to help.</p>
                        <a href="mailto:info@artistry.com" className="text-[#FE9E8F] font-bold hover:underline relative z-10">info@artistry.com</a>
                    </div>

                    <div className="bg-gradient-to-br from-[#98C4EC]/10 to-transparent p-8 rounded-3xl border border-[#98C4EC]/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#98C4EC]/10 rounded-bl-full -mr-4 -mt-4 group-hover:bg-[#98C4EC]/20 transition-colors"></div>
                        <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm mb-6 relative z-10 border border-[#98C4EC]/20">
                            <Phone className="w-7 h-7 text-[#98C4EC]" />
                        </div>
                        <h3 className="text-xl font-semibold text-[#171C3C] mb-2 relative z-10">Phone</h3>
                        <p className="text-[#171C3C]/60 mb-1 relative z-10 text-sm">Mon-Fri from 8am to 5pm.</p>
                        <a href="tel:+15551234567" className="text-[#98C4EC] font-bold hover:underline relative z-10">+1 (555) 123-4567</a>
                    </div>

                    <div className="bg-gradient-to-br from-[#D1CAF2]/10 to-transparent p-8 rounded-3xl border border-[#D1CAF2]/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#D1CAF2]/10 rounded-bl-full -mr-4 -mt-4 group-hover:bg-[#D1CAF2]/20 transition-colors"></div>
                        <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm mb-6 relative z-10 border border-[#D1CAF2]/20">
                            <MapPin className="w-7 h-7 text-[#D1CAF2]" />
                        </div>
                        <h3 className="text-xl font-semibold text-[#171C3C] mb-2 relative z-10">Address</h3>
                        <p className="text-[#171C3C]/60 mb-1 relative z-10 text-sm">Come say hello at our HQ.</p>
                        <p className="text-[#D1CAF2] font-bold relative z-10">123 Art Street, Gallery City</p>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-300 p-8 md:p-12 relative overflow-hidden">
                        {/* Decorative blobs */}
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-gradient-to-br from-[#FE9E8F]/20 to-[#98C4EC]/20 blur-3xl -z-10"></div>
                        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-gradient-to-tr from-[#D1CAF2]/20 to-[#FE9E8F]/20 blur-3xl -z-10"></div>
                        
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <MessageSquare className="w-6 h-6 text-[#171C3C]" />
                            </div>
                            <h2 className="text-2xl font-semibold text-[#171C3C]">Send a Message</h2>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-bold text-[#171C3C]">Your Name</label>
                                    <input 
                                        type="text" 
                                        id="name"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#FE9E8F]/50 focus:border-[#FE9E8F] transition-all outline-none"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-bold text-[#171C3C]">Your Email</label>
                                    <input 
                                        type="email" 
                                        id="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#98C4EC]/50 focus:border-[#98C4EC] transition-all outline-none"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label htmlFor="subject" className="text-sm font-bold text-[#171C3C]">Subject</label>
                                <input 
                                    type="text" 
                                    id="subject"
                                    name="subject"
                                    required
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#D1CAF2]/50 focus:border-[#D1CAF2] transition-all outline-none"
                                    placeholder="How can we help?"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-bold text-[#171C3C]">Message</label>
                                <textarea 
                                    id="message"
                                    name="message"
                                    required
                                    rows="5"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#FE9E8F]/50 focus:border-[#FE9E8F] transition-all outline-none resize-none"
                                    placeholder="Tell us more about your inquiry..."
                                ></textarea>
                            </div>
                            
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className={`w-full py-4 px-6 rounded-xl font-bold text-white shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                                    isSubmitting 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-[#171C3C] hover:bg-[#2a336b] hover:shadow-[0_8px_30px_rgb(23,28,60,0.3)] hover:-translate-y-1'
                                }`}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center gap-3">
                                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                        Sending...
                                    </span>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" />
                                        Send Message
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
