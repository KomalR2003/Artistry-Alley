'use client';
import React, { useState } from 'react';
import { CheckCircle, Package, ShoppingCart, Home as HomeIcon, ArrowRight, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';

export default function OrderSuccess({ orderData }) {
    const router = useRouter();
    const [isDownloading, setIsDownloading] = useState(false);

    // Extract order details from props or use defaults
    const orderId = orderData?.orderId || 'ORD' + Date.now();
    const totalAmount = orderData?.totalAmount || 0;
    const items = orderData?.items || [];
    const customer = orderData?.customer || {};

    const downloadReceipt = async () => {
        const receiptElement = document.getElementById('pdf-receipt-template');
        if (!receiptElement) return;

        setIsDownloading(true);
        try {
            // Un-hide the element briefly by removing the off-screen class to ensure perfect capture
            receiptElement.style.display = 'block';
            
            const imgData = await toPng(receiptElement, {
                pixelRatio: 2,
                backgroundColor: '#ffffff'
            });
            
            // Expected element dimensions
            const canvasWidth = receiptElement.offsetWidth * 2;
            const canvasHeight = receiptElement.offsetHeight * 2;
            
            // Format to A4 page
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvasHeight * pdfWidth) / canvasWidth;
            
            // Draw image on PDF and trigger download
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Receipt_${orderId}.pdf`);
            
        } catch (error) {
            console.error("Failed to generate PDF:", error);
        } finally {
            // Re-hide after capture
            receiptElement.style.display = 'none';
            setIsDownloading(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-[#f8f9fa] via-white to-[#f0f4f8] text-[#171C3C] flex flex-col items-center justify-center p-8 relative overflow-hidden">
            
            {/* OFF-SCREEN PRINTABLE RECEIPT FOR PDF (Clean, B&W, Small Fonts) */}
            <div 
                id="pdf-receipt-template" 
                style={{ display: 'none' }}
                className="w-[800px] bg-white text-black p-12 font-sans absolute top-0 left-0 z-[-50]"
            >
                {/* Header */}
                <div className="border-b-2 border-black pb-6 mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-extrabold uppercase tracking-widest text-black">Artistry</h1>
                        <p className="text-sm mt-2 text-gray-600 font-semibold tracking-wider">PREMIUM ART GALLERY</p>
                        <p className="text-xs mt-1 text-gray-500">123 Creative Avenue, Art District</p>
                        <p className="text-xs text-gray-500">contact@artistry.com | +91 9876543210</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-2xl font-bold uppercase tracking-widest text-gray-800 mb-2">Invoice</h2>
                        <table className="text-sm font-medium mt-1 text-gray-700 ml-auto">
                            <tbody>
                                <tr><td className="pr-4 text-right text-gray-500">Date:</td><td className="text-left font-bold">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric'})}</td></tr>
                                <tr><td className="pr-4 text-right text-gray-500">Invoice No:</td><td className="text-left font-bold">#{orderId}</td></tr>
                                <tr><td className="pr-4 text-right text-gray-500">Status:</td><td className="text-left font-bold text-black uppercase">Paid</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Billed To Section (If customer info is passed) */}
                <div className="mb-10 text-sm">
                    <h3 className="font-bold text-gray-600 uppercase mb-2">Billed To:</h3>
                    <p className="font-bold text-base text-black">{customer?.name || 'Customer'}</p>
                    {customer?.email && <p className="text-gray-700">{customer.email}</p>}
                    {customer?.phone && <p className="text-gray-700">{customer.phone}</p>}
                </div>

                {/* Items Table */}
                <div className="mb-10">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-black text-sm uppercase tracking-wide text-gray-700">
                                <th className="py-3 font-bold">Description</th>
                                <th className="py-3 font-bold text-center">Qty</th>
                                <th className="py-3 font-bold text-right">Price</th>
                                <th className="py-3 font-bold text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {/* Render items if they exist, otherwise show generic payment */}
                            {items && items.length > 0 ? (
                                items.map((item, idx) => (
                                    <tr key={idx} className="border-b border-gray-200">
                                        <td className="py-4 text-gray-800 font-medium">{item.productname || 'Artwork'}<br/><span className="text-xs text-gray-500 font-normal">Artist: {item.artistName || 'Unknown'}</span></td>
                                        <td className="py-4 text-center text-gray-800">{item.quantity || 1}</td>
                                        <td className="py-4 text-right text-gray-800">₹{item.price || totalAmount}</td>
                                        <td className="py-4 text-right font-semibold text-black">₹{(item.price || totalAmount) * (item.quantity || 1)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="border-b border-gray-200">
                                    <td className="py-4 text-gray-800 font-medium">Artistry Order Checkout<br/><span className="text-xs text-gray-500 font-normal">Online Payment Processing</span></td>
                                    <td className="py-4 text-center text-gray-800">1</td>
                                    <td className="py-4 text-right text-gray-800">₹{totalAmount}</td>
                                    <td className="py-4 text-right font-semibold text-black">₹{totalAmount}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Totals Section */}
                    <div className="flex justify-end mt-4">
                        <div className="w-64">
                            <div className="flex justify-between py-2 border-b border-gray-200 text-sm">
                                <span className="text-gray-600 font-medium">Subtotal:</span>
                                <span className="text-gray-800 font-semibold">₹{totalAmount}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-200 text-sm">
                                <span className="text-gray-600 font-medium">Taxes & Fees:</span>
                                <span className="text-gray-800 font-semibold">₹0</span>
                            </div>
                            <div className="flex justify-between py-3 mt-1 border-b-2 border-black text-base">
                                <span className="font-bold text-black uppercase">Total Paid:</span>
                                <span className="font-bold text-black text-xl">₹{totalAmount}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-20 text-center text-xs text-gray-500 pt-6">
                    <p className="uppercase font-bold tracking-widest mb-2 text-black">Thank You</p>
                    <p>This is a computer generated invoice and does not require a physical signature.</p>
                </div>
            </div>
            {/* END OFF-SCREEN RECEIPT */}

            <div className="max-w-2xl w-full relative z-10">
                {/* Success Animation */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6 animate-bounce">
                        <CheckCircle className="w-16 h-16 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-semibold text-[#171C3C] mb-3">
                        Order Placed Successfully!
                    </h1>
                    <p className="text-lg text-[#171C3C]/70">
                        Thank you for your purchase. Your order has been confirmed.
                    </p>
                </div>

                {/* Dashboard Order Details Card */}
                <div id="receipt-card" className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 mb-6 relative">
                    {/* Watermark/Logo placeholder for PDF style */}
                    <div className="absolute top-4 right-4 opacity-5 text-4xl font-extrabold tracking-widest uppercase rotate-12">
                        Artistry
                    </div>
                    
                    <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
                        <Package className="w-8 h-8 text-[#98C4EC]" />
                        <div>
                            <h2 className="text-2xl font-semibold text-[#171C3C]">Official Receipt</h2>
                            <p className="text-sm text-[#171C3C]/60">Transaction Information</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Order ID */}
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                            <span className="text-[#171C3C]/70 font-medium">Order ID</span>
                            <span className="text-[#171C3C] font-bold text-lg">{orderId}</span>
                        </div>

                        {/* Total Amount */}
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                            <span className="text-[#171C3C]/70 font-medium">Total Amount</span>
                            <span className="text-[#171C3C] font-bold text-xl">₹{totalAmount}</span>
                        </div>

                        {/* Payment Status */}
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                            <span className="text-[#171C3C]/70 font-medium">Payment Status</span>
                            <span className="text-green-600 font-bold flex items-center gap-2">
                                <CheckCircle className="w-5 h-5" />
                                Paid
                            </span>
                        </div>

                        {/* Order Status */}
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                            <span className="text-[#171C3C]/70 font-medium">Order Status</span>
                            <span className="text-blue-600 font-bold">Confirmed</span>
                        </div>
                    </div>

                    {/* What's Next (Will appear on receipt for clarity) */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-[#D1CAF2]/10 to-[#98C4EC]/10 rounded-xl border border-[#98C4EC]/20">
                        <h3 className="font-semibold text-[#171C3C] mb-2 flex items-center gap-2">
                            <Package className="w-5 h-5 text-[#98C4EC]" />
                            What happens next?
                        </h3>
                        <ul className="space-y-2 text-sm text-[#171C3C]/70">
                            <li className="flex items-start gap-2">
                                <ArrowRight className="w-4 h-4 text-[#98C4EC] mt-1 shrink-0" />
                                <span>You'll receive an order confirmation email shortly</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <ArrowRight className="w-4 h-4 text-[#98C4EC] mt-1 shrink-0" />
                                <span>We'll notify you when your order is ready for delivery</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row flex-wrap gap-4 mt-8">
                    <button
                        onClick={downloadReceipt}
                        disabled={isDownloading}
                        className={`flex-1 ${isDownloading ? 'bg-gray-400' : 'bg-[#98C4EC] hover:bg-[#85b7e2]'} text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]`}
                    >
                        <Download className={`w-5 h-5 ${isDownloading ? 'animate-pulse' : ''}`} />
                        {isDownloading ? 'Generating PDF...' : 'Download Receipt'}
                    </button>

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
                <div className="mt-12 text-center pb-8">
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
