const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');
const { JWT } = require('../config');
const { ERROR_MESSAGE_UNAUTHORIZED } = require('../utils/constants');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new AuthError(ERROR_MESSAGE_UNAUTHORIZED));
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT);
  } catch (err) {
    next(new AuthError(ERROR_MESSAGE_UNAUTHORIZED));
  }

  req.user = payload;
  next();
};
