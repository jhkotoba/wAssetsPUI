const wUtil = require("./util.js");
const wRequest = require("./request.js");
const wFs = require("./file.js");

//전역상수
const wGlobal = {
    GATEWAY_PORT: "9000",
    GATEWAY_IP: "127.0.0.1",
    GATEWAY_IP_PORT: "127.0.0.1:9000",
    GATEWAY_URI: "http://127.0.0.1:9000",
    PORT: "9020",
    IP: "127.0.0.1",
    PAGE_PATH: (__dirname + "\\src\\assets\\page").replace("\\server", "")
}

global.PUI = {
    GV: wGlobal,
    UTL: wUtil,
    REQ: wRequest,
    FS: wFs
}



