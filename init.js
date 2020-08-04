const fs = require("fs");
const request = require("request");

const init = {
    express: null,
    app: null,    
    start: function(express, app){
        this.express = express;
        this.app = app;

        this.fileImport("src");
        this.initGlobalData();
        this.initFunction();
    },

    //정적 리소스 임포트
    fileImport: function(root){        
        fs.readdirSync("./" + root, { withFileTypes: true }).forEach(item => {            
            if(item.isDirectory()){
                this.app.use("/"+item.name, this.express.static(__dirname  + '\\' + root + '\\' +item.name));
            }
        });
    },

    //전역데이터 세팅
    initGlobalData: function(){
        //전역변수
        global.wAssets = {};

        //메뉴코드 세팅
        wAssets.menuCd = {};     
        request.get("http://localhost:9000/api/admin/getMenuCodeList", (error, response, body) => {
            JSON.parse(body).forEach(menu => {
                wAssets.menuCd[menu.menuCd] = menu;
            });
        });
    },

    //전역함수 세팅
    initFunction: function(){
        global.wFunction = {};

        //빈값 체크
        wFunction.isEmpty = value => {
            if(typeof value === "string"){
                if(value.trim() === "") return true;
                else return false;
            }else{
                if(value === undefined || value === null) return true;
                else return false;
            }
        };

        //게이트웨이 확인
        wFunction.isGateway = host => host === "127.0.0.1:9000" ? true : false;

        //게이트웨이 확인(request)
        wFunction.isGatewayReq = request => wFunction.getHost(request) === "127.0.0.1:9000" ? true : false;

        //헤더에서 HOST 추출
        wFunction.getHost = request => {
            if(wFunction.isEmpty(request.headers)){
                return "";
            }else if(wFunction.isEmpty(request.headers.forwarded)){
                return "";
            }else{
                let host = request.headers.forwarded.replace(/"/g, "").split(";");
                if(host.length > 1){
                    return host[1].replace("host=", "").replace("localhost", "127.0.0.1");
                }else{
                    return "";
                }
            }
        };
    }
}
module.exports = init;