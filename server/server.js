const express = require('express');
const path = require('path');
const router = require('./routes/router');
const login = require('./routes/login');

// passing in the path to config here because we've got the .env file in the root folder
require('dotenv').config({
  path: path.resolve(__dirname, '../client/.env'),
});
// console.log('process.env', process.env);
const app = express();
const port = 3000;

// used to parse JSON bodies
app.use(express.json());

// define route handlers
app.use('/api', router);

// create a new router for logins
app.use('/api/login', login);

// create a new router for and signups
app.use('/api/signup', router);

// serve up static assets
app.use(express.static(path.resolve(__dirname, '../dist')));

// catch-all route handler for any requests to an unknown route
app.get('*', (req, res) => {
  res.sendStatus(404);
});

// global error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 400,
    message: { error: err ? err : 'An error occurred' }, // if there is an error, return that message, otherwise use default
  };

  // create an object and put into it the defaultErr overwritten with the err object parameter (if it was passed in)
  const errorObj = Object.assign(defaultErr, err);
  console.log(errorObj.log);
  res.status(errorObj.status).json(errorObj.message);
});

app.listen(port, () =>
  console.log(`Where Can I Vote? - server is listening at http://localhost:${port}`)
);
