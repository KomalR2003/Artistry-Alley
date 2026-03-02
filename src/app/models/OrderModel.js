import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    paymentId: {
        type: String,
        default: null
    },
    customer: {
        userId: {
            type: String,
            required: false
        },
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        address: String,
        city: String,
        state: String,
        pincode: String
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        productname: String,
        price: Number,
        quantity: Number,
        thumbnail: String,
        category: String,
        artistName: String,
        artistId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        artistEmail: String,
        confirmationStatus: {
            type: String,
            enum: ['pending', 'confirmed', 'cancelled'],
            default: 'pending'
        },
        confirmedAt: Date
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'failed'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        default: null
    },
    allItemsConfirmed: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Create indexes for faster queries
OrderSchema.index({ orderId: 1 });
OrderSchema.index({ 'customer.email': 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ 'items.artistId': 1 });
OrderSchema.index({ 'items.confirmationStatus': 1 });

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

export default Order;
