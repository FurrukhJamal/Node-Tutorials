const winston = require("winston")
const path = require("path")

const filePath = path.join(__dirname, "../logs/logfile.log") 
const filePath2 = path.join(__dirname, "../logs/combined.log")
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.File({ filename: filePath , level: 'error' }),
        new winston.transports.File({ filename:  filePath2}),
        new winston.transports.Console({colorize : true, prettyPrint : true})
    ],
});

// Add a console log to confirm initialization
// console.log("Logger initialized with transports: ", logger.transports);
// console.log("__dirname:" , __dirname)

// Listen for errors on the File transport
logger.transports.forEach((transport) => {
    transport.on('error', (err) => {
      console.error("Transport error:", err);
    });
  });

module.exports = logger
