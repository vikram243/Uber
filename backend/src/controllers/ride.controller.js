import rideService from '../services/ride.service.js';
import { validationResult } from 'express-validator';
import mapsService from '../services/maps.service.js';
import Ride from '../models/ride.model.js';
import socket from '../socket.js';

// Helper function to calculate fare based on distance, duration, and vehicle type
async function getFare(destination, pickup, vehicleType) {
  if (!destination || !pickup) {
    throw new Error('INVALID_LOCATIONS');
  }
  if (!vehicleType || !['car', 'bike', 'auto'].includes(vehicleType)) {
    throw new Error('INVALID_VEHICLE');
  }
  let distanceTime;
  try {
    distanceTime = await mapsService.getDistanceTime(pickup, destination);
  } catch (err) {
    throw new Error('FARE_UNAVAILABLE');
  }
  if (!distanceTime) {
    throw new Error('FARE_UNAVAILABLE');
  }

  // Prefer numeric values returned from maps service
  const distance = typeof distanceTime.distanceKm === 'number'
    ? distanceTime.distanceKm
    : parseFloat(String(distanceTime.distance || '').replace(/[^0-9.]/g, ''));
  const duration = typeof distanceTime.durationMin === 'number'
    ? distanceTime.durationMin
    : parseFloat(String(distanceTime.duration || '').replace(/[^0-9.]/g, ''));

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
  return {
    fare: Number(fare.toFixed(2)),
    distanceKm: Number(distance.toFixed(1)),
    durationMin: Number(duration.toFixed(1))
  };
}

// Create a new ride
const createRide = async (req, res) => {
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
    if (!['car', 'bike', 'auto'].includes(normalizedType)) {
      return res.status(400).json({ error: 'Invalid vehicle type provided' });
    }

    const fareResult = await getFare(destination, pickup, normalizedType);
    const newRide = await rideService.createRide({
      pickup,
      destination,
      userId: req.user._id,
      vehicleType: normalizedType,
      fare: fareResult.fare,
      distanceKm: fareResult.distanceKm,
      durationMin: fareResult.durationMin,
    });
    res.status(201).json(newRide);

    const pickupCoordinates = await mapsService.getCoordinates(pickup);
    const radius = 3; // Temporary 15km radius for testing
    const captainInRadius = await mapsService.getCaptainInTheRadius(
      pickupCoordinates.lat,
      pickupCoordinates.lng,
      radius,
      normalizedType,
      false // Only active captains
    );

    const data = await Ride.findById(newRide._id).populate('userId').select('-otp');
    captainInRadius.forEach((captain) => {
      if (captain.socketId) {
        socket.sendMessageToSocketId(captain.socketId, 'new-ride', data);
      }
    });

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
};

// Cancel a ride
const cancelRide = async (req, res) => {
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
};

// Confirm ride by captain
const confirmRideByCaptain = async (req, res) => {
  try {
    const { rideId, captainId } = req.body;
    if (!rideId || !captainId) {
      return res.status(400).json({ error: 'rideId and captainId are required' });
    }

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' });
    }
    if (ride.status == 'accepted' || ride.status == 'ongoing' || ride.status == 'completed' || ride.status == 'cancelled') {
      return res.status(400).json({ error: 'Only panding Ride is able for confirmation' });
    }

    // Update ride
    ride.captainId = captainId;
    ride.status = 'accepted';
    await ride.save();

    // Populate data
    const populatedRide = await Ride.findById(rideId).select('+otp')
      .populate('userId')
      .populate('captainId');

    // User ko OTP ke sath data send
    if (populatedRide.userId.socketId) {
      socket.sendMessageToSocketId(
        populatedRide.userId.socketId,
        'ride-confirmed',
        populatedRide
      );
    }

    // Captain ke response se OTP hata k data send
    const { otp, ...captainSafeRide } = populatedRide.toObject();

    // Captain ko response (without OTP)
    return res.status(200).json({ success: true, ride: captainSafeRide });

  } catch (error) {
    console.error('Error confirming ride:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Cancel ride by captain
const cancelRideByCaptain = async (req, res) => {
  try {
    const { rideId, captainId } = req.body;
    if (!rideId || !captainId) {
      return res.status(400).json({ error: 'rideId and captainId are required' });
    }

    const ride = await Ride.findById(rideId).populate('userId');
    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' });
    }
    if (String(ride.captainId) !== String(captainId)) {
      return res.status(403).json({ error: 'Not allowed to cancel this ride' });
    }
    if (ride.status == 'accepted' || ride.status == 'ongoing') {
      ride.status = 'cancelled';
      await ride.save();

      // Notify user that ride has been cancelled
      if (ride.userId.socketId) {
        socket.sendMessageToSocketId(ride.userId.socketId, 'ride-cancelled', null);
      }

      return res.status(200).json({ success: true });
    }
    else {
      return res.status(400).json({ error: 'Only accepted or ongoing rides can be cancelled' });
    }

  } catch (error) {
    console.error('Error cancelling ride:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Start ride by captain
const startRideByCaptain = async (req, res) => {
  try {
    const { rideId, captainId, otp } = req.body || req.query;
    const validOtp = Number(otp);
    if (!rideId || !captainId || !otp) {
      return res.status(400).json({ error: 'rideId, Otp and captainId are required' });
    }

    const ride = await Ride.findById(rideId).select('+otp').populate('userId').populate('captainId');
    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' });
    }
    if (String(ride.captainId._id) !== String(captainId)) {
      return res.status(403).json({ error: 'Not allowed to start this ride' });
    }

    if (ride.status == 'accepted') {
      if (ride.otp !== validOtp) {
        return res.status(400).json({ error: 'Invalid OTP' });
      }
      ride.status = 'ongoing';
      await ride.save();

      // Notify user that ride has started
      if (ride.userId.socketId) {
        socket.sendMessageToSocketId(ride.userId.socketId, 'ride-started', ride);
      }

      return res.status(200).json({ success: true });
    }
    else {
      return res.status(400).json({ error: 'Only accepted rides can be started' });
    }
  } catch (error) {
    console.error('Error starting ride:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Complete ride by captain
const completeRide = async (req, res) => {
  try {
    const { rideId, captainId } = req.body;
    if (!rideId || !captainId) {
      return res.status(400).json({ error: 'rideId and captainId are required' });
    }

    const ride = await Ride.findById(rideId).populate('userId');
    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' });
    }
    if (String(ride.captainId) !== String(captainId)) {
      return res.status(403).json({ error: 'Not allowed to complete this ride' });
    }
    if (ride.status == 'ongoing') {
      ride.status = 'completed';
      await ride.save();

      // Notify user that ride has been completed
      if (ride.userId.socketId) {
        socket.sendMessageToSocketId(ride.userId.socketId, 'ride-completed', null);
      }

      return res.status(200).json({ success: true });
    }
    else {
      return res.status(400).json({ error: 'Only ongoing rides can be completed' });
    }

  } catch (error) {
    console.error('Error completing ride:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export default { createRide, cancelRide, confirmRideByCaptain, startRideByCaptain, completeRide, cancelRideByCaptain };