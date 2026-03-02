'use client';
import React from 'react';
import { CheckCircle, Package, ShoppingCart, Home as HomeIcon, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function OrderSuccess({ orderData }) {
    const router = useRouter();

    // Extract order details from props or use defaults
    const orderId = orderData?.orderId || 'ORD' + Date.now();
    const totalAmount = orderData?.totalAmount || 0;

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-[#f8f9fa] via-white to-[#f0f4f8] text-[#171C3C] flex items-center justify-center p-8">
            <div className="max-w-2xl w-full">
                {/* Success Animation */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6 animate-bounce">
                        <CheckCircle className="w-16 h-16 text-green-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-[#171C3C] mb-3">
                        Order Placed Successfully!
                    </h1>
                    <p className="text-lg text-[#171C3C]/70">
                        Thank you for your purchase. Your order has been confirmed.
                    </p>
                </div>

                {/* Order Details Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 mb-6">
                    <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
                        <Package className="w-8 h-8 text-[#98C4EC]" />
                        <div>
                            <h2 className="text-2xl font-bold text-[#171C3C]">Order Details</h2>
                            <p className="text-sm text-[#171C3C]/60">Your order information</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Order ID */}
                        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-[#D1CAF2]/10 to-[#98C4EC]/10 rounded-xl">
                            <span className="text-[#171C3C]/70 font-medium">Order ID</span>
                            <span className="text-[#171C3C] font-bold text-lg">{orderId}</span>
                        </div>

                        {/* Total Amount */}
                        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-[#FE9E8F]/10 to-[#FFB88C]/10 rounded-xl">
                            <span className="text-[#171C3C]/70 font-medium">Total Amount</span>
                            <span className="text-[#171C3C] font-bold text-xl">₹{totalAmount}</span>
                        </div>

                        {/* Payment Status */}
                        <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl">
                            <span className="text-[#171C3C]/70 font-medium">Payment Status</span>
                            <span className="text-green-600 font-bold flex items-center gap-2">
                                <CheckCircle className="w-5 h-5" />
                                Paid
                            </span>
                        </div>

                        {/* Order Status */}
                        <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl">
                            <span className="text-[#171C3C]/70 font-medium">Order Status</span>
                            <span className="text-blue-600 font-bold">Processing</span>
                        </div>
                    </div>

                    {/* What's Next */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-[#D1CAF2]/5 to-[#98C4EC]/5 rounded-xl border border-[#98C4EC]/20">
                        <h3 className="font-bold text-[#171C3C] mb-2 flex items-center gap-2">
                            <Package className="w-5 h-5 text-[#98C4EC]" />
                            What happens next?
                        </h3>
                        <ul className="space-y-2 text-sm text-[#171C3C]/70">
                            <li className="flex items-start gap-2">
                                <span className="text-[#98C4EC] mt-1">•</span>
                                <span>You'll receive an order confirmation email shortly</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#98C4EC] mt-1">•</span>
                                <span>We'll notify you when your order is ready for delivery</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#98C4EC] mt-1">•</span>
                                <span>Track your order status anytime from your account</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={() => router.push('/home')}
                        className="flex-1 bg-[#171C3C] text-white py-4 rounded-xl hover:bg-[#171C3C]/90 font-bold flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
                    >
                        <HomeIcon className="w-5 h-5" />
                        Back to Home
                    </button>
                    <button
                        onClick={() => router.push('/home')}
                        className="flex-1 bg-white text-[#171C3C] py-4 rounded-xl hover:bg-gray-50 font-bold flex items-center justify-center gap-2 transition-all border-2 border-[#171C3C] transform hover:scale-[1.02]"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        Continue Shopping
                    </button>
                </div>

                {/* Support Message */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-[#171C3C]/60">
                        Need help? Contact us at{' '}
                        <a href="mailto:support@artistry.com" className="text-[#98C4EC] hover:underline font-medium">
                            support@artistry.com
                        </a>
                    </p>
                </div>
            </div>

            <style jsx>{`
                @keyframes bounce {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }
                .animate-bounce {
                    animation: bounce 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
