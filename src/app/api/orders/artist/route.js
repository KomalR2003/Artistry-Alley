import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import Order from '../../../models/OrderModel';

export async function POST(req) {
    try {
        const { artistId } = await req.json();

        if (!artistId) {
            return NextResponse.json(
                { error: 'Artist ID is required' },
                { status: 400 }
            );
        }

        // Connect to database
        await dbConnect();

        // Find all orders that contain products from this artist
        const orders = await Order.find({
            'items.artistId': artistId
        }).sort({ createdAt: -1 });

        // Filter items to only show this artist's products
        const artistOrders = orders.map(order => {
            const artistItems = order.items.filter(item =>
                item.artistId && item.artistId.toString() === artistId
            );

            return {
                _id: order._id,
                orderId: order.orderId,
                paymentId: order.paymentId,
                customer: order.customer,
                items: artistItems,
                itemTotal: artistItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                totalAmount: order.totalAmount,
                status: order.status,
                paymentStatus: order.paymentStatus,
                allItemsConfirmed: artistItems.every(item => item.confirmationStatus === 'confirmed'),
                createdAt: order.createdAt,
                updatedAt: order.updatedAt
            };
        });

        return NextResponse.json({
            success: true,
            orders: artistOrders
        }, { status: 200 });

    } catch (error) {
        console.error('Error fetching artist orders:', error);
        return NextResponse.json(
            {
                error: 'Failed to fetch orders',
                message: error.message
            },
            { status: 500 }
        );
    }
}
