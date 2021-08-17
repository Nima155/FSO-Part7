require('dotenv').config();
// const logger = require('./logger');

const DB_URL = process.env.NODE_ENV === 'production'
  ? process.env.DB_URL
  : process.env.TEST_DB_URL;
const { PORT } = process.env;
module.exports = { DB_URL, PORT };
