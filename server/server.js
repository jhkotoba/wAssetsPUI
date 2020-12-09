const hostname = "localhost";
const port = 9020;

const express = require("express");
const app = express();

//설정 스크립트
require("./config.js");

//정적 리소스 임포트
PUI.FS.readdirSync("./src", { withFileTypes: true }).forEach(item => {            
  if(item.isDirectory()){               
      app.use("/"+item.name, express.static(PUI.UTL.getViewPath()  + '\\src\\' +item.name));
  }
});

//쿠키설정
const cookieParser = require('cookie-parser');
app.use(cookieParser());

//루터설정
const route = require("./route.js");
app.use("/", route);

//404
app.use((request, response, next) => {
  response.status(404).send("Assets PC 404");
});

//500
app.use((error, request, response, next) => {
  response.status(500).status("Assets PC 500");
});

//서버시작
app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});