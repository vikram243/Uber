const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const rideController = require('../controllers/ride.controller');
const authMiddleware = require('../lib/middleware');

router.post('/create',
    authMiddleware.authUser, 
    body('pickup').notEmpty().withMessage('Pickup location is required'),
    body('destination').notEmpty().withMessage('Dropoff location is required'),
    body('vehicleType').notEmpty().isString().withMessage('Vehicle type must be a string'),
    rideController.createRide
)

router.get('/:id', authMiddleware.authUser, rideController.getRide)

router.post('/:id/cancel', authMiddleware.authUser, rideController.cancelRide)

router.post('/:id/accept', authMiddleware.authCaptain, rideController.acceptRide)

module.exports = router;