const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const mapsService = require('../services/maps.service');
const Ride = require('../models/ride.model');

// Helper function to calculate fare based on distance, duration, and vehicle type
// It checks if the locations and vehicle type are valid, calculates fare based on distance and duration
async function getFare(destination, pickup, vehicleType) {

    if (!destination || !pickup) {
        throw new Error('INVALID_LOCATIONS');
    }

    if (!vehicleType || !['car', 'bike', 'auto'].includes(vehicleType)) {
        throw new Error('INVALID_VEHICLE');
    }

    let distanceTime;
    try {
        distanceTime = await mapsService.getDistanceTime(pickup, destination)
    } catch (err) {
        throw new Error('FARE_UNAVAILABLE');
    }

    if (!distanceTime || !distanceTime.distance || !distanceTime.duration) {
        throw new Error('FARE_UNAVAILABLE');
    }

    const duration = parseFloat(String(distanceTime.duration).replace(/[^0-9.]/g, ''));
    const distance = parseFloat(String(distanceTime.distance).replace(/[^0-9.]/g, ''));

    if (!isFinite(distance) || !isFinite(duration)) {
        throw new Error('FARE_UNAVAILABLE');
    }

    // Guardrail for absurdly long routes (in km)
    if (distance > 5000) {
        throw new Error('ROUTE_TOO_LONG');
    }

    let fare = 0;
    switch (vehicleType) {
        case 'car':
            fare = distance * 13 + duration * 0.6; 
            break;
        case 'bike':
            fare = distance * 7 + duration * 0.5; 
            break;
        case 'auto':
            fare = distance * 10 + duration * 0.3; 
            break;
        default:
            throw new Error('INVALID_VEHICLE');
    }

    return Number(fare.toFixed(2));
}

// Create a new ride
// It validates the input, checks if the ride already exists, calculates fare, and creates a
module.exports.createRide = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { pickup, destination, vehicleType } = req.body;
        if (!pickup || !destination || !vehicleType) {
            return res.status(400).json({ error: 'Pickup, destination, and vehicle type are required' });
        }
        const normalizedType = vehicleType.toLowerCase();
        if (!['car','bike','auto'].includes(normalizedType)) {
            return res.status(400).json({ error: 'Invalid vehicle type provided' });
        }

        const fare = await getFare(destination, pickup, normalizedType);

        const newRide = await rideService.createRide({
            pickup,
            destination,
            userId: req.user._id,
            vehicleType: normalizedType,
            fare,
        });
        res.status(201).json(newRide);

    } catch (error) {
        console.error('Error creating ride:', error);
        if (error?.message === 'ROUTE_TOO_LONG') {
            return res.status(400).json({ error: 'Selected route is too long. Please choose nearer locations.' });
        }
        if (error?.message === 'FARE_UNAVAILABLE') {
            return res.status(400).json({ error: 'Unable to calculate fare for the selected route.' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Get ride details by ID
// It checks if the ride exists, populates captain details, and returns the ride information
module.exports.getRide = async (req, res) => {
    try {
        const { id } = req.params;
        const ride = await Ride.findById(id)
            .populate({
                path: 'captainId',
                select: 'fullname vehicle status',
            });
        if (!ride) return res.status(404).json({ error: 'Ride not found' });

        const response = { ...ride.toObject() };
        if (ride.captainId) {
            response.captain = ride.captainId;
        }
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching ride:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// Get all rides for the authenticated user
// It checks if the user is authenticated and returns all rides associated with the user
module.exports.cancelRide = async (req, res) => {
    try {
        const { id } = req.params;
        const ride = await Ride.findById(id);
        if (!ride) return res.status(404).json({ error: 'Ride not found' });
        if (String(ride.userId) !== String(req.user._id)) {
            return res.status(403).json({ error: 'Not allowed to cancel this ride' });
        }
        if (ride.status !== 'pending') {
            return res.status(400).json({ error: 'Only pending rides can be cancelled' });
        }
        ride.status = 'cancelled';
        await ride.save();
        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error cancelling ride:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// Accept a ride by captain
// It checks if the ride exists, if it's pending, and assigns the captain to the ride
module.exports.acceptRide = async (req, res) => {
    try {
        const { id } = req.params;
        const ride = await Ride.findById(id);
        if (!ride) return res.status(404).json({ error: 'Ride not found' });
        if (ride.status !== 'pending') {
            return res.status(400).json({ error: 'Ride is not pending' });
        }
        ride.captainId = req.captain._id;
        ride.status = 'accepted';
        await ride.save();
        const populated = await Ride.findById(id).populate({ path: 'captainId', select: 'fullname vehicle status' });
        return res.status(200).json({
            ride: populated,
            captain: populated.captainId,
        });
    } catch (error) {
        console.error('Error accepting ride:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}