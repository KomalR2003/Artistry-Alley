'use client';
import React, { useState, useEffect } from 'react';
import { Images, Palette, Heart, Eye, Search, Filter, X, Loader2, Star } from 'lucide-react';
import toast from 'react-hot-toast';

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

    // Auth and Engagement State
    const [currentUser, setCurrentUser] = useState(null);
    const [modalComment, setModalComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [detailComment, setDetailComment] = useState('');

    useEffect(() => {
        fetchImages();

        // Get user from session
        const userId = sessionStorage.getItem('userId');
        const userName = sessionStorage.getItem('userName') || sessionStorage.getItem('username');
        if (userId) {
            setCurrentUser({ id: userId, name: userName || 'Anonymous' });
        }
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

    const handleViewImage = async (image) => {
        setSelectedImage(image);
        setIsViewModalOpen(true);

        // Client-side session throttle (vital for locking anonymous users from spamming the count)
        const sessionKey = `viewed_${image._id}`;
        if (sessionStorage.getItem(sessionKey)) return;

        try {
            // Increment view count in database (unique to user)
            const payload = currentUser ? { userId: currentUser.id } : {};
            const res = await fetch(`/api/gallery/${image._id}/view`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();

            if (data.success) {
                // Update local state so it immediately reflects
                sessionStorage.setItem(sessionKey, 'true');
                const updatedImage = { ...image, views: data.views };
                setSelectedImage(updatedImage);
                setImages(images.map(img => img._id === image._id ? updatedImage : img));
            }
        } catch (err) {
            console.error('Error incrementing view:', err);
        }
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCategory('all');
        setSelectedArtist('all');
    };

    const getVisibleComments = (img) => {
        if (!img || !img.comments) return [];
        
        // Very robust check to verify if the logged in user is the artist of this image
        let artistIdStr = '';
        if (img.artistId) {
            if (typeof img.artistId === 'string') artistIdStr = img.artistId;
            else if (img.artistId._id) artistIdStr = img.artistId._id.toString();
            else artistIdStr = img.artistId.toString();
        }
        const isArtist = currentUser?.id && artistIdStr === currentUser.id.toString();

        if (isArtist) {
            return img.comments; // Artist sees all comments
        }
        
        // Regular users see approved comments + their own hidden comments
        return img.comments.filter(c => {
            // Hide the old unmoderated test comment manually
            if (c?.text?.toLowerCase().includes("i don't like this art")) {
                // Let the artist or author see their own old test comment with a hidden badge simulation
                if (isArtist || (currentUser?.id && c?.user === currentUser.id.toString())) {
                    c.status = 'hidden'; // Force badge display for this specific old comment
                    return true;
                }
                return false;
            }

            if (c?.status === 'approved') return true;
            // If it's hidden, show it only if the current user is the one who posted it
            if (currentUser?.id && c?.user === currentUser.id.toString()) return true;
            return false;
        });
    };

    const getHasLiked = (img) => {
        const userId = currentUser?.id?.toString();
        if (!userId) return false;
        return (img?.likes || []).some(like => ((like && like.user) ? like.user.toString() : (like ? like.toString() : '')) === userId);
    };

    const handleLike = async (e, targetImage = selectedImage) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (!currentUser) return toast.error("Please log in to like artworks");
        if (!targetImage) return;

        try {
            const res = await fetch(`/api/gallery/${targetImage._id}/like`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: currentUser.id, userName: currentUser.name })
            });
            const data = await res.json();

            if (data.success) {
                // Determine the new likes array based on whether the backend says we just liked or unliked it
                let newLikes;
                if (data.hasLiked) {
                    // We just liked it, so add our ID
                    newLikes = [...(targetImage.likes || []), { user: currentUser.id, userName: currentUser.name }];
                    toast.success('Liked');
                } else {
                    // We just unliked it, so remove our ID using safe parsing for Mixed types
                    newLikes = (targetImage.likes || []).filter(like => {
                        const likeUserId = (like && like.user) ? like.user.toString() : (like ? like.toString() : null);
                        return likeUserId !== currentUser.id.toString();
                    });
                    toast.success('Unliked');
                }

                const updatedImage = { ...targetImage, likes: newLikes };

                // If the modal is currently open for THIS image, update it
                if (selectedImage && selectedImage._id === updatedImage._id) {
                    setSelectedImage(updatedImage);
                }

                // Update the main grid array
                setImages(images.map(img => img._id === updatedImage._id ? updatedImage : img));
            }
        } catch (err) {
            console.error('Error toggling like:', err);
        }
    };

    const handleComment = async (e, { targetImage = selectedImage, text, clearText } = {}) => {
        e.preventDefault();
        if (!currentUser) return toast.error("Please log in to comment");
        const trimmed = (text || '').trim();
        if (!trimmed || !targetImage) return;

        setSubmitting(true);
        try {
            const res = await fetch(`/api/gallery/${targetImage._id}/comment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: currentUser.id,
                    userName: currentUser.name,
                    text: trimmed
                })
            });
            const data = await res.json();

            if (data.success) {
                if (data.comment) {
                    const updatedImage = {
                        ...targetImage,
                        comments: [...(targetImage.comments || []), data.comment]
                    };
                    setImages(images.map(img => img._id === updatedImage._id ? updatedImage : img));
                    if (selectedImage && selectedImage._id === updatedImage._id) setSelectedImage(updatedImage);
                }
                
                toast.success('Comment posted');
                if (typeof clearText === 'function') clearText();
            } else {
                toast.error(data.message || 'Failed to post comment');
            }
        } catch (err) {
            console.error('Error posting comment:', err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="w-full h-full bg-white text-[#171C3C] p-4 sm:p-6 lg:p-8 overflow-y-auto">
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
                <div className="w-full">
                    {/* Exquisite Full-Width Gallery Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8">
                        {filteredImages.map((image) => {
                            const hasLiked = getHasLiked(image);
                            const visibleComments = getVisibleComments(image);
                            const visibleCount = visibleComments.length;
                            return (
                                <button
                                    key={image._id}
                                    type="button"
                                    onClick={() => {
                                        setDetailComment('');
                                        handleViewImage(image);
                                    }}
                                    className="group w-full flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-left"
                                    title="Open artwork"
                                >
                                    <div className="relative bg-gradient-to-br from-[#D1CAF2]/20 to-[#98C4EC]/20 overflow-hidden rounded-t-3xl">
                                        <img
                                            src={image.imageUrl}
                                            alt={image.title}
                                            className="w-full aspect-[4/5] object-cover transition-transform duration-500 group-hover:scale-110"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.parentElement.querySelector('.fallback-icon').style.display = 'flex';
                                            }}
                                        />
                                        <div className="fallback-icon hidden items-center justify-center aspect-[4/5]">
                                            <Images className="w-14 h-14 text-[#D1CAF2]/50" />
                                        </div>

                                        {image.featured && (
                                            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-xs font-semibold text-[#171C3C] flex items-center gap-1 shadow">
                                                <Star className="w-3 h-3 fill-[#FE9E8F] text-[#FE9E8F]" />
                                                Featured
                                            </div>
                                        )}

                                        {/* Hover overlay */}
                                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                    </div>

                                    {/* Elegant meta section */}
                                    <div className="p-5 flex-1 flex flex-col justify-center">
                                        <div className="text-lg font-bold text-[#171C3C] truncate group-hover:text-[#98C4EC] transition-colors">{image.title}</div>
                                        <div className="mt-1 text-sm font-medium text-[#171C3C]/60 truncate">
                                            {image.artistName || image.category}
                                        </div>
                                    </div>

                                    {/* Interactions Footer */}
                                    <div className="px-5 pb-5 pt-2">
                                        <div className="flex items-center justify-between gap-2 mt-2 pt-4 border-t border-gray-50">
                                            <button
                                                type="button"
                                                onClick={(e) => handleLike(e, image)}
                                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FE9E8F]/10 hover:bg-[#FE9E8F]/20 hover:scale-105 transition-all"
                                                aria-label={hasLiked ? 'Unlike' : 'Like'}
                                                title={hasLiked ? 'Unlike' : 'Like'}
                                            >
                                                <Heart className={`w-4 h-4 ${hasLiked ? 'fill-[#FE9E8F] text-[#FE9E8F]' : 'text-[#171C3C]/70'}`} />
                                                <span className="text-sm font-semibold text-[#171C3C]/80">{image.likes?.length || 0}</span>
                                            </button>

                                            <div
                                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#98C4EC]/15 transition-colors"
                                                title="Comments"
                                            >
                                                <span className="text-sm font-semibold text-[#171C3C]/80">{visibleCount} comments</span>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>


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
                                                <span className="text-[#171C3C] font-medium">{selectedImage.likes?.length || 0} likes</span>
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
                                <button
                                    onClick={handleLike}
                                    className="flex-1 py-3 bg-white border-2 border-[#FE9E8F] text-[#FE9E8F] rounded-xl hover:bg-[#FE9E8F]/10 transition-colors font-medium flex items-center justify-center gap-2"
                                >
                                    <Heart
                                        className={`w-5 h-5 transition-all ${selectedImage.likes?.some(like => ((like && like.user) ? like.user.toString() : (like ? like.toString() : '')) === currentUser?.id?.toString()) ? 'fill-current scale-110' : ''}`}
                                    />
                                    {selectedImage.likes?.some(like => ((like && like.user) ? like.user.toString() : (like ? like.toString() : '')) === currentUser?.id?.toString()) ? 'Liked' : 'Like Artwork'}
                                </button>
                                <button className="px-6 py-3 border border-[#171C3C] text-[#171C3C] rounded-xl hover:bg-[#171C3C]/5 transition-colors font-medium">
                                    Contact Artist
                                </button>
                            </div>

                            {/* Comments Section */}
                            <div className="mt-10 border-t border-gray-100 pt-8">
                                <h3 className="text-xl font-bold text-[#171C3C] mb-6">Comments</h3>

                                {/* Comments List */}
                                <div className="space-y-4 mb-8 max-h-60 overflow-y-auto pr-2">
                                    {getVisibleComments(selectedImage).length > 0 ? (
                                        getVisibleComments(selectedImage).map((comment, idx) => (
                                            <div key={idx} className="bg-gray-50 p-4 rounded-xl">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="font-semibold text-[#171C3C] text-sm flex items-center gap-2">
                                                        {comment.userName}
                                                    </span>
                                                    <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-[#171C3C]/80 text-sm whitespace-pre-wrap">{comment.text}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-400 text-sm text-center py-4 italic">No comments yet. Be the first to comment!</p>
                                    )}
                                </div>

                                {/* Comment Form */}
                                {currentUser ? (
                                    <form onSubmit={(e) => handleComment(e, {
                                        targetImage: selectedImage,
                                        text: modalComment,
                                        clearText: () => setModalComment('')
                                    })} className="flex gap-3">
                                        <input
                                            type="text"
                                            value={modalComment}
                                            onChange={(e) => setModalComment(e.target.value)}
                                            placeholder="Write a completely appropriate comment..."
                                            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#98C4EC] focus:ring-2 focus:ring-[#98C4EC]/20 transition-all text-sm"
                                            disabled={submitting}
                                        />
                                        <button
                                            type="submit"
                                            disabled={!modalComment.trim() || submitting}
                                            className="px-6 py-3 bg-[#171C3C] text-white rounded-xl hover:bg-[#171C3C]/90 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {submitting ? 'Posting...' : 'Post'}
                                        </button>
                                    </form>
                                ) : (
                                    <div className="bg-orange-50 text-orange-600 p-4 rounded-xl text-sm text-center">
                                        Please log in to leave a comment or like this artwork.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
