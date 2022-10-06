const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT } = require('../config');
const User = require('../models/user');
const ErrorNotFound = require('../errors/ErrorNotFound');
const BadRequest = require('../errors/BadRequest');
const ConflictError = require('../errors/ConflictError');
const { ERROR_MESSAGE_VALIDATION, ERROR_MESSAGE_NOT_FOUND_USER, ERROR_MESSAGE_CONFLICT_EMAIL } = require('../utils/constants');

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => next(new ErrorNotFound()))
    .then((user) => res.send(user))
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .orFail(() => next(new ErrorNotFound(ERROR_MESSAGE_NOT_FOUND_USER)))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(ERROR_MESSAGE_VALIDATION));
      } else if (err.code === 11000) {
        next(new ConflictError(ERROR_MESSAGE_CONFLICT_EMAIL));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => {
      const newUser = user.toObject();
      delete newUser.password;
      res.send(newUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(ERROR_MESSAGE_VALIDATION));
      } else if (err.code === 11000) {
        next(new ConflictError(ERROR_MESSAGE_CONFLICT_EMAIL));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

module.exports = {
  getUserInfo,
  updateUser,
  createUser,
  login,
};
