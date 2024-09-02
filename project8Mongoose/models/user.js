const mongoose = require("mongoose");
const debug = require("debug")("app:main");
const Joi = require("joi");

//getting the class
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      minlength: 5,
      maxlength: 255,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 1024,
    },
  })
);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).required(),
  });

  let result = schema.validate(user);
  debug("validation result: ", result);
  return result;
}

module.exports.User = User;
module.exports.validate = validateUser;
// module.exports.genreSchema = genreSchema
