const lib = require("../lib");

describe("absolute Function tests", () => {
  test("should return positive number if input is +ve", () => {
    const result = lib.absolute(1);
    expect(result).toBe(1);
  });

  it("should return positive  number if input is -ve", () => {
    const result = lib.absolute(-1);
    expect(result).toBe(1);
  });

  test("should return 0 if input is 0", () => {
    const result = lib.absolute(0);
    expect(result).toBe(0);
  });
});

describe("greet", () => {
  it("should return a greeting message", () => {
    const result = lib.greet("Furrukh");
    // expect(result).toBe("Welcome Furrukh") not right
    expect(result).toMatch(/Furrukh/); //or toContain("Furrukh")
  });
});

describe("getCurrencies", () => {
  it("should return supported currencies", () => {
    const result = lib.getCurrencies();

    //too general
    expect(result).toBeDefined();
    expect(result).not.toBeNull();

    //Too specific
    expect(result[0]).toBe("USD");
    expect(result[1]).toBe("AUD");
    expect(result[2]).toBe("EUR");
    expect(result.length).toBe(3);

    //Proper way
    expect(result).toContain("USD");
    expect(result).toContain("AUD");
    expect(result).toContain("EUR");

    //ideal way
    expect(result).toEqual(expect.arrayContaining(["EUR", "USD", "AUD"]));
  });
});

describe("getProduct", () => {
  test("should return the product with the given id", () => {
    const result = lib.getProduct(1);
    // expect(result).toBe({id : 1, price : 10}) //test will fail cuz the two objects are at different locations in memory .toBe matcher matches the references of the two objects
    //for the object to check their properties we use toEqual
    expect(result).toEqual({ id: 1, price: 10 });
    //for objects having more properties but also contain these 2
    expect(result).toMatchObject({ id: 1, price: 10 });
    //another way to test objects
    expect(result).toHaveProperty("id", 1);
  });
});

describe("registerUser", () => {
  it("should throw if username is falsy", () => {
    /**falsy values in JS
     * Null
     * undefined
     * NaN
     * ""
     * 0
     * false
     */
    // when throwing exception the function would not return a result so this approch is not right
    //    const result = lib.registerUser(null)
    //    expect(result).toThrow()

    expect(() => {
      lib.registerUser(null);
    }).toThrow();

    const args = [null, undefined, NaN, "", 0, false];
    args.forEach((item) => {
      expect(() => {
        lib.registerUser(item);
      }).toThrow();
    });
  });

  it("should return a user object if valid username is passed", () => {
    const result = lib.registerUser("fj");
    expect(result).toMatchObject({ username: "fj" });
    expect(result.id).toBeGreaterThan(0);
  });
});

const db = require("../db");
describe("applyDiscount", () => {
  it("should apply 10% discount if customer has more than 10 points", () => {
    //creating a Mock function
    db.getCustomerSync = function (customerid) {
      console.log("Reading from a mock function db...");
      return { id: customerid, points: 11 };
    };

    order = { customerId: 1, totalPrice: 10 };
    lib.applyDiscount(order);
    expect(order.totalPrice).toBe(9);
  });
});

const mail = require("../mail");
describe("notifyCustomer", () => {
  it("should send an email to the customer", () => {
    // //jest way of creating mock functions
    // const mockFunction = jest.fn()
    // //setting the mockfunction to return 1
    // // mockFunction.mockReturnValue(1)

    // //setting a mock to return a promise
    // mockFunction.mockResolveValue(1)
    // const result = await mockFunction()

    // // if you want to simulate an error
    // mockFunction.mockRejectedValue(new Error("..."))
    // //you add this in a try catch and in catch block the given error should be there
    // const result2 = await mockFunction()
    // //END jest mocks

    db.getCustomerSync = function (customerId) {
      return { email: "a" };
    };

    let mailSent = false;
    mail.send = function (email, message) {
      mailSent = true;
    };

    lib.notifyCustomer({ customerid: 1 });
    expect(mailSent).toBe(true);
  });
});

describe("notifyCustomer using jest", () => {
  it("should send an email to the customer", () => {
    db.getCustomerSync = jest.fn().mockReturnValue({ email: "a" });
    mail.send = jest.fn();

    lib.notifyCustomer({ customerid: 1 });
    expect(mail.send).toHaveBeenCalled(); //for with arguments toHaveBeenCalledWith()
    //first call's 1st and second argument
    expect(mail.send.mock.calls[0][0]).toBe("a");
    expect(mail.send.mock.calls[0][1]).toMatch(/order/);
  });
});
