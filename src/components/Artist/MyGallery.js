import React from 'react';
import { Image, Images, Heart, Eye } from 'lucide-react';

const MyGallery = () => {
  return (
    <div className="w-full h-full bg-white text-[#171C3C] p-8 overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#171C3C] via-[#D1CAF2] to-[#98C4EC]">
          My Gallery
        </h1>
        <p className="text-[#171C3C]/70 mt-2">
          Manage your artwork collection
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#D1CAF2]/10 p-6 rounded-xl border border-[#D1CAF2]/40 hover:shadow-lg transition-shadow">
          <Images className="w-8 h-8 text-[#D1CAF2] mb-3" />
          <h3 className="text-2xl font-bold text-[#171C3C]">48</h3>
          <p className="text-sm text-[#171C3C]/60">Total Images</p>
        </div>

        <div className="bg-[#98C4EC]/10 p-6 rounded-xl border border-[#98C4EC]/40 hover:shadow-lg transition-shadow">
          <Image className="w-8 h-8 text-[#98C4EC] mb-3" />
          <h3 className="text-2xl font-bold text-[#171C3C]">6</h3>
          <p className="text-sm text-[#171C3C]/60">Albums</p>
        </div>

        <div className="bg-[#FE9E8F]/10 p-6 rounded-xl border border-[#FE9E8F]/40 hover:shadow-lg transition-shadow">
          <Heart className="w-8 h-8 text-[#FE9E8F] mb-3" />
          <h3 className="text-2xl font-bold text-[#171C3C]">850</h3>
          <p className="text-sm text-[#171C3C]/60">Likes</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#171C3C]/20 hover:shadow-lg transition-shadow">
          <Eye className="w-8 h-8 text-[#171C3C]/60 mb-3" />
          <h3 className="text-2xl font-bold text-[#171C3C]">40</h3>
          <p className="text-sm text-[#171C3C]/60">Comments</p>
        </div>
      </div>

      {/* Content Placeholder */}
      <div className="bg-[#D1CAF2]/10 rounded-2xl border border-[#D1CAF2]/40 p-12 text-center">
        <Images className="w-16 h-16 text-[#D1CAF2] mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-[#171C3C] mb-2">Gallery Collection</h2>
        <p className="text-[#171C3C]/60">Your gallery management features will be available here</p>
      </div>
    </div>
  );
};

export default MyGallery;
