const express = require("express");
const router = express.Router();

//페이지 이동
router.get("/assets", async (request, response) => {   
    if(PUI.UTL.isGatewayReq(request) && await PUI.REQ.isSession(request)){
        let index = await PUI.FS.readFile(PUI.GV.PAGE_PATH + "\\index\\index.html");
        let main = await PUI.FS.readFile(PUI.GV.PAGE_PATH + "\\main\\main.html");
        response.send(index.replace("<main>", "<main>" + main));
    }else{
        response.redirect(PUI.GV.GATEWAY_URI + "/member/login?rtnUrl?rtnUrl="+ PUI.GV.GATEWAY_URI + "/assets");
    }
});

//페이지 이동 (pattern1)
router.get("/assets/:pattern1", async (request, response) => {
    try{
        let p1 = request.params.pattern1;
        if(PUI.UTL.isGatewayReq(request) && await PUI.REQ.isSession(request)){
            let index = await PUI.FS.readFile(PUI.GV.PAGE_PATH + "\\index\\index.html");
            let main = await PUI.FS.readFile(PUI.GV.PAGE_PATH + "\\" + p1 + "\\" + p1 + ".html", true);
            response.send(index.replace("<main>", "<main>" + main));
        }else{
            response.redirect(PUI.GV.GATEWAY_URI + "/member/login?rtnUrl?rtnUrl="+ 
                PUI.GV.GATEWAY_URI + PUI.GV.PAGE_PATH + p1 + "\\" + p1 + ".html");
        }
    }catch(error){
        response.redirect(PUI.GV.GATEWAY_URI + "/assets");
    }
});

//페이지 이동 (pattern2)
router.get("/assets/:pattern1/:pattern2", async (request, response) => {
    try{
        let p1 = request.params.pattern1;
        let p2 = request.params.pattern2;    
        if(PUI.UTL.isGatewayReq(request) && await PUI.REQ.isSession(request)){
            let index = await PUI.FS.readFile(PUI.GV.PAGE_PATH + "\\index\\index.html");
            let main = await PUI.FS.readFile(PUI.GV.PAGE_PATH + "\\" + p1 + "\\" + p2 + "\\" + p2 + ".html", true);
            response.send(index.replace("<main>", "<main>" + main));
        }else{
            response.redirect(PUI.GV.GATEWAY_URI + "/member/login?rtnUrl?rtnUrl="+ 
                PUI.GV.GATEWAY_URI + PUI.GV.PAGE_PATH + p1 + "\\" + p2 + "\\" + p2 + ".html");
        }
    }catch(error){
        response.redirect(PUI.GV.GATEWAY_URI + "/assets");
    }
});

//페이지 이동 (pattern3)
router.get("/assets/:pattern1/:pattern2/:pattern3", async (request, response) => {
    try{
        let p1 = request.params.pattern1;
        let p2 = request.params.pattern2;
        let p3 = request.params.pattern3;
        if(PUI.UTL.isGatewayReq(request) && await PUI.REQ.isSession(request)){
            let index = await PUI.FS.readFile(PUI.GV.PAGE_PATH + "\\index\\index.html");
            let main = await PUI.FS.readFile(PUI.GV.PAGE_PATH + "\\" + p1 + "\\" + p2 + "\\" + p3 + "\\" + p3+ ".html", true);
            response.send(index.replace("<main>", "<main>" + main));
        }else{
            response.redirect(PUI.GV.GATEWAY_URI + "/member/login?rtnUrl?rtnUrl="+ 
                PUI.GV.GATEWAY_URI + PUI.GV.PAGE_PATH + p1 + "\\" + p2 + "\\" + p3 + "\\" + p3 + ".html");
        }
    }catch(error){
        response.redirect(PUI.GV.GATEWAY_URI + "/assets");
    }
});

module.exports = router;