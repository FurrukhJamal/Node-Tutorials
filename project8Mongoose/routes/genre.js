const express = require("express");
const router = express.Router();
const Joi = require("joi");
const debug = require("debug")("app:main");
const auth = require("../middleware/auth")
const admin = require("../middleware/admin")
const{Genre, validate, genreSchema} = require("../models/genre"); 
const { default: mongoose } = require("mongoose");
const validateObjectId = require("../middleware/validateObjectId")

// const mongoose = require("mongoose");

// const genreSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     minlength: 3,
//     maxlength: 255,
//   },
// });

// //getting the class
// const Genre = mongoose.model("Genre", genreSchema);

//adding to db
const genreNames = ["Horror", "Romantic", "Action"];

// (async () => {
//   for (let i = 0; i < genreNames.length; i++) {
//     let genre = new Genre({
//       name: genreNames[i],
//     });

//     let result = await genre.save();
//   }
//   debug("data uploaded to db");
// })();

router.use(express.json());

/**A custom middleware example to show how to avoid adding a try catch in every route by having it in 
 * one place, example is in get request below
 */

function asyncMiddleware(handler){
  return async(req,res,next) =>{
      try{
        await handler(req,res)  
      } catch (error)
      {
        next(error)
      }
  }
      
 

}

// router.get("/", asyncMiddleware(async(req, res ) => {     //adding next to log errors
//   let genres = await Genre.find();
//   res.send(genres);  
// }));



router.get("/", async(req, res, next ) => {     //adding next to log errors
  // throw new Error("Manually generated error")  
  try {
      let genres = await Genre.find();
      res.send(genres);  
    } 
    catch (error)
    {
      //we would have to log the exception here
      //res.status(500).send("Something went wrong")
      //error would be available as first argument in the custom middleware
      next(error)
    }
  
});

router.post("/", auth, (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  (async () => {
    const genre = new Genre({
      name: req.body.name,
    });

    let result = await genre.save();
    res.send(genre);
  })();
});

router.put("/:id", [auth, admin], (req, res) => {
  (async () => {
    let genre = await Genre.findById(req.params.id);
    if (!genre)
      return res.status(404).send("the genre with the given id does not exist");

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    genre.set({
      name: req.body.name,
    });

    let result = await genre.save();
    debug(`reult of put request is ${result}`);

    res.send(genre);
  })();
});

router.get("/:id", validateObjectId,  (req, res) => {
  (async () => {
    //transfering the logic to a middleware
    // if(!mongoose.Types.ObjectId.isValid(req.params.id)){
    //   return res.status(404).send("invalid id")
    // }
    
    const genre = await Genre.findById(req.params.id);
    if (!genre) {
      return res.status(404).send("No such id of genre");
    }
    res.send(genre);
  })();
});

router.delete("/:id", [auth, admin], async(req, res) => {
  
  // let result = await Genre.deleteOne({ _id: req.params.id });
  // if (!result) {
  //   return res.status(404).send("No such id of genre");
  // }
  // debug("result is ", result);
  // if (result.deletedCount == 1) {
  //   res.send({ deleted: true });
  // } else {
  //   res.status(404).send({ error: "resource does not exist" });
  // }

  // console.log("id in delete is:", req.params.id)
  let genre = await Genre.findByIdAndDelete(req.params.id);
  if (genre) {
    res.send({ deleted: true });
  } else {
    res.status(404).send({ error: "resource does not exist" });
  }
  
});

// function validateGenre(genre) {
//   const schema = Joi.object({
//     name: Joi.string().min(3).required(),
//   });

//   let result = schema.validate(genre);
//   debug("validation result: ", result);
//   return result;
// }

module.exports = router;
module.exports.genreSchema = genreSchema;
module.exports.Genre = Genre;
module.exports.validateGenre = validate;
// module.exports.debug = debug;
