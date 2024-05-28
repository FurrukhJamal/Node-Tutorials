function another(req, res, next) {
  console.log("another middleware at work");
  next();
}

// module.exports = another;
export default another;
