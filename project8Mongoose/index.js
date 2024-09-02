const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const express = require("express");
const app = express();
const genres = require("./routes/genre");
const customers = require("./routes/costumer");
const movies = require("./routes/movies");
const mongoose = require("mongoose");
const morgan = require("morgan");
const rentals = require("./routes/rentals");

mongoose
  .connect("mongodb://localhost/project8Genre")
  .then(() => console.log("connected to db"))
  .catch((err) => console.log("could not connect to the server", err));

console.log("DEBUG envoirment variable is ", process.env.DEBUG);

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
}

app.use(express.json());

//adding routes
app.use("/api/genres", genres);
app.use("/api/customers/", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
