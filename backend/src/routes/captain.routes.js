import { asyncHandler } from '../utils/asyncHandler.js';
import express from 'express';
const router = express.Router();
import captainController from '../controllers/captain.controller.js';
import authMiddleware from '../middleware/middleware.js';
import { body } from 'express-validator';

// Define routes for captain operations
// It registers a new captain, logs in a captain, logs out a captain, and retrieves
// the captain's profile
router.post('/register', [
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('email').isEmail().withMessage('Email is not valid'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('vehicle.color').isLength({ min: 3 }).withMessage('Color must be at least 3 characters long'),
    body('vehicle.model').isLength({ min: 3 }).withMessage('Model must be at least 3 characters long'),
    body('vehicle.plate').isLength({ min: 6 }).withMessage('Plate must be at least 6 characters long'),
    body('vehicle.type').isLength({ min: 3 }).withMessage('Type must be at least 3 characters long'),
    body('vehicle.capacity').isNumeric().withMessage('Capacity must be greater than 1'),
],asyncHandler(captainController.registerCaptain));

// login a captain
// It validates the input, checks if the captain exists, compares the password, and generates a token
router.post('/login', [
    body('email').isEmail().withMessage('Email is not valid'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
],asyncHandler(captainController.loginCaptain));

// logout a captain
// It invalidates the captain's token by adding it to the blacklist and clears the cookie
router.get('/logout', authMiddleware.authCaptain, asyncHandler(captainController.logoutCaptain));

// get captain profile
// It retrieves the authenticated captain's profile, excluding sensitive information like password
router.get('/profile', authMiddleware.authCaptain, asyncHandler(captainController.getCaptainProfile));

export default router;