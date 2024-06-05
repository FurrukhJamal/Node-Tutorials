// Using References (Normalization)
let author = {
  name: "FJ",
};

let course = {
  author: "id",
  authors: ["id1", "id2"],
};

//using Embedded Documents (Denormalization)

let course = {
  author: {
    name: "FJ",
  },
};

//hybrid approach
let author = {
  name: "FJ",
  // 50 other properties
};

let course = {
  author: {
    id: "ref",
    name: "fj",
  },
};
