import mongoose from 'mongoose';

const EventRegistrationSchema = new mongoose.Schema({
    registrationId: {
        type: String,
        required: true,
        unique: true
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
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
    tickets: {
        type: Number,
        required: true,
        default: 1
    },
    totalAmount: {
        type: Number,
        required: true,
        default: 0
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'free', 'failed'],
        default: 'pending'
    },
    razorpayDetails: {
        orderId: String,
        paymentId: String,
        signature: String
    }
}, {
    timestamps: true
});

// Create indexes
EventRegistrationSchema.index({ eventId: 1 });
EventRegistrationSchema.index({ email: 1 });
EventRegistrationSchema.index({ registrationId: 1 });

const EventRegistration = mongoose.models.EventRegistration || mongoose.model('EventRegistration', EventRegistrationSchema);

export default EventRegistration;
