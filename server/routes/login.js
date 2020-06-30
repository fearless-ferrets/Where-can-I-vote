const express = require('express');
const router = express.Router();
// const userController = require('../controllers/user-controllers');
const dbconnect = require('../models/model');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

//registered user login

router.post(
  '/',
  [
    //which one of them?
    check('name', 'The username is required').not().isEmpty(),
    check('email', 'A valid e-mail is required').isEmail(),
    check(
      'password',
      'Please enter a password with 6 of more characters'
    ).isLength({ min: 6 }),
  ],

  async (req, res) => {
    const validationErrors = validationResult(req);

    //check the quality of incoming (req) data
    if (!validationErrors.isEmpty) {
      return res.status(422).json({ errors: validationErrors.array() });
    }

    //check if the user exists // change if it is email
    const { username, password } = req.body;
    //    const username = req.body.username;
    //   const password = req.body.password;

    const query = `SELECT * FROM users.user_information WHERE username='${username}'`;

    try {
      const queryResult = await dbconnect.query(query);

      if (queryResult.rows.length == 0)
        return res.status(400).json({
          errors: [{ msg: 'Invalid credentials /no such username/' }],
        });

      const hashedpassword = queryResult.rows[0].password;

      const passwordMatches = await bcrypt.compare(password, hashedpassword);

      console.log('hashedPassword->', hashedpassword);
      console.log('passwordMatches->', passwordMatches);

      if (!passwordMatches) {
        return res.status(400).json({
          errors: [{ msg: 'Invalid credentials /incorrect password/' }],
        });
      }

      //return JWT
      const payload = {
        user: {
          id: queryResult.id, //or what else can be taken from the DB
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
  }

  // userController.verifyUser,
  // (req, res) => {
  //   res.status(200);
  // }
);

module.exports = router;
