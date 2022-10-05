const router = require('express').Router();
const { createUser, login } = require('../controllers/users');
const { validationLogin, validationCreateUser } = require('../middleware/validations');

router.post('/signup', validationCreateUser, createUser);
router.post('/signin', validationLogin, login);

module.exports = router;