const jwt = require('jsonwebtoken');
const blackListTokenModel = require('../models/blackListToken.model');
const userModel = require('../models/user.model');
const captainModel = require('../models/captain.model');

// Extract token from cookie or authorization header
function extractToken(req) {
    const fromCookie = req.cookies && req.cookies.token;
    if (fromCookie) return fromCookie;
    const header = req.headers && req.headers.authorization;
    if (!header) return null;
    const parts = header.split(' ');
    return parts.length === 2 ? parts[1] : null;
}

async function verifyNotBlacklisted(token) {
    if (!token) return false;
    const found = await blackListTokenModel.findOne({ token });
    return !!found;
}

async function verifyTokenAndAttach(token, model) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const doc = await model.findById(decoded.id);
    return doc;
}

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

const authUser = (req, res, next) => handleAuth(req, res, next, userModel, 'user');
const authCaptain = (req, res, next) => handleAuth(req, res, next, captainModel, 'captain');

module.exports = { authUser, authCaptain };