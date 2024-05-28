// const fs = require("fs");
// // import * as fs from "fs";

// fs.readdir("./", function (err, files) {
//   if (err) {
//     console.log("Error", err);
//   } else {
//     console.log("Result", files);
//   }
// });

// const Logger = require("./logger");
// const logger = new Logger();

// logger.on("messageLogged", (arg) => {
//   console.log("Listener called", arg);
// });

// logger.log("a new message");

const http = require("http");

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    console.log("request made");
    res.write("<h1>Hello </h1>");
    res.end();
  }
});

// server.on("connection", (socket) => {
//   console.log("on connect Event");
//   // console.log(`req : ${req}, coscket : ${socket}, head : ${head}`);
// });

server.listen(3000);

console.log("Listening on port 3000");
