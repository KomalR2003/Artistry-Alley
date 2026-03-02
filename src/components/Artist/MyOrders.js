"use client";
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Package, CheckCircle, Clock, X } from 'lucide-react';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending, confirmed
    const [confirmingItems, setConfirmingItems] = useState({});

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            // Get artist ID from session/auth
            const artistId = localStorage.getItem('userId');

            if (!artistId) {
                toast.error('Please log in as an artist');
                return;
            }

            const response = await fetch('/api/orders/artist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ artistId }),
            });

            const data = await response.json();

            if (data.success) {
                setOrders(data.orders);
            } else {
                toast.error(data.error || 'Failed to fetch orders');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const confirmOrder = async (orderId, productId) => {
        const artistId = localStorage.getItem('userId');
        const key = `${orderId}-${productId}`;

        try {
            setConfirmingItems(prev => ({ ...prev, [key]: true }));

            const response = await fetch('/api/orders/confirm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderId, productId, artistId }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Order confirmed successfully!');
                // Refresh orders
                fetchOrders();
            } else {
                toast.error(data.error || 'Failed to confirm order');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to confirm order');
        } finally {
            setConfirmingItems(prev => {
                const newState = { ...prev };
                delete newState[key];
                return newState;
            });
        }
    };

    const filteredOrders = orders.filter(order => {
        if (filter === 'all') return true;
        if (filter === 'pending') {
            return order.items.some(item => item.confirmationStatus === 'pending');
        }
        if (filter === 'confirmed') {
            return order.items.every(item => item.confirmationStatus === 'confirmed');
        }
        return true;
    });

    const getStatusBadge = (status) => {
        const badges = {
            pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', icon: Clock, label: 'Pending' },
            confirmed: { bg: 'bg-green-500/20', text: 'text-green-400', icon: CheckCircle, label: 'Confirmed' },
            cancelled: { bg: 'bg-red-500/20', text: 'text-red-400', icon: X, label: 'Cancelled' }
        };
        const badge = badges[status] || badges.pending;
        const Icon = badge.icon;
        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                <Icon className="w-3 h-3 mr-1" />
                {badge.label}
            </span>
        );
    };

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
        <div className="flex-1 overflow-y-auto p-6 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#171C3C] mb-2">My Orders</h1>
                    <p className="text-gray-600">Manage orders for your products</p>
                </div>

                {/* Filters */}
                <div className="mb-6 flex gap-3">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'all'
                                ? 'bg-[#171C3C] text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        All Orders
                    </button>
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'pending'
                                ? 'bg-[#171C3C] text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Pending
                    </button>
                    <button
                        onClick={() => setFilter('confirmed')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'confirmed'
                                ? 'bg-[#171C3C] text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Confirmed
                    </button>
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                    <div className="text-center py-16">
                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No orders yet</h3>
                        <p className="text-gray-500">Orders for your products will appear here</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredOrders.map((order) => (
                            <div
                                key={order._id}
                                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                {/* Order Header */}
                                <div className="bg-gradient-to-r from-[#FE9E8F]/10 to-[#D1CAF2]/10 px-6 py-4 border-b border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="text-lg font-bold text-[#171C3C]">
                                                Order #{order.orderId}
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
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600">Your Earnings</p>
                                            <p className="text-2xl font-bold text-[#171C3C]">₹{order.itemTotal}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Customer Info */}
                                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Customer Details</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                        <div>
                                            <span className="text-gray-600">Name:</span>
                                            <span className="ml-2 font-medium text-[#171C3C]">{order.customer.name}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Email:</span>
                                            <span className="ml-2 font-medium text-[#171C3C]">{order.customer.email}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Phone:</span>
                                            <span className="ml-2 font-medium text-[#171C3C]">{order.customer.phone}</span>
                                        </div>
                                    </div>
                                    {order.customer.address && (
                                        <div className="mt-2 text-sm">
                                            <span className="text-gray-600">Address:</span>
                                            <span className="ml-2 font-medium text-[#171C3C]">
                                                {order.customer.address}, {order.customer.city}, {order.customer.state} {order.customer.pincode}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Items */}
                                <div className="px-6 py-4">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Your Products in This Order</h4>
                                    <div className="space-y-3">
                                        {order.items.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                                            >
                                                <div className="flex items-center gap-4 flex-1">
                                                    {item.thumbnail && (
                                                        <img
                                                            src={item.thumbnail}
                                                            alt={item.productname}
                                                            className="w-16 h-16 object-cover rounded-lg"
                                                        />
                                                    )}
                                                    <div className="flex-1">
                                                        <h5 className="font-semibold text-[#171C3C]">{item.productname}</h5>
                                                        <p className="text-sm text-gray-600">
                                                            Quantity: {item.quantity} × ₹{item.price} = ₹{item.price * item.quantity}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    {getStatusBadge(item.confirmationStatus)}
                                                    {item.confirmationStatus === 'pending' && (
                                                        <button
                                                            onClick={() => confirmOrder(order.orderId, item.productId.toString())}
                                                            disabled={confirmingItems[`${order.orderId}-${item.productId}`]}
                                                            className="px-4 py-2 bg-[#171C3C] text-white rounded-lg hover:bg-[#2a3154] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
                                                        >
                                                            {confirmingItems[`${order.orderId}-${item.productId}`]
                                                                ? 'Confirming...'
                                                                : 'Confirm Order'}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
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
