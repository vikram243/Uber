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