import captainModel from '../models/captain.model.js';
import captainService from '../services/captain.service.js';
import { validationResult } from 'express-validator';
import blackListTokenModel from '../models/blackListToken.model.js';

// register a new captain
// It validates the input, checks if the captain already exists, hashes the password, and creates a new captain with the provided details
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
            status: 'active' // Keep this as is, since registration implies active status
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
        console.error('registerCaptain error:', error);
        return res.status(500).json({ message: 'Error registering captain' });
    }
}

// login a captain
// It validates the input, checks if the captain exists, compares the password, generates a token, and sets status to active
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

        // Update captain status to active
        await captainModel.updateOne(
            { _id: captain._id },
            { $set: { status: 'active' } }
        );

        const token = captain.generateAuthToken();
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000,
        });

        // Fetch the updated captain document to return
        const updatedCaptain = await captainModel.findById(captain._id);
        return res.status(200).json({ message: 'Captain logged in successfully', captain: updatedCaptain, token });
    } catch (error) {
        console.error('loginCaptain error:', error);
        return res.status(500).json({ message: 'Error logging in captain' });
    }
}

// logout a captain
// It checks if the token is present, blacklists it, clears the cookie, and sets status to inactive
const logoutCaptain = async (req, res) => {
    try {
        const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1];
        const captainId = req.captain?._id; // Assuming req.captain is set by authentication middleware

        if (captainId) {
            // Update captain status to inactive
            await captainModel.updateOne(
                { _id: captainId },
                { $set: { status: 'inactive' } }
            );
        }

        if (!token) {
            res.clearCookie('token');
            return res.status(200).json({ message: 'Captain logged out' });
        }

        const isBlackListed = await blackListTokenModel.findOne({ token });
        if (!isBlackListed) {
            await blackListTokenModel.create({ token });
        }
        res.clearCookie('token');
        return res.status(200).json({ message: 'Captain logged out successfully' });
    } catch (error) {
        console.error('logoutCaptain error:', error);
        return res.status(500).json({ message: 'Error logging out captain' });
    }
}

// get captain profile
// It checks if the captain is authenticated and returns the captain's profile
const getCaptainProfile = async (req, res) => {
    try {
        const captain = req.captain;
        if (!captain) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        return res.status(200).json({ message: 'Captain profile retrieved successfully', captain });
    } catch (error) {
        console.error('getCaptainProfile error:', error);
        return res.status(500).json({ message: 'Error retrieving captain profile' });
    }
}

export default {
    registerCaptain,
    loginCaptain,
    logoutCaptain,
    getCaptainProfile
}