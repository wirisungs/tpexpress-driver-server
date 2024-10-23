//import
const express = require('express')
const app = express()
const bodyParser = require('body-parser');

//routes
const orderRoutes = require('./src/routes/order.route');
const authRoutes = require('./src/routes/auth.route');
const userRoutes = require('./src/routes/user.route');
const cityRoutes = require('./src/routes/city.route');
const driverRoutes = require('./src/routes/driver.route');
const emailRoutes = require('./src/routes/email.route');
require('dotenv').config();

//port
const port = process.env.PORT || 3000;

//setup database
const db = require('./src/data/db.mongo.config');
db();

//middleware
app.use(bodyParser.json());

//logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

//error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

//Increase the max listerners limit
const EventEmitter = require('events');
EventEmitter.defaultMaxListeners = 20;

//route
app.use('/order', orderRoutes);
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/city', cityRoutes);
app.use('/driver', driverRoutes);
app.use('/email', emailRoutes);

app.listen(port, () => {
  console.log(`Up and Running! TPExpress Driver Server is running on http://localhost:${port}`)
})
