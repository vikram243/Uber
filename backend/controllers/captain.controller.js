const captainModel = require('../models/captain.model');
const captainService = require('../services/captain.service');
const { validationResult } = require('express-validator');
const blackListTokenModel = require('../models/blackListToken.model');

const registerCaptain = async (req, res) => {
    try {
        const { fullname, email, password, vehicle } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        if (!fullname || !email || !password || !vehicle) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const isCaptainAlready = await captainModel.findOne({ email });
        if (isCaptainAlready) {
            return res.status(401).json({ message: 'Captain already exist' });
        }

        const hashedPassword = await captainModel.hashPassword(password);
        const captain = await captainService.createCaptain({
            firstname: fullname.firstname,
            lastname: fullname.lastname || '',
            email,
            password: hashedPassword,
            color: vehicle.color,
            model: vehicle.model,
            plate: vehicle.plate,
            type: vehicle.type,
            capacity: vehicle.capacity,
        });

        const token = captain.generateAuthToken();
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000,
        });
        return res.status(201).json({ message: 'Captain registered successfully', captain, token });
    } catch (error) {
        return res.status(500).json({ message: 'Error registering captain', error });
    }
}

const loginCaptain = async (req, res) => {
    try {
        const { email, password } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const captain = await captainModel.findOne({ email }).select('+password');
        if (!captain) {
            return res.status(401).json({ message: 'Invalid password or email' });
        }

        const isMatch = await captain.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password or email' });
        }

        const token = captain.generateAuthToken();
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000,
        });
        return res.status(200).json({ message: 'Captain logged in successfully', captain, token });
    } catch (error) {
        return res.status(500).json({ message: 'Error logging in captain', error });
    }
}

const logoutCaptain = async (req, res) => {
    try {
        const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const isBlackListed = await blackListTokenModel.findOne({ token });
        if (isBlackListed) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        await blackListTokenModel.create({ token });
        res.clearCookie('token');
        return res.status(200).json({ message: 'Captain logged out successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error logging out captain', error });
    }
}

const getCaptainProfile = async (req, res) => {
    try {
        const captain = req.captain;
        if (!captain) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        return res.status(200).json({ message: 'Captain profile retrieved successfully', captain });
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving captain profile', error });
    }
}

module.exports = {
    registerCaptain,
    loginCaptain,
    logoutCaptain,
    getCaptainProfile
}