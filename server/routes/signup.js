const express = require('express');
const router = express.Router();
// const userController = require('../controllers/user-controllers');
const dbconnect = require('../models/model');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

// console.log('salt->', process.env.SALT_ROUNDS);
//registered user login

router.post(
  '/',
  [
    //check which one of them?
    check('username', 'The username is required').not().isEmpty(),
    check('email', 'A valid e-mail is required').isEmail(),
    // check(
    //   'password',
    //   'Please enter a password with 100******* of more characters'
    // ).isLength({ min: 100 }),
  ],

  async (req, res) => {
    const validationErrors = validationResult(req);

    //check the quality of incoming (req) data
    if (!validationErrors.isEmpty) {
      return res.status(422).json({ errors: validationErrors.array() });
    }

    //check if the user exists -> change it to email
    const { username, email, password } = req.body;
    //    const username = req.body.username;
    //   const password = req.body.password;
    // console.log('username ', username);
    // console.log('email ', email);
    const query = `SELECT * FROM users.user_information WHERE username='${username}' OR email='${email}'`;

    // console.log(query);
    try {
      const queryResult = await dbconnect.query(query);

      if (queryResult.rows.length !== 0)
        return res.status(400).json({
          errors: [{ msg: 'Invalid credentials' }],
          //   errors: [{ msg: 'eMail already registered/' }],
        });

      //encrypt the password
      const salt = await bcrypt.genSalt(+process.env.SALT_ROUNDS);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUserEntryQuery =
        'INSERT INTO users.user_information (username, password, email) VALUES ($1, $2, $3) RETURNING id';

      const params = [username, hashedPassword, email];

      const result = await dbconnect.query(newUserEntryQuery, params);

      const { id } = result.rows[0];

      console.log('id->', id);
      if (result) {
        //return JWT
        const payload = {
          user: {
            /// ?????
            id: id, //or what else can be taken from the DB
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
  }

  // userController.verifyUser,
  // (req, res) => {
  //   res.status(200);
  // }
);

module.exports = router;
