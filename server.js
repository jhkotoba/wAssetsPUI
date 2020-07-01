const hostname = '127.0.0.1';
const port = 3000;



//const compression = require("compression");
//const cors = require("cors");
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



// const express = require('express');
// const path = require('path');
// const app = express();

// const hostname = '127.0.0.1';
// const port = 3000;

// app.use(express.static(path.join(__dirname, "html")));
// app.get("/", (request, response) => {
//   response.sendFile(path.join(__dirname, "page", "main", "main.html"));
// });

//서버시작
// app.listen(port, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });

//===========================================================

// const http = require('http');
// const url = require('url');
// const fs = require('fs');
// const express = require('express');
// const hostname = '127.0.0.1';
// const port = 3000;

// //서버생성
// const server = http.createServer((request, response) => {

//   //url에서 path 추출
//   const path = url.parse(request.url, true).pathname;

//   response.writeHead(200, {'Content-Type':'text/html'});
//   fs.readFile(__dirname + '/page/main/main.html', (err, data) => {
//     if (err) {
//       return console.error(err);
//     }
//     response.end(data, 'utf-8');
//   });

//   // response.statusCode = 200;
//   // response.setHeader('Content-Type', 'text/plain');
//   // response.end('Hello World');
// });

// //서버시작
// server.listen(port, hostname, () => {
//      console.log(`Server running at http://${hostname}:${port}/`);
//      console.log('웹 서버가 시작되었습니다.');
// });

// //클라이언트 접속
// server.on('connection', function(socket){
//     var addr = socket.address();
//     console.log('클라이언트가 접속했습니다. :', addr.address, addr.port);
// });

// server.on('request', function(req, res){
//     console.log('클라이언트 요청이 들어왔습니다.');
//     //console.dir(req);
// });

// server.on('close', function(){
//     console.log('서버가 종료됩니다.');
// });