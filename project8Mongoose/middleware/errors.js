const winston = require("winston")

module.exports = function(err, req, res, next){
    //log the exception 
    // winston.log() //first arg the logging level
    //error
    //warn/
    //info
    //verbose
    //debug
    //silly
    const logger = winston.createLogger({
        level: 'info',
        format: winston.format.json(),
        defaultMeta: { service: 'user-service' },
        transports: [
          new winston.transports.File({ filename: 'logfile.log', level: 'error' }),
          
        ],
      });
      
    logger.error(err.message, err ) //ypu can remove err as second arg
    res.status(500).send("Something went wrong")
  }