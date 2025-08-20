const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
    pickup: {
        type: String,
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    captainId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Captain',
    },
    vehicleType: {
        type: String,
        enum: ['car', 'bike', 'auto'],
        default: 'car',
    },  
    status: {
        type: String,
        enum: ['pending', 'accepted', 'completed', 'cancelled', 'ongoing'],
        default: 'pending',
    },
    fare: {
        type: Number,
        required: true,
        min: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    duration: {
        type: Number,
        min: 0,
    },
    distance: {
        type: Number,
        min: 0,
    },
    paymentID: {
        type: String,
        required: false,
    },
    orderId: {
        type: String,
        required: false,
    },
    signature: {
        type: String,
        required: false,
    },
    otp: {
        type: Number,
        select: false,
        required: true,
    },
})

const Ride = mongoose.model('Ride', rideSchema);
module.exports = Ride;