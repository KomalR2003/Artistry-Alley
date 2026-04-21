import React, { useState, useEffect } from 'react';
import { Users, Award, Heart, Target, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

export default function OurTeam() {
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                const res = await fetch('/api/users?role=artist');
                const data = await res.json();
                if (data.success) {
                    setArtists(data.users);
                } else {
                    toast.error(data.message || 'Failed to fetch team members');
                }
            } catch (error) {
                console.error("Error fetching artists:", error);
                toast.error('Something went wrong');
            } finally {
                setLoading(false);
            }
        };
        fetchArtists();
    }, []);

    return (
        <div className="w-full h-full bg-white text-[#171C3C] p-8 overflow-y-auto">
            {/* Header */}
            <div className="mb-10 text-center">
                <h1 className="text-2xl md:text-2xl font-semibold text-[#171C3C] mb-4">
                    Our Artists
                </h1>
                <p className="text-[#171C3C]/70 max-w-2xl mx-auto text-lg">
                    Meet the incredibly talented people who bring Artistry to life. Each of our artists brings a unique vision and unmatched passion to their work.
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                <div className="bg-gradient-to-br from-[#D1CAF2]/20 to-transparent p-6 rounded-2xl border border-[#D1CAF2]/40 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-[#D1CAF2]/20 rounded-bl-full -mr-4 -mt-4 group-hover:bg-[#D1CAF2]/40 transition-colors"></div>
                    <Users className="w-8 h-8 text-[#D1CAF2] mb-3 relative z-10" />
                    <h3 className="text-2xl font-semibold text-[#171C3C] relative z-10">{artists.length > 0 ? `${artists.length}+` : '15+'}</h3>
                    <p className="text-sm font-medium text-[#171C3C]/60 relative z-10">Amazing Artists</p>
                </div>

                <div className="bg-gradient-to-br from-[#FE9E8F]/20 to-transparent p-6 rounded-2xl border border-[#FE9E8F]/40 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-[#FE9E8F]/20 rounded-bl-full -mr-4 -mt-4 group-hover:bg-[#FE9E8F]/40 transition-colors"></div>
                    <Award className="w-8 h-8 text-[#FE9E8F] mb-3 relative z-10" />
                    <h3 className="text-2xl font-semibold text-[#171C3C] relative z-10">50+</h3>
                    <p className="text-sm font-medium text-[#171C3C]/60 relative z-10">Awards Won</p>
                </div>

                <div className="bg-gradient-to-br from-[#98C4EC]/20 to-transparent p-6 rounded-2xl border border-[#98C4EC]/40 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-[#98C4EC]/20 rounded-bl-full -mr-4 -mt-4 group-hover:bg-[#98C4EC]/40 transition-colors"></div>
                    <Heart className="w-8 h-8 text-[#98C4EC] mb-3 relative z-10" />
                    <h3 className="text-2xl font-semibold text-[#171C3C] relative z-10">10+</h3>
                    <p className="text-sm font-medium text-[#171C3C]/60 relative z-10">Years of Experience</p>
                </div>

                <div className="bg-gradient-to-br from-gray-100 to-transparent p-6 rounded-2xl border border-[#171C3C]/10 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gray-200 rounded-bl-full -mr-4 -mt-4 group-hover:bg-gray-300 transition-colors"></div>
                    <Target className="w-8 h-8 text-[#171C3C]/60 mb-3 relative z-10" />
                    <h3 className="text-2xl font-semibold text-[#171C3C] relative z-10">100%</h3>
                    <p className="text-sm font-medium text-[#171C3C]/60 relative z-10">Dedication</p>
                </div>
            </div>

            {/* Artists Grid */}
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#171C3C]"></div>
                </div>
            ) : artists.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {artists.map((artist) => (
                        <div key={artist._id} className="group relative bg-[#f8f9fc] rounded-3xl p-6 border border-transparent hover:border-[#D1CAF2] hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center">
                            
                            {/* Circular Avatar */}
                            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden mb-4 border-4 border-white shadow-md relative">
                                {artist.profilePicture ? (
                                    <img 
                                        src={artist.profilePicture} 
                                        alt={artist.username} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-[#171C3C] text-white flex items-center justify-center text-3xl font-bold uppercase shadow-inner">
                                        {artist.username.charAt(0)}
                                    </div>
                                )}
                            </div>
                            
                            {/* Artist Info */}
                            <h3 className="text-lg font-bold text-[#171C3C] mb-1 line-clamp-1 w-full group-hover:text-[#FE9E8F] transition-colors">
                                {artist.username}
                            </h3>
                            
                            <span className="text-xs font-bold text-[#98C4EC] bg-[#98C4EC]/10 px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
                                {artist.specialization || "Artist"}
                            </span>
                            
                            <p className="text-sm text-[#171C3C]/60 line-clamp-2 mb-5 h-10">
                                {artist.bio || "Bringing imagination to reality through beautiful artwork."}
                            </p>
                            
                            {/* Footer Row */}
                            <div className="w-full flex justify-between items-center mt-auto pt-4 border-t border-gray-200/60">
                                <div className="flex items-center text-xs font-semibold text-[#171C3C]">
                                    <Award className="w-3.5 h-3.5 mr-1 text-[#FE9E8F]" />
                                    {artist.experience || 1}+ Years Exp
                                </div>
                                <a href={`mailto:${artist.email}`} className="text-[#171C3C]/60 hover:text-[#FE9E8F] transition-colors" title="Contact Email">
                                    <Mail className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-gradient-to-br from-[#D1CAF2]/10 via-white to-[#98C4EC]/10 rounded-3xl border border-[#D1CAF2]/40 p-16 text-center">
                    <Users className="w-20 h-20 text-[#D1CAF2] mx-auto mb-6 opacity-80" />
                    <h2 className="text-2xl font-semibold text-[#171C3C] mb-3">No Artists Found</h2>
                    <p className="text-[#171C3C]/60 max-w-md mx-auto">We are currently looking for talented artists to join our team. Check back later!</p>
                </div>
            )}
        </div>
    );
}
