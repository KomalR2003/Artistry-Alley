import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/db";

export const dynamic = 'force-dynamic';
import UserModel from "@/app/models/userModel";
import GalleryModel from "@/app/models/GalleryModel";
import ProductModel from "@/app/models/ProductModel";
import OrderModel from "@/app/models/OrderModel";
import EventModel from "@/app/models/EventModel";
import EventRegistrationModel from "@/app/models/EventRegistrationModel";

export async function GET(request) {
    try {
        await dbConnect();

        // 1. Fetch User Stats
        const usersPromise = UserModel.find({}, 'role createdAt name username profilePicture rating experience').sort({ createdAt: -1 });

        // 2. Fetch Gallery Stats
        const galleryPromise = GalleryModel.find({ status: 'active' }, 'likes category artistId');

        // 3. Fetch Marketplace Stats
        const productsPromise = ProductModel.find({}, 'artistId productname createdAt');
        const ordersPromise = OrderModel.find({}, 'items totalAmount status createdAt paymentStatus customer orderId')
            .sort({ createdAt: -1 });

        // 4. Fetch Events Stats
        const eventsPromise = EventModel.find({}).sort({ createdAt: -1 });
        const eventRegistrationsPromise = EventRegistrationModel.countDocuments({});

        // Execute all queries in parallel for efficiency
        const [users, activeGallery, allProducts, allOrders, allEvents, totalBookedEvents] =
            await Promise.all([usersPromise, galleryPromise, productsPromise, ordersPromise, eventsPromise, eventRegistrationsPromise]);

        // Process User Stats
        let totalUsersCount = users.length;
        let artists = [];
        let normalUsers = [];
        let adminUsersCount = 0;

        users.forEach(user => {
            if (user.role === 'artist') artists.push(user);
            else if (user.role === 'user') normalUsers.push(user);
            else adminUsersCount++;
        });

        // Category-wise registrations
        const mapUserForUI = (user, color) => ({
            id: user._id,
            name: user.username || user.name || 'Anonymous',
            role: user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User',
            date: new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            status: "Active",
            avatarColor: color,
            profilePicture: user.profilePicture || null
        });

        const recentArtists = artists.slice(0, 5).map(u => mapUserForUI(u, "bg-purple-600"));
        const recentUsers = normalUsers.slice(0, 5).map(u => mapUserForUI(u, "bg-blue-600"));

        // Process Gallery Stats
        const totalArts = activeGallery.length;
        const totalLikes = activeGallery.reduce((sum, item) => sum + (Array.isArray(item.likes) ? item.likes.length : 0), 0);
        const uniqueAlbumsTemp = new Set();
        activeGallery.forEach(item => {
            if (item.category) uniqueAlbumsTemp.add(item.category);
        });
        const totalAlbums = uniqueAlbumsTemp.size || 0;

        // Process Marketplace Stats
        const totalProducts = allProducts.length;
        const totalOrdersCount = allOrders.length;
        const recentOrdersDisplay = allOrders.slice(0, 5).map(order => {
            let buyerName = 'Guest';
            if (order.customer && order.customer.name) {
                buyerName = order.customer.name;
            }

            const orderAmount = order.totalAmount ? order.totalAmount : "N/A";

            return {
                id: order.orderId || order._id.toString().slice(-6).toUpperCase(),
                product: order.items?.length > 1 ? `${order.items.length} Items` : (order.items?.[0]?.productname || "Artwork Print"),
                buyer: buyerName,
                amount: `₹${orderAmount}`,
                status: order.status || (order.paymentStatus === 'paid' ? 'Completed' : 'Pending'),
                color: order.paymentStatus === 'success' || order.status === 'Completed' ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400"
            };
        });

        // Aggregate Top Artists (based on product count and rating)
        const topArtistsData = artists.map(artist => {
            // Count products for this artist
            const artistProductsCount = allProducts.filter(p => p.artistId && p.artistId.toString() === artist._id.toString()).length;
            // Fake sales based on product count for demo, or 0
            const sales = artistProductsCount * 1.5;

            return {
                id: artist._id,
                name: artist.username || artist.name || 'Artist',
                sales: `₹${(sales * 1000).toLocaleString()}`,
                likes: activeGallery.filter(g => g.artistId && g.artistId.toString() === artist._id.toString()).reduce((sum, item) => sum + (Array.isArray(item.likes) ? item.likes.length : 0), 0),
                artworks: artistProductsCount.toString(),
                rating: artist.rating ? artist.rating.toString() : "4.8",
                avatarColor: "bg-pink-600",
                profilePicture: artist.profilePicture || null,
                score: artistProductsCount + (artist.rating || 0)
            };
        }).sort((a, b) => b.score - a.score).slice(0, 4);

        // Process Recent Events
        const recentEventsDisplay = allEvents.slice(0, 4).map(event => ({
            id: event._id,
            title: event.title,
            date: new Date(event.startDate || event.date || event.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            location: event.location || 'Online',
            price: event.price || 'Free',
            status: new Date(event.startDate || event.date || event.createdAt) < new Date() ? 'Completed' : 'Upcoming'
        }));

        // System Activities (merge recent users, events, and products)
        let rawActivities = [];

        users.slice(0, 5).forEach(u => rawActivities.push({
            user: u.username || 'Anonymous',
            action: 'registered as',
            target: u.role,
            time: u.createdAt,
            avatar: (u.username || 'A').charAt(0).toUpperCase()
        }));

        allProducts.slice(0, 5).forEach(p => rawActivities.push({
            user: 'Artist',
            action: 'uploaded artwork',
            target: p.productname || p.name || 'New Product',
            time: p.createdAt,
            avatar: 'P'
        }));

        allEvents.slice(0, 5).forEach(e => rawActivities.push({
            user: 'Admin',
            action: 'created event',
            target: e.title || 'New Event',
            time: e.createdAt,
            avatar: 'E'
        }));

        allOrders.slice(0, 5).forEach(o => {
            let userStr = o.customer && o.customer.name ? o.customer.name : 'Guest';
            rawActivities.push({
                user: userStr,
                action: 'placed an order for',
                target: `₹${o.totalAmount || 'amount'}`,
                time: o.createdAt,
                avatar: userStr.charAt(0).toUpperCase()
            });
        });

        // Sort combined activities by time descending
        rawActivities.sort((a, b) => new Date(b.time) - new Date(a.time));

        const systemActivitiesDisplay = rawActivities.slice(0, 6).map(act => {
            // calculate relative time
            const diffInHrs = Math.floor((new Date() - new Date(act.time)) / (1000 * 60 * 60));
            let timeStr = diffInHrs < 1 ? 'Just now' : diffInHrs < 24 ? `${diffInHrs} hours ago` : `${Math.floor(diffInHrs / 24)} days ago`;
            return {
                user: act.user,
                action: act.action,
                target: act.target,
                time: timeStr,
                avatar: act.avatar
            };
        });

        // Assemble Final Data Payload
        const dashboardData = {
            stats: [
                {
                    title: "User Statistics",
                    barColor: "bg-[#98C4EC]",
                    items: [
                        { label: "Total Accounts", value: totalUsersCount.toString() },
                        { label: "Artists", value: artists.length.toString() },
                        { label: "Users", value: normalUsers.length.toString() }
                    ]
                },
                {
                    title: "Gallery Overview",
                    barColor: "bg-[#4ADE80]",
                    items: [
                        { label: "Total Arts", value: totalArts.toString() },
                        { label: "Albums", value: totalAlbums.toString() },
                        { label: "Likes", value: totalLikes.toString() }
                    ]
                },
                {
                    title: "Marketplace",
                    barColor: "bg-[#C084FC]",
                    items: [
                        { label: "Products", value: totalProducts.toString() },
                        { label: "Orders", value: totalOrdersCount.toString() }
                    ]
                },
                {
                    title: "Events",
                    barColor: "bg-[#FE9E8F]",
                    items: [
                        { label: "Total Events", value: allEvents.length.toString() },
                        { label: "Booked", value: totalBookedEvents.toString() }
                    ]
                }
            ],
            recentArtists,
            recentUsers,
            recentOrders: recentOrdersDisplay,
            topArtists: topArtistsData,
            recentEvents: recentEventsDisplay,
            systemActivities: systemActivitiesDisplay
        };

        return NextResponse.json({
            success: true,
            data: dashboardData
        });

    } catch (error) {
        console.error("Admin dashboard fetch error:", error);
        require('fs').writeFileSync('admin_api_error.log', error.stack || error.toString());
        return NextResponse.json(
            { success: false, message: "Failed to fetch dashboard data", error: error.message },
            { status: 500 }
        );
    }
}
