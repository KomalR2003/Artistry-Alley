import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/db';
import Event from '@/app/models/EventModel';
import User from '@/app/models/userModel';

// GET all public events (with populated artist name)
export async function GET() {
    try {
        await dbConnect();

        // Find all events and populate the artistId with the user's name
        const events = await Event.find()
            .populate({
                path: 'artistId',
                select: 'username' // Only fetch the username field
            })
            .sort({ startDate: 1 }); // Sort by upcoming dates first

        return NextResponse.json({ success: true, events }, { status: 200 });
    } catch (error) {
        console.error('Error fetching public events:', error);
        return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
    }
}
