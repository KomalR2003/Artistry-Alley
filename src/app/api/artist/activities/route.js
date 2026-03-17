import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/db';
import OrderModel from '@/app/models/OrderModel';
import EventRegistrationModel from '@/app/models/EventRegistrationModel';
import GalleryModel from '@/app/models/GalleryModel';
import UserModel from '@/app/models/UserModel';

export async function GET(request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const artistId = searchParams.get('artistId');

        if (!artistId) {
            return NextResponse.json({ success: false, message: 'Artist ID is required' }, { status: 400 });
        }

        const activities = [];

        // 1. Orders (Purchases of Artist's Products)
        const orders = await OrderModel.find({ "items.artistId": artistId }).sort({ createdAt: -1 }).limit(20);
        orders.forEach(o => {
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

        // 2. Event Registrations (Bookings for Artist's Events)
        // We need the artist's event IDs first
        const mongoose = require('mongoose');
        const EventModel = mongoose.models.Event || mongoose.model("Event");
        const artistEvents = await EventModel.find({ artistId }).select('_id title');
        const eventIds = artistEvents.map(e => e._id);
        const eventMap = {};
        artistEvents.forEach(e => eventMap[e._id.toString()] = e.title);

        if (eventIds.length > 0) {
            const registrations = await EventRegistrationModel.find({ eventId: { $in: eventIds } })
                .sort({ createdAt: -1 })
                .limit(20);

            registrations.forEach(r => {
                const registrantName = r.name || 'A user';
                const registrantInitial = registrantName !== 'A user' ? registrantName.charAt(0).toUpperCase() : 'U';

                activities.push({
                    _id: r._id.toString(),
                    type: 'registration',
                    user: registrantName,
                    action: 'booked',
                    item: eventMap[r.eventId.toString()] || 'an event',
                    createdAt: r.createdAt,
                    avatar: registrantInitial
                });
            });
        }

        // 3. Gallery Likes and Comments
        const galleries = await GalleryModel.find({ artistId });
        galleries.forEach(g => {
            // Push Likes
            if (g.likes && g.likes.length > 0) {
                g.likes.forEach(like => {
                    const likerName = like.userName || 'A user';
                    const likerInitial = likerName !== 'A user' ? likerName.charAt(0).toUpperCase() : 'U';

                    activities.push({
                        _id: `like-${g._id.toString()}-${(like && like.user ? like.user.toString() : (like ? like.toString() : Math.random()))}`,
                        type: 'like',
                        user: likerName,
                        action: 'liked',
                        item: g.title,
                        createdAt: like.createdAt || g.createdAt, // fallback to gallery creation if ancient
                        avatar: likerInitial
                    });
                });
            }

            // Push Comments
            if (g.comments && g.comments.length > 0) {
                g.comments.forEach(comment => {
                    if (comment.status === 'approved') {
                        const commenterName = comment.userName || 'A user';
                        const commenterInitial = commenterName !== 'A user' ? commenterName.charAt(0).toUpperCase() : 'U';

                        activities.push({
                            _id: `comment-${comment._id?.toString() || Math.random()}`,
                            type: 'comment',
                            user: commenterName,
                            action: 'commented on',
                            item: g.title,
                            createdAt: comment.createdAt || g.createdAt,
                            avatar: commenterInitial
                        });
                    }
                });
            }
        });

        // Sort everything descending by createdAt
        activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Attempt to fetch real Profile Pictures for the involved users
        const uniqueUsernames = [...new Set(activities.map(a => a.user))].filter(n => n !== 'A user');
        const userDocs = await UserModel.find({ username: { $in: uniqueUsernames } }).select('username profilePicture');

        const userImageMap = {};
        userDocs.forEach(u => {
            if (u.profilePicture) userImageMap[u.username] = u.profilePicture;
        });

        // Attach the real image URL if it exists
        activities.forEach(activity => {
            if (userImageMap[activity.user]) {
                activity.avatarImage = userImageMap[activity.user];
            }
        });

        // Take top 10 recent activities. If there are none from the past 2-3 days, 
        // this inherently grabs the most recent older ones to fill the vertical space.
        const recentActivities = activities.slice(0, 10);

        return NextResponse.json({ success: true, activities: recentActivities });

    } catch (error) {
        console.error("Error fetching activities:", error);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}
