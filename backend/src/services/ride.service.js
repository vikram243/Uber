import rideModel from '../models/ride.model.js';
import crypto from 'crypto';

// Helper function to generate a random OTP
// It generates a random integer between 100000 and 999999
const getOtp = () => {
    return crypto.randomInt(100000, 999999);
}

// Create a new ride
// It validates the input, checks if the ride already exists, calculates fare, and creates a new ride with the provided details
export const createRide = async ({ pickup, destination, userId, vehicleType, fare, paymentID, orderId, signature, distanceKm, durationMin }) => {
    try {
        if (!pickup || !destination || !userId || !vehicleType || fare === undefined || fare === null) {
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
            distance: typeof distanceKm === 'number' ? distanceKm : undefined,
            duration: typeof durationMin === 'number' ? durationMin : undefined,
        });

        await newRide.save();
        return newRide;
    } catch (error) {
        console.error('Error creating rideService:', error);
        throw error;
    }
}

export default {createRide}