const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
  //get the token from the header
  const token = req.header('x-auth-token');

  //check of no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, autorisation denied' });
  }

  //verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
