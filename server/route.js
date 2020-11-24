const express = require("express");
const path = require("path");
const router = express.Router();
const fs = require("fs");
const cors = require("cors");

//페이지 이동
router.get("/assets", (request, response) => {
    if(wFunction.isGatewayReq(request)){
        fs.readFile(path.join(__dirname, "..", "src", "assets", "page", "index", "index.html"), "UTF-8", (err, text) => {
            response.send(text);
        });
    }else {
        response.send("");
    }
});

//html가져오기
router.get("/assets/getHtml", cors({origin: PUI.GATEWAY_URI}), (request, response) => {
    let html = request.query.html == "undefined" ? "MAIN" : request.query.html;    
    fs.readFile(path.join(__dirname, "..", "src", "assets", "page", UTIL.getPageCode(html) + ".html"), "UTF-8", (err, text) => {      
        response.send(text);
    });
});

//script 가져오기
router.get("/assets/getScript", cors({origin: PUI.GATEWAY_URI}), (request, response) => {
    let script = request.query.script == "undefined" ? "MAIN" : request.query.script;
    fs.readFile(path.join(__dirname, "..", "src", "assets", "page", UTIL.getPageCode(script) + ".js"), "UTF-8", (err, text) => {
        response.send(text);
    });
});

module.exports = router;