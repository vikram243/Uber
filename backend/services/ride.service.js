const rideModel = require('../models/ride.model');
const crypto = require('crypto');

const getOtp = () => {
    return crypto.randomInt(100000, 999999);
}

module.exports.createRide = async ({ pickup, destination, userId, vehicleType, fare, paymentID, orderId, signature }) => {
    try {
        if (!pickup || !destination || !userId || !vehicleType || !fare) {
            throw new Error('Pickup, destination, user, vehicle type, and fare are required');
        }

        const newRide = new rideModel({
            pickup,
            destination,
            userId,
            vehicleType,
            fare,
            paymentID,
            orderId,
            signature,
            otp: getOtp(),
        });

        await newRide.save();
        return newRide;
    } catch (error) {
        console.error('Error creating rideService:', error);
        throw error;
    }
}