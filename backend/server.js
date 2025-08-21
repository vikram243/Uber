require('dotenv').config();
const http = require('http');
const app = require('./app');
const server = http.createServer(app);
const { initializeSocket } = require('./socket'); // added

initializeSocket(server); // added

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Global process handlers to aid debugging
process.on('unhandledRejection', (reason, promise) => {
    // eslint-disable-next-line no-console
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    // eslint-disable-next-line no-console
    console.error('Uncaught Exception:', err);
    process.exit(1);
});