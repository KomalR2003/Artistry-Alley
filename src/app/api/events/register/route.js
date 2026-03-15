import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '../../../../app/lib/db';
import EventRegistration from '../../../../app/models/EventRegistrationModel';
import EventModel from '../../../../app/models/EventModel';
import { sendEventRegistrationEmail, sendArtistEventRegistrationAlertEmail } from '../../../../app/lib/emailService';

export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.json();

        const {
            eventId,
            userId,
            customerDetails,
            tickets = 1,
            totalAmount = 0,
            isFree = false,
            isMock = false,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = body;

        // Validation
        if (!eventId || !customerDetails?.name || !customerDetails?.email || !customerDetails?.phone) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const eventDetails = await EventModel.findById(eventId).populate('artistId', 'name email');
        if (!eventDetails) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        // 1. Verify Payment if not free
        if (!isFree && !isMock) {
            if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
                return NextResponse.json({ error: 'Payment details missing for paid event' }, { status: 400 });
            }

            const sign = razorpay_order_id + "|" + razorpay_payment_id;
            const expectedSign = crypto
                .createHmac("sha256", process.env.RAZORPAY_SECRET || process.env.RAZORPAY_KEY_SECRET)
                .update(sign.toString())
                .digest("hex");

            if (razorpay_signature !== expectedSign) {
                return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
            }
        }

        // 2. Create Custom Registration ID
        const customRegId = `REG-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

        // 3. Create Registration in DB
        const newRegistration = new EventRegistration({
            registrationId: customRegId,
            eventId: eventId,
            userId: userId || null,
            name: customerDetails.name,
            email: customerDetails.email,
            phone: customerDetails.phone,
            tickets: tickets,
            totalAmount: totalAmount,
            paymentStatus: isFree ? 'free' : 'paid',
            razorpayDetails: isFree ? {} : {
                orderId: razorpay_order_id,
                paymentId: razorpay_payment_id,
                signature: razorpay_signature
            }
        });

        const savedRegistration = await newRegistration.save();

        // Prepare event info for email
        const formattedEventInfo = {
            title: eventDetails.title,
            startDate: eventDetails.startDate,
            startTime: eventDetails.startTime,
            endTime: eventDetails.endTime,
            location: eventDetails.location || eventDetails.venue || 'Online/TBA',
            artistName: eventDetails.artistId?.name || 'Artist',
            artistEmail: eventDetails.artistId?.email
        };

        // 4. Send Emails
        // To Customer
        sendEventRegistrationEmail(savedRegistration, formattedEventInfo)
            .then(res => console.log("Event email result:", res))
            .catch(err => console.error("Event email error:", err));

        // To Artist
        if (formattedEventInfo.artistEmail) {
            sendArtistEventRegistrationAlertEmail(savedRegistration, formattedEventInfo)
                .then(res => console.log("Artist event email result:", res))
                .catch(err => console.error("Artist event email error:", err));
        }

        return NextResponse.json({
            success: true,
            message: 'Registration successful',
            registrationId: savedRegistration.registrationId
        });

    } catch (error) {
        console.error("Error creating event registration:", error);
        return NextResponse.json(
            { success: false, error: 'Registration failed' },
            { status: 500 }
        );
    }
}
