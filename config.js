require('dotenv').config();

const {
  NODE_ENV,
  JWT,
  DATA_BASE,
  PORT,
} = process.env;

module.exports = {
  JWT: NODE_ENV === 'production' ? JWT : 'ArtemchenkoVladimir',
  DATA_BASE: NODE_ENV === 'production' ? DATA_BASE : 'mongodb://localhost:27017/moviesdb',
  PORT: NODE_ENV === 'production' ? PORT : 3001,
};
