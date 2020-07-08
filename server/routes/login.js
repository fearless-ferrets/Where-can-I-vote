const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const dbconnect = require('../models/model');

const router = express.Router();

// registered user login
router.post(
  '/',
  [
    // express validation for user input (not quite working properly)
    check('username', 'The username is required').not().isEmpty(),
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

    // check if the user exists // change if it is email
    const { username, password } = req.body;

    const query = `SELECT * FROM users.user_information WHERE username='${username}'`;

    try {
      const queryResult = await dbconnect.query(query);

      if (queryResult.rows.length === 0) return next('Invalid credentials');

      const hashedpassword = queryResult.rows[0].password;

      const passwordMatches = await bcrypt.compare(password, hashedpassword);

      console.log('hashedPassword->', hashedpassword);
      console.log('passwordMatches->', passwordMatches);

      if (!passwordMatches) return next('Invalid credentials');

      // return JWT
      const payload = {
        user: {
          id: queryResult.id, // or what else can be taken from the DB
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
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Looks like we have a server problem!');
    }
  },
);

module.exports = router;
