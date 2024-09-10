const logger = require("./startup/logger");
require("./startup/logging")(logger)
require("express-async-errors")
const express = require("express");
const app = express();
require("./startup/routes")(app)
require("./startup/db")()
require("./startup/config")(app)



// // Test logging to see if the file gets created
//logger.error("This is a test error message to check file creation.");

// if(!config.get("jwtPrivateKey")){
//   console.error("FATAL ERROR : jwtPrivateKey is not defined")
//   process.exit(1)
// }


console.log("DEBUG envoirment variable is ", process.env.DEBUG);

// if (app.get("env") === "development") {
//   app.use(morgan("tiny"));
// }


const port = process.env.PORT || 3000;
let server = app.listen(port, () => console.log(`Listening on port ${port}`));

// const port = process.env.PORT || 3000;
// app.listen(port, () => logger.info(`Listening on port ${port}`));

module.exports = server
