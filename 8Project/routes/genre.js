const express = require("express");
const router = express.Router();
const Joi = require("joi");
const debug = require("debug")("app:main");

router.use(express.json());

const genres = [
  { id: 1, name: "Action" },
  { id: 2, name: "Horror" },
  { id: 3, name: "Romance" },
];

router.get("/", (req, res) => {
  res.send(genres);
});

router.post("/", (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const genre = {
    id: genres.length + 1,
    name: req.body.name,
  };

  genres.push(genre);
  res.send(genre);
});

router.put("/:id", (req, res) => {
  const genre = genres.find((c) => c.id === parseInt(req.params.id));
  if (!genre)
    return res.status(404).send("the genre with the given id does not exist");

  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  genre.name = req.body.name;
  res.send(genre);
});

router.get("/:id", (req, res) => {
  const genre = genres.find((item) => item.id === parseInt(req.params.id));
  if (!genre) {
    return res.status(404).send("No such id of genre");
  }
  res.send(genre);
});

router.delete("/api/genres/:id", (req, res) => {
  const genre = genres.find((item) => item.id === parseInt(req.params.id));
  if (!genre) {
    return res.status(404).send("No such id of genre");
  }
  let index = genres.indexOf(genre);
  genres.splice(index, 1);
  res.send(genre);
});

function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  let result = schema.validate(genre);
  debug("validation result: ", result);
  return result;
}

module.exports = router;
