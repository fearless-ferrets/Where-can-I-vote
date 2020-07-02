// const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const dbconnect = require('../models/model');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

const userController = {};

userController.verifyUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;
  //    const username = req.body.username;
  //   const password = req.body.password;

  const query = `SELECT * FROM users.user_information WHERE username='${username}'`;

  dbconnect
    .query(query)
    .then((res) => {
        
      if (res.rows == 0)
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] });

      const hashedpassword = res.rows[0].password;

      bcrypt.compare(password, hashedpassword, function (err, result) {
        if (result) {
          //save sth to res.locals?
          return next();
        } else if (err) {
          return next(err);
        } else {
          return res
            .status(400)
            .json({ errors: [{ msg: 'Invalid credentials' }] });
        }
      });
    })
    .catch((error) => next(error));

  //   dbconnect.query(query, (error, res1) => {
  //     // console.log('query', query);
  //     if (error) return next(error);
  //     if (res1.rows == 0) return res.json({ msg: 'No such username' });

  //     const hashedpassword = res1.rows[0].password;

  //     bcrypt.compare(password, hashedpassword, function (err, result) {
  //       if (result) {
  //         return next();
  //       } else if (err) {
  //         return next(err);
  //       } else {
  //         return res.json({ msg: 'Invalid password' });
  //       }
  //     });

  //     return next();
  //   });

  // userController.verifyPassword = (req, res, next) => {
  //   const password = req.body.password;

  //   const query = `SELECT * FROM users.user_information WHERE password='${hashedpassword}'`;

  //   dbconnect.query(query, (error, res1) => {
  //     console.log('query', query);
  //     if (error) return next(error);
  //     if (res1.rows == 0) return res.json({ msg: 'No such password' });
  //     const hashedpassword = res1.rows[0].password;
  //     bcrypt.compare(password, hashedpassword, function (err, result) {
  //       if (result) {
  //         return next();
  //       } else if (err) {
  //         return next(err);
  //       } else {
  //         return res.json({ msg: 'Invalid ppassword' });
  //       }
  //     });
  //     return next();
  //   });
  // };
  // userController.createToken = (req, res, next) => {
  //   const payload = 'theUser';
  //   try {
  //     const token = jwt.sign(payload, process.env.JWT_TOKEN);
  //     //   console.log(token);
  //     //   return next();
  //     if (token) {
  //       console.log('from createToken ->', token);

  //       return res.json({ token });
  //     }
  //   } catch (error) {
  //     console.log('the error from cteateToken', error);
  //     if (error) next(error);
  //   }
  // };

  // userController.verifyToken = (req, res, next) => {
  //   try {
  //     const token = req.header('x-auth-token');
  //     console.log('from verifyToken');
  //     //check of no token
  //     if (!token) userController.createToken(req, res, next);
  //     // {
  //     //   return res.status(401).json({ msg: 'No token, autorisation denied' });
  //     // }

  //     //verify token
  //     // try {
  //     //   const decoded = jwt.verify(token, process.env.JWT_TOKEN);
  //     //   req.user = decoded.user;
  //     //   next();
  //     // } catch (err) {
  //     //   res.status(401).json({ msg: 'Token is not valid' });
  //     // }
  //     return next();
  //   } catch (error) {
  //     console.log(error);
  //     next(error);
  //   }
  // };
};
module.exports = userController;
