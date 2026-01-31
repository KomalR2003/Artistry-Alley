import React from 'react';
import { ShoppingBag, Package, ShoppingCart, DollarSign } from 'lucide-react';

const ManageProducts = () => {
  return (
    <div className="w-full h-full bg-white text-[#171C3C] p-8 overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#171C3C] via-[#98C4EC] to-[#FE9E8F]">
          Manage Products
        </h1>
        <p className="text-[#171C3C]/70 mt-2">
          Manage all products here
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#98C4EC]/10 p-6 rounded-xl border border-[#98C4EC]/40 hover:shadow-lg transition-shadow">
          <Package className="w-8 h-8 text-[#98C4EC] mb-3" />
          <h3 className="text-2xl font-bold text-[#171C3C]">250</h3>
          <p className="text-sm text-[#171C3C]/60">Total Products</p>
        </div>

        <div className="bg-[#D1CAF2]/10 p-6 rounded-xl border border-[#D1CAF2]/40 hover:shadow-lg transition-shadow">
          <ShoppingCart className="w-8 h-8 text-[#D1CAF2] mb-3" />
          <h3 className="text-2xl font-bold text-[#171C3C]">180</h3>
          <p className="text-sm text-[#171C3C]/60">Orders</p>
        </div>

        <div className="bg-[#FE9E8F]/10 p-6 rounded-xl border border-[#FE9E8F]/40 hover:shadow-lg transition-shadow">
          <DollarSign className="w-8 h-8 text-[#FE9E8F] mb-3" />
          <h3 className="text-2xl font-bold text-[#171C3C]">$12.5k</h3>
          <p className="text-sm text-[#171C3C]/60">Revenue</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#171C3C]/20 hover:shadow-lg transition-shadow">
          <ShoppingBag className="w-8 h-8 text-[#171C3C]/60 mb-3" />
          <h3 className="text-2xl font-bold text-[#171C3C]">45</h3>
          <p className="text-sm text-[#171C3C]/60">Active Sales</p>
        </div>
      </div>

      {/* Content Placeholder */}
      <div className="bg-[#98C4EC]/10 rounded-2xl border border-[#98C4EC]/40 p-12 text-center">
        <ShoppingBag className="w-16 h-16 text-[#98C4EC] mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-[#171C3C] mb-2">Product Management</h2>
        <p className="text-[#171C3C]/60">Product management features will be implemented here</p>
      </div>
    </div>
  );
};

export default ManageProducts;
