const express = require("express");
const router = express.Router();
const Joi = require("joi");
const debug = require("debug")("app:main");
const _ = require("lodash");
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
const config = require("config")
const jwt = require("jsonwebtoken")
const auth = require("../middleware/auth")

// router.use(express.json());

//getting information abt the currently logged in user
router.get("/me", auth, async(req, res)=>{
  const user = await User.findById(req.user._id).select("-password")
  res.send(user)
})

//a register user route
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
  
  //arguments to jwt.sign are the payload and privatekey
  // const token = jwt.sign({_id : user._id}, config.get("jwtPrivateKey"))
  const token = user.generateAuthToken()
  
  res.header("x-auth-token", token).send(_.pick(user, ["name", "email"])); //sending just name and email to client
});

module.exports = router;
