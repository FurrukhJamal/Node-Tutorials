const mongoose = require("mongoose");
const { Movie } = require("../models/movie");
const Joi = require("joi");
const { Customer, customerSchema } = require("../models/customer");
Joi.objectId = require("joi-objectid")(Joi);

const rentalsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return new Promise(async (resolve) => {
          let movies = await Movie.find();
          console.log("Movies : ");
          const movie = movies.filter((movie) => {
            return movie.title === v;
          });
          if (movie.length > 0 && movie[0].numberInStock >= 1) {
            await Movie.updateOne(
              {
                _id: movie[0]._id,
              },
              {
                $inc: {
                  numberInStock: -1,
                },
              }
            );
            resolve(true);
          } else {
            resolve(false);
          }
        });
      },
      message:
        "We dont have the given movie to offer as a rental or we are out of stock",
    },
  },
  rentedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customer",
  },

  date: {
    type: Date,
    default: Date.now,
  },
  dateReturned : {},
  rentalFee : {}

});

// rentalsSchema.methods.returnFee = async function(){
//     this.dateReturned = Date.now()
//     // await rental.save()

//     let difference = this.dateReturned - this.date
//     // let differenceinMilliseconds = new Date(difference).getMilliseconds()
//     //console.log("TIME DIFFERENCE in Days: ", difference/(24 * 60* 60 * 1000) )
//     let daysRented = Math.floor(difference/(24 * 60* 60 * 1000))

//     //calculating the rental fee and updating the stock
//     let movie = await Movie.findOne({title : req.body.title})
//     await Movie.updateOne({title : movie.title}, {$inc : {numberInStock : 1}})
//     rental.rentalFee = movie.dailyRentalRate * daysRented
    
// }

const Rental = mongoose.model("Rental", rentalsSchema);

function validate(rental) {
  const schema = Joi.object({
    title: Joi.string().min(6).required(),
    rentedBy: Joi.objectId().required(),
  });

  return schema.validate(rental);
}

module.exports.Rental = Rental;
module.exports.validate = validate;
