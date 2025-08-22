require('dotenv').config();
const http = require('http');
const app = require('./app');
const server = http.createServer(app);
const { initializeSocket } = require('./socket'); // added

initializeSocket(server); // added

// Set up the socket.io server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Global process handlers to aid debugging
process.on('unhandledRejection', (reason, promise) => {
    // eslint-disable-next-line no-console
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
// This is a last resort to catch errors that were not caught by any try/catch blocks
process.on('uncaughtException', (err) => {
    // eslint-disable-next-line no-console
    console.error('Uncaught Exception:', err);
    process.exit(1);
});