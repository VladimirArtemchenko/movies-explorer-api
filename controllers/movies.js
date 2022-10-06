const Movie = require('../models/movies');
const ErrorNotFound = require('../errors/ErrorNotFound');
const BadRequestError = require('../errors/BadRequest');
const ForbiddenError = require('../errors/ForbiddenError');
const { ERROR_MESSAGE_VALIDATION, ERROR_MESSAGE_NOT_FOUND_FILM, ERROR_MESSAGE_NO_RIGHTS_FILM } = require('../utils/constants');

const getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => res.send(movies.reverse()))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(ERROR_MESSAGE_VALIDATION));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => next(new ErrorNotFound(ERROR_MESSAGE_NOT_FOUND_FILM)))
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        next(new ForbiddenError(ERROR_MESSAGE_NO_RIGHTS_FILM));
      } else {
        movie.remove()
          .then(() => res.send({ message: movie }))
          .catch(next);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(ERROR_MESSAGE_NO_RIGHTS_FILM));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
