import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req) {
    try {
        const { amount } = await req.json();

        // Validate amount
        if (!amount || amount <= 0) {
            return NextResponse.json(
                { error: 'Invalid amount' },
                { status: 400 }
            );
        }

        // Check if using placeholder/demo keys
        const isPlaceholder = process.env.RAZORPAY_KEY_ID?.includes('placeholder');

        if (isPlaceholder) {
            // DEMO MODE - Generate mock order for project demo
            const mockOrderId = `order_demo_${Date.now()}_${Math.random().toString(36).substring(7)}`;

            // console.log(' Running in DEMO MODE ');
            console.log('Mock Order ID:', mockOrderId);

            return NextResponse.json({
                success: true,
                orderId: mockOrderId,
                amount: amount * 100,
                currency: 'INR',
                demoMode: true
            }, { status: 200 });
        }

        // LIVE MODE - Use actual Razorpay API (when real keys are provided)
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET
        });

        const options = {
            amount: amount * 100,
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
            payment_capture: 1
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            demoMode: false
        }, { status: 200 });

    } catch (error) {
        console.error('Create order error:', error);
        return NextResponse.json(
            {
                error: 'Failed to create order',
                message: error.message
            },
            { status: 500 }
        );
    }
}
