require('dotenv').config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('./lib/db.js')();
const userRoute = require('./routes/user.route.js');
const captainRoute = require('./routes/captain.route.js');

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/users', userRoute);
app.use('/captains', captainRoute);

module.exports = app;