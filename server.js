//import
const express = require('express')
const app = express()
const bodyParser = require('body-parser');

//port
const port = 3000;

//setup database
const db = require('./src/data/db.mongo.config');
db();

//middleware
app.use(bodyParser.json());

//eogging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

//error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});


app.listen(port, () => {
  console.log(`Up and Running! TPExpress Driver Serveexpress.r is running on http://localhost:${port}`)
})