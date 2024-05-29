const mongoose = require("mongoose");
//connect to db
mongoose
  .connect("mongodb://localhost/playground")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("could not connect to the server", err));

//Document schema
const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  data: { type: Date, default: Date.now },
  isPublished: Boolean,
});

//returns a class
const Course = mongoose.model("Course", courseSchema);

(async () => {
  //creating an object of the model class above
  let course = new Course({
    name: "Angular Course",
    author: "FJ",
    tags: ["angular", "frontend"],
    isPublished: true,
  });

  let result = await course.save();
  console.log(result);

  //course 2
  course = new Course({
    name: "Nodejs Course",
    author: "someoneElse",
    tags: ["node", "backend"],
    isPublished: true,
  });

  result = await course.save();
  console.log(result);
})();

(async () => {
  /**Mongoose or mongo db operator
   * eq (equal)
   * ne (not equal)
   * gt (greater than)
   * gte (greater than or equal to)
   * lt (less than)
   * lte (less than or equal to)
   * in
   * nin(not in)
   * if courses had a price one could call the find method like
   * .find({price : {$gt : 10}})
   * for inbetween a range
   * .find({price : {$gt : 10}, $lte : 20})
   * for fixed three price points
   * .find({price : {$in : [10,15, 20]}})
   */

  /**The logical operator are or, and
   * if we want to find courses that are authored by FJ or are just published
   * .find().or([{name : "FJ"}, {isPublished : true}])
   * similarly the and method is quite similar you pass an array to .and
   * method with objects of filter
   * .find.and([{name : "FJ"}, {isPublished : false}])
   */

  let courses = await Course.find();
  console.log("all courses", courses);

  //applying a filter
  let course = await Course.find({ author: "FJ" })
    .limit(2)
    .sort({ name: 1 }) //sort by name in ascending order, if value is -1 the order is descending
    .select({ name: 1, tags: 1 }); // return only these properties
  console.log("courses by FJ ", course);

  //to get the count of documents fetched by query
  let count = await Course.find().count();
  console.log("Number of documents are ", count);
})();

//updating a document
(async () => {
  console.log("updating of a document starting");
  //got the id from mongocompass
  let id = "66574d6af1a8c9ca682730c0";
  let course = await Course.findById(id);

  if (!course) {
    console.log("hitting the return part");
    return;
  }
  // course.author = "SOME DUDE"
  course.set({
    author: "SOME RANDOM DUDE Updaated",
  });

  let result = await course.save();
  console.log("course updated : ", result);
})();

//updating a document by a mongo db update operator
(async () => {
  let id = "66574da2fd5eacd07032fbf9";
  let result = await Course.updateOne(
    { _id: id },
    {
      $set: {
        name: "NEW NAME UPDATED",
      },
    }
  );
  console.log("updated course via update operator : ", result);
})();

// removing a document
(async () => {
  let id = "66574da2fd5eacd07032fbf9";
  let result = await Course.deleteOne({ _id: id });
  console.log("deleted : ", result);
})();
