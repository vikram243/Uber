const mapsService = require('../services/maps.service');
const { validationResult } = require('express-validator');

module.exports.getCoordinates = async (req, res) => {
    // Validate request parameters
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Extract address from query parameters
    try {
        const { address } = req.query;
        if (!address) {
            return res.status(400).json({ message: 'Address is required' });
        }

        const coordinates = await mapsService.getCoordinates(address);
        if (!coordinates) {
            return res.status(404).json({ message: 'Coordinates not found for the given address' });
        }

        return res.status(200).json(coordinates);
    } catch (error) {
        console.error('Error fetching coordinates:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

module.exports.getDistanceTime = async (req, res) => {
    // Validate request parameters
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Extract origin and destination from query parameters
    try {
        const { origin, destination } = req.query;
        if (!origin || !destination) {
            return res.status(400).json({ message: 'Origin and destination are required' });
        }

        const distanceTime = await mapsService.getDistanceTime(origin, destination);
        if (!distanceTime) {
            return res.status(404).json({ message: 'No route found for the given locations' });
        }

        return res.status(200).json(distanceTime);
    } catch (error) {
        console.error('Error fetching distance and time:', error);
        const msg = error?.message === 'ZERO_RESULTS' || error?.message === 'NOT_FOUND'
            ? 'No route found for the given locations'
            : (error?.message || 'Failed to get distance and time');
        return res.status(400).json({ message: msg });
    }
}

module.exports.getSuggestions = async (req, res) => {
    // Validate request parameters
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Extract input from query parameters
    try {
        const { input } = req.query;
        if (!input) {
            return res.status(400).json({ message: 'Input is required' });
        }

        const suggestions = await mapsService.getSuggestions(input);
        if (!suggestions || suggestions.length === 0) {
            return res.status(404).json({ message: 'No suggestions found for the given input' });
        }

        return res.status(200).json(suggestions);
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}