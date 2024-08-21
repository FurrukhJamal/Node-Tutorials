const mongoose = require("mongoose");
const exercise1 = require("./exercise1");

mongoose
  .connect("mongodb://localhost/mongo-exercises")
  .then(() => console.log("Connected to db"))
  .catch((err) => console.log("could not connect to db", err));

const Course = mongoose.model("Course", exercise1.coursesSchema);
(async () => {
  try {
    let courses = await Course.find({
      $expr: { $gte: [{ $toDouble: "$price" }, 15] },
    })
      .and({ name: /.*learning.*/i })
      .select("name author price");
    console.log("courses $15 or more having 'by' : ", courses);
  } catch (error) {
    console.error("Something went wrong", error);
  } finally {
    mongoose.connection.close();
  }
})();
