'use client';
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Package, Star, TrendingUp, Search, Filter, X, Loader2, Eye } from 'lucide-react';
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
        <div className="w-full h-full bg-white text-[#171C3C] p-8 overflow-y-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#171C3C] via-[#98C4EC] to-[#FE9E8F]">
                    Products
                </h1>
                <p className="text-[#171C3C]/70 mt-2">
                    Browse our exclusive art products from talented artists
                </p>
            </div>

            {/* Quick Stats - Dashboard Style with Groups (Matching Artist Side) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 mb-10">
                {/* Product Stats Group */}
                <div className="flex flex-col">
                    <h3 className="text-xl font-semibold text-[#171C3C] mb-4 pl-1">Product Stats</h3>
                    <div className="flex items-center gap-4 px-2">
                        <div className="w-2.5 h-16 rounded-l-full rounded-r-none bg-[#FE9E8F] shrink-0"></div>
                        <div className="flex gap-8">
                            <div className="flex flex-col justify-center">
                                <span className="text-sm text-[#171C3C]/60 font-medium whitespace-nowrap mb-1">Total Products</span>
                                <span className="text-2xl font-semibold text-[#171C3C] tracking-tight">{stats.total}</span>
                            </div>
                            <div className="flex flex-col justify-center">
                                <span className="text-sm text-[#171C3C]/60 font-medium whitespace-nowrap mb-1">Categories</span>
                                <span className="text-2xl font-semibold text-[#171C3C] tracking-tight">{stats.categories}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sales Group */}
                <div className="flex flex-col">
                    <h3 className="text-xl font-semibold text-[#171C3C] mb-4 pl-1">Availability</h3>
                    <div className="flex items-center gap-4 px-2">
                        <div className="w-2.5 h-16 rounded-l-full rounded-r-none bg-[#98C4EC] shrink-0"></div>
                        <div className="flex gap-8">
                            <div className="flex flex-col justify-center">
                                <span className="text-sm text-[#171C3C]/60 font-medium whitespace-nowrap mb-1">Sold Out</span>
                                <span className="text-2xl font-semibold text-[#171C3C] tracking-tight">{stats.sold}</span>
                            </div>
                            <div className="flex flex-col justify-center">
                                <span className="text-sm text-[#171C3C]/60 font-medium whitespace-nowrap mb-1">In Stock</span>
                                <span className="text-2xl font-semibold text-[#171C3C] tracking-tight">{stats.inStock}</span>
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
                        placeholder="Search products, artists, or tags..."
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
                        className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#98C4EC] focus:ring-2 focus:ring-[#98C4EC]/20 transition-all appearance-none bg-white cursor-pointer min-w-[200px]"
                    >
                        <option value="all">All Categories</option>
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </div>

                {/* Clear Filters */}
                {(searchQuery || selectedCategory !== 'all') && (
                    <button
                        onClick={clearFilters}
                        className="flex items-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-medium"
                    >
                        <X className="w-5 h-5" />
                        Clear
                    </button>
                )}
            </div>

            {/* Products Grid */}
            {loading ? (
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-[#98C4EC]" />
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="bg-[#98C4EC]/10 rounded-2xl border border-[#98C4EC]/40 p-12 text-center">
                    <ShoppingBag className="w-16 h-16 text-[#98C4EC] mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-[#171C3C] mb-2">No Products Found</h2>
                    <p className="text-[#171C3C]/60 mb-6">
                        {products.length === 0
                            ? 'No products available at the moment'
                            : 'Try adjusting your filters or search query'}
                    </p>
                    {(searchQuery || selectedCategory !== 'all') && (
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
                    {filteredProducts.map((product) => (
                        <div
                            key={product._id}
                            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group cursor-pointer"
                            onClick={() => handleViewProduct(product)}
                        >
                            {/* Product Image */}
                            <div className="relative h-48 bg-gradient-to-br from-[#D1CAF2]/20 to-[#98C4EC]/20 overflow-hidden">
                                {product.thumbnail || product.images?.[0] ? (
                                    <img
                                        src={product.thumbnail || product.images[0]}
                                        alt={product.productname}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <ShoppingBag className="w-16 h-16 text-[#98C4EC]/40" />
                                    </div>
                                )}

                                {/* Product Status Badge */}
                                {!product.inStock && (
                                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                                        Sold Out
                                    </div>
                                )}
                                {product.featured && (
                                    <div className="absolute top-2 left-2 bg-[#FE9E8F] text-white text-xs px-2 py-1 rounded-full font-medium">
                                        Featured
                                    </div>
                                )}
                                {product.bestseller && (
                                    <div className="absolute top-2 left-2 bg-[#171C3C] text-white text-xs px-2 py-1 rounded-full font-medium">
                                        Bestseller
                                    </div>
                                )}
                            </div>

                            {/* Product Details */}
                            <div className="p-4">
                                <div className="mb-3">
                                    <h3 className="font-bold text-[#171C3C] text-lg mb-1 truncate">
                                        {product.productname}
                                    </h3>
                                    <p className="text-sm text-[#171C3C]/60">{product.category}</p>
                                    {product.artistName && (
                                        <p className="text-xs text-[#171C3C]/50 mt-1">by {product.artistName}</p>
                                    )}
                                </div>

                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <span className="text-2xl font-bold text-[#171C3C]">
                                            ₹{product.price}
                                        </span>
                                        {product.originalPrice && (
                                            <span className="text-sm text-[#171C3C]/50 line-through ml-2">
                                                ₹{product.originalPrice}
                                            </span>
                                        )}
                                    </div>
                                    {product.rating > 0 && (
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-[#FE9E8F] fill-[#FE9E8F]" />
                                            <span className="text-sm font-medium text-[#171C3C]">{product.rating}</span>
                                        </div>
                                    )}
                                </div>

                                {product.description && (
                                    <p className="text-sm text-[#171C3C]/70 mb-4 line-clamp-2">
                                        {product.description}
                                    </p>
                                )}

                                {/* Product Meta */}
                                <div className="flex items-center gap-2 text-xs text-[#171C3C]/60 mb-4">
                                    {product.size && (
                                        <span className="bg-[#98C4EC]/10 px-2 py-1 rounded">
                                            {product.size.height} x {product.size.width} {product.size.unit}
                                        </span>
                                    )}
                                    {product.medium && (
                                        <span className="bg-[#D1CAF2]/10 px-2 py-1 rounded truncate">
                                            {product.medium}
                                        </span>
                                    )}
                                </div>

                                {/* View Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleViewProduct(product);
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

            {/* View Product Modal */}
            {isViewModalOpen && selectedProduct && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setIsViewModalOpen(false)}>
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6">
                            {/* Modal Header */}
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-3xl font-bold text-[#171C3C] mb-2">{selectedProduct.productname}</h2>
                                    <p className="text-[#171C3C]/60">{selectedProduct.category}</p>
                                    {selectedProduct.artistName && (
                                        <p className="text-sm text-[#171C3C]/50 mt-1">by {selectedProduct.artistName}</p>
                                    )}
                                </div>
                                <button
                                    onClick={() => setIsViewModalOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-6 h-6 text-[#171C3C]" />
                                </button>
                            </div>

                            {/* Product Image */}
                            <div className="mb-6 rounded-xl overflow-hidden bg-gradient-to-br from-[#D1CAF2]/20 to-[#98C4EC]/20">
                                {selectedProduct.thumbnail || selectedProduct.images?.[0] ? (
                                    <img
                                        src={selectedProduct.thumbnail || selectedProduct.images[0]}
                                        alt={selectedProduct.productname}
                                        className="w-full h-96 object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-96">
                                        <ShoppingBag className="w-24 h-24 text-[#98C4EC]/40" />
                                    </div>
                                )}
                            </div>

                            {/* Product Details Grid */}
                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-sm font-semibold text-[#171C3C]/60 mb-1">Price</h3>
                                        <div>
                                            <span className="text-3xl font-bold text-[#171C3C]">₹{selectedProduct.price}</span>
                                            {selectedProduct.originalPrice && (
                                                <span className="text-lg text-[#171C3C]/50 line-through ml-3">
                                                    ₹{selectedProduct.originalPrice}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {selectedProduct.size && (
                                        <div>
                                            <h3 className="text-sm font-semibold text-[#171C3C]/60 mb-1">Size</h3>
                                            <p className="text-[#171C3C]">
                                                {selectedProduct.size.height} x {selectedProduct.size.width} {selectedProduct.size.unit}
                                            </p>
                                        </div>
                                    )}

                                    {selectedProduct.medium && (
                                        <div>
                                            <h3 className="text-sm font-semibold text-[#171C3C]/60 mb-1">Medium</h3>
                                            <p className="text-[#171C3C]">{selectedProduct.medium}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    {selectedProduct.yearCreated && (
                                        <div>
                                            <h3 className="text-sm font-semibold text-[#171C3C]/60 mb-1">Year Created</h3>
                                            <p className="text-[#171C3C]">{selectedProduct.yearCreated}</p>
                                        </div>
                                    )}

                                    {selectedProduct.orientation && (
                                        <div>
                                            <h3 className="text-sm font-semibold text-[#171C3C]/60 mb-1">Orientation</h3>
                                            <p className="text-[#171C3C]">{selectedProduct.orientation}</p>
                                        </div>
                                    )}

                                    <div>
                                        <h3 className="text-sm font-semibold text-[#171C3C]/60 mb-1">Availability</h3>
                                        <p className={`font-medium ${selectedProduct.inStock ? 'text-green-600' : 'text-red-600'}`}>
                                            {selectedProduct.inStock ? `In Stock (${selectedProduct.stock})` : 'Sold Out'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            {selectedProduct.description && (
                                <div className="mb-6">
                                    <h3 className="text-sm font-semibold text-[#171C3C]/60 mb-2">Description</h3>
                                    <p className="text-[#171C3C] leading-relaxed">{selectedProduct.description}</p>
                                </div>
                            )}

                            {/* Tags */}
                            {selectedProduct.tags && selectedProduct.tags.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-sm font-semibold text-[#171C3C]/60 mb-2">Tags</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedProduct.tags.map((tag, index) => (
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

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                <button
                                    onClick={() => handleAddToCart(selectedProduct)}
                                    disabled={!selectedProduct.inStock || isInCart(selectedProduct._id)}
                                    className={`flex-1 py-3 rounded-xl font-medium transition-colors ${selectedProduct.inStock && !isInCart(selectedProduct._id)
                                            ? 'bg-[#171C3C] text-white hover:bg-[#171C3C]/90'
                                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                        }`}
                                >
                                    {!selectedProduct.inStock ? 'Out of Stock' : isInCart(selectedProduct._id) ? 'Already in Cart' : 'Add to Cart'}
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
