// backend/src/server.js
import http from 'http';
import dotenv from 'dotenv';
import app from './app.js';
import { connectDB, disconnectDB } from './config/db.js';
import socket from './socket.js'; // Import socket.js

dotenv.config();

const PORT = process.env.PORT || 3000;
let server;

(async () => {
    try {
        await connectDB();

        // Create HTTP server & attach app
        server = http.createServer(app);

        // Initialize socket.io using socket.js
        console.log('Setting up socket.io with socket.js');
        const io = socket.initializeSocket(server);
        if (!io) {
            throw new Error('Failed to initialize socket.io');
        }

        // Make io available to the app (if controllers need to emit)
        app.set('io', io);

        server.listen(PORT, () => {
            console.log(`✅ Server listening on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('❌ Failed to start server:', err);
        process.exit(1);
    }
})();

// Graceful shutdown
const shutdown = async (signal) => {
    try {
        console.log(`\n${signal} received. Shutting down gracefully...`);
        if (server) {
            await new Promise((resolve) => server.close(resolve));
        }
        await disconnectDB();
        process.exit(0);
    } catch (err) {
        console.error('Error during shutdown:', err);
        process.exit(1);
    }
};

['SIGINT', 'SIGTERM'].forEach((sig) => process.on(sig, () => shutdown(sig)));

process.on('unhandledRejection', (reason) => {
    console.error('UNHANDLED REJECTION', reason);
});
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION', err);
    process.exit(1);
});