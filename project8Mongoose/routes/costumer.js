const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Joi = require("joi");
// const { debug } = require("./genre");
const debug = require("debug")("app:customer");

debug("DEBUG env var in customers ", process.env.DEBUG);
console.log("DEBUG env var in customers produced via c.log", process.env.DEBUG);
const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  phone: String,
  isGold: {
    type: Boolean,
    default: false,
  },
});

const Customer = mongoose.model("customer", customerSchema);
//adding a middleware
router.use(express.json());

router.get("/", async (req, res) => {
  let customers = await Customer.find();
  res.send(customers);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
  }

  const customer = new Customer({
    name: req.body.name,
    phone: req.body.phone ? req.body.phone : "",
    isGold: req.body.isGold,
  });
  let result = await customer.save();
  res.send(customer);
});

router.put("/:id", async (req, res) => {
  const result = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        name: req.body.name,
        phone: req.body.phone ? req.body.phone : "",
        isGold: req.body.isGold,
      },
    },
    { new: true }
  );

  res.send(result);

  //   const customer = await Customer.findById(req.params.id);
  //   if (!customer) {
  //     res.status(404).send("Invalid customer id");
  //   }
  //   const { error } = validate(req.body);
  //   if (error) {
  //     res.status(400).send(error.details[0].message);
  //   }

  //   customer.set({
  //     name: req.body.name,
  //     phone: req.body.phone ? req.body.phone : "",
  //     isGold: req.body.isGold,
  //   });
  //   let result = await customer.save();
  //   res.send(customer);
});

router.delete("/:id", async (req, res) => {
  let customer = await Customer.findByIdAndDelete(req.params.id);
  if (customer) {
    res.send({ deleted: true });
  } else {
    res.status(404).send("Could not delete the customer with the give id");
  }
});

function validate(customer) {
  const schema = Joi.object({
    name: Joi.string().min(5).required(),
    phone: Joi.string(),
    isGold: Joi.boolean(),
  });

  let result = schema.validate(customer);
  debug("result in Post end point '/': ", result.error);
  return result;
}

module.exports = router;
