import jwt from 'jsonwebtoken';
import blackListTokenModel from '../models/blackListToken.model.js';
import userModel from '../models/user.model.js';
import captainModel from '../models/captain.model.js';

// Extract token from cookie or authorization header
// It checks for a token in the request cookies or headers and returns it
function extractToken(req) {
    const fromCookie = req.cookies && req.cookies.token;
    if (fromCookie) return fromCookie;
    const header = req.headers && req.headers.authorization;
    if (!header) return null;
    const parts = header.split(' ');
    return parts.length === 2 ? parts[1] : null;
}

// Verify if the token is blacklisted
// It checks if the token exists in the blacklist collection and returns true or false
async function verifyNotBlacklisted(token) {
    if (!token) return false;
    const found = await blackListTokenModel.findOne({ token });
    return !!found;
}

// Verify the token and attach the user or captain to the request
// It decodes the token, finds the user or captain by ID, and attaches it to the request object
async function verifyTokenAndAttach(token, model) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const doc = await model.findById(decoded.id);
    return doc;
}

// Handle authentication for user or captain
// It extracts the token, checks if it's blacklisted, verifies it, and attaches the user
async function handleAuth(req, res, next, model, attachKey) {
    try {
        const token = extractToken(req);
        if (!token) return res.status(401).json({ message: 'Unauthorized' });

        const blacklisted = await verifyNotBlacklisted(token);
        if (blacklisted) return res.status(401).json({ message: 'Unauthorized' });

        const doc = await verifyTokenAndAttach(token, model);
        if (!doc) return res.status(401).json({ message: 'Unauthorized' });

        req[attachKey] = doc;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

// Exported middleware functions for user and captain authentication
// They use the handleAuth function to authenticate the user or captain and attach them to the request
const authUser = (req, res, next) => handleAuth(req, res, next, userModel, 'user');
const authCaptain = (req, res, next) => handleAuth(req, res, next, captainModel, 'captain');

export default { authUser, authCaptain };