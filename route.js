const express = require("express");
const path = require("path");
const router = express.Router();
const fs = require("fs");
const cors = require("cors");

//페이지 이동
router.get("/wAssets", (request, response) => {
    if(wFunction.isGatewayReq(request)){
        fs.readFile(path.join(__dirname, "src", "page", "wAssets", "wAssets.html"), "UTF-8", (err, text) => {
            response.send(convert(text));
        });
    }else{
        response.send("");
    }
});

//html가져오기
router.get("/wAssets/getHtml", cors({origin:"http://127.0.0.1:9000"}), (request, response) => {
    let html = request.query.html == "undefined" ? "MAIN" : request.query.html;    
    fs.readFile(path.join(__dirname, "src", "page", getMenuCode(html) + ".html"), "UTF-8", (err, text) => {      
        response.send(convert(text));
    });
});

//script 가져오기
router.get("/wAssets/getScript", cors({origin:"http://127.0.0.1:9000"}), (request, response) => {
    let script = request.query.script == "undefined" ? "MAIN" : request.query.script;
    fs.readFile(path.join(__dirname, "src", "page", getMenuCode(script) + ".js"), "UTF-8", (err, text) => {
        response.send(convert(text));
    });
});

function convert(text){
    if(text == null || text == undefined){
        return "";
    }else{
        return text.replace(/{contextPath}/gi, "http://127.0.0.1:9020");
    }
}

function getMenuCode(menuCd){
    if(menuCd === "MAIN" || menuCd === null || menuCd === undefined || menuCd === ""){
        return "/main/main";
    }else{
        return wAssets.menuCd[menuCd].pagePath;
    }
}

module.exports = router;