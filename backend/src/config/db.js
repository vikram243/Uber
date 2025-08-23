// backend/src/config/db.js
import mongoose from 'mongoose';


const MONGO_URI = process.env.MONGO_URI;


export async function connectDB() {
    if (!MONGO_URI) throw new Error('MONGO_URI missing in environment');
    mongoose.set('strictQuery', true);
    await mongoose.connect(MONGO_URI, {
        // options as needed
        autoIndex: true,
    });
    console.log('✅ MongoDB connected');


    mongoose.connection.on('error', (err) => {
        console.error('Mongo connection error:', err);
    });
}


export async function disconnectDB() {
    await mongoose.connection.close();
    console.log('🛑 MongoDB disconnected');
}