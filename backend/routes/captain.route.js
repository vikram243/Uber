const express = require('express');
const router = express.Router();
const captainController = require('../controllers/captain.controller');
const authMiddleware = require('../lib/middleware');
const { body } = require('express-validator');

router.post('/register', [
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('email').isEmail().withMessage('Email is not valid'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('vehicle.color').isLength({ min: 3 }).withMessage('Color must be at least 3 characters long'),
    body('vehicle.model').isLength({ min: 3 }).withMessage('Model must be at least 3 characters long'),
    body('vehicle.plate').isLength({ min: 6 }).withMessage('Plate must be at least 6 characters long'),
    body('vehicle.type').isLength({ min: 3 }).withMessage('Type must be at least 3 characters long'),
    body('vehicle.capacity').isNumeric().withMessage('Capacity must be greater than 1'),
], captainController.registerCaptain);

router.post('/login', [
    body('email').isEmail().withMessage('Email is not valid'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], captainController.loginCaptain);

router.get('/logout', authMiddleware.authCaptain, captainController.logoutCaptain);

router.get('/profile', authMiddleware.authCaptain, captainController.getCaptainProfile);

module.exports = router;