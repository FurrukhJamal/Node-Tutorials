const express = require("express");
const router = express.Router();
const Joi = require("joi");
const debug = require("debug")("app:main");
const _ = require("lodash");
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");

// router.use(express.json());

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).send("User with the email already registered");
  }

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  //hashing the password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();
  res.send(_.pick(user, ["name", "email"])); //sending just name and email to client
});

module.exports = router;
