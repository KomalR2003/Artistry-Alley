'use client';
import React from 'react';
import { X } from 'lucide-react';

const ViewProductModal = ({ isOpen, onClose, product }) => {
    if (!isOpen || !product) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fadeIn"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div
                    className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden pointer-events-auto animate-scaleIn"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header - Simplified */}
                    <div className="px-8 py-6 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-[#171C3C]">Product Details</h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <X size={24} className="text-gray-500" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-8 overflow-y-auto max-h-[calc(90vh-180px)]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Left Side - Images */}
                            <div>
                                {/* Main Image */}
                                <div className="mb-4">
                                    <img
                                        src={product.thumbnail || product.images?.[0] || '/placeholder.png'}
                                        alt={product.productname}
                                        className="w-full h-80 object-cover rounded-xl border border-gray-200"
                                    />
                                </div>

                                {/* Thumbnail Gallery */}
                                {product.images && product.images.length > 0 && (
                                    <div className="grid grid-cols-4 gap-2">
                                        {product.images.slice(0, 4).map((img, idx) => (
                                            <img
                                                key={idx}
                                                src={img}
                                                alt={`${product.productname} - ${idx + 1}`}
                                                className="w-full h-20 object-cover rounded-lg border border-gray-200 hover:border-[#98C4EC] transition-all cursor-pointer"
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Right Side - Details */}
                            <div className="space-y-6">
                                {/* Product Name */}
                                <div>
                                    <h3 className="text-3xl font-bold text-[#171C3C] mb-3">
                                        {product.productname}
                                    </h3>
                                    <span className="inline-block px-3 py-1 bg-gray-100 text-[#171C3C] rounded-lg text-sm font-medium">
                                        {product.category}
                                    </span>
                                </div>

                                {/* Price */}
                                <div className="flex items-baseline gap-3 pb-6 border-b border-gray-200">
                                    <span className="text-4xl font-bold text-[#171C3C]">
                                        ₹{product.price}
                                    </span>
                                    {product.originalPrice && (
                                        <span className="text-lg text-gray-400 line-through">
                                            ₹{product.originalPrice}
                                        </span>
                                    )}
                                </div>

                                {/* Description */}
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Description</h4>
                                    <p className="text-[#171C3C]/80 leading-relaxed">
                                        {product.description}
                                    </p>
                                </div>

                                {/* Details Grid - Simplified */}
                                <div className="space-y-3">
                                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Specifications</h4>

                                    {/* Reference No */}
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span className="text-sm text-gray-600">Reference No</span>
                                        <span className="text-sm font-semibold text-[#171C3C]">{product.referenceno}</span>
                                    </div>

                                    {/* Stock */}
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span className="text-sm text-gray-600">Stock</span>
                                        <span className="text-sm font-semibold text-[#171C3C]">
                                            {product.stock} {product.inStock ? '(Available)' : '(Out of Stock)'}
                                        </span>
                                    </div>

                                    {/* Size */}
                                    {product.size && (
                                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                            <span className="text-sm text-gray-600">Size</span>
                                            <span className="text-sm font-semibold text-[#171C3C]">
                                                {product.size.height} x {product.size.width} {product.size.unit}
                                            </span>
                                        </div>
                                    )}

                                    {/* Medium */}
                                    {product.medium && (
                                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                            <span className="text-sm text-gray-600">Medium</span>
                                            <span className="text-sm font-semibold text-[#171C3C]">{product.medium}</span>
                                        </div>
                                    )}

                                    {/* Year Created */}
                                    {product.yearCreated && (
                                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                            <span className="text-sm text-gray-600">Year Created</span>
                                            <span className="text-sm font-semibold text-[#171C3C]">{product.yearCreated}</span>
                                        </div>
                                    )}

                                    {/* Orientation */}
                                    {product.orientation && (
                                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                            <span className="text-sm text-gray-600">Orientation</span>
                                            <span className="text-sm font-semibold text-[#171C3C] capitalize">{product.orientation}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Tags */}
                                {product.tags && product.tags.length > 0 && (
                                    <div className="pt-4">
                                        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Tags</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {product.tags.map((tag, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Badges - Simplified */}
                                {(product.featured || product.bestseller) && (
                                    <div className="flex gap-2 pt-4">
                                        {product.featured && (
                                            <span className="px-3 py-1 bg-[#171C3C] text-white rounded-lg text-sm font-medium">
                                                ⭐ Featured
                                            </span>
                                        )}
                                        {product.bestseller && (
                                            <span className="px-3 py-1 bg-[#FE9E8F] text-white rounded-lg text-sm font-medium">
                                                🔥 Bestseller
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer - Simplified */}
                    <div className="px-8 py-4 border-t border-gray-200 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 bg-[#171C3C] text-white rounded-lg hover:bg-[#171C3C]/90 transition-all font-medium"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
        </>
    );
};

export default ViewProductModal;
