/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    minLength: 3,
    required: true,
    validate: {
      validator: (value) => value.match(/[a-z0-9]/gi).length === value.length,
      message: () => 'Username can only have alphanumeric characters',
    },
  },
  name: String,
  passwordHash: String,
  blogs: [{ ref: 'Blog', type: mongoose.Schema.Types.ObjectId }],
});
// what should be returned when toJSON() is called on the object
userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    // for safety reasons
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // passwordHash should be hidden
    delete returnedObject.passwordHash;
  },
});
// to enforce username uniqueness
userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', userSchema);
