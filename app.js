require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');

const { MONGODB_ADDRESS = '//localhost:27017/filmsdb', PORT = 3001 } = process.env;

const { requestLogger, errorLogger } = require('./middleware/logger');

const router = require('./routes');
const { login, createUser } = require('./controllers/users');
const auth = require('./middleware/middleware');
const handelError = require('./middleware/handelError');
const { validationLogin, validationCreateUser } = require('./middleware/validations');

const options = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://artemchenko.films.nomoredomains.icu',
    'https://artemchenko.films.nomoredomains.icu',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

const app = express();

mongoose.connect(`mongodb:${MONGODB_ADDRESS}`);

app.use(cors(options));
app.use(express.json());
app.use(requestLogger);
app.post('/signin', validationLogin, login);
app.post('/signup', validationCreateUser, createUser);
app.use(auth);
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(handelError);
app.listen(PORT);
