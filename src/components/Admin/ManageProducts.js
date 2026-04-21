import React, { useState, useEffect } from 'react';
import { ShoppingBag, Package, ShoppingCart, DollarSign, Search, Trash2, IndianRupee, Image as ImageIcon, AlertTriangle, Edit2, X, Save } from 'lucide-react';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [productToDelete, setProductToDelete] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products');
      const result = await res.json();
      if (result.success) {
        setProducts(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Derived Statistics
  const totalProducts = products.length;
  const totalSales = products.reduce((acc, curr) => acc + (curr.totalSold || 0), 0);
  const projectedRevenue = products.reduce((acc, curr) => acc + ((curr.totalSold || 0) * (curr.price || 0)), 0);
  const outOfStock = products.filter(p => !p.inStock).length;

  // Filtered Products
  const filteredProducts = products.filter(p => {
    return (p.productname || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.artistId?.name || p.artistName || p.artist?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
  });

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      const res = await fetch(`/api/admin/products?id=${productToDelete}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setProductToDelete(null);
        fetchProducts();
      } else {
        alert(data.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const openEditModal = (product) => {
    setEditingProduct({
      id: product._id,
      productname: product.productname || product.name || '',
      category: product.category || '',
      description: product.description || '',
      medium: product.medium || '',
      orientation: product.orientation || 'Portrait',
      yearCreated: product.yearCreated || new Date().getFullYear(),
      price: product.price || 0,
      originalPrice: product.originalPrice || 0,
      stock: product.stock !== undefined ? product.stock : 1,
      inStock: product.inStock !== false,
      status: product.status || 'active'
    });
  };

  const saveProductEdits = async () => {
    if (!editingProduct) return;
    try {
      const res = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct)
      });
      const data = await res.json();
      if (data.success) {
        setEditingProduct(null);
        fetchProducts();
      } else {
        alert(data.message || 'Failed to update product');
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <div className="w-full h-full bg-[#FAFAFA] text-[#171C3C] p-8 overflow-y-auto relative custom-scrollbar">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-black border-none">
            Manage Products
          </h1>
          <p className="text-[#171C3C]/70 mt-1">
            Oversee the entire marketplace inventory and sales records.
          </p>
        </div>

        {/* Search */}
        <div className="relative border border-[#D1CAF2]/40 rounded-xl overflow-hidden flex bg-white w-64 shadow-sm">
          <div className="px-3 py-2 text-[#171C3C]/40 flex items-center justify-center">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search artworks, categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 py-2 pr-4 bg-transparent text-sm font-medium focus:outline-none text-[#171C3C]"
          />
        </div>
      </div>



      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="flex flex-col transition-shadow">
          <h3 className="text-lg font-semibold text-[#171C3C] mb-4">Marketplace Inventory</h3>
          <div className="flex items-center gap-4">
            <div className="w-2 h-14 rounded-l-full bg-[#C084FC] shrink-0"></div>
            <div className="flex gap-6 w-full">
              <div className="flex flex-col justify-center">
                <span className="text-sm text-[#171C3C]/60 font-medium mb-1">Total Artwork</span>
                <span className="text-xl font-bold text-[#171C3C]">{loading ? 0 : totalProducts}</span>
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-sm text-[#171C3C]/60 font-medium mb-1">Out of Stock</span>
                <span className="text-xl font-bold text-[#171C3C]">{loading ? 0 : outOfStock}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col transition-shadow">
          <h3 className="text-lg font-semibold text-[#171C3C] mb-4">Sales Performance</h3>
          <div className="flex items-center gap-4">
            <div className="w-2 h-14 rounded-l-full bg-[#4ADE80] shrink-0"></div>
            <div className="flex gap-6 w-full">
              <div className="flex flex-col justify-center">
                <span className="text-sm text-[#171C3C]/60 font-medium mb-1">Total Sold</span>
                <span className="text-xl font-bold text-[#171C3C]">{loading ? 0 : totalSales}</span>
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-sm text-[#171C3C]/60 font-medium mb-1">Gross Revenue</span>
                <span className="text-xl font-bold text-[#171C3C]">₹{loading ? 0 : projectedRevenue.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* List Section */}
      <div className="bg-white rounded-2xl border border-[#D1CAF2]/40 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAFAFA] border-b border-[#D1CAF2]/30 text-xs uppercase tracking-wider text-[#171C3C]/50">
                <th className="p-5 font-bold">Product Preview</th>
                <th className="p-5 font-bold">Artist</th>
                <th className="p-5 font-bold">Category</th>
                <th className="p-5 font-bold text-right">Price</th>
                <th className="p-5 font-bold text-center">Status</th>
                <th className="p-5 font-bold text-center">Sales</th>
                <th className="p-5 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-[#171C3C]/50 font-medium">Scanning inventory...</td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-[#171C3C]/50 font-medium">No marketplace items match your search.</td>
                </tr>
              ) : filteredProducts.map((product, idx) => (
                <tr key={idx} className="border-b border-[#D1CAF2]/10 hover:bg-[#FAFAFA]/50 transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-12 rounded-lg bg-slate-100 overflow-hidden shadow-sm shrink-0 flex items-center justify-center">
                        {product.thumbnail ? (
                          <img src={product.thumbnail.startsWith('http') || product.thumbnail.startsWith('data:') ? product.thumbnail : `http://localhost:3000${product.thumbnail}`} alt={product.productname} className="w-full h-full object-cover" />
                        ) : product.images && product.images.length > 0 ? (
                          <img src={product.images[0].startsWith('http') || product.images[0].startsWith('data:') ? product.images[0] : `http://localhost:3000${product.images[0]}`} alt={product.productname} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-slate-300" />
                        )}
                      </div>
                      <h4 className="font-semibold text-black text-sm group-hover:text-[#98C4EC] transition-colors line-clamp-2 max-w-[200px]">
                        {product.productname}
                      </h4>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#171C3C] bg-cover bg-center shrink-0" style={{ backgroundImage: (product.artistId?.profilePicture || product.artist?.profilePicture) ? `url(${product.artistId?.profilePicture || product.artist?.profilePicture})` : undefined }}>
                        {!(product.artistId?.profilePicture || product.artist?.profilePicture) && <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-white">{((product.artistId?.name || product.artist?.name || product.artistName || 'A')).charAt(0).toUpperCase()}</div>}
                      </div>
                      <span className="text-sm font-semibold text-black line-clamp-1">{product.artistId?.username || product.artistId?.name || product.artistName || product.artist?.name || 'Unknown Artist'}</span>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className="text-xs font-bold text-black  tracking-widest">{product.category}</span>
                  </td>
                  <td className="p-5 text-right">
                    <span className="text-sm font-medium text-black flex items-center justify-end gap-0.5 whitespace-nowrap">
                     ₹{product.price}
                    </span>
                  </td>
                  <td className="p-5 text-center">
                    {product.inStock ? (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md  text-black ">In Stock</span>
                    ) : (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md text-rose-600 ">Sold Out</span>
                    )}
                  </td>
                  <td className="p-5 text-center font-bold text-black">
                    {product.totalSold || 0}
                  </td>
                  <td className="p-5">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openEditModal(product)}
                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors tooltip-trigger"
                        title="Edit Product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setProductToDelete(product._id)}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors tooltip-trigger"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="absolute inset-0 z-50 bg-[#171C3C]/80 backdrop-blur-sm flex items-center justify-center p-4 min-h-screen">
          <div className="bg-white rounded-3xl w-full max-w-2xl p-8 shadow-2xl animate-fade-in relative border border-[#D1CAF2] max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button onClick={() => setEditingProduct(null)} className="absolute right-6 top-6 text-[#171C3C]/40 hover:text-[#FE9E8F] transition-colors p-1 bg-gray-100 rounded-full hover:bg-gray-200">
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-black text-[#171C3C] mb-6 tracking-tight">Edit Product details</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs font-bold text-[#171C3C]/60 uppercase tracking-wider mb-2 block pl-1">Product Name</label>
                  <input type="text" value={editingProduct.productname} onChange={(e) => setEditingProduct({ ...editingProduct, productname: e.target.value })} className="w-full bg-[#FAFAFA] border border-[#D1CAF2]/40 rounded-xl px-4 py-3 text-[#171C3C] font-semibold focus:outline-none focus:border-[#98C4EC]" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-bold text-[#171C3C]/60 uppercase tracking-wider mb-2 block pl-1">Description</label>
                  <textarea rows="3" value={editingProduct.description} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} className="w-full bg-[#FAFAFA] border border-[#D1CAF2]/40 rounded-xl px-4 py-3 text-[#171C3C] text-sm focus:outline-none focus:border-[#98C4EC] resize-none"></textarea>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#171C3C]/60 uppercase tracking-wider mb-2 block pl-1">Category</label>
                  <input type="text" value={editingProduct.category} onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })} className="w-full bg-[#FAFAFA] border border-[#D1CAF2]/40 rounded-xl px-4 py-3 text-[#171C3C] font-semibold focus:outline-none focus:border-[#98C4EC]" />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#171C3C]/60 uppercase tracking-wider mb-2 block pl-1">Medium</label>
                  <input type="text" value={editingProduct.medium} onChange={(e) => setEditingProduct({ ...editingProduct, medium: e.target.value })} className="w-full bg-[#FAFAFA] border border-[#D1CAF2]/40 rounded-xl px-4 py-3 text-[#171C3C] font-semibold focus:outline-none focus:border-[#98C4EC]" />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#171C3C]/60 uppercase tracking-wider mb-2 block pl-1">Orientation</label>
                  <select value={editingProduct.orientation} onChange={(e) => setEditingProduct({ ...editingProduct, orientation: e.target.value })} className="w-full bg-[#FAFAFA] border border-[#D1CAF2]/40 rounded-xl px-4 py-3 text-[#171C3C] font-semibold focus:outline-none focus:border-[#98C4EC] appearance-none">
                    <option value="Portrait">Portrait</option>
                    <option value="Landscape">Landscape</option>
                    <option value="Square">Square</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#171C3C]/60 uppercase tracking-wider mb-2 block pl-1">Year Created</label>
                  <input type="number" value={editingProduct.yearCreated} onChange={(e) => setEditingProduct({ ...editingProduct, yearCreated: e.target.value })} className="w-full bg-[#FAFAFA] border border-[#D1CAF2]/40 rounded-xl px-4 py-3 text-[#171C3C] font-semibold focus:outline-none focus:border-[#98C4EC]" />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#171C3C]/60 uppercase tracking-wider mb-2 block pl-1">Price (₹)</label>
                  <input type="number" value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })} className="w-full bg-[#FAFAFA] border border-[#D1CAF2]/40 rounded-xl px-4 py-3 text-[#171C3C] font-semibold focus:outline-none focus:border-[#98C4EC]" />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#171C3C]/60 uppercase tracking-wider mb-2 block pl-1">Original Price (₹)</label>
                  <input type="number" value={editingProduct.originalPrice} onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: e.target.value })} className="w-full bg-[#FAFAFA] border border-[#D1CAF2]/40 rounded-xl px-4 py-3 text-[#171C3C] font-semibold focus:outline-none focus:border-[#98C4EC]" />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#171C3C]/60 uppercase tracking-wider mb-2 block pl-1">Stock Quantity</label>
                  <input type="number" value={editingProduct.stock} onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })} className="w-full bg-[#FAFAFA] border border-[#D1CAF2]/40 rounded-xl px-4 py-3 text-[#171C3C] font-semibold focus:outline-none focus:border-[#98C4EC]" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold text-[#171C3C]/60 uppercase tracking-wider mb-2 block pl-1">In Stock</label>
                    <select value={editingProduct.inStock} onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.value === 'true' })} className="w-full bg-[#FAFAFA] border border-[#D1CAF2]/40 rounded-xl px-4 py-3 text-[#171C3C] font-semibold focus:outline-none focus:border-[#98C4EC] appearance-none">
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#171C3C]/60 uppercase tracking-wider mb-2 block pl-1">Status</label>
                    <select value={editingProduct.status} onChange={(e) => setEditingProduct({ ...editingProduct, status: e.target.value })} className="w-full bg-[#FAFAFA] border border-[#D1CAF2]/40 rounded-xl px-4 py-3 text-[#171C3C] font-semibold focus:outline-none focus:border-[#98C4EC] appearance-none">
                      <option value="active">Active</option>
                      <option value="draft">Draft</option>
                      <option value="soldout">Sold Out</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>

              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button onClick={() => setEditingProduct(null)} className="flex-1 py-3 px-4 bg-gray-100 text-[#171C3C] rounded-xl font-bold hover:bg-gray-200 transition-colors">Cancel</button>
              <button onClick={saveProductEdits} className="flex-[2] py-3 px-4 bg-[#171C3C] text-white rounded-xl font-bold hover:bg-[#171C3C]/90 transition-all flex justify-center items-center gap-2">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="absolute inset-0 z-50 bg-[#171C3C]/80 backdrop-blur-sm flex items-center justify-center p-4 min-h-screen">
          <div className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl animate-fade-in relative border border-red-200">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-center text-[#171C3C] mb-3">Remove Listing?</h2>
            <p className="text-sm text-center text-[#171C3C]/70 mb-8 font-medium">This action is irreversible. The artwork will be permanently deleted from the entire marketplace.</p>

            <div className="flex gap-3">
              <button onClick={() => setProductToDelete(null)} className="flex-1 py-3 bg-gray-100 text-[#171C3C] rounded-xl font-bold hover:bg-gray-200 transition-colors">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 shadow-md shadow-red-500/20 transition-all">Yes, Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
