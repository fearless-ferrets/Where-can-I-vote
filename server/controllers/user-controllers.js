// const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const dbconnect = require('../models/model');

const userController = {};

userController.verifyUser = (req, res, next) => {
  const username = req.username;
  const query = `SELECT * FROM users.user_information WHERE username = ${username}`;
  dbconnect.query(query, (error, res) => {
    if (error) return next(error);
    // if(res.rows)
    console.log(res);
  });
};

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

module.exports = userController;
