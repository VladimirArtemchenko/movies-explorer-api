require('dotenv').config();
const express = require('express');
const { PORT, DATA_BASE } = require('./config');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');

const { requestLogger, errorLogger } = require('./middleware/logger');
const { limiter } = require('./middleware/limiter');
const router = require('./routes/index');
const handelError = require('./middleware/handelError');

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

mongoose.connect(DATA_BASE);

app.use(cors(options));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(requestLogger);
app.use(limiter);
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(handelError);
app.listen(PORT);
