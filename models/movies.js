const mongoose = require('mongoose');
const { URL_LINK } = require('../constants');

const moviesSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (url) => URL_LINK.test(url),
      message: 'Некорректный адрес URL',
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (url) => URL_LINK.test(url),
      message: 'Некорректный адрес URL',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (url) => URL_LINK.test(url),
      message: 'Некорректный адрес URL',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movies', moviesSchema);
