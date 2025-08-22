const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
// It uses the MONGODB_URI from environment variables to connect to the database
// If the connection fails, it logs the error and exits the process
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {});
        console.log('✅ MongoDB connected');
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err.message);
        process.exit(1);
    }
}

module.exports = connectDB;