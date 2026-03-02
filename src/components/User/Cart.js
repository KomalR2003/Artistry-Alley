'use client';
import React from 'react';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function Cart({ onNavigate }) {
    const router = useRouter();
    const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

    const handleCheckout = () => {
        if (cart.length === 0) {
            toast.error('Your cart is empty');
            return;
        }
        if (onNavigate) {
            onNavigate('Checkout');
        } else {
            router.push('/checkout');
        }
    };

    if (cart.length === 0) {
        return (
            <div className="w-full h-full bg-white text-[#171C3C] p-8 overflow-y-auto">
                <div className="max-w-4xl mx-auto text-center py-20">
                    <ShoppingCart className="w-24 h-24 text-[#98C4EC]/40 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-[#171C3C] mb-4">Your Cart is Empty</h2>
                    <p className="text-[#171C3C]/60 mb-8">Add some beautiful art pieces to get started!</p>
                    <button
                        onClick={() => router.push('/user/products')}
                        className="px-8 py-3 bg-[#171C3C] text-white rounded-xl hover:bg-[#171C3C]/90 transition-colors font-medium"
                    >
                        Browse Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-white text-[#171C3C] p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#171C3C] via-[#98C4EC] to-[#FE9E8F]">
                        Shopping Cart
                    </h1>
                    <p className="text-[#171C3C]/70 mt-2">
                        Review your items and proceed to checkout
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.map(item => (
                            <div key={item._id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                                <div className="flex gap-4">
                                    {/* Product Image */}
                                    <div className="relative w-24 h-24 flex-shrink-0">
                                        {item.thumbnail || item.images?.[0] ? (
                                            <img
                                                src={item.thumbnail || item.images[0]}
                                                alt={item.productname}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-[#D1CAF2]/20 to-[#98C4EC]/20 rounded-lg flex items-center justify-center">
                                                <ShoppingCart className="w-8 h-8 text-[#98C4EC]/40" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-[#171C3C] text-lg mb-1 truncate">
                                            {item.productname}
                                        </h3>
                                        <p className="text-sm text-[#171C3C]/60 mb-2">{item.category}</p>
                                        {item.artistName && (
                                            <p className="text-xs text-[#171C3C]/50 mb-3">by {item.artistName}</p>
                                        )}

                                        {/* Price */}
                                        <div className="flex items-baseline gap-2 mb-3">
                                            <span className="text-2xl font-bold text-[#171C3C]">₹{item.price}</span>
                                            {item.originalPrice && (
                                                <span className="text-sm text-[#171C3C]/50 line-through">
                                                    ₹{item.originalPrice}
                                                </span>
                                            )}
                                        </div>

                                        {/* Stock Info */}
                                        <p className={`text-xs mb-3 font-medium ${item.quantity >= item.stock
                                            ? 'text-orange-600'
                                            : 'text-green-600'
                                            }`}>
                                            {item.quantity >= item.stock
                                                ? `Maximum quantity reached (${item.stock} available)`
                                                : `${item.stock} items available`
                                            }
                                        </p>

                                        {/* Quantity and Remove */}
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                                                <button
                                                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                    className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="px-4 font-medium min-w-[3rem] text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                    disabled={item.quantity >= item.stock}
                                                    className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    title={item.quantity >= item.stock ? `Only ${item.stock} available` : 'Increase quantity'}
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeFromCart(item._id)}
                                                className="flex items-center gap-2 text-red-500 hover:text-red-700 transition-colors font-medium text-sm"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Remove
                                            </button>
                                        </div>
                                    </div>

                                    {/* Item Total */}
                                    <div className="text-right">
                                        <p className="text-sm text-[#171C3C]/60 mb-1">Subtotal</p>
                                        <p className="text-xl font-bold text-[#171C3C]">
                                            ₹{item.price * item.quantity}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Clear Cart Button */}
                        <button
                            onClick={clearCart}
                            className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium transition-colors mt-4"
                        >
                            <X className="w-4 h-4" />
                            Clear All Items
                        </button>
                    </div>

                    {/* Order Summary - Sticky Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-gradient-to-br from-[#D1CAF2]/10 to-[#98C4EC]/10 rounded-xl p-6 border border-gray-200 sticky top-4">
                            <h2 className="text-2xl font-bold text-[#171C3C] mb-6">Order Summary</h2>

                            {/* Summary Details */}
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-[#171C3C]/70">
                                    <span>Items ({cart.reduce((count, item) => count + item.quantity, 0)})</span>
                                    <span className="font-medium">₹{getCartTotal()}</span>
                                </div>
                                <div className="flex justify-between text-[#171C3C]/70">
                                    <span>Shipping</span>
                                    <span className="font-medium text-green-600">FREE</span>
                                </div>
                                <div className="flex justify-between text-[#171C3C]/70">
                                    <span>Tax</span>
                                    <span className="font-medium">Included</span>
                                </div>

                                <div className="border-t border-gray-300 pt-4 mt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xl font-bold text-[#171C3C]">Total</span>
                                        <span className="text-2xl font-bold text-[#171C3C]">₹{getCartTotal()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Checkout Button */}
                            <button
                                onClick={handleCheckout}
                                className="w-full bg-[#171C3C] text-white py-3 rounded-xl hover:bg-[#171C3C]/90 font-medium flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
                            >
                                Proceed to Checkout
                                <ArrowRight className="w-5 h-5" />
                            </button>

                            <button
                                onClick={() => router.push('/user/products')}
                                className="w-full mt-3 py-3 border border-[#171C3C] text-[#171C3C] rounded-xl hover:bg-[#171C3C]/5 font-medium transition-colors"
                            >
                                Continue Shopping
                            </button>

                            {/* Security Badge */}
                            <div className="mt-6 pt-6 border-t border-gray-300">
                                <p className="text-xs text-[#171C3C]/60 text-center flex items-center justify-center gap-2">
                                    <span className="text-green-600 text-lg">🔒</span>
                                    Secure Checkout
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
