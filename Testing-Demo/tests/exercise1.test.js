const exercise1 = require("../exercise1");

describe("exercise", () => {
  test("should throw an exception if input is not a number", () => {
    expect(() => {
      exercise1.fizzBuzz("hello").toThrow();
      exercise1.fizzBuzz(null).toThrow();
      exercise1.fizzBuzz(undefined).toThrow();
      exercise1.fizzBuzz({}).toThrow();
    });
  });

  it("should return 'FizzBuzz' on input that is divisible by 3 and 5", () => {
    const result = exercise1.fizzBuzz(15);
    expect(result).toBe("FizzBuzz");
  });

  it("should return 'Fizz' on input that is divisible by 3", () => {
    const result = exercise1.fizzBuzz(12);
    expect(result).toBe("Fizz");
  });

  it("should return 'Buzz' on input that is divisible by 5", () => {
    const result = exercise1.fizzBuzz(25);
    expect(result).toBe("Buzz");
  });

  it("should return the number if not divisible by 3 0r 5", () => {
    const input = 2;
    const result = exercise1.fizzBuzz(input);
    expect(result).toBe(input);
  });
});
