const { JWT } = require('../config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ErrorNotFound = require('../errors/ErrorNotFound');
const BadRequest = require('../errors/BadRequest');
const ConflictError = require('../errors/ConflictError');

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => next(new ErrorNotFound('Пользователь не найден')))
    .then((user) => res.send(user))
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .orFail(() => next(new ErrorNotFound('Пользователь не найден')))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Ошибка валидации'));
      } else if (err.code === 11000) {
        next(new ConflictError('Данный email уже используется'));
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
        next(new BadRequest('Ошибка валидации'));
      } else if (err.code === 11000) {
        next(new ConflictError('Данный email уже используется'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id },JWT, { expiresIn: '7d' });
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
