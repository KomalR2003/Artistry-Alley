import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req) {
    try {
        const body = await req.json();
        const { amount, currency = "INR", receipt } = body;

        if (!amount) {
            return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
        }

        const key_id = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
        const key_secret = process.env.RAZORPAY_SECRET || process.env.RAZORPAY_KEY_SECRET;

        // Fallback to mock order if keys are invalid or placeholders
        if (!key_id || !key_secret || key_id.includes('placeholder')) {
            return NextResponse.json({
                success: true,
                order: { id: `mock_order_${Date.now()}`, amount: Math.round(amount * 100), currency },
                isMock: true
            });
        }

        const razorpay = new Razorpay({
            key_id,
            key_secret,
        });

        const options = {
            amount: Math.round(amount * 100), // amount in the smallest currency unit (paise for INR)
            currency,
            receipt: receipt || `rcpt_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json({
            success: true,
            order,
            isMock: false
        });
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        
        let errorMessage = 'Failed to create Razorpay order. Please check your API keys.';
        if (error?.error?.description) {
            errorMessage = error.error.description;
        } else if (error?.description) {
            errorMessage = error.description;
        } else if (error?.message) {
            errorMessage = error.message;
        }

        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}
