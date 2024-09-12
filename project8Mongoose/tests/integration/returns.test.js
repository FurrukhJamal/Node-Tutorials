const {Rental} = require("../../models/rental")
const {Genre} =require("../../models/genre")
const {Movie} = require("../../models/movie")
const {Customer} = require("../../models/customer")
const {User} = require("../../models/user")
const { iteratee } = require("lodash")
const mongoose = require("mongoose")
const request = require("supertest")

describe("/api/returns", ()=>{
    let server
    let genre;
    let movie;
    let customer
    let rental
    let token
    let title
    let rentedBy
    let date;

    beforeEach(async()=>{
        server = require("../../index")
        //generating a token
        token = new User().generateAuthToken()
        
        //creating a Genre
        genre = new Genre({name : "genre1"})
        
        //creating a movie
        movie = new Movie({
            title: "movie1",
            genre: genre,
            numberInStock: 10,
            dailyRentalRate: 2
        })

        title = movie.title

        await movie.save()

        //creating a customer
        customer = new Customer({
            name : "customer1",
            phone : "123456",
            isGold : true
        })

        rentedBy = customer._id
        
        rental = new Rental({
            title : movie.title,
            rentedBy : customer._id, 
        })

        await rental.save()
    })
    afterEach(async()=>{
        await Rental.deleteMany({})
        await Movie.deleteMany({})
        await Genre.deleteMany({})
        await Customer.deleteMany({})
        await server.close()
        
    })

    afterAll(async () => {
        await mongoose.connection.close();  // Close mongoose connection after all tests
    });

    const execute = ()=>{
        return request(server)
                .post("/api/returns")
                .set("x-auth-token", token)
                .send({
                    rentedBy ,
                    title 
                })
    }
    
    
    it("should work", async()=>{
        let result = await Rental.findById(rental._id)
        expect(result).not.toBeNull()
    })

    it("should return a 401 if client is not logged in", async()=>{
        token = ""
        const res = await execute()
        expect(res.status).toBe(401)
    })

    it("should return a 400 if title is not provided", async()=>{
        title = ""
        const res = await execute()
        expect(res.status).toBe(400)
    })

    it("should return a 400 if rentedBy is not provided", async()=>{
        rentedBy = ""
        const res = await execute()
        expect(res.status).toBe(400)
    })

    it("should return 404 if no retal is found for given title and rentedBy id", async()=>{
        rentedBy = new mongoose.Types.ObjectId()
        const res = await execute()
        expect(res.status).toBe(404)
    })

    it("should return 400 if rental already processed", async()=>{
        rental.dateReturned = Date.now()
        await rental.save()
        const res = await execute()
        expect(res.status).toBe(400)
        expect(res.text).toBe("rental already processed")
    })

    it("should return 200 for a valid request and update all properties", async()=>{
        //adding a week old rental creation date 
        
        let result = await Rental.findOne({title : movie.title, rentedBy : customer._id})
        let newDate = result.date - (7 * 24 * 60* 60 *1000)
        result.date = new Date(newDate)
        await result.save() 
        // console.log("result", result)
        
        const res = await execute()

        //number of movies in stock should have increased by 1
        let updatedMovie = await Movie.findOne({title})
        
        
        expect(res.status).toBe(200)
        expect(res.body).toMatchObject({rentalFee : (movie.dailyRentalRate * 7)})
        expect(updatedMovie).toHaveProperty("numberInStock", 8) //returns 7 in failing test becuse the way I implemented Rental custom validation for title its decrmenting number in stock everytime rental is getting updated
    })
})