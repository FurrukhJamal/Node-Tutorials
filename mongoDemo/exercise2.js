const mongoose = require("mongoose");
const exercise1 = require("./exercise1");

mongoose
  .connect("mongodb://localhost/mongo-exercises")
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log("could not conect to db", err));

const Course = mongoose.model("Course", exercise1.coursesSchema);

(async () => {
  try {
    let courses = await Course.find({ isPublished: true })
      .or([{ tags: "frontend" }, { tags: "backend" }])
      .sort({ price: -1 })
      .select({ name: 1, author: 1, price: 1 });

    console.log("exercise 2 courses :", courses);
  } catch (error) {
    console.error("Something went wrong", error);
  } finally {
    mongoose.connection.close();
  }
})();
