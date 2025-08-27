import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const captainSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [3, 'First name must be at least 3 characters long'],
            maxlength: 20,
        },
        lastname: {
            type: String,
            minlength: [3, 'Last name must be at least 3 characters long'],
            maxlength: 20,
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [6, 'Email must be at least 6 characters long'],
        maxlength: [50, 'Email must be at most 50 characters long'],
    },
    password: {
        type: String,
        required: true,
        select: false,
        minlength: [6, 'Password must be at least 6 characters long'],
        maxlength: [100, 'Password must be at most 50 characters long'],
    },
    socketId: {
        type: String,
        default: null,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive',
    },
    vehicle: {
        color: {
            type: String,
            required: true,
            minlength: [3, 'Color must be at least 3 characters long'],
            maxlength: 20,
        },
        model: {
            type: String,
            required: true,
            minlength: [3, 'Model must be at least 3 characters long'],
            maxlength: 30,
        },
        plate: {
            type: String,
            required: true,
            unique: true,
            minlength: [6, 'Plate must be at least 6 characters long'],
            maxlength: [15, 'Plate must be at most 15 characters long'],
        },
        type: {
            type: String,
            enum: ['Car', 'Bike', 'Auto'],
            required: true,
        },
        capacity: {
            type: Number,
            required: true,
            min: [1, 'Capacity must be at least 1'],
            max: [30, 'Capacity must be at most 30'],
        },
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            default: [0, 0],
        },
    },
}, { timestamps: true });

// Create a 2dsphere index on the location field
captainSchema.index({ location: '2dsphere' });

captainSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;
};

captainSchema.methods.comparePassword = async function (password) {
    const isMatch = await bcrypt.compare(password, this.password);
    return isMatch;
};

captainSchema.statics.hashPassword = async function (password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
};

const Captain = mongoose.model('Captain', captainSchema);

export default Captain;