const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const dbconnect = require('../models/model');

const router = express.Router();
// console.log('salt->', process.env.SALT_ROUNDS);

// registered user login
router.post(
  '/',
  [
    // express validation for input, but not working consistently
    check('username', 'The username is required').not().isEmpty(),
    check('email', 'A valid e-mail is required').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters',
    ).isLength({ min: 6 }),
  ],

  async (req, res, next) => {
    const validationErrors = validationResult(req);

    // check the quality of incoming (req) data
    if (!validationErrors.isEmpty) {
      return res.status(422).json({ errors: validationErrors.array() });
    }

    // check if the user exists -> change it to email
    const { username, email, password } = req.body;
    let query;
    if (username && email && password) {
      query = `SELECT * FROM users.user_information WHERE username='${username}' OR email='${email}'`;
    } else {
      return next('Invalid sign-up credentials');
    }

    // console.log(query);
    try {
      const queryResult = await dbconnect.query(query);

      if (queryResult.rows.length !== 0) return next('Invalid sign-up credentials');

      // encrypt the password
      const salt = await bcrypt.genSalt(+process.env.SALT_ROUNDS);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUserEntryQuery = 'INSERT INTO users.user_information (username, password, email) VALUES ($1, $2, $3) RETURNING id';

      const params = [username, hashedPassword, email];

      const result = await dbconnect.query(newUserEntryQuery, params);

      const { id } = result.rows[0];

      console.log('id->', id);
      if (result) {
        // return JWT
        const payload = {
          user: {
            // ?????
            id, // or what else can be taken from the DB
          },
        };

        jwt.sign(
          payload,
          process.env.JWT_TOKEN,
          { expiresIn: 360000 },
          (err, token) => {
            if (err) throw err;
            res.json({ token });
          }
        );
      }
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Another server problem!');
    }
  },
);

module.exports = router;
