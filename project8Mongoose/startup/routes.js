const express = require("express");
const genres = require("../routes/genre");
const customers = require("../routes/costumer");
const movies = require("../routes/movies");
const rentals = require("../routes/rentals");
const users = require("../routes/users");
const auth = require("../routes/auth");
const errors = require("../middleware/errors")

module.exports = function(app){
    app.use(express.json())
    app.use("/api/genres", genres);
app.use("/api/customers/", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);

//after all the middlewares one need to register an error middleware with an err argument
// app.use(function(err, req, res, next){
//   res.status(500).send("Something went wrong")
// })
app.use(errors)

}