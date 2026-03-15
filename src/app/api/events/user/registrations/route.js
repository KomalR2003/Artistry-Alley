import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/db';
// import dbConnect from '../../../../lib/db';
// import EventRegistration from '../../../../../models/EventRegistrationModel';
import EventRegistration from '@/app/models/EventRegistrationModel';
// import EventModel from '../../../../../models/EventModel';
import EventModel from '@/app/models/EventModel';


export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        const email = searchParams.get('email');

        if (!userId && !email) {
            return NextResponse.json(
                { success: false, error: 'User ID or Email is required' },
                { status: 400 }
            );
        }

        const query = {};
        if (userId && email) {
            query.$or = [{ userId: userId }, { email: email }];
        } else if (userId) {
            query.userId = userId;
        } else if (email) {
            query.email = email;
        }

        const registrations = await EventRegistration.find(query)
            .populate({
                path: 'eventId',
                model: EventModel,
                select: 'title image startDate endDate startTime endTime location eventType type'
            })
            .sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            registrations
        });

    } catch (error) {
        console.error('Error fetching user event registrations:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch event registrations' },
            { status: 500 }
        );
    }
}
