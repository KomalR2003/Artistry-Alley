import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import Event from '../../../models/EventModel';

// GET all events for an artist
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const artistId = searchParams.get('artistId');

        if (!artistId) {
            return NextResponse.json({ error: 'Artist ID is required' }, { status: 400 });
        }

        await dbConnect();

        const events = await Event.find({ artistId }).sort({ createdAt: -1 });

        return NextResponse.json({ success: true, events }, { status: 200 });

    } catch (error) {
        console.error('Error fetching artist events:', error);
        return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
    }
}

// POST create a new event for an artist
export async function POST(req) {
    try {
        const body = await req.json();
        const {
            artistId,
            title,
            description,
            eventType,
            startDate,
            endDate,
            startTime,
            endTime,
            location,
            isFree,
            price,
            image
        } = body;

        if (!artistId || !title || !description || !startDate || !endDate || !startTime || !endTime || !location) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Validate price if paid
        if (!isFree) {
            if (!price || price <= 0) {
                return NextResponse.json({ error: 'Paid events must have a valid price' }, { status: 400 });
            }
        }

        await dbConnect();

        const newEvent = await Event.create({
            artistId,
            title,
            description,
            eventType: eventType || 'Event',
            startDate,
            endDate,
            startTime,
            endTime,
            location,
            isFree,
            price: isFree ? 0 : price,
            image: image || '',
            status: 'Upcoming'
        });

        return NextResponse.json({
            success: true,
            message: 'Event created successfully',
            event: newEvent
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating event:', error);
        return NextResponse.json({ error: error.message || 'Failed to create event' }, { status: 500 });
    }
}
