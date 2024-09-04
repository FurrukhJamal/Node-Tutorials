const express = require("express");
const router = express.Router();
const Joi = require("joi");
const debug = require("debug")("app:main");
const _ = require("lodash");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const config = require("config")

// router.use(express.json());

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send("Invalid email or password");
  }

  let result = await bcrypt.compare(req.body.password, user.password);
  if (!result) {
    return res.status(400).send("Invalid email or password");
  }
  
  // const token = jwt.sign({_id : user._id}, config.get("jwtPrivateKey"))
  const token = user.generateAuthToken()
  res.send(token);
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).required(),
  });

  let result = schema.validate(req);
  debug("validation result: ", result);
  return result;
}

module.exports = router;
