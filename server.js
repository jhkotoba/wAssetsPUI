const hostname = "localhost";
const port = 9020;

const express = require("express");
const app = express();

const init = require("./server/init.js");
init.start(express, app);

const route = require("./server/route.js");
app.use("/", route);

//404
app.use((request, response, next) => {
  response.status(404).send("Assets PC 404");
});

//500
app.use((error, request, response, next) => {
  response.status(500).status("500");
});

//서버시작
app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});