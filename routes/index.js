const router = require('express').Router();
const userRoute = require('./users');
const moviesRoute = require('./movies');

const ErrorNotFound = require('../errors/ErrorNotFound');

router.use('/users', userRoute);
router.use('/movies', moviesRoute);

router.use((req, res, next) => {
  next(new ErrorNotFound('Запрашиваемая страница отсутствует'));
});

module.exports = router;
