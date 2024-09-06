module.exports.getCustomerSync = function (id) {
  console.log("Reading a customer from db");
  return { id: id, points: 11 };
};

module.exports.getCustomer = async function (id) {
  return new Promise((resolve, reject) => {
    console.log("Reading a customer from db...");
    resolve({ id: id, points: 11 });
  });
};
