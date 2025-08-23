import { asyncHandler } from '../utils/asyncHandler.js';
import express from 'express';
const router = express.Router();    
import authMiddleware from '../middleware/middleware.js';
import mapController from '../controllers/maps.controller.js';
import { query } from 'express-validator';

// Define routes for maps operations
// It retrieves coordinates for a given address, distance and time between two locations, and suggestions for a given input
router.get(
    '/coordinates',
    [ query('address').notEmpty().isString() ],
    asyncHandler(authMiddleware.authUser),
    asyncHandler(mapController.getCoordinates)
);

// Get distance and time between two locations
// It validates the input, checks if both origin and destination are provided, and returns the distance
router.get(
    '/distanceTime',
    [ query('origin').notEmpty().isString(),
      query('destination').notEmpty().isString() ],
    asyncHandler(authMiddleware.authUser),
    asyncHandler(mapController.getDistanceTime)
)

// Get suggestions for a given input
// It validates the input, checks if the input is provided, and returns suggestions based on the Google Places API Autocomplete service
router.get(
    '/suggestions',
    [ query('input').notEmpty().isString() ],
    asyncHandler(authMiddleware.authUser),
    asyncHandler(mapController.getSuggestions)
)

export default router;