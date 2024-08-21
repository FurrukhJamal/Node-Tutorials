const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/mongo-exercises")
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log("could not conect to db", err));

const coursesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  tags: [String],
  date: {
    type: Date,
    default: Date.now,
  },
  isPublished: Boolean,
  author: String,
  price: String,
});

const Course = mongoose.model("Course", coursesSchema);
// let test = {};
//to stop getting this run when this file is imported by another file
if (require.main == module) {
  //trying an outer EIFE to check functionality if inner function has a return
  (async () => {
    let test = await (async () => {
      try {
        let courses = await Course.find({ isPublished: true })
          .sort({ name: 1 })
          .select({ name: 1, author: 1 });
        return courses;
        //console.log("the published courses are : ", courses);
      } catch (error) {
        console.error("Something went wrong", error);
      } finally {
        mongoose.connection.close();
      }
    })();
    console.log("test : ", test);
  })();

  console.log("WORKING");
}

module.exports.coursesSchema = coursesSchema;
