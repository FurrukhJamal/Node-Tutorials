const os = require("os");

let totalMemory = os.totalmem();
let freeMemory = os.freemem();

console.log(`total memory : ${totalMemory}`);
console.log(`free memory : ${freeMemory}`);
