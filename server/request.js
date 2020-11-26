const request = require("request");

const wRequest = {

    //세션체크
    isSession: async request => {
        let session = await PUI.REQ.getSession(request.cookies.SESSION_TOKEN);
        if(PUI.UTL.isEmpty(session)){
            return false;
        }else{
            return session.isLogin;
        }
    },

    //세션조회
    getSession: SESSION_TOKEN => {
        return new Promise((resolve, reject) => {
            request.post({
                headers: {
                    "content-type" : "application/json",
                    "Accept" : "application/json",
                    "cookie": "SESSION_TOKEN=" + SESSION_TOKEN
                },
                url: PUI.GV.GATEWAY_URI + "/api/member/getSession",
                body: "{}"
                }, (error, response, body) => {
                resolve(JSON.parse(body));
            });
        });
    }
}

//세션조회 API 호출
// getSession: (SESSION_TOKEN) => {
//     return new Promise((resolve, reject) => {
//         //console.log(request.jar());            
//         //
//         request.post({
//             headers: {
//                 "content-type" : "application/json",
//                 "Accept" : "application/json",
//                 "cookie": "SESSION_TOKEN=" + SESSION_TOKEN
//             },
//             url: PUI.GV.GATEWAY_URI + "/api/member/getSession",
//             body: "{}"
//         }, (error, response, body) => {
//             resolve(JSON.parse(body));
//         });
//     });
// }


module.exports = wRequest;
