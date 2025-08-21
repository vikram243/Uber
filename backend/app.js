require('dotenv').config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('./lib/db.js')();
const userRoute = require('./routes/user.route.js');
const captainRoute = require('./routes/captain.route.js');
const mapsRoute = require('./routes/maps.routes.js'); 
const rideRoute = require('./routes/ride.routes.js');

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : true,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/users', userRoute);
app.use('/captains', captainRoute);
app.use('/maps', mapsRoute);
app.use('/rides', rideRoute);

// Register centralized error handler after routes
const errorHandler = require('./lib/errorHandler');
app.use(errorHandler);

module.exports = app;