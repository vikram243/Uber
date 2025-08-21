const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');

let io = null;

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
            const { userId, role } = data;
            if (role === 'user') {
                const user = await userModel.findByIdAndUpdate(userId, { socketId: socket.id }, { new: true });
            }
            else if (role === 'captain') {
                const captain = await captainModel.findByIdAndUpdate(userId, { socketId: socket.id }, { new: true });
            }
        });
                

        socket.on('disconnect', (reason) => {
            console.log('Socket disconnected:', socket.id, reason);
        });

        socket.on('ping', (cb) => {
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

module.exports = { initializeSocket, sendMessageToSocketId };