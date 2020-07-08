const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const dbconnect = require('../models/model');

const userController = {};

userController.verifyUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  const query = `SELECT * FROM users.user_information WHERE username='${username}'`;

  dbconnect
    .query(query)
    .then((results) => {
      // if there are no results, the credentials are invalid, so return an error message into next
      if (results.rows === 0) return next('Invalid credentials');

      const hashedpassword = results.rows[0].password;

      // check whether the password is correct
      bcrypt.compare(password, hashedpassword, (err, result) => {
        if (result) {
          // save sth to res.locals?
          return next();
        }
        if (err) {
          return next(err);
        }
        return next('Invalid credentials');
      });
    })
    .catch((error) => next(error));
};

module.exports = userController;
