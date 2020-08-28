const hostname = "localhost";
const port = 9020;

const express = require("express");
const app = express();

const init = require("./init.js");
init.start(express, app);

const route = require("./route.js");
app.use("/", route);

//404
app.use((request, response, next) => {
  response.status(404).send("404");
});

//500
app.use((error, request, response, next) => {
  console.error(error.stack);
  response.status(500).status("500");
});

//서버시작
app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});