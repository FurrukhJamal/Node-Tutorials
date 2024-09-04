require("express-async-errors")
const winston = require("winston")
const config = require("config")
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
const users = require("./routes/users");
const auth = require("./routes/auth");
const errors = require("./middleware/errors")

if(!config.get("jwtPrivateKey")){
  console.error("FATAL ERROR : jwtPrivateKey is not defined")
  process.exit(1)
}

/**For catching uncaught exception that are to the part of request pipeline */
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'logfile.log', level: 'error' }),
    
  ],
});

process.on("uncaughtException", (ex)=>{
  console.log("UNCAUGHT EXCEPTION")
  logger.error(ex.message, ex)
    //best practice is top stop the process and restart it using process managers
  process.exit(1)
})

// throw new Error("Something went wrong in startup")
/**END catching uncaught exception */

/**Unhandled promise rejections */
process.on("unhandledRejection", (ex)=>{
  console.log("WE GOT an UNhandled Rejection")
  logger.error(ex.message, ex)
  //best practice is top stop the process and restart it using process managers
  process.exit(1)
})

const p = Promise.reject(new Error("Async promise rejection"))
p.then(()=>console.log("Done"))
/**END Unhandled promise rejections */


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
app.use("/api/users", users);
app.use("/api/auth", auth);

//after all the middlewares one need to register an error middleware with an err argument
// app.use(function(err, req, res, next){
//   res.status(500).send("Something went wrong")
// })
app.use(errors)

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
