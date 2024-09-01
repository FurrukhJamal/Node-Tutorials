const Joi = require("joi");
const mongoose = require("mongoose");
const debug = require("debug")("app:customer");


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


module.exports.Customer = Customer
module.exports.validate = validate
module.exports.customerSchema = customerSchema