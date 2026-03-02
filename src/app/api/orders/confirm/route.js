import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import Order from '../../../models/OrderModel';
import { sendOrderConfirmedByArtistEmail } from '../../../lib/emailService';

export async function POST(req) {
    try {
        const { orderId, productId, artistId } = await req.json();

        if (!orderId || !productId || !artistId) {
            return NextResponse.json(
                { error: 'Order ID, Product ID, and Artist ID are required' },
                { status: 400 }
            );
        }

        // Connect to database
        await dbConnect();

        // Find the order
        const order = await Order.findOne({ orderId });

        if (!order) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            );
        }

        // Find the specific item in the order
        const itemIndex = order.items.findIndex(item =>
            item.productId.toString() === productId &&
            item.artistId && item.artistId.toString() === artistId
        );

        if (itemIndex === -1) {
            return NextResponse.json(
                { error: 'Product not found in order or you are not the artist for this product' },
                { status: 403 }
            );
        }

        const item = order.items[itemIndex];

        // Check if already confirmed
        if (item.confirmationStatus === 'confirmed') {
            return NextResponse.json(
                { error: 'Order item already confirmed' },
                { status: 400 }
            );
        }

        // Update confirmation status
        order.items[itemIndex].confirmationStatus = 'confirmed';
        order.items[itemIndex].confirmedAt = new Date();

        // Check if all items are confirmed
        const allConfirmed = order.items.every(item => item.confirmationStatus === 'confirmed');
        if (allConfirmed) {
            order.status = 'confirmed';
            order.allItemsConfirmed = true;
        }

        await order.save();

        console.log(`✅ Order item confirmed: ${order.orderId} - ${item.productname}`);

        // Send confirmation email to customer
        try {
            await sendOrderConfirmedByArtistEmail(order, item);
            console.log('📧 Order confirmed email sent to customer');
        } catch (emailError) {
            console.error('Error sending confirmation email:', emailError);
            // Don't fail the confirmation if email fails
        }

        return NextResponse.json({
            success: true,
            message: 'Order confirmed successfully',
            order: {
                orderId: order.orderId,
                status: order.status,
                allItemsConfirmed: order.allItemsConfirmed
            }
        }, { status: 200 });

    } catch (error) {
        console.error('Error confirming order:', error);
        return NextResponse.json(
            {
                error: 'Failed to confirm order',
                message: error.message
            },
            { status: 500 }
        );
    }
}
