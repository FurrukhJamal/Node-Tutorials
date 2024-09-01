const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Joi = require("joi");
const debug = require("debug")("app:movies");
const { genreSchema, Genre } = require("./genre");
const {Movie} = require("../models/movie")

// const moviesSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     minlength: 6,
//     maxlength: 255,
//     required: true,
//     trim: true,
//   },
//   genre: {
//     type: genreSchema,
//     required: true,
//   },
//   numberInStock: Number,
//   dailyRentalRate: Number,
// });

// const Movie = mongoose.model("movie", moviesSchema);

router.get("/", async (req, res) => {
  const movies = await Movie.find();
  res.send(movies);
});

router.post("/", async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  let genres = await Genre.find({ name: req.body.genre });
  debug("genre gotten", genres);
  if (genres.length === 0) {
    return res.status(400).send("invalid genre");
  }

  let movie = new Movie({
    title: req.body.title,
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
    // genre: new Genre({
    //   name: req.body.genre,
    // }),
    genre: {
      _id: genres[0]._id,
      name: genres[0].name,
    },
  });

  let result = await movie.save();
  res.send(movie);
});

router.put("/:id", async (req, res) => {
  // prettier-ignore
  let result = await Movie.updateOne(
    { _id: req.params.id },
    {
      $set: {
        "title": req.body.title,
        "numberInStock": req.body.numberInStock,
        "dailyRentalRate": req.body.dailyRentalRate,
        'genre.name': req.body.genre,
      },
    }
  );
  debug("result", result);
  res.send(result);
});

router.delete("/:id", async (req, res) => {
  let movie = await Movie.findByIdAndDelete(req.params.id);
  if (movie) {
    res.send({ deleted: true });
  } else {
    res.status(404).send({ error: "movie does not exist" });
  }
});

function validateMovie(movie) {
  const schema = Joi.object({
    title: Joi.string().min(6).required(),
    numberInStock: Joi.number(),
    dailyRentalRate: Joi.number(),
    genre: Joi.string().min(3).required(),
  });
  let result = schema.validate(movie);
  return result;
}

module.exports = router;
