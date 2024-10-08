const EventEmitter = require("events");
const emitter = new EventEmitter();

//registering a listener
emitter.on("testingEvents", ({ id, name }) => {
  console.log(`the id passed in : ${id}, name : ${name}`);
});

//raising an event
emitter.emit("testingEvents", { id: 42, name: "futtay" });

emitter.on("logging", (arg) => {
  console.log(`logging event hit, data : ${arg.data}`);
});

emitter.emit("logging", { data: "hello world" });
