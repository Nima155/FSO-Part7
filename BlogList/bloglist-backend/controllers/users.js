// eliminates the need for try-catch blocks
// errors get sent to our error-handler middleware automatically
require('express-async-errors');

const userRouter = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/users');
// creating a new user
userRouter.post('/', async (request, response) => {
  // generating password hash
  if (!request.body.password || request.body.password.length < 3) {
    response
      .status(400)
      .json({ error: 'Password must at least be 3 characters long' });
  }
  const passwordHash = await bcrypt.hash(request.body.password, 10);

  const newUser = new User({
    username: request.body.username,
    name: request.body.name,
    // saving password hash to the database
    passwordHash,
  });

  const savedUser = await newUser.save();
  // ok response on creation
  response.json(savedUser);
});
// returning all users
userRouter.get('/', async (request, response) => {
  const allUsers = await User.find({}).populate('blogs', {
    url: 1,
    title: 1,
    author: 1,
  });
  response.json(allUsers);
});

module.exports = userRouter;
