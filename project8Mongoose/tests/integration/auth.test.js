const request = require("supertest")
const {User} = require("../../models/user")
const mongoose = require("mongoose")
const {Genre} = require("../../models/genre")

describe("Auth Middleware", ()=>{
    let server; 
    let token;
    
    beforeEach(async()=>{
        server = require("../../index")
        token = new User().generateAuthToken()
        //Bug fix in tests
        // await Genre.deleteMany({});
    })

    afterEach(async()=>{
        await Genre.deleteMany({})
        await server.close()
        // await new Promise((resolve)=>server.close(resolve))
        
        
    })

    // afterEach(async () => {
    //     await new Promise((resolve) => server.close(resolve)); // Ensure server is fully closed
    //     await Genre.deleteMany({});
    // });

    afterAll(async () => {
        await mongoose.connection.close();  // Close mongoose connection after all tests
    });

    const execute = async()=>{
        return request(server).post("/api/genres").set("x-auth-token", token).send({name : "genre1"})
    }

    it("should eturn a 401 if genre is valid but token is not set", async()=>{
        token = ""
        const res = await execute()
        expect(res.status).toBe(401) 
    })

    it("should return a 400 if token is invalid", async()=>{
        token = "1234"
        const res = await execute()
        expect(res.status).toBe(400)
    })

    it("should have a 200 if valid token is provided", async()=>{
        const res = await execute()
        expect(res.status).toBe(200)     
    })
})