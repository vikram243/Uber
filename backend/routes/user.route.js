const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../lib/middleware');
const { body } = require('express-validator');

// Define routes for user operations
// It registers a new user, logs in a user, logs out a user, and retrieves the user's profile
router.post('/register', [
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('email').isEmail().withMessage('Email is not valid'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
] ,userController.registerUser);

// login a user
// It validates the input, checks if the user exists, compares the password, and generates a token
router.post('/login', [
    body('email').isEmail().withMessage('Email is not valid'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], userController.loginUser);

// logout a user
// It invalidates the user's token by adding it to the blacklist and clears the cookie
router.get('/logout', authMiddleware.authUser, userController.logoutUser);

// get user profile]
// It retrieves the authenticated user's profile, excluding sensitive information like password
router.get('/profile', authMiddleware.authUser, userController.getUserProfile);

module.exports = router;