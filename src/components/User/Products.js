'use client';
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Package, Star, TrendingUp, Search, Filter, X, Loader2, Eye, Clock, ChevronDown } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import toast from 'react-hot-toast';

export default function Products() {
    const { addToCart, isInCart } = useCart();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [categories, setCategories] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [stats, setStats] = useState({
        total: 0,
        categories: 0,
        sold: 0,
        inStock: 0
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [products, searchQuery, selectedCategory]);

    const fetchProducts = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/product?status=active');
            const data = await response.json();

            if (data.success) {
                setProducts(data.products);

                // Extract unique categories
                const uniqueCategories = [...new Set(data.products.map(p => p.category))];
                setCategories(uniqueCategories);

                // Calculate stats
                const total = data.products.length;
                const sold = data.products.filter(p => !p.inStock).length;
                // Calculate total stock quantity (sum of all stock numbers)
                const totalStockQuantity = data.products.reduce((sum, p) => {
                    return sum + (p.inStock ? (p.stock || 0) : 0);
                }, 0);
                const categoriesCount = uniqueCategories.length;

                setStats({
                    total,
                    categories: categoriesCount,
                    sold,
                    inStock: totalStockQuantity
                });
            } else {
                setError(data.message || 'Failed to fetch products');
            }
        } catch (err) {
            setError('An error occurred while fetching products');
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    };

    const filterProducts = () => {
        let filtered = [...products];

        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(p => p.category === selectedCategory);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(p =>
                p.productname.toLowerCase().includes(query) ||
                p.description.toLowerCase().includes(query) ||
                p.artistName?.toLowerCase().includes(query) ||
                p.tags?.some(tag => tag.toLowerCase().includes(query))
            );
        }

        setFilteredProducts(filtered);
    };

    const handleViewProduct = (product) => {
        setSelectedProduct(product);
        setIsViewModalOpen(true);
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCategory('all');
    };

    const handleAddToCart = (product) => {
        if (!product.inStock) {
            toast.error('Product is out of stock');
            return;
        }
        addToCart(product);
    };

    return (
        <div className="w-full h-full bg-[#FAFAFC] text-[#171C3C] p-6 md:p-4 overflow-y-auto relative">
            {/* Ambient Background Gradient Glows */}
            <div className="fixed top-0 left-0 w-full h-96 bg-gradient-to-br from-[#98C4EC]/10 via-[#D1CAF2]/10 to-transparent pointer-events-none z-0"></div>
            <div className="fixed top-0 right-0 w-96 h-96 bg-[#FE9E8F]/10 rounded-full blur-3xl pointer-events-none z-0"></div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
                    <div className="max-w-2xl">
                      
                        <h1 className="text-2xl md:text-4xl font-semibold text-[#171C3C] tracking-tight mb-4">
                            Masterpiece <span className="text-[#171C3C] ">Collection</span>
                        </h1>
                        <p className="text-[#171C3C]/60 text-lg leading-relaxed font-medium">
                            Discover exquisite, one-of-a-kind pieces crafted by visionary artists. Elevate your space with authentic art.
                        </p>
                    </div>

                    {/* Premium Stats - Dashboard Style */}
                    <div className="flex flex-col transition-transform duration-200   p-5 rounded-3xl ">
                        <h3 className="text-xl font-semibold text-[#171C3C] mb-4 pl-1">Gallery Overview</h3>
                        <div className="flex items-center gap-4 px-2">
                            {/* Vertical Half-Pill Bar */}
                            <div className="w-2.5 h-16 rounded-l-full rounded-r-none bg-[#98C4EC] shrink-0"></div>
                            <div className="flex gap-8 w-full pr-4">
                                <div className="flex flex-col justify-center">
                                    <span className="text-sm text-[#171C3C]/60 font-medium whitespace-nowrap mb-1">Artworks</span>
                                    <span className="text-xl font-semibold text-[#171C3C] tracking-tight">{stats.total}</span>
                                </div>
                                <div className="flex flex-col justify-center">
                                    <span className="text-sm text-[#171C3C]/60 font-medium whitespace-nowrap mb-1">Styles</span>
                                    <span className="text-xl font-semibold text-[#171C3C] tracking-tight">{stats.categories}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters & Search - Sleek design */}
                <div className="flex flex-col lg:flex-row gap-4 mb-12 items-center bg-white/80 backdrop-blur-xl p-3 rounded-3xl shadow-[0_8px_30px_rgb(23,28,60,0.04)] border border-white sticky top-4 z-20">
                    {/* Search */}
                    <div className="flex-1 relative w-full group">
                        <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#171C3C]/40 group-focus-within:text-[#FE9E8F] transition-colors" />
                        <input
                            type="text"
                            placeholder="Discover by title, artist, or tags..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-transparent border-none focus:outline-none focus:ring-0 text-[#171C3C] placeholder-[#171C3C]/40 font-medium text-lg"
                        />
                    </div>

                    {/* Category Dropdown */}
                    <div className="w-full lg:w-auto border-t lg:border-t-0 lg:border-l border-[#171C3C]/10 px-2 lg:pl-4 py-3 lg:py-0 flex items-center justify-between lg:justify-start gap-3">
                        <div className="relative w-full lg:w-56 group">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full appearance-none bg-transparent border-2 border-[#171C3C]/10 rounded-2xl px-5 py-3 pr-12 text-[#171C3C] font-bold text-sm focus:outline-none focus:border-[#171C3C] hover:border-[#171C3C]/30 transition-all cursor-pointer"
                            >
                                <option value="all">All Categories</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#171C3C]/40 pointer-events-none group-hover:text-[#171C3C] transition-colors" />
                        </div>
                        {(searchQuery || selectedCategory !== 'all') && (
                            <button
                                onClick={clearFilters}
                                className="p-3.5 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all duration-300 shrink-0 shadow-sm"
                                title="Clear Filters"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Products Display */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center p-24 h-[50vh]">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-[#98C4EC]/20 rounded-full"></div>
                            <div className="w-16 h-16 border-4 border-[#FE9E8F] rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
                        </div>
                        <p className="mt-4 text-[#171C3C]/60 font-medium animate-pulse">Curating gallery...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center gap-4">
                        <X className="w-6 h-6" />
                        <span className="font-medium">{error}</span>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white p-20 text-center shadow-[0_8px_30px_rgb(23,28,60,0.04)]">
                        <div className="w-24 h-24 bg-gradient-to-br from-[#D1CAF2] to-[#98C4EC] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#D1CAF2]/40">
                            <Search className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-2xl font-semibold text-[#171C3C] mb-3">No Masterpieces Found</h2>
                        <p className="text-[#171C3C]/60 mb-8 text-lg max-w-md mx-auto">
                            {products.length === 0
                                ? 'Our gallery is currently updating its collection.'
                                : 'We couldn\'t find any artworks matching your artistic taste.'}
                        </p>
                        {(searchQuery || selectedCategory !== 'all') && (
                            <button
                                onClick={clearFilters}
                                className="px-8 py-4 bg-[#171C3C] text-white rounded-2xl hover:bg-[#171C3C]/90 transition-all font-bold inline-flex items-center gap-3 shadow-xl shadow-[#171C3C]/20"
                            >
                                <Filter className="w-5 h-5" />
                                View Full Collection
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="columns-2 md:columns-3 xl:columns-4 gap-6 space-y-6 max-w-7xl mx-auto">
                        {filteredProducts.map((product) => (
                            <div
                                key={product._id}
                                className="group relative bg-[#FAFAFC] hover:bg-white p-3 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col border border-transparent hover:border-[#D1CAF2]/50 break-inside-avoid"
                                onClick={() => handleViewProduct(product)}
                            >
                                {/* Floating Badges (Smaller) */}
                                <div className="absolute top-5 left-5 z-10 flex flex-col gap-1.5">
                                    {product.featured && (
                                        <div className="bg-white/95 backdrop-blur-md text-[#FE9E8F] text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded shadow-sm">
                                            Featured
                                        </div>
                                    )}
                                    {product.bestseller && (
                                        <div className="bg-[#171C3C]/95 backdrop-blur-md text-[#98C4EC] text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded shadow-sm">
                                            Trending
                                        </div>
                                    )}
                                    {!product.inStock && (
                                        <div className="bg-red-500/95 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded shadow-sm">
                                            Sold Out
                                        </div>
                                    )}
                                </div>

                                {/* Artwork Image Container - fluid height for masonry */}
                                <div className="relative w-full rounded-xl overflow-hidden shadow-inner group-hover:shadow-none transition-shadow duration-300">
                                    {product.thumbnail || product.images?.[0] ? (
                                        <img
                                            src={product.thumbnail || product.images[0]}
                                            alt={product.productname}
                                            className="w-full h-auto object-cover transform group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center aspect-square bg-gray-100">
                                            <TrendingUp className="w-8 h-8 text-[#171C3C]/20" />
                                        </div>
                                    )}

                                    {/* Quick Add Overlay */}
                                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-[#171C3C]/80 via-[#171C3C]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddToCart(product);
                                            }}
                                            disabled={!product.inStock || isInCart(product._id)}
                                            className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 ${product.inStock && !isInCart(product._id)
                                                ? 'bg-white text-[#171C3C] hover:bg-[#98C4EC] hover:text-[#171C3C] shadow-lg'
                                                : 'bg-white/30 backdrop-blur-md text-white/70 cursor-not-allowed'
                                                }`}
                                        >
                                            <ShoppingBag className="w-4 h-4" />
                                            {!product.inStock ? 'Out of Stock' : isInCart(product._id) ? 'In Collection' : 'Quick Add'}
                                        </button>
                                    </div>
                                </div>

                                {/* Minimalist Artwork Details */}
                                <div className="pt-4 px-1 flex flex-col text-left">
                                    <h3 className="font-semibold text-[#171C3C] text-base leading-snug line-clamp-1 mb-1 group-hover:text-[#98C4EC] transition-colors">
                                        {product.productname}
                                    </h3>
                                    <p className="text-[9px] font-medium text-[#171C3C]/50 uppercase tracking-widest mb-2 truncate">
                                        {product.artistName || 'Unknown Artist'}
                                    </p>

                                    {product.description && (
                                        <p className="text-xs text-[#171C3C]/70 line-clamp-2 mb-3 leading-relaxed">
                                            {product.description}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between mt-auto border-t border-[#171C3C]/5 pt-3">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-lg font-bold text-[#171C3C]">
                                                ₹{product.price}
                                            </span>
                                            {product.originalPrice && (
                                                <span className="text-[10px] font-medium text-[#171C3C]/40 line-through">
                                                    ₹{product.originalPrice}
                                                </span>
                                            )}
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-[#171C3C]/5 flex items-center justify-center group-hover:bg-[#FE9E8F] group-hover:text-white transition-colors text-[#171C3C]/40">
                                            <TrendingUp className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Premium View Product Modal */}
            {isViewModalOpen && selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8" onClick={() => setIsViewModalOpen(false)}>
                    {/* Darker Blur Backdrop */}
                    <div className="absolute inset-0 bg-[#171C3C]/40 backdrop-blur-md transition-opacity"></div>

                    <div className="relative bg-white rounded-[2.5rem] w-full max-w-6xl max-h-full overflow-hidden shadow-2xl flex flex-col md:flex-row transform transition-all" onClick={(e) => e.stopPropagation()}>
                        {/* Close Button Floating */}
                        <button
                            onClick={() => setIsViewModalOpen(false)}
                            className="absolute top-6 right-6 z-20 w-12 h-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-[#171C3C] hover:bg-[#171C3C] hover:text-white transition-colors shadow-lg"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Image Section (Left Half) */}
                        <div className="w-full md:w-1/2 min-h-[40vh] md:min-h-[80vh] relative bg-[#f4f4f4]">
                            {selectedProduct.thumbnail || selectedProduct.images?.[0] ? (
                                <img
                                    src={selectedProduct.thumbnail || selectedProduct.images[0]}
                                    alt={selectedProduct.productname}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#D1CAF2]/20 to-[#98C4EC]/20">
                                    <ShoppingBag className="w-32 h-32 text-[#171C3C]/10" />
                                </div>
                            )}

                            {/* Tags overlay */}
                            <div className="absolute bottom-8 left-8 flex flex-wrap gap-2 pr-8 z-10">
                                <span className="bg-white/90 backdrop-blur px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-[#171C3C] shadow-lg">
                                    {selectedProduct.category}
                                </span>
                                {selectedProduct.medium && (
                                    <span className="bg-[#171C3C]/90 backdrop-blur px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-white shadow-lg">
                                        {selectedProduct.medium}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Details Section (Right Half) */}
                        <div className="w-full md:w-1/2 p-8 overflow-y-auto bg-white relative">
                            <div className="mb-2">
                                <span className="text-[#FE9E8F] font-semibold tracking-widest uppercase text-[9px] bg-[#FE9E8F]/5 px-2 py-1 rounded-sm">
                                    {selectedProduct.brand || 'Original Artwork'}
                                </span>
                            </div>

                            <h2 className="text-2xl font-semibold text-[#171C3C] mb-3 leading-snug">
                                {selectedProduct.productname}
                            </h2>

                            <div className="flex items-center gap-3 py-3 border-y border-[#171C3C]/5 mb-5">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#98C4EC] to-[#D1CAF2] flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                                    {selectedProduct.artistName ? selectedProduct.artistName[0].toUpperCase() : 'A'}
                                </div>
                                <div>
                                    <p className="text-[9px] font-medium text-[#171C3C]/40 uppercase tracking-widest mb-0.5">Created By</p>
                                    <p className="font-semibold text-[#171C3C] text-xs">{selectedProduct.artistName || 'Unknown Artist'}</p>
                                </div>
                            </div>

                            <div className="flex items-baseline gap-2 mb-5">
                                <span className="text-2xl font-bold text-[#171C3C]">₹{selectedProduct.price}</span>
                                {selectedProduct.originalPrice && (
                                    <span className="text-xs text-[#171C3C]/40 line-through font-medium">
                                        ₹{selectedProduct.originalPrice}
                                    </span>
                                )}
                                <div className={`ml-auto px-2.5 py-1 rounded-lg font-semibold text-[10px] uppercase tracking-wider ${selectedProduct.inStock ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                                    {selectedProduct.inStock ? `In Stock (${selectedProduct.stock})` : 'Sold Out'}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-6">
                                {selectedProduct.size && (
                                    <div className="bg-[#FAFAFC] p-2.5 rounded-xl border border-[#171C3C]/5">
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <Package className="w-3 h-3 text-[#98C4EC]" />
                                            <h3 className="text-[9px] font-medium uppercase tracking-widest text-[#171C3C]/50">Dimensions</h3>
                                        </div>
                                        <p className="text-[#171C3C] font-semibold text-xs">
                                            {selectedProduct.size.height} x {selectedProduct.size.width} {selectedProduct.size.unit}
                                        </p>
                                    </div>
                                )}

                                {selectedProduct.yearCreated && (
                                    <div className="bg-[#FAFAFC] p-2.5 rounded-xl border border-[#171C3C]/5">
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <Clock className="w-3 h-3 text-[#D1CAF2]" />
                                            <h3 className="text-[9px] font-medium uppercase tracking-widest text-[#171C3C]/50">Year</h3>
                                        </div>
                                        <p className="text-[#171C3C] font-semibold text-xs">{selectedProduct.yearCreated}</p>
                                    </div>
                                )}
                            </div>

                            {selectedProduct.description && (
                                <div className="mb-6">
                                    <h3 className="text-[9px] font-medium uppercase tracking-widest text-[#171C3C]/50 mb-1.5">About the Artwork</h3>
                                    <p className="text-[#171C3C]/70 leading-relaxed text-xs font-normal">{selectedProduct.description}</p>
                                </div>
                            )}

                            {/* Action Area */}
                            <div className="mt-auto bg-white sticky bottom-0 pt-4 border-t border-[#171C3C]/5">
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        onClick={() => handleAddToCart(selectedProduct)}
                                        disabled={!selectedProduct.inStock || isInCart(selectedProduct._id)}
                                        className={`flex-1 py-3.5 rounded-xl font-black text-sm transition-all shadow-md flex justify-center items-center gap-2 ${selectedProduct.inStock && !isInCart(selectedProduct._id)
                                            ? 'bg-[#171C3C] text-white hover:bg-[#171C3C]/90 shadow-[#171C3C]/10 hover:-translate-y-0.5'
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                                            }`}
                                    >
                                        <ShoppingBag className="w-5 h-5" />
                                        {!selectedProduct.inStock ? 'Temporarily Unavailable' : isInCart(selectedProduct._id) ? 'Already in Collection' : 'Acquire Artwork'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
