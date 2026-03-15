import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/db';
import ProductModel from '@/app/models/ProductModel';
import EventModel from '@/app/models/EventModel';
import GalleryModel from '@/app/models/GalleryModel';
import OrderModel from '@/app/models/OrderModel';
import EventRegistrationModel from '@/app/models/EventRegistrationModel';

export async function GET(request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const artistId = searchParams.get('artistId');

        if (!artistId) {
            return NextResponse.json({ success: false, message: 'Artist ID is required' }, { status: 400 });
        }

        const activities = [];

        // Calculate 7 days ago timestamp
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // 1. Products
        const products = await ProductModel.find({ artistId, createdAt: { $gte: sevenDaysAgo } }).sort({ createdAt: -1 }).limit(10);
        products.forEach(p => {
            activities.push({
                _id: p._id.toString(),
                type: 'product',
                user: 'You',
                action: 'added product',
                item: p.productname,
                createdAt: p.createdAt,
                avatar: 'Y'
            });
        });

        // 2. Events
        const events = await EventModel.find({ artistId, createdAt: { $gte: sevenDaysAgo } }).sort({ createdAt: -1 }).limit(10);
        const eventIds = events.map(e => e._id);
        events.forEach(e => {
            activities.push({
                _id: e._id.toString(),
                type: 'event',
                user: 'You',
                action: 'created event',
                item: e.title,
                createdAt: e.createdAt,
                avatar: 'Y'
            });
        });

        // 3. Gallery
        const gallery = await GalleryModel.find({ artistId, createdAt: { $gte: sevenDaysAgo } }).sort({ createdAt: -1 }).limit(10);
        gallery.forEach(g => {
            activities.push({
                _id: g._id.toString(),
                type: 'gallery',
                user: 'You',
                action: 'published',
                item: g.title,
                createdAt: g.createdAt,
                avatar: 'Y'
            });
        });

        // 4. Orders (Products sold by artist)
        // OrderModel usually has a 'customer.name' or 'userId' we would ideally populate, 
        // but checking schema it seems usually there's a user associated. Let's try to pull customer name.
        const orders = await OrderModel.find({ "items.artistId": artistId, createdAt: { $gte: sevenDaysAgo } }).sort({ createdAt: -1 }).limit(10);
        orders.forEach(o => {
            // Find the item(s) belonging to this artist
            const artistItems = o.items.filter(item => item.artistId && item.artistId.toString() === artistId);
            const buyerName = o.customer?.name || 'A user';
            const buyerInitial = buyerName !== 'A user' ? buyerName.charAt(0).toUpperCase() : 'U';

            artistItems.forEach(item => {
                activities.push({
                    _id: `${o._id.toString()}-${item.productId}`,
                    type: 'order',
                    user: buyerName,
                    action: 'purchased',
                    item: item.productname,
                    createdAt: o.createdAt,
                    avatar: buyerInitial
                });
            });
        });

        // 5. Event Registrations (Bookings for artist events)
        if (eventIds.length > 0) {
            const registrations = await EventRegistrationModel.find({ eventId: { $in: eventIds }, createdAt: { $gte: sevenDaysAgo } })
                .sort({ createdAt: -1 })
                .limit(10)
                .populate('eventId');

            registrations.forEach(r => {
                const registrantName = r.name || 'A user';
                const registrantInitial = registrantName !== 'A user' ? registrantName.charAt(0).toUpperCase() : 'U';

                activities.push({
                    _id: r._id.toString(),
                    type: 'registration',
                    user: registrantName,
                    action: 'booked',
                    item: r.eventId?.title || 'an event',
                    createdAt: r.createdAt,
                    avatar: registrantInitial
                });
            });
        }

        // Sort all descending by createdAt and take top 10
        activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const recentActivities = activities.slice(0, 10);

        return NextResponse.json({ success: true, activities: recentActivities });

    } catch (error) {
        console.error("Error fetching activities:", error);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}
