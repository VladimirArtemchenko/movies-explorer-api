const router = require('express').Router();
const userRoute = require('./users');
const moviesRoute = require('./movies');
const storageRoute = require('./storage');
const auth = require('../middleware/middleware');
const ErrorNotFound = require('../errors/ErrorNotFound');

router.use( storageRoute);
router.use(auth);
router.use( userRoute);
router.use( moviesRoute);


router.use((req, res, next) => {
  next(new ErrorNotFound('Запрашиваемая страница отсутствует'));
});

module.exports = router;
