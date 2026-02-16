'use client';
import React, { useState, useEffect } from 'react';
import { Images, Palette, TrendingUp, Heart, Eye, Search, Filter, X, Loader2, Star } from 'lucide-react';

export default function Gallery() {
    const [images, setImages] = useState([]);
    const [filteredImages, setFilteredImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedArtist, setSelectedArtist] = useState('all');
    const [categories, setCategories] = useState([]);
    const [artists, setArtists] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [stats, setStats] = useState({
        total: 0,
        artists: 0,
        categories: 0,
        featured: 0
    });

    useEffect(() => {
        fetchImages();
    }, []);

    useEffect(() => {
        filterImages();
    }, [images, searchQuery, selectedCategory, selectedArtist]);

    const fetchImages = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/gallery?status=active');
            const data = await response.json();

            if (data.success) {
                setImages(data.images);

                // Extract unique categories and artists
                const uniqueCategories = [...new Set(data.images.map(img => img.category))];
                const uniqueArtists = [...new Set(data.images.map(img => img.artistName).filter(Boolean))];
                setCategories(uniqueCategories);
                setArtists(uniqueArtists);

                // Calculate stats
                const total = data.images.length;
                const artistsCount = uniqueArtists.length;
                const categoriesCount = uniqueCategories.length;
                const featured = data.images.filter(img => img.featured).length;

                setStats({
                    total,
                    artists: artistsCount,
                    categories: categoriesCount,
                    featured
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

    const filterImages = () => {
        let filtered = [...images];

        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(img => img.category === selectedCategory);
        }

        // Filter by artist
        if (selectedArtist !== 'all') {
            filtered = filtered.filter(img => img.artistName === selectedArtist);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(img =>
                img.title.toLowerCase().includes(query) ||
                img.description?.toLowerCase().includes(query) ||
                img.artistName?.toLowerCase().includes(query) ||
                img.tags?.some(tag => tag.toLowerCase().includes(query))
            );
        }

        setFilteredImages(filtered);
    };

    const handleViewImage = (image) => {
        setSelectedImage(image);
        setIsViewModalOpen(true);
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCategory('all');
        setSelectedArtist('all');
    };

    return (
        <div className="w-full h-full bg-white text-[#171C3C] p-8 overflow-y-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-[#171C3C]">
                    Gallery
                </h1>
                <p className="text-[#171C3C]/70 mt-2">
                    Explore our vast collection of artworks from talented artists
                </p>
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
                                <span className="text-sm text-[#171C3C]/60 font-medium whitespace-nowrap mb-1">Total Artworks</span>
                                <span className="text-2xl font-semibold text-[#171C3C] tracking-tight">{stats.total}</span>
                            </div>
                            <div className="flex flex-col justify-center">
                                <span className="text-sm text-[#171C3C]/60 font-medium whitespace-nowrap mb-1">Artists</span>
                                <span className="text-2xl font-semibold text-[#171C3C] tracking-tight">{stats.artists}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Group */}
                <div className="flex flex-col">
                    <h3 className="text-xl font-semibold text-[#171C3C] mb-4 pl-1">Content</h3>
                    <div className="flex items-center gap-4 px-2">
                        <div className="w-2.5 h-16 rounded-l-full rounded-r-none bg-[#98C4EC] shrink-0"></div>
                        <div className="flex gap-8">
                            <div className="flex flex-col justify-center">
                                <span className="text-sm text-[#171C3C]/60 font-medium whitespace-nowrap mb-1">Categories</span>
                                <span className="text-2xl font-semibold text-[#171C3C] tracking-tight">{stats.categories}</span>
                            </div>
                            <div className="flex flex-col justify-center">
                                <span className="text-sm text-[#171C3C]/60 font-medium whitespace-nowrap mb-1">Featured</span>
                                <span className="text-2xl font-semibold text-[#171C3C] tracking-tight">{stats.featured}</span>
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
                        placeholder="Search artworks, artists, or tags..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#98C4EC] focus:ring-2 focus:ring-[#98C4EC]/20 transition-all"
                    />
                </div>

                {/* Category Filter */}
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#171C3C]/40 pointer-events-none" />
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#98C4EC] focus:ring-2 focus:ring-[#98C4EC]/20 transition-all appearance-none bg-white cursor-pointer min-w-[180px]"
                    >
                        <option value="all">All Categories</option>
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </div>

                {/* Artist Filter */}
                <div className="relative">
                    <Palette className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#171C3C]/40 pointer-events-none" />
                    <select
                        value={selectedArtist}
                        onChange={(e) => setSelectedArtist(e.target.value)}
                        className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#98C4EC] focus:ring-2 focus:ring-[#98C4EC]/20 transition-all appearance-none bg-white cursor-pointer min-w-[180px]"
                    >
                        <option value="all">All Artists</option>
                        {artists.map(artist => (
                            <option key={artist} value={artist}>{artist}</option>
                        ))}
                    </select>
                </div>

                {/* Clear Filters */}
                {(searchQuery || selectedCategory !== 'all' || selectedArtist !== 'all') && (
                    <button
                        onClick={clearFilters}
                        className="flex items-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-medium"
                    >
                        <X className="w-5 h-5" />
                        Clear
                    </button>
                )}
            </div>

            {/* Gallery Grid */}
            {loading ? (
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-[#98C4EC]" />
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            ) : filteredImages.length === 0 ? (
                <div className="bg-[#D1CAF2]/10 rounded-2xl border border-[#D1CAF2]/40 p-12 text-center">
                    <Images className="w-16 h-16 text-[#D1CAF2] mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-[#171C3C] mb-2">No Artworks Found</h2>
                    <p className="text-[#171C3C]/60 mb-6">
                        {images.length === 0
                            ? 'No artworks available at the moment'
                            : 'Try adjusting your filters or search query'}
                    </p>
                    {(searchQuery || selectedCategory !== 'all' || selectedArtist !== 'all') && (
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredImages.map((image) => (
                        <div
                            key={image._id}
                            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group cursor-pointer"
                            onClick={() => handleViewImage(image)}
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
                                    <Images className="w-16 h-16 text-[#D1CAF2]/40" />
                                </div>

                                {/* Featured Badge */}
                                {image.featured && (
                                    <div className="absolute top-2 left-2 bg-[#FE9E8F] text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                                        <Star className="w-3 h-3 fill-white" />
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
                                    {image.artistName && (
                                        <p className="text-xs text-[#171C3C]/50 mt-1">by {image.artistName}</p>
                                    )}
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

                                {/* View Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleViewImage(image);
                                    }}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#171C3C] text-white rounded-lg hover:bg-[#171C3C]/90 transition-colors font-medium"
                                >
                                    <Eye className="w-4 h-4" />
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* View Image Modal */}
            {isViewModalOpen && selectedImage && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setIsViewModalOpen(false)}>
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6">
                            {/* Modal Header */}
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-3xl font-bold text-[#171C3C] mb-2">{selectedImage.title}</h2>
                                    <p className="text-[#171C3C]/60">{selectedImage.category}</p>
                                    {selectedImage.artistName && (
                                        <p className="text-sm text-[#171C3C]/50 mt-1">by {selectedImage.artistName}</p>
                                    )}
                                </div>
                                <button
                                    onClick={() => setIsViewModalOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-6 h-6 text-[#171C3C]" />
                                </button>
                            </div>

                            {/* Image */}
                            <div className="mb-6 rounded-xl overflow-hidden bg-gradient-to-br from-[#D1CAF2]/20 to-[#98C4EC]/20">
                                <img
                                    src={selectedImage.imageUrl}
                                    alt={selectedImage.title}
                                    className="w-full h-96 object-cover"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.parentElement.querySelector('.fallback-icon').style.display = 'flex';
                                    }}
                                />
                                <div className="fallback-icon hidden items-center justify-center h-96">
                                    <Images className="w-24 h-24 text-[#D1CAF2]/40" />
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                <div className="space-y-4">
                                    {selectedImage.album && (
                                        <div>
                                            <h3 className="text-sm font-semibold text-[#171C3C]/60 mb-1">Album</h3>
                                            <p className="text-[#171C3C]">{selectedImage.album}</p>
                                        </div>
                                    )}

                                    <div>
                                        <h3 className="text-sm font-semibold text-[#171C3C]/60 mb-1">Category</h3>
                                        <p className="text-[#171C3C]">{selectedImage.category}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-sm font-semibold text-[#171C3C]/60 mb-1">Engagement</h3>
                                        <div className="flex gap-4">
                                            <div className="flex items-center gap-1">
                                                <Heart className="w-5 h-5 text-[#FE9E8F]" />
                                                <span className="text-[#171C3C] font-medium">{selectedImage.likes || 0} likes</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Eye className="w-5 h-5 text-[#98C4EC]" />
                                                <span className="text-[#171C3C] font-medium">{selectedImage.views || 0} views</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            {selectedImage.description && (
                                <div className="mb-6">
                                    <h3 className="text-sm font-semibold text-[#171C3C]/60 mb-2">Description</h3>
                                    <p className="text-[#171C3C] leading-relaxed">{selectedImage.description}</p>
                                </div>
                            )}

                            {/* Tags */}
                            {selectedImage.tags && selectedImage.tags.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-sm font-semibold text-[#171C3C]/60 mb-2">Tags</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedImage.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="bg-[#D1CAF2]/20 text-[#171C3C] px-3 py-1 rounded-full text-sm"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Action Button */}
                            <div className="flex gap-4">
                                <button className="flex-1 py-3 bg-[#FE9E8F] text-white rounded-xl hover:bg-[#FE9E8F]/90 transition-colors font-medium flex items-center justify-center gap-2">
                                    <Heart className="w-5 h-5" />
                                    Like Artwork
                                </button>
                                <button className="px-6 py-3 border border-[#171C3C] text-[#171C3C] rounded-xl hover:bg-[#171C3C]/5 transition-colors font-medium">
                                    Contact Artist
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
