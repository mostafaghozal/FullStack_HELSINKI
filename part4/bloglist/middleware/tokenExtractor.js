const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.token = authorization.substring(7);
  }
  next();
};

module.exports = tokenExtractor;
