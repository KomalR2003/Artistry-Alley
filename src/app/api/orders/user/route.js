import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import Order from '../../../models/OrderModel';

export async function POST(req) {
    try {
        const { userId, email } = await req.json();

        if (!userId && !email) {
            return NextResponse.json(
                { error: 'User ID or Email is required' },
                { status: 400 }
            );
        }

        // Connect to database
        await dbConnect();

        // Build query to find orders by userId OR email
        const query = {};
        if (userId && email) {
            // If both provided, search by either userId OR email
            query.$or = [
                { 'customer.userId': userId },
                { 'customer.email': email }
            ];
        } else if (userId) {
            query['customer.userId'] = userId;
        } else if (email) {
            query['customer.email'] = email;
        }

        // Find all orders for this user
        const orders = await Order.find(query).sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            orders: orders
        }, { status: 200 });

    } catch (error) {
        console.error('Error fetching user orders:', error);
        return NextResponse.json(
            {
                error: 'Failed to fetch orders',
                message: error.message
            },
            { status: 500 }
        );
    }
}
