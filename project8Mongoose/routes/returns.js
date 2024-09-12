const express = require("express")
const router = express.Router()
const auth = require("../middleware/auth")
const{Rental, validate} = require("../models/rental")
const {Movie} = require("../models/movie")


router.post("/", auth, async(req,res)=>{
    const {error} = validate(req.body)
    if(error){
        return res.status(400).send(error.details[0].message)
    }

    let rental = await Rental.findOne({title : req.body.title, rentedBy : req.body.rentedBy})
    if(!rental){
        return res.status(404).send("No rental to show with given title and customer id")
    }
    if(typeof(rental.dateReturned) === "number"){
        console.log("rental.dateReturned :", rental.dateReturned)
        return res.status(400).send("rental already processed")
    }

    rental.dateReturned = Date.now()
    await rental.save()

    let difference = rental.dateReturned - rental.date
    // let differenceinMilliseconds = new Date(difference).getMilliseconds()
    //console.log("TIME DIFFERENCE in Days: ", difference/(24 * 60* 60 * 1000) )
    let daysRented = Math.floor(difference/(24 * 60* 60 * 1000))

    //calculating the rental fee and updating the stock
    let movie = await Movie.findOne({title : req.body.title})
    await Movie.updateOne({title : movie.title}, {$inc : {numberInStock : 1}})
    rental.rentalFee = movie.dailyRentalRate * daysRented
    
    return res.send(rental)
})

module.exports = router