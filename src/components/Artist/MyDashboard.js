import React, { useState, useEffect } from "react";
import {
    TrendingUp,
    Users,
    Eye,
    ShoppingBag,
    ArrowUpRight,
    ArrowDownRight,
    MoreHorizontal,
    DollarSign,
    Palette,
    Clock,
    Plus,
    FileText
} from "lucide-react";
import Image from "next/image";

const stats = [
    {
        title: "My Events",
        barColor: "bg-[#FE9E8F]",
        items: [
            { id: "upcomingEvents", label: "Upcoming", value: "0" },
            { id: "completedEvents", label: "Completed", value: "0" },
            { id: "bookedEvents", label: "Booked Events", value: "0" }
        ]
    },
    {
        title: "My Products",
        barColor: "bg-[#4ADE80]",
        items: [
            { label: "Total Products", value: "0" },
            { label: "Purchased", value: "0" }
        ]
    },
    {
        title: "My Gallery",
        barColor: "bg-[#D1CAF2]",
        items: [
            { label: "Total Images", value: "0" },
            { label: "Albums", value: "0" },
            { label: "Likes", value: "0" },
            { label: "comments", value: "0" }
        ]
    },

];
// Function to format relative time
function timeAgo(dateInput) {
    if (!dateInput) return '';
    const date = new Date(dateInput);
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    interval = seconds / 86400;
    if (interval >= 1) return Math.floor(interval) + ' days ago';
    interval = seconds / 3600;
    if (interval >= 1) return Math.floor(interval) + ' hours ago';
    interval = seconds / 60;
    if (interval >= 1) return Math.floor(interval) + ' minutes ago';
    return 'Just now';
}

