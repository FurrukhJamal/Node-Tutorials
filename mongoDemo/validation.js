const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/validation-tutorial")
  .then(() => console.log("connected to DB"))
  .catch((err) => console.log("something Went wrong", err));

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  author: String,
  tags: [String],
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
  price: Number,
});

const Course = mongoose.model("Course", courseSchema);

async function createCourse() {
  const course = new Course({
    // name: "How to Fail",
    author: "FJ",
    tags: ["frontend", "backend"],
    isPublished: true,
    price: 15,
  });

  try {
    let result = await course.save();
    console.log(result);
  } catch (ex) {
    console.log(ex.message);
  }
}

createCourse();

mongoose.connection.close();
