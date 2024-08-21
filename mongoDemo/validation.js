const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/validation-tutorial")
  .then(() => console.log("connected to DB"))
  .catch((err) => console.log("something Went wrong", err));

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255,
    // match : /pattern/
  },
  category: {
    type: String,
    enum: ["web", "mobile", "network"],
    required: true,
    lowercase: true,
    trim: true,
  },
  author: String,
  // tags: [String],
  //custom validator, tags should have atleast one value
  // tags: {
  //   type: Array,
  //   validate: {
  //     validator: function (v) {
  //       return v && v.length > 0;
  //     },
  //     message: "The course should atleast have one tag",
  //   },
  // },

  tags: {
    type: Array,
    validate: {
      isAsync: true,
      validator: function (v) {
        //it expects a promise to be returned
        return new Promise((resolve) => {
          //do some async work
          setTimeout(() => {
            const result = v && v.length > 0;
            resolve(result);
          }, 4000);
        });
      },
      message: "The course should atleast have one tag",
    },
  },

  date: { type: Date, default: Date.now },
  isPublished: Boolean,
  price: {
    //only required if the course is published
    type: Number,
    required: function () {
      return this.isPublished;
    },
    min: 2,
    max: 200,
    // get : (v)=> Math.round(v)
    set: (v) => Math.round(v),
  },
});

const Course = mongoose.model("Course", courseSchema);

async function createCourse() {
  const course = new Course({
    name: "How to Fail",
    category: "WEB",
    author: "FJ",
    tags: ["frontend"],
    isPublished: true,
    price: 15.7,
  });

  try {
    let result = await course.save();
    console.log("result : ", result);
  } catch (ex) {
    // console.log(ex.message);

    for (field in ex.errors) console.log(ex.errors[field].message);
  } finally {
    mongoose.connection.close();
  }
}

createCourse();
