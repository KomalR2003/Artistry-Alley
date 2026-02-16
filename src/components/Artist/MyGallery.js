'use client';
import React, { useState, useEffect } from 'react';
import { Images, Image, Heart, Eye, Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import AddGalleryImageForm from './AddGalleryImageForm';
import EditGalleryImageForm from './EditGalleryImageForm';

const MyGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [artistId, setArtistId] = useState(null);
  const [artistName, setArtistName] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    categories: 0,
    totalLikes: 0,
    totalViews: 0
  });

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');
    const username = localStorage.getItem('username');

    // Debug logging
    console.log('MyGallery - localStorage values:', {
      userId,
      userRole,
      username
    });

    // Check if user is logged in and is an artist
    if (userId) {
      setArtistId(userId);
      setArtistName(username || 'Artist');
      fetchImages(userId);
    } else {
      setLoading(false);
      setError('Please log in to view your gallery.');
      console.error('No userId found in localStorage');
    }
  }, []);

  const fetchImages = async (userId) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/gallery?artistId=${userId}&status=active`);
      const data = await response.json();

      if (data.success) {
        setImages(data.images);

        // Calculate stats
        const total = data.images.length;
        const uniqueCategories = [...new Set(data.images.map(img => img.category))].length;
        const totalLikes = data.images.reduce((sum, img) => sum + (img.likes || 0), 0);
        const totalViews = data.images.reduce((sum, img) => sum + (img.views || 0), 0);

        setStats({
          total,
          categories: uniqueCategories,
          totalLikes,
          totalViews
        });
      } else {
        setError(data.message || 'Failed to fetch gallery images');
      }
    } catch (err) {
      setError('An error occurred while fetching gallery images');
      console.error('Error fetching images:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageAdded = (newImage) => {
    setImages(prev => [newImage, ...prev]);
    if (artistId) {
      fetchImages(artistId);
    }
  };

  const handleImageUpdated = (updatedImage) => {
    setImages(prev =>
      prev.map(img => img._id === updatedImage._id ? updatedImage : img)
    );
    if (artistId) {
      fetchImages(artistId);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      const response = await fetch(`/api/gallery/${imageId}?soft=true`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setImages(prev => prev.filter(img => img._id !== imageId));
        setStats(prev => ({
          ...prev,
          total: prev.total - 1
        }));
      } else {
        alert(data.message || 'Failed to delete image');
      }
    } catch (err) {
      alert('An error occurred while deleting the image');
      console.error('Error deleting image:', err);
    }
  };

  const handleEditClick = (imageId) => {
    setSelectedImageId(imageId);
    setIsEditModalOpen(true);
  };

  return (
    <div className="w-full h-full bg-white text-[#171C3C] p-8 overflow-y-auto">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-[#171C3C]">
            My Gallery
          </h1>
          <p className="text-[#171C3C]/70 mt-2">
            Manage your artwork collection
          </p>
        </div>
        <div className="flex items-center gap-4">
          {artistName && (
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#D1CAF2]/10 rounded-lg border border-[#D1CAF2]/30">
              <span className="text-sm text-[#171C3C]/60">Artist:</span>
              <span className="font-semibold text-[#171C3C]">{artistName}</span>
            </div>
          )}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#171C3C] text-white rounded-xl hover:bg-[#171C3C]/90 transition-all font-medium"
          >
            <Plus className="w-5 h-5" />
            Upload Image
          </button>
        </div>
      </div>

      {/* Quick Stats - Dashboard Style with Groups */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 mb-10">
        {/* Gallery Stats Group */}
        <div className="flex flex-col">
          <h3 className="text-xl font-semibold text-[#171C3C] mb-4 pl-1">Gallery Stats</h3>
          <div className="flex items-center gap-4 px-2">
            <div className="w-2.5 h-16 rounded-l-full rounded-r-none bg-[#D1CAF2] shrink-0"></div>
            <div className="flex gap-8">
              <div className="flex flex-col justify-center">
                <span className="text-sm text-[#171C3C]/60 font-medium whitespace-nowrap mb-1">Total Images</span>
                <span className="text-2xl font-semibold text-[#171C3C] tracking-tight">{stats.total}</span>
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-sm text-[#171C3C]/60 font-medium whitespace-nowrap mb-1">Categories</span>
                <span className="text-2xl font-semibold text-[#171C3C] tracking-tight">{stats.categories}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Engagement Group */}
        <div className="flex flex-col">
          <h3 className="text-xl font-semibold text-[#171C3C] mb-4 pl-1">Engagement</h3>
          <div className="flex items-center gap-4 px-2">
            <div className="w-2.5 h-16 rounded-l-full rounded-r-none bg-[#FE9E8F] shrink-0"></div>
            <div className="flex gap-8">
              <div className="flex flex-col justify-center">
                <span className="text-sm text-[#171C3C]/60 font-medium whitespace-nowrap mb-1">Total Likes</span>
                <span className="text-2xl font-semibold text-[#171C3C] tracking-tight">{stats.totalLikes}</span>
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-sm text-[#171C3C]/60 font-medium whitespace-nowrap mb-1">Total Views</span>
                <span className="text-2xl font-semibold text-[#171C3C] tracking-tight">{stats.totalViews}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Images Grid */}
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#98C4EC]" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      ) : images.length === 0 ? (
        <div className="bg-[#D1CAF2]/10 rounded-2xl border border-[#D1CAF2]/40 p-12 text-center">
          <Images className="w-16 h-16 text-[#D1CAF2] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#171C3C] mb-2">No Images Found</h2>
          <p className="text-[#171C3C]/60 mb-6">Start by uploading your first artwork</p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-6 py-3 bg-[#171C3C] text-white rounded-xl hover:bg-[#171C3C]/90 transition-all font-medium inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Upload Image
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {images.map((image) => (
            <div
              key={image._id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group"
            >
              {/* Image */}
              <div className="relative h-48 bg-gradient-to-br from-[#D1CAF2]/20 to-[#98C4EC]/20 overflow-hidden">
                <img
                  src={image.imageUrl}
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.querySelector('.fallback-icon').style.display = 'flex';
                  }}
                />
                <div className="fallback-icon hidden items-center justify-center h-full">
                  <Image className="w-16 h-16 text-[#D1CAF2]/40" />
                </div>

                {/* Featured Badge */}
                {image.featured && (
                  <div className="absolute top-2 left-2 bg-[#FE9E8F] text-white text-xs px-2 py-1 rounded-full font-medium">
                    Featured
                  </div>
                )}
              </div>

              {/* Image Details */}
              <div className="p-4">
                <div className="mb-3">
                  <h3 className="font-bold text-[#171C3C] text-lg mb-1 truncate">
                    {image.title}
                  </h3>
                  <p className="text-sm text-[#171C3C]/60">{image.category}</p>
                </div>

                {image.description && (
                  <p className="text-sm text-[#171C3C]/70 mb-4 line-clamp-2">
                    {image.description}
                  </p>
                )}

                {/* Stats */}
                <div className="flex items-center gap-4 mb-4 text-sm text-[#171C3C]/60">
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span>{image.likes || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{image.views || 0}</span>
                  </div>
                </div>

                {/* Tags */}
                {image.tags && image.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {image.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="bg-[#D1CAF2]/10 text-[#171C3C]/70 px-2 py-1 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(image._id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#98C4EC]/10 text-[#98C4EC] rounded-lg hover:bg-[#98C4EC]/20 transition-colors font-medium"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteImage(image._id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Image Modal */}
      <AddGalleryImageForm
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onImageAdded={handleImageAdded}
      />

      {/* Edit Image Modal */}
      <EditGalleryImageForm
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedImageId(null);
        }}
        onImageUpdated={handleImageUpdated}
        imageId={selectedImageId}
      />
    </div>
  );
};

export default MyGallery;
