const express = require("express");
const path = require("path");
const router = express.Router();
const fs = require("fs");

//페이지 이동
router.get("/assets", async (request, response) => {
    if(PUI.UTL.isGatewayReq(request) && await PUI.REQ.isSession(request)){
        fs.readFile(
            path.join(
                __dirname,
                "..",
                "src",
                "assets",
                "page",
                "index",
                "index.html"
            ), "UTF-8", (err, text) => response.send(text)
        );
    }else{
        response.redirect(PUI.GV.GATEWAY_URI + "/member/login?rtnUrl?rtnUrl="+ PUI.GV.GATEWAY_URI + "/assets");
    }
});

//페이지 이동 (pattern1)
router.get("/assets/:pattern1", async (request, response) => {
    if(PUI.UTL.isGatewayReq(request) && await PUI.REQ.isSession(request)){
        fs.readFile(
            path.join(
                __dirname,
                "..",
                "src",
                "assets",
                "page",
                request.params.pattern1,
                request.params.pattern1 + ".html"
            ), "UTF-8", (err, text) => {
                if(PUI.UTL.isNotEmpty(err) || PUI.UTL.isEmpty(text)){
                    response.redirect("/assets");
                }else{
                    response.send(text);
                }
            }
        );
    }else {
        response.redirect(PUI.GV.GATEWAY_URI + "/member/login?rtnUrl?rtnUrl="+ PUI.GV.GATEWAY_URI + "/assets");
    }
});

//페이지 이동 (pattern2)
router.get("/assets/:pattern1/:pattern2", async (request, response) => {
    if(PUI.UTL.isGatewayReq(request) && await PUI.REQ.isSession(request)){
        fs.readFile(
            path.join(
                __dirname,
                "..",
                "src",
                "assets",
                "page",
                request.params.pattern1,
                request.params.pattern2,
                request.params.pattern2 + ".html"
            ), "UTF-8", (err, text) => {
                if(PUI.UTL.isNotEmpty(err) || PUI.UTL.isEmpty(text)){
                    response.redirect("/assets/"+request.params.pattern1);
                }else{
                    response.send(text);
                }
            }
        );
    }else {
        response.redirect(PUI.GV.GATEWAY_URI + "/member/login?rtnUrl?rtnUrl="+ PUI.GV.GATEWAY_URI + "/assets");
    }
});

//페이지 이동 (pattern3)
router.get("/assets/:pattern1/:pattern2/::pattern3", async (request, response) => {
    if(UTIL.isGatewayReq(request) && await PUI.REQ.isSession(request)){
        fs.readFile(
            path.join(
                __dirname,
                "..",
                "src",
                "assets",
                "page",
                request.params.pattern1,
                request.params.pattern2,
                request.params.pattern3,
                request.params.pattern3 + ".html"
            ), "UTF-8", (err, text) => {
                if(PUI.UTL.isNotEmpty(err) || PUI.UTL.isEmpty(text)){
                    response.redirect("/assets/"+request.params.pattern2);
                }else{
                    response.send(text);
                }
            }
        );
    }else {
        response.redirect(PUI.GV.GATEWAY_URI + "/member/login?rtnUrl?rtnUrl="+ PUI.GV.GATEWAY_URI + "/assets");
    }
});

//html가져오기
// router.get("/assets/getHtml", cors({origin: PUI.GV.GATEWAY_URI}), (request, response) => {
//     let html = request.query.html == "undefined" ? "MAIN" : request.query.html;    
//     fs.readFile(path.join(__dirname, "..", "src", "assets", "page", UTIL.getPageCode(html) + ".html"), "UTF-8", (err, text) => {      
//         response.send(text);
//     });
// });

//script 가져오기
// router.get("/assets/getScript", cors({origin: PUI.GV.GATEWAY_URI}), (request, response) => {
//     let script = request.query.script == "undefined" ? "MAIN" : request.query.script;
//     fs.readFile(path.join(__dirname, "..", "src", "assets", "page", UTIL.getPageCode(script) + ".js"), "UTF-8", (err, text) => {
//         response.send(text);
//     });
// });

module.exports = router;