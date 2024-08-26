const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost/playground")
  .then(() => console.log("Connected to db"))
  .catch((err) => console.log("could not connect to db ", db));

const authorsSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String,
});

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Author",
  },
});

const Author = mongoose.model("Author", authorsSchema);
const Course = mongoose.model("Course", courseSchema);

async function createCourse(name, author) {
  let course = new Course({
    name,
    author,
  });
  let result = await course.save();
  console.log("course created", result._id);
}

async function createAuthor(name, bio, website) {
  let author = new Author({
    name,
    bio,
    website,
  });

  let result = await author.save();
  console.log("author created", result);
}

async function listCourses() {
  const courses = await Course.find().populate("author", "name -_id").select("name author");

  //to get properties of author provide them as second argument to populate,
  //   and if u want to exclude them append name with - like
  // const courses = await Course.find().populate("author", "name -_id").select("name author");

  console.log(courses);
}

(async () => {
    // createAuthor("Furrukh", "my bio", "www.website");

    // createCourse("Node Course", "66cc7de1f8d6b2480ebbd2aa");

  listCourses();
})();
