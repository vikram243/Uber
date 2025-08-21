const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            min: [3, 'First name must be at least 3 characters long'],
            max: 20,
        },
        lastname: {
            type: String,
            min: [3, 'Last name must be at least 3 characters long'],
            max: 20,
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,
        min: [6, 'Email must be at least 6 characters long'],
        max: [50, 'Email must be at most 50 characters long'],
    },
    password: {
        type: String,
        required: true,
        select: false,
        min: [6, 'Password must be at least 6 characters long'],
        max: [50, 'Password must be at most 50 characters long'],
        
    },
    socketId: {
        type: String,
    },
}, { timestamps: true });

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;
}

userSchema.statics.hashPassword = async function (password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

const User = mongoose.model('User', userSchema);
module.exports = User;