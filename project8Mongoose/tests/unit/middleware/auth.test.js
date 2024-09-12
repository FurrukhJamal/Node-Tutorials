const { default: mongoose } = require("mongoose")
const auth = require("../../../middleware/auth")
const {User} = require("../../../models/user")

describe("auth middleware", ()=>{
    // afterAll(async()=>{
    //     await mongoose.connection.close()
    //   })
    
    it("should populate req.user with payload of a valid jwt token", ()=>{
        const user = {
            _id : new mongoose.Types.ObjectId().toHexString(), 
            isAdmin : true
        }
        
        const token = new User(user).generateAuthToken()
        const req = {
            header : jest.fn().mockReturnValue(token)
        }

        const next = jest.fn()
        const res = {}
        auth(req, res, next)
        expect(req.user).toBeDefined()
        expect(req.user).toMatchObject(user)
    })
})