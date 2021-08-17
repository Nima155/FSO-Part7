const resetRouter = require('express').Router();
const User = require('../models/users');
const Blog = require('../models/blog');

resetRouter.post('/reset', async (request, response) => {
  // reset the state of all collections in the database
  await User.deleteMany({});
  await Blog.deleteMany({});

  response.status(204).end();
});

module.exports = resetRouter;
