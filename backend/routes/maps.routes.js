const express = require('express');
const router = express.Router();    
const authMiddleware = require('../lib/middleware');
const mapController = require('../controllers/maps.controller.js');
const { query } = require('express-validator');

// Define routes for maps operations
// It retrieves coordinates for a given address, distance and time between two locations, and suggestions for a given input

router.get(
    '/coordinates',
    [ query('address').notEmpty().isString() ],
    authMiddleware.authUser,
    mapController.getCoordinates
);

// Get distance and time between two locations
// It validates the input, checks if both origin and destination are provided, and returns the distance
router.get(
    '/distanceTime',
    [ query('origin').notEmpty().isString(),
      query('destination').notEmpty().isString() ],
    authMiddleware.authUser,
    mapController.getDistanceTime
)

// Get suggestions for a given input
// It validates the input, checks if the input is provided, and returns suggestions based on the Google Places API Autocomplete service
router.get(
    '/suggestions',
    [ query('input').notEmpty().isString() ],
    authMiddleware.authUser,
    mapController.getSuggestions
)

module.exports = router;