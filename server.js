//import express
const express = require('express')
const app = express()

//port
const port = 3000;

//route

//setup database
const db = require('./src/data/db.mongo.config');
db();

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.get('/about', function (req, res) {
  res.send('This is TPExpress Server for Driver')
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})