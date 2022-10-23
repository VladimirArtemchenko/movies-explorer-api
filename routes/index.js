const router = require('express').Router();
const userRoute = require('./users');
const moviesRoute = require('./movies');
const storageRoute = require('./storage');
const auth = require('../middleware/middleware');
const ErrorNotFound = require('../errors/ErrorNotFound');
const { ERROR_MESSAGE_NOT_FOUND_PAGE } = require('../utils/constants');

router.use(storageRoute);
router.use(auth);
router.use('/users', userRoute);
router.use('/movies', moviesRoute);

router.use((req, res, next) => {
  next(new ErrorNotFound(ERROR_MESSAGE_NOT_FOUND_PAGE));
});

module.exports = router;
