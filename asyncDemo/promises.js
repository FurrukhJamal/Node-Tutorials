const p = new Promise(function (resolve, reject) {
  //kickoff some async work
  setTimeout(() => {
    resolve(1); //state of the promise goes from pending => resolved or fulfilled
    // reject(new Error("message"));
  }, 2000);
  //if result successful
  //   resolve(1);

  //if error
  // reject(new Error("message"))
});

//result would be value of 1 passed in resolve
p.then((result) => {
  console.log("result : ", result);
}).catch((err) => console.log("Error :", err.message));
console.log("test");
