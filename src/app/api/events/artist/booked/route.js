import { NextResponse } from 'next/server';
// import dbConnect from '@/lib/db';
import dbConnect  from '@/app/lib/db';
// import EventRegistration from '@/models/EventRegistrationModel';
// import EventModel from '@/models/EventModel';
import EventModel from '@/app/models/EventModel';
import EventRegistration from '@/app/models/EventRegistrationModel';

export async function GET(req) {
    try {
        await dbConnect();

        const url = new URL(req.url);
        const artistId = url.searchParams.get('artistId');

        if (!artistId) {
            return NextResponse.json({ error: 'Artist ID is required' }, { status: 400 });
        }

        // First find all events assigned to this artist
        const artistEvents = await EventModel.find({ artistId: artistId });
        const artistEventIds = artistEvents.map(event => event._id);

        if (artistEventIds.length === 0) {
            return NextResponse.json({ success: true, registrations: [] });
        }

        // Now find all registrations for these events
        const registrations = await EventRegistration.find({
            eventId: { $in: artistEventIds }
        })
            .populate('eventId', 'title startDate startTime location')
            .sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            registrations
        });

    } catch (error) {
        console.error("Error fetching booked events for artist:", error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch booked events' },
            { status: 500 }
        );
    }
}
