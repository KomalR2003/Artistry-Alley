'use client';
import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';

const EditGalleryImageForm = ({ isOpen, onClose, onImageUpdated, imageId }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        imageUrl: '',
        category: '',
        album: '',
        tags: '',
        featured: false,
    });
    const [loading, setLoading] = useState(false);
    const [fetchingImage, setFetchingImage] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen && imageId) {
            fetchImageData();
        }
    }, [isOpen, imageId]);

    const fetchImageData = async () => {
        setFetchingImage(true);
        setError('');

        try {
            const response = await fetch(`/api/gallery/${imageId}`);
            const data = await response.json();

            if (data.success) {
                const image = data.image;
                setFormData({
                    title: image.title || '',
                    description: image.description || '',
                    imageUrl: image.imageUrl || '',
                    category: image.category || '',
                    album: image.album || '',
                    tags: image.tags ? image.tags.join(', ') : '',
                    featured: image.featured || false,
                });
            } else {
                setError(data.message || 'Failed to fetch image data');
            }
        } catch (err) {
            setError('An error occurred while fetching image data');
            console.error('Error fetching image:', err);
        } finally {
            setFetchingImage(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const tagsArray = formData.tags
                ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
                : [];

            const response = await fetch(`/api/gallery/${imageId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    tags: tagsArray,
                }),
            });

            const data = await response.json();

            if (data.success) {
                onImageUpdated(data.image);
                onClose();
            } else {
                setError(data.message || 'Failed to update image');
            }
        } catch (err) {
            setError('An error occurred while updating the image');
            console.error('Error updating image:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-[#171C3C]">Edit Gallery Image</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="w-6 h-6 text-[#171C3C]" />
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Loading State */}
                    {fetchingImage ? (
                        <div className="flex items-center justify-center p-8">
                            <Loader2 className="w-8 h-8 animate-spin text-[#98C4EC]" />
                        </div>
                    ) : (
                        /* Form */
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-[#171C3C] mb-1">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#98C4EC] focus:ring-2 focus:ring-[#98C4EC]/20"
                                    placeholder="Enter image title"
                                />
                            </div>

                            {/* Image URL */}
                            <div>
                                <label className="block text-sm font-medium text-[#171C3C] mb-1">
                                    Image URL *
                                </label>
                                <input
                                    type="url"
                                    name="imageUrl"
                                    value={formData.imageUrl}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#98C4EC] focus:ring-2 focus:ring-[#98C4EC]/20"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-[#171C3C] mb-1">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#98C4EC] focus:ring-2 focus:ring-[#98C4EC]/20"
                                    placeholder="Describe your artwork"
                                />
                            </div>

                            {/* Category and Album */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#171C3C] mb-1">
                                        Category
                                    </label>
                                    <input
                                        type="text"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#98C4EC] focus:ring-2 focus:ring-[#98C4EC]/20"
                                        placeholder="e.g. Paintings, Photography"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#171C3C] mb-1">
                                        Album
                                    </label>
                                    <input
                                        type="text"
                                        name="album"
                                        value={formData.album}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#98C4EC] focus:ring-2 focus:ring-[#98C4EC]/20"
                                        placeholder="e.g. Nature Collection"
                                    />
                                </div>
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="block text-sm font-medium text-[#171C3C] mb-1">
                                    Tags
                                </label>
                                <input
                                    type="text"
                                    name="tags"
                                    value={formData.tags}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#98C4EC] focus:ring-2 focus:ring-[#98C4EC]/20"
                                    placeholder="art, nature, abstract (comma separated)"
                                />
                                <p className="text-xs text-[#171C3C]/60 mt-1">Separate tags with commas</p>
                            </div>

                            {/* Featured */}
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="featured"
                                    checked={formData.featured}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-[#98C4EC] border-gray-300 rounded focus:ring-[#98C4EC]"
                                />
                                <label className="ml-2 text-sm text-[#171C3C]">
                                    Mark as Featured
                                </label>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-4 py-3 border border-gray-200 text-[#171C3C] rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-4 py-3 bg-[#171C3C] text-white rounded-lg hover:bg-[#171C3C]/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5" />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditGalleryImageForm;
