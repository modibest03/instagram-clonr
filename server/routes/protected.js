// const jwt = require('jsonwebtoken');
const signin = require('../middleware/signin')
const express = require('express');
const router = express.Router();


router.post('/', signin,async (req, res) => {
  res.send('protected');
});




module.exports = router; 