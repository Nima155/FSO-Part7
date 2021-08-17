const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const blogRouter = require('./controllers/blog');
const userRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');

const logger = require('./utils/logger');

const app = express();
const { DB_URL } = require('./utils/config');
const middleware = require('./utils/middleware');

mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    logger.info('Conntected to the database');
  })
  .catch((error) => {
    logger.error(error);
  });
// make the reset route available only if running in test mode.
if (process.env.NODE_ENV === 'test') {
  // eslint-disable-next-line global-require
  const resetRouter = require('./controllers/testing');
  app.use('/api/testing', resetRouter);
}
app.use(express.json());
app.use(cors());
// order of putting middlewares into use matters. Also using a middleware on every path.
app.use(middleware.tokenExtractor);
// using a middleware on an specific route, though we're not doing that here
app.use('/api/blogs', blogRouter);
app.use('/api/login', loginRouter);
app.use('/api/users', userRouter);
app.use(middleware.unknownEndPoint);
app.use(middleware.errorHandler);
module.exports = app;
