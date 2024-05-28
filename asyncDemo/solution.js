// getCustomer(1, (customer) => {
//   console.log("Customer : ", customer);
//   if (customer.isGold) {
//     getTopMovies((movies) => {
//       console.log("Top Movies : ", movies);
//       sendEmail(customer.email, movies, () => {
//         console.log("Email sent...");
//       });
//     });
//   }
// });

function getCustomer(id) {
  const p = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        id: 1,
        name: "fj",
        isGold: true,
        email: "email",
      });
    }, 4000);
  });

  return p;
}

function getTopMovies() {
  const p = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(["movie1", "movie2"]);
    }, 4000);
  });
  return p;
}

function sendEmail(email, movies) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("email send custom");
    }, 4000);
  });
}

(async () => {
  let customer = await getCustomer(1);
  console.log("customer : ", customer);
  if (customer.isGold) {
    let movies = await getTopMovies();
    console.log("Top Movies : ", movies);
    let result = await sendEmail(customer.email, movies);
    console.log(result);
  }
})();
