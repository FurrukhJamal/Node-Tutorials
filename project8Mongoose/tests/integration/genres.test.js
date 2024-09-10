const request = require("supertest")
let server;
const {Genre} = require("../../models/genre");
const mongoose = require("mongoose");
const {User} = require("../../models/user");
const { delay } = require("lodash");

describe("/api/genres", ()=>{
    beforeEach(()=>{
        server = require("../../index")
    })
    afterEach(async()=>{
        //server.close()
        await new Promise((resolve)=>server.close(resolve))
        await Genre.deleteMany({})
    })

    afterAll(async () => {
        await mongoose.connection.close();  // Close mongoose connection after all tests
    });

    describe("GET /", ()=>{
        test("it should return all genres", async()=>{
            /**Bug fix */
            const test = delay(()=>{}, 2000)
            test.close()
            /**END */
            
            await Genre.collection.insertMany([
                {name : "genre1"},
                {name : "genre2"}
            ])
            
            const res = await request(server).get("/api/genres")
            expect(res.status).toBe(200)
            expect(res.body.length).toBe(2)

            expect(res.body.some((genre)=>genre.name === "genre1")).toBeTruthy()
            expect(res.body.some((genre)=>genre.name === "genre2")).toBeTruthy()

            
        }) 
    })

    describe("GET /:id", ()=>{
        it("should return a 404 for a invalid id", async()=>{
            await Genre.collection.insertMany([{name : "horrorGenre"}])
            const res = await request(server).get(`/api/genres/1234`)
            expect(res.status).toBe(404)
            expect(res.text).toContain("invalid id")
        })

        it("should return a 404 for a genre id not in the db", async()=>{
            await Genre.collection.insertMany([{name : "horrorGenre"}])
            const res = await request(server).get(`/api/genres/${new mongoose.Types.ObjectId()}`)
            expect(res.status).toBe(404)
            expect(res.text).toContain("No such id of genre")
        })
        
        it("should return a genre if a valid id is passed", async()=>{
            const genre = new Genre({name : "genre1"})
            await genre.save()

            const res = await request(server).get("/api/genres/" + genre._id)

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty("name", genre.name)
        })
    })
    
    describe("POST /", ()=>{
        /**Reafactoring : Define the happy path, and then in each test,
         * we change one parameter that clearly aligns with the name of the test
         */
        let token;
        let name;
        const execute = async()=>{
            return await request(server)
                .post("/api/genres")
                .set("x-auth-token", token)
                .send({name : name})
        }

        beforeEach(()=>{
            token = new User().generateAuthToken()
            name = "genre1"    
        })

        it("should return a 401 when client is not logged in", async()=>{
            // const res = await request(server).post("/api/genres").send({name : "genre1"})
            token = ""
            const res = await execute()
            expect(res.status).toBe(401)
        })

        it("should return a 400 if genre is invalid less than 3 char and user is logged in", async()=>{
            // const token = new User().generateAuthToken()
            
            // const res = await request(server)
            //     .post("/api/genres")
            //     .set("x-auth-token", token)
            //     .send({name : "12"})

            name = "12"
            const res = await execute()
            expect(res.status).toBe(400)
        })

        it("should return a 400 if genre is more than 255 char and user is logged in", async()=>{
            // const token = new User().generateAuthToken()
            // let name = new Array(257).join("a")
            // const res = await request(server)
            //     .post("/api/genres")
            //     .set("x-auth-token", token)
            //     .send({name : name})
            
            name = new Array(257).join("a")
            const res = await execute()

            expect(res.status).toBe(400)
        })

        it("should save the genre in db if its valid", async()=>{
            // const token = new User().generateAuthToken()
            // const res = await request(server)
            //     .post("/api/genres")
            //     .set("x-auth-token", token)
            //     .send({name : "genre1"})
            
            await execute()
            let genre = await Genre.find({name : "genre1"})
            
            expect(genre).not.toBeNull()
            
        })

        it("should return the genre if its valid", async()=>{
            // const token = new User().generateAuthToken()
            // const res = await request(server)
            //     .post("/api/genres")
            //     .set("x-auth-token", token)
            //     .send({name : "genre1"})

            const res = await execute()
            
            expect(res.body).toMatchObject({name : "genre1"})
            expect(res.body).toHaveProperty("_id")
            
        })


    })
    
    describe("DELETE /:id", ()=>{
        let user;
        let token;
        let genre;
        let id;
        
        beforeEach(async()=>{
            const userPayload = {name : "user1", isAdmin : false}
            user = new User(userPayload)
            // await user.save()
            
            token = user.generateAuthToken()
            genre = new Genre({name : "genre1"})
            await genre.save()
            id = genre.id
        })

        afterEach(async()=>{
            await User.deleteMany({})
            await Genre.deleteMany({})
        })
        
        const execute = ()=>{
            return  request(server)
                .delete("/api/genres/" + id)
                .set("x-auth-token", token)
                
        }
        
        it("should return a 403 if the user is authenticated but not authorized", async()=>{
            const res = await execute()
            expect(res.status).toBe(403)

        })

        it("should return a 404 if user is authenticated and authorized but invalid genre id", async()=>{
            user.isAdmin = true
            token = user.generateAuthToken()
            id = new mongoose.Types.ObjectId()

            const res = await execute()
            expect(res.status).toBe(404)
        })
    })
})