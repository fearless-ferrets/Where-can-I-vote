const express = require('express');
const userController = require('../controllers/user-controllers');

const router = express.Router();

router.post('/', userController.verifyUser, (req, res) => {
  res.status(200);
});

module.exports = router;
