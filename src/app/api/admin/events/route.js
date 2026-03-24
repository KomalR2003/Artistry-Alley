import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/db";
import EventModel from "@/app/models/EventModel";
import EventRegistrationModel from "@/app/models/EventRegistrationModel";

export async function GET(request) {
    try {
        await dbConnect();

        // Fetch all events sorted by latest
        const events = await EventModel.find({})
            .populate('artistId', 'name username email profilePicture')
            .sort({ createdAt: -1 });

        // Fetch booking counts for each event
        const eventsWithBookings = await Promise.all(events.map(async (event) => {
            const bookingCount = await EventRegistrationModel.countDocuments({ eventId: event._id });
            return {
                ...event.toObject(),
                bookingCount
            };
        }));

        return NextResponse.json({
            success: true,
            data: eventsWithBookings
        });
    } catch (error) {
        console.error("Admin Events GET error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch events" },
            { status: 500 }
        );
    }
}

export async function DELETE(request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const eventId = searchParams.get('id');

        if (!eventId) {
            return NextResponse.json({ success: false, message: "Event ID is required" }, { status: 400 });
        }

        // Delete the event
        const deletedEvent = await EventModel.findByIdAndDelete(eventId);

        if (!deletedEvent) {
            return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
        }

        // Delete all registrations associated with this event
        await EventRegistrationModel.deleteMany({ eventId: eventId });

        return NextResponse.json({
            success: true,
            message: "Event and associated bookings deleted successfully"
        });
    } catch (error) {
        console.error("Admin Events DELETE error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to delete event" },
            { status: 500 }
        );
    }
}

export async function PUT(request) {
    try {
        await dbConnect();
        const data = await request.json();
        const { id, title, description, eventType, startDate, endDate, startTime, endTime, location, isFree, price, status } = data;

        if (!id) {
            return NextResponse.json({ success: false, message: "Event ID is required" }, { status: 400 });
        }

        const updatedEvent = await EventModel.findByIdAndUpdate(
            id,
            { title, description, eventType, startDate, endDate, startTime, endTime, location, isFree, price, status },
            { new: true, runValidators: true }
        );

        if (!updatedEvent) {
            return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: updatedEvent,
            message: "Event updated successfully"
        });
    } catch (error) {
        console.error("Admin Events PUT error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to update event" },
            { status: 500 }
        );
    }
}
