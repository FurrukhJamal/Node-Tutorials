const config = require("config")
const logger = require("../startup/logger")
const morgan = require("morgan");

module.exports = function(app){
    if(!config.get("jwtPrivateKey")){
        // console.error("FATAL ERROR : jwtPrivateKey is not defined")
        //instead of consoling it let the uncaught error configuration on process in logging.js catch this and logs it
        // logger.error("FATAL ERROR : jwtPrivateKey is not defined")
        throw new Error("FATAL ERROR : jwtPrivateKey is not defined")
        process.exit(1)
    }

    if (app.get("env") === "development") {
        app.use(morgan("tiny"));
    }
}