export default function Dashboard() {
    const [recentGallery, setRecentGallery] = useState([]);
    const [recentProductsList, setRecentProductsList] = useState([]);
    const [recentActivityList, setRecentActivityList] = useState([]);
    const [loadingGallery, setLoadingGallery] = useState(true);
    const [dashboardStats, setDashboardStats] = useState(stats);

    useEffect(() => {
        const fetchDashboardData = async () => {
            const userId = sessionStorage.getItem('userId');
            if (userId) {
                try {
                    // --- 1. Fetch Gallery ---
                    try {
                        const galleryRes = await fetch(`/api/gallery?artistId=${userId}&status=active&limit=3&sortBy=createdAt&order=desc`);
                        const galleryData = await galleryRes.json();
                        if (galleryData.success) {
                            const colors = [
                                "bg-gradient-to-br from-[#FE9E8F] to-[#D1CAF2]",
                                "bg-gradient-to-br from-[#98C4EC] to-[#D1CAF2]",
                                "bg-gradient-to-br from-[#D1CAF2] to-[#98C4EC]"
                            ];
                            const formattedGallery = galleryData.images.slice(0, 3).map((img, index) => {
                                const date = new Date(img.createdAt);
                                const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
                                return {
                                    _id: img._id,
                                    name: img.title,
                                    date: formattedDate,
                                    status: img.status === 'active' ? 'Published' : img.status,
                                    color: colors[index % colors.length],
                                    imageUrl: img.imageUrl
                                };
                            });
                            setRecentGallery(formattedGallery);
                        }
                    } catch (e) {
                        console.error('Error fetching recent gallery:', e);
                    }

                    // --- 2. Fetch Events ---
                    let upcomingCount = 0;
                    let completedCount = 0;
                    let bookedCount = 0;
                    try {
                        const eventsRes = await fetch(`/api/events/artist?artistId=${userId}`);
                        const eventsData = await eventsRes.json();
                        if (eventsData.success) {
                            const now = new Date();
                            eventsData.events.forEach(evt => {
                                if (new Date(evt.endDate) < now) {
                                    completedCount++;
                                } else {
                                    upcomingCount++;
                                }
                            });
                        }

                        const bookedRes = await fetch(`/api/events/artist/booked?artistId=${userId}`);
                        const bookedData = await bookedRes.json();
                        if (bookedData.success) {
                            bookedCount = bookedData.registrations?.length || 0;
                        }

                        setDashboardStats(prev => {
                            const newStats = [...prev];
                            const eventStatsIndex = newStats.findIndex(s => s.title === "My Events");
                            if (eventStatsIndex !== -1) {
                                newStats[eventStatsIndex] = {
                                    ...newStats[eventStatsIndex],
                                    items: [
                                        { id: "upcomingEvents", label: "Upcoming", value: upcomingCount.toString() },
                                        { id: "completedEvents", label: "Completed", value: completedCount.toString() },
                                        { id: "bookedEvents", label: "Booked Events", value: bookedCount.toString() }
                                    ]
                                };
                            }
                            return newStats;
                        });
                    } catch (e) {
                        console.error('Error fetching events stats:', e);
                    }

                    // --- 3. Fetch Products ---
                    try {
                        const productRes = await fetch(`/api/product?artistId=${userId}`);
                        const productData = await productRes.json();
                        let totalProducts = 0;
                        let purchasedProducts = 0;
                        let recentFormattedProducts = [];

                        if (productData.success) {
                            const productList = productData.products || [];
                            totalProducts = productData.pagination ? productData.pagination.total : productList.length;
                            purchasedProducts = productList.filter(p => !p.inStock).length;

                            recentFormattedProducts = productList.slice(0, 3).map((prod, index) => ({
                                name: prod.productname,
                                price: `₹${prod.price}`,
                                stock: prod.stock ? prod.stock.toString() : "0",
                                imageUrl: (prod.images && prod.images.length > 0) ? prod.images[0] : null,
                                color: ["bg-[#D1CAF2]", "bg-[#98C4EC]", "bg-[#FE9E8F]"][index % 3]
                            }));
                        }
                        setRecentProductsList(recentFormattedProducts);

                        setDashboardStats(prev => {
                            const newStats = [...prev];
                            const productStatsIndex = newStats.findIndex(s => s.title === "My Products");
                            if (productStatsIndex !== -1) {
                                newStats[productStatsIndex] = {
                                    ...newStats[productStatsIndex],
                                    items: [
                                        { label: "Total Products", value: totalProducts.toString() },
                                        { label: "Purchased", value: purchasedProducts.toString() }
                                    ]
                                };
                            }
                            return newStats;
                        });
                    } catch (e) {
                        console.error('Error fetching products data:', e);
                    }

                    // --- 4. Fetch Activities Data ---
                    try {
                        const activitiesRes = await fetch(`/api/artist/activities?artistId=${userId}`);
                        const activitiesData = await activitiesRes.json();
                        if (activitiesData.success) {
                            setRecentActivityList(activitiesData.activities);
                        }
                    } catch (e) {
                        console.error('Error fetching activities:', e);
                    }

                    // --- 5. Fetch Gallery History ---
                    try {
                        const galleryAllRes = await fetch(`/api/gallery?artistId=${userId}&status=active`);
                        const galleryAllData = await galleryAllRes.json();
                        let totalGalleryImages = 0;
                        let galleryLikes = 0;
                        let galleryComments = 0;
                        let galleryAlbums = 0;

                        if (galleryAllData.success) {
                            const allImages = galleryAllData.images || [];
                            totalGalleryImages = allImages.length;
                            galleryLikes = allImages.reduce((sum, img) => sum + (img.likes?.length || 0), 0);
                            galleryAlbums = [...new Set(allImages.map(img => img.category))].length;
                            galleryComments = allImages.reduce((sum, img) => {
                                const allComments = img.comments || [];
                                return sum + allComments.length;
                            }, 0);
                        }

                        setDashboardStats(prev => {
                            const newStats = [...prev];
                            const galleryStatsIndex = newStats.findIndex(s => s.title === "My Gallery");
                            if (galleryStatsIndex !== -1) {
                                newStats[galleryStatsIndex] = {
                                    ...newStats[galleryStatsIndex],
                                    items: [
                                        { label: "Total Images", value: totalGalleryImages.toString() },
                                        { label: "Albums", value: galleryAlbums.toString().padStart(2, '0') },
                                        { label: "Likes", value: galleryLikes.toString() },
                                        { label: "comments", value: galleryComments.toString() }
                                    ]
                                };
                            }
                            return newStats;
                        });
                    } catch (e) {
                        console.error('Error fetching gallery stats:', e);
                    }
                } catch (error) {
                    console.error("Error fetching dashboard data:", error);
                }
            }
            setLoadingGallery(false);
        };

        fetchDashboardData();
    }, []);


    return (
        <div className="w-full h-full bg-white text-[#171C3C] p-8 overflow-y-auto custom-scrollbar">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-[#171C3C]">
                        Artist Dashboard
                    </h1>
                    <p className="text-[#171C3C]/70 mt-1">
                        Welcome back! Here what is happening with your art today.
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-8 mb-10">
                {dashboardStats.map((stat, index) => (
                    <div key={index} className="flex flex-col">
                        {/* Title - positioned above the bar/stats */}
                        <h3 className="text-xl font-semibold text-[#171C3C] mb-4 pl-1">{stat.title}</h3>

                        <div className="flex items-center gap-4 px-2">
                            {/* Vertical Half-Pill Bar (Rounded Left, Flat Right) */}
                            <div className={`w-2.5 h-16 rounded-l-full rounded-r-none ${stat.barColor} shrink-0`}></div>

                            <div className="flex gap-8">
                                {stat.items.map((item, idx) => (
                                    <div key={idx} className="flex flex-col justify-center">
                                        <span className="text-sm text-[#171C3C]/60 font-medium whitespace-nowrap mb-1">{item.label}</span>
                                        <span className="text-2xl font-semibold text-[#171C3C] tracking-tight">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart Section (Visual Mockup) */}
                <div className="lg:col-span-2 flex flex-col space-y-8">
                    {/* Gallery Overview */}
                    <div className="bg-[#D1CAF2]/10 p-6 rounded-2xl border border-[#D1CAF2]/40">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-[#171C3C]">Recent Gallery Uploads</h2>
                            <button className="text-sm text-[#171C3C] hover:text-[#98C4EC] transition-colors font-medium">View All</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {loadingGallery ? (
                                <p className="text-sm text-gray-500 col-span-3 text-center py-4">Loading...</p>
                            ) : recentGallery.length === 0 ? (
                                <p className="text-sm text-gray-500 col-span-3 text-center py-4">No gallery uploads yet.</p>
                            ) : recentGallery.slice(0, 3).map((art, idx) => (
                                <div key={idx} className="p-3 rounded-xl bg-white border border-[#D1CAF2]/40 hover:border-[#98C4EC] transition-all cursor-pointer group shadow-sm hover:shadow-md">
                                    <div
                                        className={`h-32 mb-3 rounded-lg ${art.color} relative overflow-hidden bg-cover bg-center`}
                                        style={art.imageUrl ? { backgroundImage: `url(${art.imageUrl})` } : {}}
                                    >
                                        <div className="absolute inset-0 bg-white/10 group-hover:bg-transparent transition-colors"></div>
                                    </div>
                                    <h4 className="font-semibold text-[#171C3C] mb-1 truncate">{art.name}</h4>
                                    <div className="flex justify-between items-center text-sm text-[#171C3C]/70">
                                        <span>{art.date}</span>
                                        <span className="text-[#98C4EC] text-xs px-2 py-0.5 bg-[#98C4EC]/20 rounded-full font-medium">{art.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Products */}
                    <div className="bg-[#98C4EC]/10 p-6 rounded-2xl border border-[#98C4EC]/40">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-[#171C3C]">Latest Products</h2>
                            <button className="text-sm text-[#171C3C] hover:text-[#98C4EC] transition-colors font-medium">View All</button>
                        </div>
                        <div className="space-y-4">
                            {!recentProductsList || recentProductsList.length === 0 ? (
                                <p className="text-sm text-gray-500 text-center py-4">No products added yet.</p>
                            ) : (
                                recentProductsList.slice(0, 2).map((prod, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#98C4EC]/40 shadow-sm">
                                        <div className="flex items-center gap-4">
                                            {prod.imageUrl ? (
                                                <div className="w-14 h-14 rounded-xl overflow-hidden shadow-sm shrink-0 border border-gray-100">
                                                    <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
                                                </div>
                                            ) : (
                                                <div className={`w-14 h-14 rounded-xl ${prod.color} shadow-sm shrink-0`}></div>
                                            )}

                                            <div className="flex flex-col">
                                                <h4 className="font-semibold text-[#171C3C] text-lg leading-tight mb-1">{prod.name}</h4>
                                                <p className="text-sm text-[#171C3C]/60 font-medium">Stock: {prod.stock}</p>
                                            </div>
                                        </div>
                                        <span className="font-bold text-[#171C3C] text-lg">{prod.price}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
                {/* Right Side Panel */}
                <div className="w-full">
                    {/* Recent Activity */}
                    <div className="bg-[#FE9E8F]/10 p-6 rounded-2xl border border-[#FE9E8F]/40 h-full flex flex-col">
                        <h2 className="text-xl font-semibold text-[#171C3C] mb-6">Recent Activity</h2>
                        <div className="space-y-6 pb-4">
                            {!recentActivityList || recentActivityList.length === 0 ? (
                                <p className="text-sm text-gray-500 text-center py-4">No recent activity.</p>
                            ) : (
                                recentActivityList.slice(0, 7).map((activity, index) => (
                                    <div key={index} className="flex gap-4 items-start">
                                        <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-[#D1CAF2] to-[#98C4EC] flex items-center justify-center text-sm font-bold border-2 border-white shadow-sm text-[#171C3C] overflow-hidden">
                                            {activity.avatarImage ? (
                                                <img src={activity.avatarImage} alt={activity.user} className="w-full h-full object-cover rounded-full" />
                                            ) : (
                                                <span>{activity.avatar}</span>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm text-[#171C3C]">
                                                <span className="font-bold text-[#171C3C]">{activity.user}</span>{" "}
                                                {activity.action}{" "}
                                                <span className="text-[#FE9E8F] font-medium">{activity.item}</span>
                                            </p>
                                            <p className="text-xs text-[#171C3C]/60 mt-1 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {timeAgo(activity.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* <button className="w-full mt-6 py-3 border border-gray-700 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
                            View All Activity
                        </button> */}
                    </div>
                </div>
            </div>
        </div>
    );
}
