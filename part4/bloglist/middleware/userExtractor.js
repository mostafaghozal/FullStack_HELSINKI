const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config(); // Load environment variables

const userExtractor = async (req, res, next) => {
  const token = req.token;
  if (token) {
    try {
      const decodedToken = jwt.verify(token, process.env.SECRET);
      req.user = await User.findById(decodedToken.id);
    } catch (error) {
      return res.status(401).json({ error: 'token invalid' });
    }
  } else {
    return res.status(401).json({ error: 'token missing' });
  }
  next();
};

module.exports = userExtractor;
