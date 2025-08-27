import { Server } from 'socket.io';
import mongoose from 'mongoose';
import userModel from './models/user.model.js';
import captainModel from './models/captain.model.js';

let io = null;

function initializeSocket(server) {
    if (io) return io;
    console.log('Initializing socket.io...');
    io = new Server(server, {
        cors: {
            origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : true,
            credentials: true,
            methods: ['GET', 'POST'],
        },
    });

    io.on('connection', (socket) => {
        console.log('Socket connected:', socket.id);

        socket.on('join', async (data) => {
            try {
                const { userId, role } = data || {};
                if (!userId || !role) {
                    console.error('Invalid join data: userId or role missing');
                    return;
                }
                if (!['user', 'captain'].includes(role)) {
                    console.error('Invalid role:', role);
                    return;
                }
                let validId;
                try {
                    validId = new mongoose.Types.ObjectId(userId);
                } catch (err) {
                    console.error('Invalid userId format:', userId);
                    return;
                }
                let updated = null;
                let documentExists = null;
                if (role === 'user') {
                    documentExists = await userModel.findById(validId);
                    if (documentExists) {
                        updated = await userModel.findByIdAndUpdate(
                            validId,
                            { socketId: socket.id },
                            { new: true, runValidators: true }
                        );
                    }
                } else if (role === 'captain') {
                    documentExists = await captainModel.findById(validId);
                    if (documentExists) {
                        updated = await captainModel.findByIdAndUpdate(
                            validId,
                            { socketId: socket.id },
                            { new: true, runValidators: true }
                        );
                    }
                }
                if (!documentExists) {
                    console.error(`No ${role} found with ID: ${userId}`);
                }
            } catch (err) {
                console.error('Socket join error:', err.message || err);
            }
        });

        socket.on('update-location-captain', async (data) => {
            try {
                const { userId, role, location } = data;
                const { lat, lng } = location || {};
                if (!location || !lat || !lng || isNaN(lat) || isNaN(lng)) {
                    return socket.emit('error', { message: 'Invalid location details' });
                }
                if (role !== 'captain') {
                    return socket.emit('error', { message: 'Only captains can update location' });
                }
                const captain = await captainModel.findById(userId);
                if (!captain) {
                    console.log('Captain not found');
                    return socket.emit('error', { message: 'Captain not found' });
                }
                await captainModel.findByIdAndUpdate(userId, {
                    location: {
                        type: 'Point',
                        coordinates: [lng, lat], // [longitude, latitude]
                    },
                });
                console.log(`Updated captain ${userId} location to [${lng}, ${lat}]`);
            } catch (error) {
                console.error('Error updating captain location:', error);
                socket.emit('error', { message: 'Failed to update location' });
            }
        });

        socket.on('disconnect', async (reason) => {
            try {
                await Promise.all([
                    userModel.updateOne({ socketId: socket.id }, { $unset: { socketId: 1 } }),
                    captainModel.updateOne({ socketId: socket.id }, { $unset: { socketId: 1 } }),
                ]);
            } catch (err) {
                console.error('Socket disconnect cleanup error:', err.message || err);
            }
            console.log('Socket disconnected:', socket.id, reason);
        });

        socket.on('ping', (cb) => {
            console.log('Received ping event');
            if (typeof cb === 'function') cb('pong');
        });
    });

    return io;
}

function sendMessageToSocketId(socketId, event, data) {
    if (!io) {
        throw new Error('Socket.io not initialized. Call initializeSocket(server) first.');
    }
    io.to(socketId).emit(event, data);
}

function getIo() {
    return io;
}

export default { initializeSocket, sendMessageToSocketId, getIo };