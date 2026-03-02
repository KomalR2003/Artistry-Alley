"use client";
import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, Clock, X, User, Mail, Phone, MapPin } from 'lucide-react';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending, confirmed, processing, shipped, delivered

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            // Get user info from localStorage
            const userId = localStorage.getItem('userId');
            const email = localStorage.getItem('userEmail');

            // If no credentials available, show empty state
            if (!userId && !email) {
                setOrders([]);
                setLoading(false);
                return;
            }

            const response = await fetch('/api/orders/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId || null,
                    email: email || null
                }),
            });

            const data = await response.json();

            if (data.success) {
                setOrders(data.orders || []);
                console.log('✅ Fetched orders:', data.orders.length);
            } else {
                console.error(data.error || 'Failed to fetch orders');
                setOrders([]);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-600', icon: Clock, label: 'Pending Confirmation' },
            confirmed: { bg: 'bg-blue-500/20', text: 'text-blue-600', icon: CheckCircle, label: 'Confirmed' },
            processing: { bg: 'bg-purple-500/20', text: 'text-purple-600', icon: Package, label: 'Processing' },
            shipped: { bg: 'bg-indigo-500/20', text: 'text-indigo-600', icon: Truck, label: 'Shipped' },
            delivered: { bg: 'bg-green-500/20', text: 'text-green-600', icon: CheckCircle, label: 'Delivered' },
            cancelled: { bg: 'bg-red-500/20', text: 'text-red-600', icon: X, label: 'Cancelled' }
        };
        const badge = badges[status] || badges.pending;
        const Icon = badge.icon;
        return (
            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${badge.bg} ${badge.text}`}>
                <Icon className="w-4 h-4 mr-1.5" />
                {badge.label}
            </span>
        );
    };

    const getItemStatusBadge = (status) => {
        const badges = {
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Awaiting Artist' },
            confirmed: { bg: 'bg-green-100', text: 'text-green-700', label: '✓ Confirmed' },
            cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled' }
        };
        const badge = badges[status] || badges.pending;
        return (
            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${badge.bg} ${badge.text}`}>
                {badge.label}
            </span>
        );
    };

    const filteredOrders = orders.filter(order => {
        if (filter === 'all') return true;
        return order.status === filter;
    });

    if (loading) {
        return (
            <div className="flex-1 overflow-y-auto p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FE9E8F]"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-[#171C3C] mb-2">My Orders</h1>
                    <p className="text-gray-600">Track and manage your orders</p>
                </div>

                {/* Filters */}
                <div className="mb-6 flex flex-wrap gap-3">
                    {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === status
                                    ? 'bg-[#171C3C] text-white shadow-lg'
                                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                        <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-2xl font-semibold text-gray-700 mb-2">No orders found</h3>
                        <p className="text-gray-500 mb-6">
                            {orders.length === 0
                                ? "Start shopping and your orders will appear here"
                                : `No ${filter} orders at the moment`}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredOrders.map((order) => (
                            <div
                                key={order._id}
                                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-gray-100"
                            >
                                {/* Order Header */}
                                <div className="bg-gradient-to-r from-[#FE9E8F]/10 via-[#D1CAF2]/10 to-[#98C4EC]/10 px-6 py-5 border-b border-gray-100">
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-[#171C3C] mb-1">
                                                Order #{order.orderId?.slice(-8)}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                        <div className="flex flex-col md:items-end gap-2">
                                            {getStatusBadge(order.status)}
                                            <p className="text-2xl font-bold text-[#171C3C]">₹{order.totalAmount}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Info */}
                                <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-2 text-sm">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span className="text-gray-700">
                                        Payment: <span className="font-semibold text-green-600">Paid</span>
                                    </span>
                                    <span className="text-gray-400 mx-2">|</span>
                                    <span className="text-gray-600">
                                        Payment ID: <span className="font-mono text-xs">{order.paymentId?.slice(-12)}</span>
                                    </span>
                                </div>

                                {/* Items */}
                                <div className="px-6 py-5">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Order Items</h4>
                                    <div className="space-y-4">
                                        {order.items.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-[#FE9E8F] transition-colors"
                                            >
                                                {item.thumbnail && (
                                                    <img
                                                        src={item.thumbnail}
                                                        alt={item.productname}
                                                        className="w-20 h-20 object-cover rounded-lg shadow-sm"
                                                    />
                                                )}
                                                <div className="flex-1">
                                                    <h5 className="font-bold text-[#171C3C] text-lg mb-1">{item.productname}</h5>
                                                    <p className="text-sm text-gray-600 mb-2">
                                                        by <span className="font-medium text-[#FE9E8F]">{item.artistName}</span>
                                                    </p>
                                                    <div className="flex items-center gap-4 text-sm">
                                                        <span className="text-gray-700">
                                                            Qty: <span className="font-semibold">{item.quantity}</span>
                                                        </span>
                                                        <span className="text-gray-400">×</span>
                                                        <span className="text-gray-700">
                                                            ₹{item.price}
                                                        </span>
                                                        <span className="text-gray-400">=</span>
                                                        <span className="font-bold text-[#171C3C]">₹{item.price * item.quantity}</span>
                                                    </div>
                                                    <div className="mt-2">
                                                        {getItemStatusBadge(item.confirmationStatus)}
                                                        {item.confirmationStatus === 'confirmed' && item.confirmedAt && (
                                                            <span className="ml-2 text-xs text-gray-500">
                                                                on {new Date(item.confirmedAt).toLocaleDateString()}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Delivery Address */}
                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        Delivery Address
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                        <div className="flex items-start gap-2">
                                            <User className="w-4 h-4 text-gray-400 mt-0.5" />
                                            <span className="text-gray-700">{order.customer.name}</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                                            <span className="text-gray-700">{order.customer.email}</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                                            <span className="text-gray-700">{order.customer.phone}</span>
                                        </div>
                                        {order.customer.address && (
                                            <div className="flex items-start gap-2 md:col-span-2">
                                                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                                                <span className="text-gray-700">
                                                    {order.customer.address}, {order.customer.city}, {order.customer.state} {order.customer.pincode}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Order Summary Footer */}
                                <div className="px-6 py-4 bg-gradient-to-r from-[#171C3C] to-[#2a3154] text-white">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm opacity-90">Total Amount</span>
                                        <span className="text-2xl font-bold">₹{order.totalAmount}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
