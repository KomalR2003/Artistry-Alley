import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '../../../lib/db';
import Order from '../../../models/OrderModel';
import ProductModel from '../../../models/ProductModel';
import { sendOrderConfirmationEmail, sendArtistOrderAlertEmail } from '../../../lib/emailService';

export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.json();

        const {
            isMock,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            customerDetails,
            cartItems,
            totalAmount
        } = body;

        // 1. Verify Signature (Skip if Mock)
        if (!isMock) {
            const sign = razorpay_order_id + "|" + razorpay_payment_id;
            const expectedSign = crypto
                .createHmac("sha256", process.env.RAZORPAY_SECRET || process.env.RAZORPAY_KEY_SECRET)
                .update(sign.toString())
                .digest("hex");

            if (razorpay_signature !== expectedSign) {
                return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
            }
        }

        // 2. Format Items
        const formattedItems = cartItems.map(item => ({
            productId: item._id,
            productname: item.productname,
            price: item.price,
            quantity: item.quantity,
            thumbnail: item.thumbnail || (item.images && item.images[0]),
            category: item.category,
            artistName: item.artistName,
            artistId: item.artistId?._id || item.artistId,
            artistEmail: item.artistId?.email || null, // Assuming populated artistId has email, otherwise we might need to fetch it
            confirmationStatus: 'confirmed'
        }));

        // Fetch artist emails if not present
        for (const item of formattedItems) {
            if (!item.artistEmail) {
                const product = await ProductModel.findById(item.productId).populate('artistId', 'email');
                if (product && product.artistId) {
                    item.artistEmail = product.artistId.email;
                    item.artistId = product.artistId._id;
                }
            }
        }

        // 3. Create Custom Order ID
        const customOrderId = `ORD-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

        // 4. Create Order in DB
        const newOrder = new Order({
            orderId: customOrderId,
            paymentId: razorpay_payment_id,
            customer: customerDetails,
            items: formattedItems,
            totalAmount: totalAmount,
            status: 'confirmed',
            paymentStatus: 'paid',
            paymentMethod: 'razorpay',
            allItemsConfirmed: true
        });

        const savedOrder = await newOrder.save();

        // 5. Send Emails
        console.log("Sending emails for order:", savedOrder.orderId);
        // Send to Customer
        sendOrderConfirmationEmail(savedOrder)
            .then(res => console.log("Customer email result:", res))
            .catch(err => console.error("Customer email error:", err));

        // Send to Artists (Alerts)
        for (const item of savedOrder.items) {
            console.log("Sending artist email to:", item.artistEmail, "for item:", item.productname);
            sendArtistOrderAlertEmail(savedOrder, item)
                .then(res => console.log("Artist email result:", res))
                .catch(err => console.error("Artist email error:", err));
        }

        // Update product stock
        for (const item of formattedItems) {
            await ProductModel.findByIdAndUpdate(item.productId, {
                $inc: { stock: -item.quantity }
            });
        }

        console.log("Order processing complete!");
        return NextResponse.json({
            success: true,
            message: 'Payment verified and order created successfully',
            orderId: savedOrder.orderId
        });

    } catch (error) {
        console.error("Error verifying payment:", error);
        return NextResponse.json(
            { success: false, error: 'Payment verification failed' },
            { status: 500 }
        );
    }
}
