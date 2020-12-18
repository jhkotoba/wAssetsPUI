/**
 * fetch 유틸화
 */
export const wFetch = {
    //세션체크
    isSession: async () => {
        let session = await this.getSession();
        if(PUI.UTL.isEmpty(session)){
            return false;
        }else{
            return session.isLogin;
        }
    },

    //세션조회
    getSession: () => {
        return new Promise((resolve, reject) => {
            fetch("/api/member/getSession", {
                method: "POST",
                mode: "same-origin",
                credentials: "include",
                headers: {
                     "Accept": "application/json",
                     "Content-Type": "application/json"
                },
                body: "{}"
            })
            .then(response => response.json())
            .then(data => resolve(data));
        });
    },

    //GET 조회
    getFetch(url){
        return new Promise((resolve, reject) => {
            fetch(url, {
                credentials: "same-origin"
            })
            .then(response => response.json())
            .then(data => resolve(data));
        });
    },

    //POST 조회
    postFetch(url, param){
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: "POST",
                mode: "same-origin",
                credentials: "include",
                headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                },
                body: JSON.stringify(param)
            })
            .then(response => response.json())
            .then(data => resolve(data));
        });
    }

}

// window.wFetch = {
//     getHtml(wApageNm){
//         return new Promise((resolve, reject) => {
//             fetch("/assets/getHtml?html=" + wApageNm)
//                 .then(response => response.text())
//                 .then(html => resolve({data:html, resultCode:"200", message:"success"}))
//                 .catch(error => resolve({data:null, retrunCode:"500", message:error}));
//         });
//     },
//     getScript(wApageNm){
//         return new Promise((resolve, reject) => {
//             fetch("/assets/getScript?script=" + wApageNm)
//                 .then(response => response.text())
//                 .then(script => resolve({data:script, resultCode:"200", message:"success"}))
//                 .catch(error => resolve({data:null, retrunCode:"500", message:error}));
//         });
//     },

//     getFetch(url){
//         return new Promise((resolve, reject) => {
//             fetch(url, {
//                 credentials: "same-origin"
//             })
//             .then(response => response.json())
//             .then(data => resolve(data));
//         });
//     },

//     postFetch(url, data){
//         return new Promise((resolve, reject) => {
//             fetch(url, {
//                 method: "POST",
//                 mode: "same-origin",
//                 credentials: "include",
//                 headers: {
//                      "Accept": "application/json",
//                      "Content-Type": "application/json"
//                 },
//                 body: JSON.stringify(data)
//             })
//             .then(response => response.json())
//             .then(data => resolve(data));
//         });
//     },

//     getSession(){
//         return new Promise((resolve, reject) => {
//             fetch("/api/member/getSession", {
//                 method: "POST",
//                 mode: "same-origin",
//                 credentials: "include",
//                 headers: {
//                      "Accept": "application/json",
//                      "Content-Type": "application/json"
//                 },
//                 body: JSON.stringify({})
//             })
//             .then(response => response.json())
//             .then(data => resolve(data));
//         });
//     }
// }