require('dotenv').config();

const loginRoute = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

loginRoute.post('/', async (request, response) => {
  const { body } = request;
  // use findOne to get only one single entry
  const user = await User.findOne({ username: body.username });
  // compare given password with the passwordhash stored in the database
  const passwordIsValid = !user
    ? false
    : await bcrypt.compare(body.password, user.passwordHash);
  if (!(user && passwordIsValid)) {
    return response
      .status(401)
      .json({ invalid: 'Invalid password and or username' });
  }
  // object that we will later be able to salvage from the token
  const tokenStructure = {
    username: user.username,
    // eslint-disable-next-line no-underscore-dangle
    id: user._id,
  };

  // create a token
  const token = jwt.sign(tokenStructure, process.env.SECRET, {
    expiresIn: 60 * 60,
  });
  // send back the token as well...

  return response.status(200).send({
    token,
    username: user.username,
    name: user.name,
    // for the frontend
    stampedDate: Date.now(),
  });
});

module.exports = loginRoute;
