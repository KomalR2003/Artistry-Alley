import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import Event from '../../../../models/EventModel';

// PUT update an event
export async function PUT(req, { params }) {
    try {
        const { id } = await params;
        const body = await req.json();

        if (!id) {
            return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
        }

        await dbConnect();

        // If switching from Paid to Free, clear price
        if (body.isFree) {
            body.price = 0;
        } else {
            // Ensure price is a number for paid events
            if (body.price) {
                body.price = Number(body.price);
            }
        }

        const updatedEvent = await Event.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true, runValidators: true }
        );

        if (!updatedEvent) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Event updated successfully',
            event: updatedEvent
        }, { status: 200 });

    } catch (error) {
        console.error('Error updating event:', error);
        return NextResponse.json({ error: error.message || 'Failed to update event' }, { status: 500 });
    }
}

// DELETE an event
export async function DELETE(req, { params }) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
        }

        await dbConnect();

        const deletedEvent = await Event.findByIdAndDelete(id);

        if (!deletedEvent) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Event deleted successfully'
        }, { status: 200 });

    } catch (error) {
        console.error('Error deleting event:', error);
        return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
    }
}
