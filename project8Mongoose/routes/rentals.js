const mongoose = require("mongoose")
const express = require("express")
const router = require("express").Router()
const debug = require("debug")("app:main")
const {Rental, validate} = require("../models/rental")


router.use(express.json())


router.post("/", async(req, res)=>{
    const {error} = validate(req.body)
    if(error){
        return res.status(400).send(error.details[0].message)
    }

    try {
        let rental = new Rental({
            title : req.body.title,
            rentedBy : req.body.rentedBy
        })
    
        await rental.save()
        res.send(rental)    
    } catch (error) {
        res.status(400).send(error.message)
    }
})


router.get("/", async(req, res)=>{
    const rentals = await Rental.find().populate("rentedBy", "name _id")
    res.send(rentals)
})


module.exports = router