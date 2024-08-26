const express = require("express");
const router = express.Router();
const Joi = require("joi");
const debug = require("debug")("app:main");

const{Genre, validate, genreSchema} = require("../models/genre") 

// const mongoose = require("mongoose");

// const genreSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     minlength: 3,
//     maxlength: 255,
//   },
// });

// //getting the class
// const Genre = mongoose.model("Genre", genreSchema);

//adding to db
const genreNames = ["Horror", "Romantic", "Action"];

(async () => {
  for (let i = 0; i < genreNames.length; i++) {
    let genre = new Genre({
      name: genreNames[i],
    });

    let result = await genre.save();
  }
  debug("data uploaded to db");
})();

router.use(express.json());

router.get("/", (req, res) => {
  (async () => {
    let genres = await Genre.find();
    res.send(genres);
  })();
});

router.post("/", (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  (async () => {
    const genre = new Genre({
      name: req.body.name,
    });

    let result = await genre.save();
    res.send(genre);
  })();
});

router.put("/:id", (req, res) => {
  (async () => {
    let genre = await Genre.findById(req.params.id);
    if (!genre)
      return res.status(404).send("the genre with the given id does not exist");

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    genre.set({
      name: req.body.name,
    });

    let result = await genre.save();
    debug(`reult of put request is ${result}`);

    res.send(genre);
  })();
});

router.get("/:id", (req, res) => {
  (async () => {
    const genre = await Genre.findById(req.params.id);
    if (!genre) {
      return res.status(404).send("No such id of genre");
    }
    res.send(genre);
  })();
});

router.delete("/:id", (req, res) => {
  (async () => {
    // let result = await Genre.deleteOne({ _id: req.params.id });
    // if (!result) {
    //   return res.status(404).send("No such id of genre");
    // }
    // debug("result is ", result);
    // if (result.deletedCount == 1) {
    //   res.send({ deleted: true });
    // } else {
    //   res.status(404).send({ error: "resource does not exist" });
    // }

    let genre = await Genre.findByIdAndDelete(req.params.id);
    if (genre) {
      res.send({ deleted: true });
    } else {
      res.status(404).send({ error: "resource does not exist" });
    }
  })();
});

// function validateGenre(genre) {
//   const schema = Joi.object({
//     name: Joi.string().min(3).required(),
//   });

//   let result = schema.validate(genre);
//   debug("validation result: ", result);
//   return result;
// }

module.exports = router;
module.exports.genreSchema = genreSchema;
module.exports.Genre = Genre;
module.exports.validateGenre = validate;
// module.exports.debug = debug;
