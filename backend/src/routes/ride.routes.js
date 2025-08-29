import { asyncHandler } from '../utils/asyncHandler.js';
import express from 'express';
const router = express.Router();
import { body, query } from 'express-validator';
import rideController from '../controllers/ride.controller.js';
import authMiddleware from '../middleware/middleware.js';

// Define routes for ride operations
// It creates a new ride, retrieves a ride by ID, cancels a ride, and accepts a ride by captain
router.post('/create',
    authMiddleware.authUser, 
    body('pickup').notEmpty().withMessage('Pickup location is required'),
    body('destination').notEmpty().withMessage('Dropoff location is required'),
    body('vehicleType').notEmpty().isString().withMessage('Vehicle type must be a string'),
    asyncHandler(rideController.createRide)
)

// Get all rides for the authenticated user
// It retrieves all rides associated with the authenticated user
router.post('/:id/cancel', authMiddleware.authUser, asyncHandler(rideController.cancelRide))

// Confirm ride by captain
router.post('/confirm-ride', authMiddleware.authCaptain, asyncHandler(rideController.confirmRideByCaptain))

// Start ride by captain
router.post('/start-ride', 
    authMiddleware.authCaptain, 
    query('rideId').notEmpty().withMessage('Ride ID is required'),
    query('captainId').notEmpty().withMessage('Captain ID is required'),
    query('otp').notEmpty().withMessage('OTP is required'),
    asyncHandler(rideController.startRideByCaptain),
)

// Complete ride by captain
// It marks a ride as completed by the captain
router.post('/complete-ride', authMiddleware.authCaptain, asyncHandler(rideController.completeRide))

export default router;