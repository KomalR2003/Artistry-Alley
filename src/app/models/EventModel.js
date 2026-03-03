import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    artistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please provide an event title'],
        trim: true,
        maxLength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please provide an event description'],
        maxLength: [2000, 'Description cannot exceed 2000 characters']
    },
    eventType: {
        type: String,
        enum: ['Event', 'Exhibition'],
        default: 'Event',
        required: true
    },
    startDate: {
        type: Date,
        required: [true, 'Please provide event start date']
    },
    endDate: {
        type: Date,
        required: [true, 'Please provide event end date']
    },
    startTime: {
        type: String,
        required: [true, 'Please provide event start time']
    },
    endTime: {
        type: String,
        required: [true, 'Please provide event end time']
    },
    location: {
        type: String,
        required: [true, 'Please provide event location']
    },
    isFree: {
        type: Boolean,
        default: true
    },
    price: {
        type: Number,
        default: 0
    },
    image: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'],
        default: 'Upcoming'
    }
}, {
    timestamps: true
});

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

export default Event;
