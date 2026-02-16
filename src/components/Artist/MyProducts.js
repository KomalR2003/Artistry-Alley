'use client';
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Package, DollarSign, TrendingUp, Plus, Edit, Trash2, Loader2, Eye } from 'lucide-react';
import AddProductForm from './AddProductForm';
import EditProductForm from './EditProductForm';
import ViewProductModal from './ViewProductModal';

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [artistId, setArtistId] = useState(null);
  const [artistName, setArtistName] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    purchased: 0,
    categories: 0,
    inStock: 0
  });

  useEffect(() => {
    // Get artist ID from localStorage (stored during login)
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');
    const username = localStorage.getItem('username');

    if (userId && userRole === 'artist') {
      setArtistId(userId);
      setArtistName(username || 'Artist');
      fetchProducts(userId);
    } else {
      // If no user found or not an artist, stop loading and show empty state
      setLoading(false);
      if (!userId) {
        setError('Please log in to view your products.');
      } else {
        setError('Unable to load products.');
      }
    }
  }, []);

  const fetchProducts = async (userId) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/product?artistId=${userId}&status=active`);
      const data = await response.json();

      if (data.success) {
        setProducts(data.products);

        // Calculate stats
        const total = data.products.length;
        const purchased = data.products.filter(p => !p.inStock).length;
        const uniqueCategories = [...new Set(data.products.map(p => p.category))].length;
        // Calculate total stock quantity (sum of all stock numbers)
        const totalStockQuantity = data.products.reduce((sum, p) => {
          return sum + (p.inStock ? (p.stock || 0) : 0);
        }, 0);

        setStats({
          total,
          purchased,
          categories: uniqueCategories,
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

  const handleProductAdded = (newProduct) => {
    setProducts(prev => [newProduct, ...prev]);
    // Recalculate stats after adding product
    if (artistId) {
      fetchProducts(artistId);
    }
  };

  const handleProductUpdated = (updatedProduct) => {
    setProducts(prev =>
      prev.map(p => p._id === updatedProduct._id ? updatedProduct : p)
    );
    if (artistId) {
      fetchProducts(artistId);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch(`/api/product/${productId}?soft=true`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setProducts(prev => prev.filter(p => p._id !== productId));
        setStats(prev => ({
          ...prev,
          total: prev.total - 1
        }));
      } else {
        alert(data.message || 'Failed to delete product');
      }
    } catch (err) {
      alert('An error occurred while deleting the product');
      console.error('Error deleting product:', err);
    }
  };

  const handleEditClick = (productId) => {
    setSelectedProductId(productId);
    setIsEditModalOpen(true);
  };

  const handleViewClick = (product) => {
    setSelectedProduct(product);
    setIsViewModalOpen(true);
  };

  return (
    <div className="w-full h-full bg-white text-[#171C3C] p-8 overflow-y-auto">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-[#171C3C]">
            My Products
          </h1>
          <p className="text-[#171C3C]/70 mt-2">
            Manage your products and sales
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#171C3C] text-white rounded-xl hover:bg-[#171C3C]/90 transition-all font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Quick Stats - Dashboard Style with Groups */}
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
          <h3 className="text-xl font-semibold text-[#171C3C] mb-4 pl-1">Sales</h3>
          <div className="flex items-center gap-4 px-2">
            <div className="w-2.5 h-16 rounded-l-full rounded-r-none bg-[#98C4EC] shrink-0"></div>
            <div className="flex gap-8">
              <div className="flex flex-col justify-center">
                <span className="text-sm text-[#171C3C]/60 font-medium whitespace-nowrap mb-1">Purchased</span>
                <span className="text-2xl font-semibold text-[#171C3C] tracking-tight">{stats.purchased}</span>
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-sm text-[#171C3C]/60 font-medium whitespace-nowrap mb-1">In Stock</span>
                <span className="text-2xl font-semibold text-[#171C3C] tracking-tight">{stats.inStock}</span>
              </div>
            </div>
          </div>
        </div>
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
      ) : products.length === 0 ? (
        <div className="bg-[#98C4EC]/10 rounded-2xl border border-[#98C4EC]/40 p-12 text-center">
          <ShoppingBag className="w-16 h-16 text-[#98C4EC] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#171C3C] mb-2">No Products Found</h2>
          <p className="text-[#171C3C]/60 mb-6">Start by adding your first product</p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-6 py-3 bg-[#171C3C] text-white rounded-xl hover:bg-[#171C3C]/90 transition-all font-medium inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group"
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
              </div>

              {/* Product Details */}
              <div className="p-4">
                <div className="mb-3">
                  <h3 className="font-bold text-[#171C3C] text-lg mb-1 truncate">
                    {product.productname}
                  </h3>
                  <p className="text-sm text-[#171C3C]/60">{product.category}</p>
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
                  <div className="text-sm text-[#171C3C]/60">
                    Stock: {product.stock}
                  </div>
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

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewClick(product)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#FE9E8F]/10 text-[#FE9E8F] rounded-lg hover:bg-[#FE9E8F]/20 transition-colors font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button
                    onClick={() => handleEditClick(product._id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#98C4EC]/10 text-[#98C4EC] rounded-lg hover:bg-[#98C4EC]/20 transition-colors font-medium"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
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

      {/* Add Product Modal */}
      <AddProductForm
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onProductAdded={handleProductAdded}
        artistId={artistId}
        artistName={artistName}
      />

      {/* Edit Product Modal */}
      <EditProductForm
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProductId(null);
        }}
        onProductUpdated={handleProductUpdated}
        productId={selectedProductId}
      />

      {/* View Product Modal */}
      <ViewProductModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
      />
    </div>
  );
};

export default MyProducts;
