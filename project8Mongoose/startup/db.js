const mongoose = require("mongoose");

module.exports = function(){
    mongoose
  .connect("mongodb://localhost/project8Genre")
  .then(() => console.log("connected to db"))
  .catch((err) => console.log("could not connect to the server", err));

}