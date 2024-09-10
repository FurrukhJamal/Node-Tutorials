const mongoose = require("mongoose")
const debug = require("debug")("app:main")
const Joi = require("joi")

const genreSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 255,
    },
  });
  
  //getting the class
  const Genre = mongoose.model("Genre", genreSchema);

  
  function validateGenre(genre) {
    const schema = Joi.object({
      name: Joi.string().min(3).max(255).required(),
    });
  
    let result = schema.validate(genre);
    debug("validation result: ", result);
    return result;
  }

module.exports.Genre = Genre 
module.exports.validate = validateGenre
module.exports.genreSchema = genreSchema