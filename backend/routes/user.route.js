const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../lib/middleware');
const { body } = require('express-validator');

router.post('/register', [
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('email').isEmail().withMessage('Email is not valid'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
] ,userController.registerUser);

router.post('/login', [
    body('email').isEmail().withMessage('Email is not valid'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], userController.loginUser);

router.get('/logout', authMiddleware.authUser, userController.logoutUser);
router.get('/profile', authMiddleware.authUser, userController.getUserProfile);

module.exports = router;