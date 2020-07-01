const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../client/.env'),
});

const express = require('express');
const router = require('./routes/router');
// const login = require('./routes/login');

// passing in the path to config here because we've got the .env file in the root folder
console.log('process.env', process.env.POSTGRES_URI);
const app = express();
const port = 3000;

// used to parse JSON bodies
app.use(express.json());

// define route handlers
app.use('/api', router);

//creates a  router for logins
app.use('/api/login', require('./routes/login'));

app.use('/api/login', require('./routes/login'));

//creates a  router for and signups
app.use('/api/signup', require('./routes/signup'));

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
  console.log(`Example app listening at http://localhost:${port}`)
);
