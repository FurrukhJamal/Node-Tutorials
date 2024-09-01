const mongoose = require("mongoose")
const {genreSchema} = require("./genre")


const moviesSchema = new mongoose.Schema({
    title: {
      type: String,
      minlength: 6,
      maxlength: 255,
      required: true,
      trim: true,
    },
    genre: {
      type: genreSchema,
      required: true,
    },
    numberInStock: Number,
    dailyRentalRate: Number,
  });
  
  const Movie = mongoose.model("movie", moviesSchema);


module.exports.Movie = Movie 
module.exports.moviesSchema = moviesSchema