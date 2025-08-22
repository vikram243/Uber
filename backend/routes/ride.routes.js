const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const rideController = require('../controllers/ride.controller');
const authMiddleware = require('../lib/middleware');

// Define routes for ride operations
// It creates a new ride, retrieves a ride by ID, cancels a ride, and accepts a ride by captain
router.post('/create',
    authMiddleware.authUser, 
    body('pickup').notEmpty().withMessage('Pickup location is required'),
    body('destination').notEmpty().withMessage('Dropoff location is required'),
    body('vehicleType').notEmpty().isString().withMessage('Vehicle type must be a string'),
    rideController.createRide
)

// Get a ride by ID
// It retrieves the ride details for the authenticated user
router.get('/:id', authMiddleware.authUser, rideController.getRide)

// Get all rides for the authenticated user
// It retrieves all rides associated with the authenticated user
router.post('/:id/cancel', authMiddleware.authUser, rideController.cancelRide)

// Accept a ride by captain
// It checks if the ride exists, verifies the captain's eligibility, and updates the ride status
router.post('/:id/accept', authMiddleware.authCaptain, rideController.acceptRide)

module.exports = router;