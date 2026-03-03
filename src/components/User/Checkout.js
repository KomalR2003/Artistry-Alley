'use client';
import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, CreditCard, User, Mail, Phone, MapPin, ArrowRight, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
export default function Checkout({ onNavigate }) {
    const router = useRouter();
    const { cart, getCartTotal, clearCart } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);

    // Customer form state
    const [customerDetails, setCustomerDetails] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: ''
    });

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomerDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Validate form
    const validateForm = () => {
        if (!customerDetails.name.trim()) {
            toast.error('Please enter your name');
            return false;
        }
        if (!customerDetails.email.trim()) {
            toast.error('Please enter your email');
            return false;
        }
        if (!customerDetails.email.includes('@')) {
            toast.error('Please enter a valid email');
            return false;
        }
        if (!customerDetails.phone.trim()) {
            toast.error('Please enter your phone number');
            return false;
        }
        if (customerDetails.phone.length < 10) {
            toast.error('Please enter a valid phone number');
            return false;
        }
        return true;
    };

    // Handle payment
    const handlePayment = async () => {
        // Validate cart
        if (cart.length === 0) {
            toast.error('Your cart is empty');
            return;
        }

        // Validate form
        if (!validateForm()) {
            return;
        }

        setIsProcessing(true);

        try {
            // Placeholder: this is where your Razorpay flow will go once implemented from scratch
            toast.success('Processing payment (Mock)...');

            // Wait 1.5 seconds to simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Generate mock payment success for now
            const totalAmount = getCartTotal();
            clearCart();

            if (onNavigate) {
                onNavigate('OrderSuccess', {
                    orderId: `mock_order_${Date.now()}`,
                    totalAmount: totalAmount
                });
            }
        } catch (error) {
            console.error('Payment error:', error);
            toast.error(error.message || 'Payment failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    // Redirect if cart is empty
    if (cart.length === 0) {
        return (
            <div className="w-full h-full bg-white text-[#171C3C] p-8 overflow-y-auto">
                <div className="max-w-4xl mx-auto text-center py-20">
                    <ShoppingCart className="w-24 h-24 text-[#98C4EC]/40 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-[#171C3C] mb-4">Your Cart is Empty</h2>
                    <p className="text-[#171C3C]/60 mb-8">Add some beautiful art pieces to checkout!</p>
                    <button
                        onClick={() => router.push('/home')}
                        className="px-8 py-3 bg-[#171C3C] text-white rounded-xl hover:bg-[#171C3C]/90 transition-colors font-medium"
                    >
                        Browse Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="w-full h-full bg-gradient-to-br from-[#f8f9fa] via-white to-[#f0f4f8] text-[#171C3C] p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#171C3C] via-[#98C4EC] to-[#FE9E8F]">
                            Checkout
                        </h1>
                        <p className="text-[#171C3C]/70 mt-2">
                            Complete your purchase securely
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Customer Details Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                                <h2 className="text-2xl font-bold text-[#171C3C] mb-6 flex items-center gap-2">
                                    <User className="w-6 h-6 text-[#98C4EC]" />
                                    Customer Information
                                </h2>

                                <div className="space-y-4">
                                    {/* Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-[#171C3C] mb-2">
                                            Full Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={customerDetails.name}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#98C4EC] focus:border-transparent outline-none transition-all"
                                            placeholder="Enter your full name"
                                            required
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-[#171C3C] mb-2">
                                            Email Address <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="email"
                                                name="email"
                                                value={customerDetails.email}
                                                onChange={handleInputChange}
                                                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#98C4EC] focus:border-transparent outline-none transition-all"
                                                placeholder="your.email@example.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="block text-sm font-medium text-[#171C3C] mb-2">
                                            Phone Number <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={customerDetails.phone}
                                                onChange={handleInputChange}
                                                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#98C4EC] focus:border-transparent outline-none transition-all"
                                                placeholder="9876543210"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div>
                                        <label className="block text-sm font-medium text-[#171C3C] mb-2">
                                            Address (Optional)
                                        </label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                            <textarea
                                                name="address"
                                                value={customerDetails.address}
                                                onChange={handleInputChange}
                                                rows="3"
                                                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#98C4EC] focus:border-transparent outline-none transition-all resize-none"
                                                placeholder="Enter your address"
                                            />
                                        </div>
                                    </div>

                                    {/* City, State, Pincode */}
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[#171C3C] mb-2">
                                                City
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={customerDetails.city}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#98C4EC] focus:border-transparent outline-none transition-all"
                                                placeholder="City"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#171C3C] mb-2">
                                                State
                                            </label>
                                            <input
                                                type="text"
                                                name="state"
                                                value={customerDetails.state}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#98C4EC] focus:border-transparent outline-none transition-all"
                                                placeholder="State"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#171C3C] mb-2">
                                                Pincode
                                            </label>
                                            <input
                                                type="text"
                                                name="pincode"
                                                value={customerDetails.pincode}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#98C4EC] focus:border-transparent outline-none transition-all"
                                                placeholder="400001"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary - Sticky Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-gradient-to-br from-[#D1CAF2]/10 to-[#98C4EC]/10 rounded-xl p-6 border border-gray-200 sticky top-4">
                                <h2 className="text-2xl font-bold text-[#171C3C] mb-6">Order Summary</h2>

                                {/* Cart Items */}
                                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                                    {cart.map(item => (
                                        <div key={item._id} className="flex gap-3 bg-white p-3 rounded-lg">
                                            <div className="w-16 h-16 flex-shrink-0">
                                                {item.thumbnail || item.images?.[0] ? (
                                                    <img
                                                        src={item.thumbnail || item.images[0]}
                                                        alt={item.productname}
                                                        className="w-full h-full object-cover rounded"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                                                        <ShoppingCart className="w-6 h-6 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm text-[#171C3C] truncate">{item.productname}</p>
                                                <p className="text-xs text-[#171C3C]/60">Qty: {item.quantity}</p>
                                                <p className="text-sm font-bold text-[#171C3C]">₹{item.price * item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Summary Details */}
                                <div className="space-y-3 mb-6 border-t border-gray-300 pt-4">
                                    <div className="flex justify-between text-[#171C3C]/70">
                                        <span>Subtotal ({cart.reduce((count, item) => count + item.quantity, 0)} items)</span>
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

                                    <div className="border-t border-gray-300 pt-3 mt-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xl font-bold text-[#171C3C]">Total</span>
                                            <span className="text-2xl font-bold text-[#171C3C]">₹{getCartTotal()}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Button */}
                                <button
                                    onClick={handlePayment}
                                    disabled={isProcessing}
                                    className="w-full bg-[#171C3C] text-white py-4 rounded-xl hover:bg-[#171C3C]/90 font-bold flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard className="w-5 h-5" />
                                            Pay Now ₹{getCartTotal()}
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>

                                {/* Security Badge */}
                                <div className="mt-6 pt-6 border-t border-gray-300">
                                    <p className="text-xs text-[#171C3C]/60 text-center flex items-center justify-center gap-2">
                                        <Shield className="w-4 h-4 text-green-600" />
                                        Secure Payment via Razorpay
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
