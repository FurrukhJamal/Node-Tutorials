const lib = require("../lib")

describe("absolute Function tests" , ()=>{
    test("should return positive number if input is +ve", ()=>{
        const result = lib.absolute(1)
        expect(result).toBe(1)
    })
    
    it("should return positive  number if input is -ve", ()=>{
        const result = lib.absolute(-1)
        expect(result).toBe(1)
    })
    
    test("should return 0 if input is 0", ()=>{
        const result = lib.absolute(0)
        expect(result).toBe(0)
    })
})

describe("greet" , ()=>{
    it("should return a greeting message", ()=>{
        const result = lib.greet("Furrukh")
        // expect(result).toBe("Welcome Furrukh") not right 
        expect(result).toMatch(/Furrukh/) //or toContain("Furrukh")
    })
})

describe("getCurrencies" , ()=>{
    it("should return supported currencies", ()=>{
        const result = lib.getCurrencies()

        //too general
        expect(result).toBeDefined()
        expect(result).not.toBeNull()

        //Too specific
        expect(result[0]).toBe("USD")
        expect(result[1]).toBe("AUD")
        expect(result[2]).toBe("EUR")
        expect(result.length).toBe(3)

        //Proper way
        expect(result).toContain("USD")
        expect(result).toContain("AUD")
        expect(result).toContain("EUR")

        //ideal way 
        expect(result).toEqual(expect.arrayContaining(["EUR", "USD", "AUD"]))
    })
})

describe("getProduct" , ()=>{
    test("should return the product with the given id" , ()=>{
        const result = lib.getProduct(1)
        // expect(result).toBe({id : 1, price : 10}) //test will fail cuz the two objects are at different locations in memory .toBe matcher matches the references of the two objects 
        //for the object to check their properties we use toEqual 
        expect(result).toEqual({id : 1, price : 10})
        //for objects having more properties but also contain these 2
        expect(result).toMatchObject({id : 1, price : 10})
        //another way to test objects
        expect(result).toHaveProperty("id", 1)

    })
})