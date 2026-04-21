import React, { useState, useEffect } from 'react';
import { Activity, ShoppingBag, Calendar as CalendarIcon, Package, MapPin, Clock, Loader2, Search, ArrowRight } from 'lucide-react';

export default function Dashboard({ onNavigate, user }) {
    const [orders, setOrders] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeUser, setActiveUser] = useState(user || null);

    const initialStats = [
        {
            title: "My Collection",
            barColor: "bg-[#FE9E8F]",
            items: [
                { id: 'totalPurchases', label: "Total Purchases", value: "0" },
                { id: 'recentOrders', label: "Recent Orders", value: "0" }
            ],
            navTarget: 'My Orders'
        },
        {
            title: "My Events",
            barColor: "bg-[#98C4EC]",
            items: [
                { id: 'registeredEvents', label: "Registered", value: "0" },
                { id: 'upcomingEvents', label: "Upcoming", value: "0" }
            ],
            navTarget: 'My Events'
        },
        {
            title: "Gallery Activity",
            barColor: "bg-[#D1CAF2]",
            items: [
                { id: 'totalActivity', label: "Recent Actions", value: "0" }
            ]
        }
    ];

    const [dashboardStats, setDashboardStats] = useState(initialStats);

    useEffect(() => {
        const localUserId = sessionStorage.getItem('userId');
        const localEmail = sessionStorage.getItem('userEmail');
        const localName =
            sessionStorage.getItem('userName') ||
            sessionStorage.getItem('username') ||
            sessionStorage.getItem('name');
        const localUsername = sessionStorage.getItem('username');
        const localProfilePicture =
            sessionStorage.getItem('profilePicture') ||
            sessionStorage.getItem('userProfilePicture') ||
            sessionStorage.getItem('userAvatar') ||
            '';

        const resolvedUser =
            user ||
            (localUserId
                ? { _id: localUserId, id: localUserId, email: localEmail, name: localName, username: localUsername }
                : null);

        if (resolvedUser && localProfilePicture && !resolvedUser.profilePicture) {
            resolvedUser.profilePicture = localProfilePicture;
        }

        setActiveUser(resolvedUser);

        if (resolvedUser) {
            fetchDashboardData(resolvedUser);
            // Ensure we show the actual saved profile picture from DB (not initials)
            if (resolvedUser._id || resolvedUser.id) {
                const id = resolvedUser._id || resolvedUser.id;
                fetch(`/api/user?userId=${encodeURIComponent(id)}`)
                    .then((r) => r.json())
                    .then((data) => {
                        if (data?.success && data?.user) {
                            setActiveUser((prev) => {
                                if (!prev) return prev;
                                return {
                                    ...prev,
                                    username: data.user.username || prev.username,
                                    email: data.user.email || prev.email,
                                    profilePicture: data.user.profilePicture || prev.profilePicture
                                };
                            });
                            if (data.user.profilePicture) {
                                try {
                                    sessionStorage.setItem('profilePicture', data.user.profilePicture);
                                } catch { }
                            }
                        }
                    })
                    .catch(() => { });
            }
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchDashboardData = async (activeUser) => {
        setLoading(true);
        try {
            // Fetch Orders
            const ordersRes = await fetch('/api/orders/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: activeUser?._id || activeUser?.id, email: activeUser?.email })
            });
            const ordersData = await ordersRes.json();
            const fetchedOrders = ordersData.success ? ordersData.orders : [];

            // Fetch Event Registrations
            const eventsRes = await fetch(`/api/events/user/registrations?userId=${activeUser?._id || activeUser?.id}&email=${activeUser?.email}`);
            const eventsData = await eventsRes.json();
            const fetchedEvents = eventsData.success ? eventsData.registrations : [];

            setOrders(fetchedOrders);
            setRegistrations(fetchedEvents);

            // Compute Stats
            const recentOrdersCount = fetchedOrders.filter(o => {
                const orderDate = new Date(o.createdAt);
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                return orderDate >= thirtyDaysAgo;
            }).length;

            const upcomingEventsCount = fetchedEvents.filter(reg => {
                if (!reg.eventId?.startDate) return false;
                return new Date(reg.eventId.startDate) >= new Date();
            }).length;

            setDashboardStats(prev => {
                const newStats = [...prev];
                // Collection
                if (newStats[0]) {
                    newStats[0].items[0].value = fetchedOrders.length.toString();
                    newStats[0].items[1].value = recentOrdersCount.toString();
                }
                // Events
                if (newStats[1]) {
                    newStats[1].items[0].value = fetchedEvents.length.toString();
                    newStats[1].items[1].value = upcomingEventsCount.toString();
                }
                // Activity
                if (newStats[2]) {
                    const activityCount = fetchedOrders.slice(0, 5).length + fetchedEvents.slice(0, 5).length;
                    newStats[2].items[0].value = activityCount.toString();
                }
                return newStats;
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="w-full h-full min-h-[60vh] flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-[#98C4EC] animate-spin mb-4" />
                <p className="text-[#171C3C]/60 font-medium">Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <div
            className="w-full h-full bg-white text-[#171C3C] p-4 sm:p-8 overflow-y-auto custom-scrollbar"
            style={{ fontFamily: "'Poppins', sans-serif" }}
        >
            {/* Header Section (Admin Dashboard Style) */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-semibold text-black">
                        Welcome back,{" "}
                        <span className="text-black">
                            {(activeUser?.name || activeUser?.username || 'User').split(' ')[0]}
                        </span>
                    </h1>
                    <p className="text-[#171C3C]/70 mt-1">
                        Here is an overview of your collection and schedule.
                    </p>
                </div>

                {/* Dashboard-only profile */}
                <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                    <div
                        className="w-12 h-12 rounded-full bg-[#171C3C] bg-cover bg-center flex items-center justify-center text-sm font-extrabold text-white shrink-0"
                        style={{ backgroundImage: activeUser?.profilePicture ? `url(${activeUser.profilePicture})` : undefined }}
                        aria-label="Profile picture"
                    >
                        {!activeUser?.profilePicture && ((activeUser?.name || activeUser?.username || 'U').charAt(0).toUpperCase())}
                    </div>
                    <div className="min-w-0">
                        <div className="font-bold text-[#171C3C] truncate max-w-[220px]">
                            {activeUser?.name || activeUser?.username || 'User'}
                        </div>
                        <div className="text-sm text-[#171C3C]/60 truncate max-w-[220px]">
                            {activeUser?.username ? `@${activeUser.username}` : (activeUser?.email || '')}
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid (Admin Dashboard Style) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {dashboardStats.map((stat, index) => (
                    <div
                        key={index}
                        onClick={() => stat.navTarget && onNavigate && onNavigate(stat.navTarget)}
                        className={`flex flex-col transition-transform duration-200 ${stat.navTarget ? 'cursor-pointer hover:scale-[1.02]' : 'hover:scale-[1.02]'}`}
                    >
                        <h3 className="text-xl font-semibold text-[#171C3C] mb-4 pl-1">{stat.title}</h3>
                        <div className="flex items-center gap-4 px-2">
                            {/* Vertical Half-Pill Bar */}
                            <div className={`w-2.5 h-16 rounded-l-full rounded-r-none ${stat.barColor} shrink-0`}></div>
                            <div className="flex gap-8 w-full pr-4">
                                {stat.items.map((item, idx) => (
                                    <div key={idx} className="flex flex-col justify-center">
                                        <span className="text-sm text-[#171C3C]/60 font-medium whitespace-nowrap mb-1">{item.label}</span>
                                        <span className="text-xl font-semibold text-[#171C3C] tracking-tight">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Acquisitions - Styled like Admin Recent Orders */}
                <div className="bg-[#98C4EC]/10 rounded-2xl border border-[#98C4EC]/40 overflow-hidden shadow-sm flex flex-col h-full">
                    <div className="p-6 border-b border-[#98C4EC]/30 flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-[#171C3C]">Recent Orders</h2>
                        <button onClick={() => onNavigate && onNavigate('My Orders')} className="text-sm text-[#171C3C] hover:text-[#98C4EC] transition-colors font-medium">View All</button>
                    </div>
                    <div className="flex flex-col">
                        {orders.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 px-8">
                                <Package className="w-10 h-10 text-[#98C4EC]/50 mb-3" />
                                <p className="text-[#171C3C]/50 text-sm font-medium text-center">Your collection history is empty.</p>
                            </div>
                        ) : (
                            orders.slice(0, 4).map((order) => (
                                <div key={order._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-white/60 transition-all duration-200 cursor-pointer border-b border-[#98C4EC]/20 last:border-0 hover:pl-6 gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-[#98C4EC]/20 flex items-center justify-center overflow-hidden shrink-0 p-1">
                                            {order.items[0]?.thumbnail ? (
                                                <img src={order.items[0].thumbnail} alt="Product" className="w-full h-full object-cover rounded" />
                                            ) : (
                                                <ShoppingBag className="w-5 h-5 text-[#171C3C]/60" />
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-[#171C3C] text-sm truncate max-w-[150px] sm:max-w-[200px]">
                                                {order.items.length === 1 ? order.items[0]?.productname || 'Artwork' : `${order.items.length} Artworks`}
                                            </h4>
                                            <p className="text-xs text-[#171C3C]/60 mt-0.5 whitespace-nowrap">
                                                Order #{order._id.slice(-6).toUpperCase()}  <span className="text-[#171C3C] font-semibold tracking-tight">₹{order.totalAmount}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 self-end sm:self-auto">
                                        <span className="text-xs text-[#171C3C]/50 whitespace-nowrap hidden sm:block">
                                            {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </span>
                                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${order.orderStatus === 'Delivered' ? 'bg-[#4ADE80]/20 text-green-700' : order.orderStatus === 'Processing' ? 'bg-[#98C4EC]/30 text-blue-700' : 'bg-[#FE9E8F]/20 text-[#FE9E8F]'}`}>
                                            {order.orderStatus}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Upcoming Schedule - Styled like Admin Pending Activities/Events */}
                <div className="bg-[#D1CAF2]/10 rounded-2xl border border-[#D1CAF2]/40 overflow-hidden shadow-sm flex flex-col h-full">
                    <div className="p-6 border-b border-[#D1CAF2]/30 flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-[#171C3C]">Upcoming Schedule</h2>
                        <button onClick={() => onNavigate && onNavigate('My Events')} className="text-sm text-[#171C3C] hover:text-[#D1CAF2] transition-colors font-medium">View All</button>
                    </div>
                    <div className="flex flex-col">
                        {registrations.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 px-8">
                                <CalendarIcon className="w-10 h-10 text-[#D1CAF2]/70 mb-3" />
                                <p className="text-[#171C3C]/50 text-sm font-medium text-center">You haven't booked any events yet.</p>
                            </div>
                        ) : (
                            registrations.slice(0, 4).map((reg) => (
                                <div key={reg._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-white/60 transition-all duration-200 cursor-pointer border-b border-[#D1CAF2]/20 last:border-0 hover:pl-6 gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-[#D1CAF2]/30 flex flex-col items-center justify-center shrink-0 border border-[#D1CAF2]/40">
                                            <span className="text-[8px] font-bold text-[#171C3C]/70 leading-none uppercase mb-0.5">{reg.eventId?.startDate ? new Date(reg.eventId.startDate).toLocaleDateString(undefined, { month: 'short' }) : 'TBA'}</span>
                                            <span className="text-sm font-black text-[#171C3C] leading-none">{reg.eventId?.startDate ? new Date(reg.eventId.startDate).getDate() : '-'}</span>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-[#171C3C] text-sm truncate max-w-[150px] sm:max-w-[200px]">
                                                {reg.eventId?.title || 'Unknown Event'}
                                            </h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[9px] px-1.5 py-0.5 bg-white rounded font-bold text-[#FE9E8F] uppercase tracking-wider border border-[#FE9E8F]/20">
                                                    {reg.eventId?.eventType || 'Event'}
                                                </span>
                                                <p className="text-xs text-[#171C3C]/60 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" /> {reg.eventId?.startTime || 'TBA'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 self-end sm:self-auto">
                                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${reg.paymentStatus === 'free' ? 'bg-[#4ADE80]/20 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                                            {reg.paymentStatus === 'free' ? 'Free' : 'Paid'}
                                        </span>
                                        <span className="text-xs font-semibold text-[#171C3C] bg-white px-2 py-1 rounded border border-[#D1CAF2]/30 shadow-sm whitespace-nowrap">
                                            {reg.tickets} Tkt.
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
