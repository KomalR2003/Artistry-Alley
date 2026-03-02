import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '../../../lib/db';
import Order from '../../../models/OrderModel';
import Product from '../../../models/ProductModel';
import { sendOrderConfirmationEmail, sendArtistOrderAlertEmail } from '../../../lib/emailService';

export async function POST(req) {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            customerDetails,
            cartItems,
            totalAmount
        } = await req.json();

        // Validate required fields
        if (!razorpay_order_id || !customerDetails || !cartItems) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Check if using placeholder/demo keys
        const isPlaceholder = process.env.RAZORPAY_KEY_ID?.includes('placeholder');

        // Verify payment signature (skip in demo mode)
        if (!isPlaceholder) {
            // LIVE MODE - Verify signature
            if (!razorpay_payment_id || !razorpay_signature) {
                return NextResponse.json(
                    { error: 'Missing payment details' },
                    { status: 400 }
                );
            }

            const body = razorpay_order_id + "|" + razorpay_payment_id;
            const expectedSignature = crypto
                .createHmac('sha256', process.env.RAZORPAY_SECRET)
                .update(body.toString())
                .digest('hex');

            const isAuthentic = expectedSignature === razorpay_signature;

            if (!isAuthentic) {
                return NextResponse.json(
                    { error: 'Invalid payment signature' },
                    { status: 400 }
                );
            }
        } else {
            // DEMO MODE - Skip signature verification
            console.log('🎓 DEMO MODE: Skipping signature verification');
        }

        // Connect to database
        await dbConnect();

        // Fetch product details with artist information
        const enrichedItems = await Promise.all(
            cartItems.map(async (item) => {
                try {
                    // Find the product in database
                    const product = await Product.findById(item._id).populate('artistId', 'username email');

                    if (!product) {
                        console.warn(`Product not found: ${item._id}`);
                        return {
                            productId: item._id,
                            productname: item.productname,
                            price: item.price,
                            quantity: item.quantity,
                            thumbnail: item.thumbnail || item.images?.[0] || '',
                            category: item.category || '',
                            artistName: item.artistName || 'Unknown Artist',
                            artistId: null,
                            artistEmail: null
                        };
                    }

                    return {
                        productId: product._id,
                        productname: product.productname,
                        price: product.price,
                        quantity: item.quantity,
                        thumbnail: product.thumbnail || product.images?.[0] || '',
                        category: product.category || '',
                        artistName: product.artistId?.username || product.artistName || 'Unknown Artist',
                        artistId: product.artistId?._id || null,
                        artistEmail: product.artistId?.email || null,
                        confirmationStatus: 'pending'
                    };
                } catch (error) {
                    console.error(`Error fetching product ${item._id}:`, error);
                    return {
                        productId: item._id,
                        productname: item.productname,
                        price: item.price,
                        quantity: item.quantity,
                        thumbnail: item.thumbnail || item.images?.[0] || '',
                        category: item.category || '',
                        artistName: item.artistName || 'Unknown Artist',
                        artistId: null,
                        artistEmail: null
                    };
                }
            })
        );

        // Generate payment ID for demo mode if not provided
        const paymentId = razorpay_payment_id || `pay_demo_${Date.now()}_${Math.random().toString(36).substring(7)}`;

        // Create order in database
        const order = await Order.create({
            orderId: razorpay_order_id,
            paymentId: paymentId,
            customer: {
                userId: customerDetails.userId || null,
                name: customerDetails.name,
                email: customerDetails.email,
                phone: customerDetails.phone,
                address: customerDetails.address || '',
                city: customerDetails.city || '',
                state: customerDetails.state || '',
                pincode: customerDetails.pincode || ''
            },
            items: enrichedItems,
            totalAmount: totalAmount,
            status: 'pending',
            paymentStatus: 'paid',
            paymentMethod: isPlaceholder ? 'demo' : 'razorpay',
            allItemsConfirmed: false
        });

        console.log('✅ Order created successfully:', order.orderId);

        // Send order confirmation email to customer
        try {
            await sendOrderConfirmationEmail(order);
            console.log('📧 Order confirmation email sent to customer');
        } catch (emailError) {
            console.error('Error sending customer email:', emailError);
            // Don't fail the order if email fails
        }

        // Send order alert emails to artists
        for (const item of enrichedItems) {
            if (item.artistEmail) {
                try {
                    await sendArtistOrderAlertEmail(order, item);
                    console.log(`📧 Order alert email sent to artist: ${item.artistEmail}`);
                } catch (emailError) {
                    console.error(`Error sending artist email to ${item.artistEmail}:`, emailError);
                    // Don't fail the order if email fails
                }
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Payment verified successfully',
            orderId: order.orderId,
            orderDbId: order._id,
            demoMode: isPlaceholder
        }, { status: 200 });

    } catch (error) {
        console.error('Payment verification error:', error);
        return NextResponse.json(
            {
                error: 'Payment verification failed',
                message: error.message
            },
            { status: 500 }
        );
    }
}
