// using a call back
console.log("Before");
let user = getUser(1, function (user) {
  console.log("user: ", user);
});
console.log("after");

function getUser(id, callback) {
  setTimeout(() => {
    console.log("Db call..");
    callback({ id: id, user: "FJ" });
  }, 2000);
}

//Promises

function getUserP(id, timeOut = 2000, message = "") {
  const p = new Promise(function (resolve, reject) {
    setTimeout(() => {
      console.log(`Async call number ${message}`);
      resolve({ id: id, user: "FJ" });
    }, timeOut);
  });

  return p;
}

console.log("staring promise implementation");

let u = getUserP(2, 5000, 1);
u.then((user) => {
  console.log("new user:", user);
});

console.log("another promise");

getUserP(3, 2000, 2).then((user) => console.log("third user : ", user));

// async await
(async () => {
  let userAsync = await getUserP(4, 2000, 3);
  console.log("forth user : ", userAsync);
})();
