const express = require("express");
const path = require("path");
const router = express.Router();

const pageCode = {
    IDX: {TEXT: "/index/index", UPPER_CODE:"", GROUP_CODE:"MENU_PAGE_PATH_CD"},
    MAIN: {TEXT: "/main/main", UPPER_CODE:"", GROUP_CODE:"MENU_PAGE_PATH_CD"},
    LED_MGT: {TEXT: "/ledger/ledgerMgt/ledgerMgt", UPPER_CODE:"", GROUP_CODE:"MENU_PAGE_PATH_CD"},
    LED_WRT: {TEXT: "/ledger/ledgerWrt/ledgerWrt", UPPER_CODE:"", GROUP_CODE:"MENU_PAGE_PATH_CD"}
};

//페이지 이동
router.get("/p/wAssets", (request, response) => {
    response.sendFile(path.join(__dirname, "src", "page", "index", "index.html"));
});

//html가져오기
router.get("/p/wAssets/getHtml", (request, response) => {
    let html = request.query.html;
    response.sendFile(path.join(__dirname, "src", "page", pageCode[html].TEXT + ".html"), null, error => {
        if(error) {
            console.error("NOT HTML FILE:", error);
            response.status(500).end();
        }
    });
});

//script 가져오기
router.get("/p/wAssets/getScript", (request, response) => {
    let script = request.query.script;
    response.sendFile(path.join(__dirname, "src", "page", pageCode[script].TEXT + ".js"), null, error => {
        if(error) {
            console.error("NOT SCRIPT FILE:", error);
            response.status(500).end();
        }
    });
});

module.exports = router;