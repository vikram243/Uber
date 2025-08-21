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

function sendMessageToSocketId(socketId, event, data) {
    if (!io) {
        throw new Error('Socket.io not initialized. Call initializeSocket(server) first.');
    }
    io.to(socketId).emit(event, data);
}

function getIo() {
    return io;
}

module.exports = { initializeSocket, sendMessageToSocketId, getIo };