// const express = require("express");
//404 not found
//400 bad request

import express from "express";
import Joi from "joi";
import Another from "./Another.js";
import debug from "debug";
//for debugging
const startupDebugger = debug("app:startup");

//third party middlewares
import helmet from "helmet";
import morgan from "morgan";

// const another = require("./Another");

const app = express();
//setting up view engine
app.set("view engine", "pug");
//path to tempelates
app.set("views", "./views"); //default is views

console.log(`NODE_ENV : ${process.env.NODE_ENV}`);
console.log(`app.get('env') : ${app.get("env")}`);

//third party middlewares
app.use(helmet());
if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  //console.log("Morgan enabled");
  //using a debugger instead
  startupDebugger("Morgan Enabled");
}

// middleware to parse json object from the body
app.use(express.json());

//get key=value from website link
app.use(express.urlencoded({ extended: true }));

//to allow showing static content
app.use(express.static("public"));

//custom middleware
app.use(function (req, res, next) {
  console.log("Logging...");
  //required to stop the request hanging in there
  next();
});

app.use((req, res, next) => {
  console.log("authenticating");
  next();
});

app.use(Another);

const courses = [
  {
    id: 1,
    name: "name 1",
  },
  {
    id: 2,
    name: "name 2",
  },
  {
    id: 3,
    name: "name 3",
  },
];

app.get("/", (req, res) => {
  // res.send("Hello World");
  //using pug teplating engine
  res.render("index", { title: "My express App", message: "Hello Worald!" });
});

app.get("/api/courses", (req, res) => {
  res.send([1, 2, 3]);
});

//for dynamic endpoints with a placeholder id
// app.get("/api/courses/:id", (req, res) => {
//   res.send(req.params.id);
// });

//for multiple
app.get("/api/courses/:year/:month", (req, res) => {
  res.send(req.params);
});

//for query
// app.get("/api/courses/:year/:month", (req, res) => {
//   res.send(req.query);
// });

app.get("/api/Courses/:Id", (req, res) => {
  let course = courses.find((item) => item.id === parseInt(req.params.Id));
  if (!course) {
    res.status(404).send("no such id");
  }
  res.send(course);
});

//example of a POST request
app.post("/api/courses", (req, res) => {
  console.log("post request made");

  //joi schema
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  let result = schema.validate(req.body);
  console.log(result);

  if (!req.body.name || req.body.name.length < 3) {
    // 400 Bad Request
    res.status(400).send("Name is required");
    return;
  }

  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };

  courses.push(course);
  res.send(course);
});

//adding a course.... a PUT request
app.put("/api/courses/:id", (req, res) => {
  console.log("put request hitting");
  let course = courses.find((item) => item.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send("no such id");
    return;
  }

  //joi schema
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  let result = schema.validate(req.body);
  // console.log(result);

  if (result.error) {
    // 400 Bad Request
    res.status(400).send(result.error.details[0].message);
    return;
  }

  course.name = req.body.name;
  res.send(course);
});

app.delete("/api/courses/:id", (req, res) => {
  console.log("put request hitting");
  let course = courses.find((item) => item.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send("no such id");
    return;
  }

  let index = courses.indexOf(course);
  courses.splice(index, 1);
  res.send(course);
});

// for port number using envoirment variable
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening on port ${port}`));
