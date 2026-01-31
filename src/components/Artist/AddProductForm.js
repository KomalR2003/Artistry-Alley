'use client';
import React, { useState } from 'react';
import { X, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AddProductForm = ({ isOpen, onClose, onProductAdded, artistId, artistName }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [imagePreviews, setImagePreviews] = useState([]);
    const [thumbnailPreview, setThumbnailPreview] = useState('');

    const [formData, setFormData] = useState({
        productname: '',
        category: '',
        description: '',
        price: '',
        referenceno: '',
        size: {
            height: '',
            width: '',
            unit: 'inches'
        },
        originalPrice: '',
        stock: 1,
        inStock: true,
        medium: '',
        yearCreated: '',
        orientation: '',
        images: [],
        thumbnail: '',
        tags: '',
        featured: false,
        bestseller: false,
        status: 'active'
    });

    const categories = [
        'Painting',
        'Sculpture',
        'Photography',
        'Digital Art',
        'Mixed Media',
        'Drawing',
        'Printmaking',
        'Textile Art',
        'Installation',
        'Other'
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.startsWith('size.')) {
            const sizeField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                size: {
                    ...prev.size,
                    [sizeField]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const previews = [];
        const base64Images = [];

        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                previews.push(base64String);
                base64Images.push(base64String);

                if (previews.length === files.length) {
                    setImagePreviews(prev => [...prev, ...previews]);
                    setFormData(prev => ({
                        ...prev,
                        images: [...prev.images, ...base64Images]
                    }));
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const handleThumbnailUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setThumbnailPreview(base64String);
                setFormData(prev => ({
                    ...prev,
                    thumbnail: base64String
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = (index) => {
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Prepare data for API
            const productData = {
                ...formData,
                price: Number(formData.price),
                referenceno: Number(formData.referenceno),
                originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
                stock: Number(formData.stock),
                yearCreated: formData.yearCreated ? Number(formData.yearCreated) : undefined,
                size: {
                    height: Number(formData.size.height),
                    width: Number(formData.size.width),
                    unit: formData.size.unit
                },
                tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
                artistId: artistId,
                artistName: artistName
            };

            const response = await fetch('/api/product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
            });

            const data = await response.json();

            if (data.success) {
                // Reset form
                setFormData({
                    productname: '',
                    category: '',
                    description: '',
                    price: '',
                    referenceno: '',
                    size: { height: '', width: '', unit: 'inches' },
                    originalPrice: '',
                    stock: 1,
                    inStock: true,
                    medium: '',
                    yearCreated: '',
                    orientation: '',
                    images: [],
                    thumbnail: '',
                    tags: '',
                    featured: false,
                    bestseller: false,
                    status: 'active'
                });
                setImagePreviews([]);
                setThumbnailPreview('');

                // Show success toast
                toast.success('Product created successfully!');

                // Notify parent component
                if (onProductAdded) {
                    onProductAdded(data.product);
                }

                onClose();
            } else {
                toast.error(data.message || 'Failed to create product');
                setError(data.message || 'Failed to create product');
            }
        } catch (err) {
            toast.error('An error occurred while creating the product');
            setError('An error occurred while creating the product');
            console.error('Error creating product:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center rounded-t-2xl">
                    <h2 className="text-2xl font-bold text-[#171C3C]">Add New Product</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6 text-[#171C3C]" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-[#171C3C]">Basic Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[#171C3C] mb-2">
                                    Product Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="productname"
                                    value={formData.productname}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#98C4EC] focus:border-transparent"
                                    placeholder="Enter product name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#171C3C] mb-2">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#98C4EC] focus:border-transparent"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-[#171C3C] mb-2">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    rows="4"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#98C4EC] focus:border-transparent"
                                    placeholder="Describe your product..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pricing & Stock */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-[#171C3C]">Pricing & Stock</h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[#171C3C] mb-2">
                                    Price <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#98C4EC] focus:border-transparent"
                                    placeholder="0.00"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#171C3C] mb-2">
                                    Original Price
                                </label>
                                <input
                                    type="number"
                                    name="originalPrice"
                                    value={formData.originalPrice}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#98C4EC] focus:border-transparent"
                                    placeholder="0.00"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#171C3C] mb-2">
                                    Stock <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#98C4EC] focus:border-transparent"
                                    placeholder="1"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#171C3C] mb-2">
                                    Reference Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="referenceno"
                                    value={formData.referenceno}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#98C4EC] focus:border-transparent"
                                    placeholder="Unique reference number"
                                />
                            </div>

                            <div className="flex items-center md:col-span-2">
                                <input
                                    type="checkbox"
                                    name="inStock"
                                    checked={formData.inStock}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-[#98C4EC] border-gray-300 rounded focus:ring-[#98C4EC]"
                                />
                                <label className="ml-2 text-sm font-medium text-[#171C3C]">
                                    In Stock
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Size */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-[#171C3C]">Size</h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[#171C3C] mb-2">
                                    Height <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="size.height"
                                    value={formData.size.height}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#98C4EC] focus:border-transparent"
                                    placeholder="0.0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#171C3C] mb-2">
                                    Width <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="size.width"
                                    value={formData.size.width}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#98C4EC] focus:border-transparent"
                                    placeholder="0.0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#171C3C] mb-2">
                                    Unit <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="size.unit"
                                    value={formData.size.unit}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#98C4EC] focus:border-transparent"
                                >
                                    <option value="inches">Inches</option>
                                    <option value="cm">Centimeters</option>
                                    <option value="feet">Feet</option>
                                    <option value="mm">Millimeters</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Additional Details */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-[#171C3C]">Additional Details</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[#171C3C] mb-2">
                                    Medium
                                </label>
                                <input
                                    type="text"
                                    name="medium"
                                    value={formData.medium}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#98C4EC] focus:border-transparent"
                                    placeholder="e.g., Oil on Canvas"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#171C3C] mb-2">
                                    Year Created
                                </label>
                                <input
                                    type="number"
                                    name="yearCreated"
                                    value={formData.yearCreated}
                                    onChange={handleChange}
                                    min="1800"
                                    max={new Date().getFullYear()}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#98C4EC] focus:border-transparent"
                                    placeholder="2024"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#171C3C] mb-2">
                                    Orientation
                                </label>
                                <select
                                    name="orientation"
                                    value={formData.orientation}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#98C4EC] focus:border-transparent"
                                >
                                    <option value="">Select Orientation</option>
                                    <option value="Portrait">Portrait</option>
                                    <option value="Landscape">Landscape</option>
                                    <option value="Square">Square</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#171C3C] mb-2">
                                    Tags (comma separated)
                                </label>
                                <input
                                    type="text"
                                    name="tags"
                                    value={formData.tags}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#98C4EC] focus:border-transparent"
                                    placeholder="modern, abstract, colorful"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Images */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-[#171C3C]">Images</h3>

                        <div>
                            <label className="block text-sm font-medium text-[#171C3C] mb-2">
                                Product Images
                            </label>
                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 mb-2 text-gray-400" />
                                        <p className="text-sm text-gray-500">Click to upload images</p>
                                    </div>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            {imagePreviews.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                    {imagePreviews.map((preview, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={preview}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-32 object-cover rounded-lg border border-gray-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#171C3C] mb-2">
                                Thumbnail
                            </label>
                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                    {thumbnailPreview ? (
                                        <img
                                            src={thumbnailPreview}
                                            alt="Thumbnail preview"
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <ImageIcon className="w-8 h-8 mb-2 text-gray-400" />
                                            <p className="text-sm text-gray-500">Click to upload thumbnail</p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleThumbnailUpload}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Options */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-[#171C3C]">Options</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="featured"
                                    checked={formData.featured}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-[#98C4EC] border-gray-300 rounded focus:ring-[#98C4EC]"
                                />
                                <label className="ml-2 text-sm font-medium text-[#171C3C]">
                                    Featured Product
                                </label>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="bestseller"
                                    checked={formData.bestseller}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-[#98C4EC] border-gray-300 rounded focus:ring-[#98C4EC]"
                                />
                                <label className="ml-2 text-sm font-medium text-[#171C3C]">
                                    Bestseller
                                </label>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#171C3C] mb-2">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#98C4EC] focus:border-transparent"
                                >
                                    <option value="active">Active</option>
                                    <option value="draft">Draft</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-4 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-gray-300 text-[#171C3C] rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-[#171C3C] text-white rounded-lg hover:bg-[#171C3C]/90 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Create Product'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProductForm;
