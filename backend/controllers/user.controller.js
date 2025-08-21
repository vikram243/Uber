const userModel = require('../models/user.model');
const { validationResult } = require('express-validator');
const userService = require('../services/user.service');
const blackListTokenModel = require('../models/blackListToken.model');

const registerUser = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        if (!fullname || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const isUserAlready = await userModel.findOne({ email });
        if (isUserAlready) {
            return res.status(401).json({ message: 'User already exist' });
        }

        const hashedPassword = await userModel.hashPassword(password);
        const user = await userService.createUser({
            firstname: fullname.firstname,
            lastname: fullname.lastname || '',
            email,
            password: hashedPassword
        });

        const token = user.generateAuthToken();
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000,
        });
        return res.status(201).json({ message: 'User registered successfully', user, token });
    }
    catch (error) {
  // avoid leaking internal error details to clients
  // eslint-disable-next-line no-console
  console.error('registerUser error:', error);
  return res.status(500).json({ message: 'Error registering user' });
    }
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await userModel.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = user.generateAuthToken();
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    // sanitize user before sending
    const safeUser = user.toObject ? user.toObject() : { ...user };
    delete safeUser.password;

    return res.status(200).json({ message: 'User logged in successfully', user: safeUser, token });
  }
  catch (error) {
  // eslint-disable-next-line no-console
  console.error('loginUser error:', error);
  return res.status(500).json({ message: 'Error logging in user' });
  }
}

const logoutUser = async (req, res) => {
    try {
    const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1];
    if (token) {
      await blackListTokenModel.create({ token });
    }
    res.clearCookie('token');
    return res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
    // eslint-disable-next-line no-console
    console.error('logoutUser error:', error);
    return res.status(500).json({ message: 'Error logging out user' });
    }
}

const getUserProfile = async (req, res) => {
  try {
    const user = req.user;
    const safeUser = user.toObject ? user.toObject() : { ...user };
    delete safeUser.password;
    return res.status(200).json({ message: 'User profile fetched successfully', user: safeUser });
  } catch (error) {
  // eslint-disable-next-line no-console
  console.error('getUserProfile error:', error);
  return res.status(500).json({ message: 'Error fetching user profile' });
  }
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile
}