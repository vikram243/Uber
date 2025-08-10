const express = require('express');
const router = express.Router();    
const authMiddleware = require('../lib/middleware');
const mapController = require('../controllers/maps.controller.js');
const { query } = require('express-validator');

router.get(
    '/coordinates',
    [ query('address').notEmpty().isString() ],
    authMiddleware.authUser,
    mapController.getCoordinates
);

router.get(
    '/distanceTime',
    [ query('origin').notEmpty().isString(),
      query('destination').notEmpty().isString() ],
    authMiddleware.authUser,
    mapController.getDistanceTime
)

router.get(
    '/suggestions',
    [ query('input').notEmpty().isString() ],
    authMiddleware.authUser,
    mapController.getSuggestions
)

module.exports = router;