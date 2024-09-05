// const logger = require("../startup/logger")

module.exports = function (logger){
    /**For catching uncaught exception that are to the part of request pipeline */
process.on("uncaughtException", (ex)=>{
    console.log("UNCAUGHT EXCEPTION")
    logger.error( ex.message, ex)
      //best practice is top stop the process and restart it using process managers
    // process.exit(1)

    // Wait for logging to finish before exiting
    // logger.on('finish', () => process.exit(1));
    // logger.end();  // End the stream to trigger 'finish'

    // Allow time for logging to complete before exiting
    // setImmediate(() => process.exit(1));

    // on immediately exiting the process logs were no getting written to the file hence this fix
    setTimeout(() => {
        console.log("Logging completed");
        process.exit(1);
    }, 1000);
  })
  
  // throw new Error("Something went wrong in startup")
  /**END catching uncaught exception */
  
  /**Unhandled promise rejections */
  process.on("unhandledRejection", (ex)=>{
    console.log("WE GOT an UNhandled Rejection")
    logger.error( ex.message, ex)
    console.log("error logged in to the file")
    //best practice is top stop the process and restart it using process managers
    // process.exit(1)

    // Wait for logging to finish before exiting
    // logger.on('finish', () => process.exit(1));
    // logger.end();  // End the stream to trigger 'finish'

    // Allow time for logging to complete before exiting
    // setImmediate(() => process.exit(1));

    // on immediately exiting the process logs were no getting written to the file hence this fix
    setTimeout(() => {
        console.log("Logging completed");
        process.exit(1);
    }, 1000);

  })
  
//   const p = Promise.reject(new Error("Async promise rejection"))
//   p.then(()=>console.log("Done"))
  /**END Unhandled promise rejections */
  
}