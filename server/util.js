const wUtil = {
    //빈값 체크
    isEmpty: value => {
        if(typeof value === "string"){
            if(value.trim() === "") return true;
            else return false;
        }else{
            if(value === undefined || value === null) return true;
            else return false;
        }
    },

    //값여부 체크
    isNotEmpty: data => !wUtil.isEmpty(data),

    //페이지코드 가져오기
    getPageCode: pageCd => {
        if(pageCd === "MAIN" || wUtil.isEmpty(pageCd)) return "/main/main";
        else return MUI.PAGE_CD[pageCd].pagePath + "/" + MUI.PAGE_CD[pageCd].pageFile;
    },

    //게이트웨이 확인
    isGateway: host => host === MUI.GATEWAY_IP_PORT ? true : false,

    //게이트웨이 확인(request)
    isGatewayReq: request => wUtil.getHost(request) === PUI.GV.GATEWAY_IP_PORT ? true : false,

    //헤더에서 HOST 추출
    getHost: request => {
        if(wUtil.isEmpty(request.headers)){
            return "";
        }else if(wUtil.isEmpty(request.headers.forwarded)){
            return "";
        }else{
            let host = request.headers.forwarded.replace(/"/g, "").split(";");
            if(host.length > 1){
                return host[1].replace("host=", "").replace("localhost", "127.0.0.1");
            }else{
                return "";
            }
        }
    },
    getViewPath: () => {
        return __dirname.replace("\\server", "");
    }
}

module.exports = wUtil;