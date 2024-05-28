//creating a promise that is already resolved
const p = Promise.resolve({ id: 1 });

p.then((result) => console.log(result));

//promise that is already rejected
const P = Promise.reject(new Error("rejected promise"));

P.catch((err) => console.log(err));

//if you wanna run two async process then display results when both of them are finished

const p1 = new Promise(function (resolve) {
  setTimeout(() => {
    console.log("async operation 1");
    resolve(1);
  }, 2000);
});

const p2 = new Promise(function (resolve) {
  setTimeout(() => {
    console.log("async operation 2");
    resolve(2);
  }, 5000);
});

//takes array of promises
Promise.all([p1, p2]).then((result) => {
  console.log(result);
});

//if you want the outer Promise to be fulfilled as soon as anyone of p1, p2 are finished
Promise.race([p1, p2]).then((result) => {
  console.log(result);
});
