const mongoose = require("mongoose");
//for transaction like behaviour install fawn
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
  authors: [authorsSchema],
});

const Author = mongoose.model("Author", authorsSchema);
const Course = mongoose.model("Course", courseSchema);

async function createCourse(name, authors) {
  let course = new Course({
    name,
    authors,
  });
  let result = await course.save();
  console.log("course created", result);
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
  const courses = await Course.find().populate("author").select("name author");

  //to get properties of author provide them as second argument to populate,
  //   and if u want to exclude them append name with - like
  // const courses = await Course.find().populate("author", "name -_id").select("name author");

  console.log(courses);
}

async function updateAuthor(courseId) {
  const course = await Course.updateOne(
    { _id: courseId },
    {
      $set: {
        "author.name": "Updated Name", //to remove use $unset and set it to empty array
      },
    }
  );
  //   await course.save();
}

//TO UPDATE authors array in course
async function addAuthor(courseId, author) {
  let course = await Course.findById(courseId);
  course.authors.push(author);
  await course.save();
}

async function removeAuthor(courseId, authorId) {
  const course = await Course.findById(courseId);
  const author = course.authors.id(authorId);
  author.deleteOne();
  course.save();
}

// createCourse("new Node Course", [
//   new Author({ name: "FJ" }),
//   new Author({ name: "jHON" }),
// ]);
// updateAuthor("665c87892ae3ffeab2305e0c");

// addAuthor("665c93395db236306e958161", new Author({ name: "FurrukhJAmal" }));

removeAuthor("665c93395db236306e958161", "665c93395db236306e958160");
