import { asyncHandler } from '../utils/asyncHandler.js';
import express from 'express';
const router = express.Router();
import { body } from 'express-validator';
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

// Get a ride by ID
// It retrieves the ride details for the authenticated user
router.get('/:id', authMiddleware.authUser, asyncHandler(rideController.getRide))

// Get all rides for the authenticated user
// It retrieves all rides associated with the authenticated user
router.post('/:id/cancel', authMiddleware.authUser, asyncHandler(rideController.cancelRide))

// Accept a ride by captain
// It checks if the ride exists, verifies the captain's eligibility, and updates the ride status
router.post('/:id/accept', authMiddleware.authCaptain, asyncHandler(rideController.acceptRide))

export default router;