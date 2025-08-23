import userModel from '../models/user.model.js';
import captainModel from '../models/captain.model.js';

let io = null;

// Function to initialize socket.io with the server
// This function sets up the socket.io server and handles connection events
function initializeSocket(server) {
    if (io) return io;
    const { Server } = require('socket.io');
    io = new Server(server, {
        cors: {
            origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : true,
            credentials: true,
        },
    });

    io.on('connection', (socket) => {
        console.log('Socket connected:', socket.id);

        socket.on('join', async (data) => {
            try {
                const { userId, role } = data || {};
                if (!userId || !role) return;
                if (role === 'user') {
                    await userModel.findByIdAndUpdate(userId, { socketId: socket.id }, { new: true });
                } else if (role === 'captain') {
                    await captainModel.findByIdAndUpdate(userId, { socketId: socket.id }, { new: true });
                }
            } catch (err) {
                // log but don't crash socket
                // eslint-disable-next-line no-console
                console.error('Socket join error:', err.message || err);
            }
        });

        socket.on('disconnect', async (reason) => {
            // try to clear any user/captain record that references this socket id
            try {
                await Promise.all([
                    userModel.updateOne({ socketId: socket.id }, { $unset: { socketId: 1 } }),
                    captainModel.updateOne({ socketId: socket.id }, { $unset: { socketId: 1 } }),
                ]);
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error('Socket disconnect cleanup error:', err.message || err);
            }
            // eslint-disable-next-line no-console
            console.log('Socket disconnected:', socket.id, reason);
        });

        socket.on('ping', (cb) => {
            if (typeof cb === 'function') cb('pong');
        });
    });

    return io;
}

// Function to send a message to a specific socket ID
// This function allows sending events to a specific socket, useful for targeted notifications
function sendMessageToSocketId(socketId, event, data) {
    if (!io) {
        throw new Error('Socket.io not initialized. Call initializeSocket(server) first.');
    }
    io.to(socketId).emit(event, data);
}

// Function to get the current socket.io instance
// This function is useful for accessing the socket instance in other parts of the application
function getIo() {
    return io;
}

export default { initializeSocket, sendMessageToSocketId, getIo };